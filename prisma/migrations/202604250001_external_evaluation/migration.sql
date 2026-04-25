-- CreateEnum
CREATE TYPE "ExternalEvaluationIndicatorStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "ExternalEvaluationIndicatorProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "domainTitle" TEXT NOT NULL,
    "standardId" TEXT NOT NULL,
    "standardTitle" TEXT NOT NULL,
    "indicatorCode" TEXT NOT NULL,
    "indicatorText" TEXT NOT NULL,
    "status" "ExternalEvaluationIndicatorStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalEvaluationIndicatorProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalEvaluationIndicatorEvidence" (
    "id" TEXT NOT NULL,
    "progressId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT,
    "linkUrl" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExternalEvaluationIndicatorEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExternalEvaluationIndicatorProgress_userId_indicatorCode_key" ON "ExternalEvaluationIndicatorProgress"("userId", "indicatorCode");

-- AddForeignKey
ALTER TABLE "ExternalEvaluationIndicatorProgress" ADD CONSTRAINT "ExternalEvaluationIndicatorProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalEvaluationIndicatorEvidence" ADD CONSTRAINT "ExternalEvaluationIndicatorEvidence_progressId_fkey" FOREIGN KEY ("progressId") REFERENCES "ExternalEvaluationIndicatorProgress"("id") ON DELETE CASCADE ON UPDATE CASCADE;
