-- CreateTable
CREATE TABLE "AuditReturn" (
    "id" TEXT NOT NULL,
    "recordHash" TEXT NOT NULL,
    "regional" VARCHAR(2) NOT NULL,
    "fileName" TEXT NOT NULL,
    "cnabType" TEXT NOT NULL,
    "lineNumber" INTEGER NOT NULL,
    "bankCode" TEXT NOT NULL,
    "agreement" TEXT NOT NULL,
    "lotCode" TEXT NOT NULL,
    "regionalNumber" TEXT NOT NULL,
    "regionalNumberDigit" TEXT NOT NULL,
    "titleNumber" TEXT,
    "titleType" TEXT,
    "agency" TEXT,
    "agencyDigit" TEXT,
    "account" TEXT,
    "accountDigit" TEXT,
    "payerName" TEXT,
    "payerRegistration" TEXT,
    "payerRegistrationType" TEXT,
    "movementCode" TEXT NOT NULL,
    "occurrenceCode" TEXT,
    "receivedValue" DECIMAL(15,2),
    "tariff" DECIMAL(15,2),
    "accruedInterest" DECIMAL(15,2),
    "discountAmount" DECIMAL(15,2),
    "dischargeAmount" DECIMAL(15,2),
    "paidAmount" DECIMAL(15,2),
    "otherExpenses" DECIMAL(15,2),
    "otherCredits" DECIMAL(15,2),
    "netCreditValue" DECIMAL(15,2),
    "paymentDate" TIMESTAMP(3),
    "creditDate" TIMESTAMP(3),
    "fileGenerationDate" TEXT,
    "fileSequence" TEXT,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditReturn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuditReturn_recordHash_key" ON "AuditReturn"("recordHash");

-- CreateIndex
CREATE INDEX "AuditReturn_bankCode_idx" ON "AuditReturn"("bankCode");

-- CreateIndex
CREATE INDEX "AuditReturn_agreement_idx" ON "AuditReturn"("agreement");

-- CreateIndex
CREATE INDEX "AuditReturn_movementCode_idx" ON "AuditReturn"("movementCode");

-- CreateIndex
CREATE INDEX "AuditReturn_creditDate_idx" ON "AuditReturn"("creditDate");

-- CreateIndex
CREATE INDEX "AuditReturn_paymentDate_idx" ON "AuditReturn"("paymentDate");

-- CreateIndex
CREATE INDEX "AuditReturn_regionalNumber_idx" ON "AuditReturn"("regionalNumber");

-- CreateIndex
CREATE INDEX "AuditReturn_regional_idx" ON "AuditReturn"("regional");
