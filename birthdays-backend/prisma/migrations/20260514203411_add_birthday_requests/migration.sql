-- CreateTable
CREATE TABLE "BirthdayRequest" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "day" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER,
    "hideYear" BOOLEAN NOT NULL DEFAULT true,
    "religion" "Religion",
    "socials" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BirthdayRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BirthdayRequest_ownerId_idx" ON "BirthdayRequest"("ownerId");

-- AddForeignKey
ALTER TABLE "BirthdayRequest" ADD CONSTRAINT "BirthdayRequest_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
