import { google } from "googleapis";
import { env } from "../../config/env";
import { prisma } from "../../db/prisma";
import jwt from "jsonwebtoken";

// Calendar name to create for syncing
const CALENDAR_SUMMARY = "My Circle Birthdays";

/**
 * Instantiates the Google OAuth2 client.
 */
export function getOAuth2Client() {
  const clientId = env.GOOGLE_CLIENT_ID;
  const clientSecret = env.GOOGLE_CLIENT_SECRET;
  const redirectUri = env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Google OAuth credentials are not fully configured in environment variables.");
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

/**
 * Generates the Google consent screen URL for the user.
 */
export function getGoogleAuthUrl(userId: string): string {
  const oauth2Client = getOAuth2Client();

  // Create state token containing the userId with a 15-minute expiration
  const state = jwt.sign({ userId }, env.JWT_ACCESS_SECRET, { expiresIn: "15m" });

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // Force consent screen to guarantee refresh token is returned
    scope: ["https://www.googleapis.com/auth/calendar.events", "https://www.googleapis.com/auth/calendar"],
    state,
  });
}

/**
 * Authenticates an OAuth2 client for a given user connection.
 */
async function getAuthenticatedClient(userId: string) {
  const connection = await prisma.calendarConnection.findUnique({
    where: {
      userId_provider: {
        userId,
        provider: "google",
      },
    },
  });

  if (!connection) {
    throw new Error("No Google Calendar connection found for this user.");
  }

  const oauth2Client = getOAuth2Client();
  const credentials: any = {
    access_token: connection.accessToken,
  };
  if (connection.refreshToken) {
    credentials.refresh_token = connection.refreshToken;
  }
  if (connection.expiresAt) {
    credentials.expiry_date = connection.expiresAt.getTime();
  }
  oauth2Client.setCredentials(credentials);

  // Automatically save refreshed tokens if Google refreshes them
  oauth2Client.on("tokens", async (tokens) => {
    try {
      const updateData: any = {};
      if (tokens.access_token) {
        updateData.accessToken = tokens.access_token;
      }
      if (tokens.expiry_date) {
        updateData.expiresAt = new Date(tokens.expiry_date);
      }
      if (tokens.refresh_token) {
        updateData.refreshToken = tokens.refresh_token;
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.calendarConnection.update({
          where: {
            userId_provider: {
              userId,
              provider: "google",
            },
          },
          data: updateData,
        });
      }
    } catch (err) {
      console.error("🔴 Error updating refreshed Google tokens:", err);
    }
  });

  return { oauth2Client, connection };
}

/**
 * Handles the redirect callback from Google OAuth.
 */
export async function handleGoogleCallback(code: string, state: string): Promise<string> {
  let userId: string;
  try {
    const decoded = jwt.verify(state, env.JWT_ACCESS_SECRET) as { userId: string };
    userId = decoded.userId;
  } catch (err) {
    throw new Error("Invalid or expired OAuth state parameter.");
  }

  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);

  if (!tokens.access_token) {
    throw new Error("Did not receive access token from Google.");
  }

  const expiresAt = tokens.expiry_date ? new Date(tokens.expiry_date) : null;

  await prisma.calendarConnection.upsert({
    where: {
      userId_provider: {
        userId,
        provider: "google",
      },
    },
    create: {
      userId,
      provider: "google",
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || null,
      expiresAt,
    },
    update: {
      accessToken: tokens.access_token,
      ...(tokens.refresh_token ? { refreshToken: tokens.refresh_token } : {}),
      expiresAt,
    },
  });

  return userId;
}

/**
 * Returns connected calendars for a user.
 */
export async function getConnections(userId: string) {
  const connections = await prisma.calendarConnection.findMany({
    where: { userId },
    select: {
      provider: true,
      createdAt: true,
    },
  });
  return connections;
}

/**
 * Disconnects a user's calendar connection.
 */
export async function disconnectCalendar(userId: string, provider: string) {
  // Try to delete the custom calendar on Google if it exists
  try {
    if (provider === "google") {
      const { oauth2Client, connection } = await getAuthenticatedClient(userId);
      if (connection.externalCalendarId) {
        const calendar = google.calendar({ version: "v3", auth: oauth2Client });
        await calendar.calendars.delete({
          calendarId: connection.externalCalendarId,
        });
      }
    }
  } catch (err) {
    console.error("🔴 Could not delete custom Google Calendar during disconnect:", err);
  }

  await prisma.calendarConnection.delete({
    where: {
      userId_provider: {
        userId,
        provider,
      },
    },
  });
}

/**
 * Finds or creates the dedicated "My Circle Birthdays" calendar in the user's account.
 */
async function getOrCreateCustomCalendar(userId: string): Promise<string> {
  const { oauth2Client, connection } = await getAuthenticatedClient(userId);
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  // 1. If we have a stored externalCalendarId, verify it still exists
  if (connection.externalCalendarId) {
    try {
      const res = await calendar.calendars.get({
        calendarId: connection.externalCalendarId,
      });
      if (res.data.id) {
        return res.data.id;
      }
    } catch {
      // Calendar was likely deleted from Google UI. We will recreate it.
    }
  }

  // 2. Check if a calendar with the name already exists
  try {
    const listRes = await calendar.calendarList.list();
    const existing = listRes.data.items?.find((item) => item.summary === CALENDAR_SUMMARY);
    if (existing?.id) {
      await prisma.calendarConnection.update({
        where: { userId_provider: { userId, provider: "google" } },
        data: { externalCalendarId: existing.id },
      });
      return existing.id;
    }
  } catch (err) {
    console.error("🔴 Error listing calendars:", err);
  }

  // 3. Create a new calendar
  const createRes = await calendar.calendars.insert({
    requestBody: {
      summary: CALENDAR_SUMMARY,
      timeZone: "UTC",
    },
  });

  const newCalendarId = createRes.data.id;
  if (!newCalendarId) {
    throw new Error("Failed to create custom calendar on Google.");
  }

  await prisma.calendarConnection.update({
    where: { userId_provider: { userId, provider: "google" } },
    data: { externalCalendarId: newCalendarId },
  });

  return newCalendarId;
}

/**
 * Formats a birthday event body for the Google Calendar API.
 */
function buildEventResource(birthday: { fullName: string; day: number; month: number; year: number | null }) {
  const startYear = birthday.year || new Date().getFullYear();
  
  // Format month and day as two-digit strings
  const mm = String(birthday.month).padStart(2, "0");
  const dd = String(birthday.day).padStart(2, "0");

  // Google Calendar all-day event dates (inclusive start, exclusive end)
  const startDateStr = `${startYear}-${mm}-${dd}`;
  
  // Calculate next day
  const startDate = new Date(startYear, birthday.month - 1, birthday.day);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 1);
  const endYear = endDate.getFullYear();
  const endMm = String(endDate.getMonth() + 1).padStart(2, "0");
  const endDd = String(endDate.getDate()).padStart(2, "0");
  const endDateStr = `${endYear}-${endMm}-${endDd}`;

  return {
    summary: `${birthday.fullName}'s Birthday 🎂`,
    description: `Automatically synced from MerkTag.`,
    start: {
      date: startDateStr,
    },
    end: {
      date: endDateStr,
    },
    recurrence: ["RRULE:FREQ=YEARLY"],
    transparency: "transparent", // Show as "Free"
    reminders: {
      useDefault: false,
      overrides: [
        { method: "popup", minutes: 0 },       // On the day
        { method: "popup", minutes: 24 * 60 },  // 1 day before
      ],
    },
  };
}

/**
 * Syncs a single birthday to Google Calendar (create or update).
 */
export async function syncBirthdayToGoogle(userId: string, birthdayId: string) {
  try {
    const birthday = await prisma.birthday.findFirst({
      where: { id: birthdayId, ownerId: userId },
    });

    if (!birthday) return;

    const hasGoogle = await prisma.calendarConnection.findUnique({
      where: { userId_provider: { userId, provider: "google" } },
    });

    if (!hasGoogle) return;

    const { oauth2Client } = await getAuthenticatedClient(userId);
    const calendarId = await getOrCreateCustomCalendar(userId);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });
    const eventBody = buildEventResource(birthday);

    if (birthday.googleEventId) {
      try {
        await calendar.events.update({
          calendarId,
          eventId: birthday.googleEventId,
          requestBody: eventBody,
        });
        return;
      } catch (err: any) {
        // If event was deleted in calendar directly, we'll recreate it
        if (err.status !== 404) {
          throw err;
        }
      }
    }

    // Create a new event
    const insertRes = await calendar.events.insert({
      calendarId,
      requestBody: eventBody,
    });

    if (insertRes.data.id) {
      await prisma.birthday.update({
        where: { id: birthdayId },
        data: { googleEventId: insertRes.data.id },
      });
    }
  } catch (err) {
    console.error(`🔴 Failed to sync birthday ${birthdayId} to Google Calendar:`, err);
  }
}

/**
 * Removes a birthday event from Google Calendar.
 */
export async function deleteBirthdayFromGoogle(userId: string, googleEventId: string | null) {
  if (!googleEventId) return;

  try {
    const hasGoogle = await prisma.calendarConnection.findUnique({
      where: { userId_provider: { userId, provider: "google" } },
    });

    if (!hasGoogle) return;

    const { oauth2Client } = await getAuthenticatedClient(userId);
    const calendarId = await getOrCreateCustomCalendar(userId);
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    await calendar.events.delete({
      calendarId,
      eventId: googleEventId,
    });
  } catch (err: any) {
    // If already deleted, ignore
    if (err.status !== 404) {
      console.error(`🔴 Failed to delete event ${googleEventId} from Google Calendar:`, err);
    }
  }
}

/**
 * Performs a full synchronization of all user birthdays.
 */
export async function syncAllBirthdays(userId: string) {
  const { oauth2Client } = await getAuthenticatedClient(userId);
  const calendarId = await getOrCreateCustomCalendar(userId);
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const birthdays = await prisma.birthday.findMany({
    where: { ownerId: userId },
  });

  for (const birthday of birthdays) {
    const eventBody = buildEventResource(birthday);

    if (birthday.googleEventId) {
      try {
        await calendar.events.update({
          calendarId,
          eventId: birthday.googleEventId,
          requestBody: eventBody,
        });
        continue;
      } catch (err: any) {
        if (err.status !== 404) {
          throw err;
        }
      }
    }

    // Create event
    const insertRes = await calendar.events.insert({
      calendarId,
      requestBody: eventBody,
    });

    if (insertRes.data.id) {
      await prisma.birthday.update({
        where: { id: birthday.id },
        data: { googleEventId: insertRes.data.id },
      });
    }
  }
}
