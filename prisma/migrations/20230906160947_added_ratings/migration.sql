-- CreateEnum
CREATE TYPE "RatingType" AS ENUM ('MENTOR');

-- CreateTable
CREATE TABLE "ratings" (
    "id" TEXT NOT NULL,
    "type" "RatingType" NOT NULL,
    "rating" INTEGER NOT NULL,
    "ratedByUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOnRatings" (
    "userId" TEXT NOT NULL,
    "ratingId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserOnRatings_userId_ratingId_key" ON "UserOnRatings"("userId", "ratingId");

-- AddForeignKey
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_ratedByUserId_fkey" FOREIGN KEY ("ratedByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnRatings" ADD CONSTRAINT "UserOnRatings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnRatings" ADD CONSTRAINT "UserOnRatings_ratingId_fkey" FOREIGN KEY ("ratingId") REFERENCES "ratings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
