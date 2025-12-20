-- CreateEnum
CREATE TYPE "IntegrationType" AS ENUM ('HUBSPOT');

-- CreateTable
CREATE TABLE "IntegrationAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "type" "IntegrationType" NOT NULL,

    CONSTRAINT "IntegrationAccess_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IntegrationAccess" ADD CONSTRAINT "IntegrationAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
