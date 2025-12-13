/*
  Warnings:

  - You are about to drop the column `requestType` on the `Request` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[identifier,vesselId,requestTypeId]` on the table `Request` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `requestTypeId` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Request_identifier_vesselId_key";

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "requestType",
ADD COLUMN     "requestTypeId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "RequestType";

-- CreateTable
CREATE TABLE "RequestTypeModel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "vesselId" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RequestTypeModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RequestTypeModel_vesselId_idx" ON "RequestTypeModel"("vesselId");

-- CreateIndex
CREATE UNIQUE INDEX "RequestTypeModel_name_vesselId_key" ON "RequestTypeModel"("name", "vesselId");

-- CreateIndex
CREATE UNIQUE INDEX "Request_identifier_vesselId_requestTypeId_key" ON "Request"("identifier", "vesselId", "requestTypeId");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_requestTypeId_fkey" FOREIGN KEY ("requestTypeId") REFERENCES "RequestTypeModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RequestTypeModel" ADD CONSTRAINT "RequestTypeModel_vesselId_fkey" FOREIGN KEY ("vesselId") REFERENCES "Vessel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
