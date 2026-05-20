import { z } from "zod";


export function isValidBirthdayDate(day: number, month: number) {
  const testDate = new Date(2024, month - 1, day);

  return (
    testDate.getFullYear() === 2024 &&
    testDate.getMonth() === month - 1 &&
    testDate.getDate() === day
  );
}

export const createBirthdaySchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  day: z.coerce.number().int().min(1).max(31),
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear()).nullable().optional(),
  hideYear: z.boolean().default(true),
  religion: z.enum(["christian", "muslim", "none"]).nullable().optional(),
  socials: z
    .object({
      linkedin: z.string().max(60).optional(),
      instagram: z.string().max(30).optional(),
      facebook: z.string().max(60).optional(),
      twitter: z.string().max(15).optional(),
    })
    .optional(),
});

export type CreateBirthdayInput = z.infer<typeof createBirthdaySchema>;