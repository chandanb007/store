-- AlterTable
ALTER TABLE "Address" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "InventoryTransaction" ADD COLUMN "variantId" INTEGER;

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN "deletedAt" DATETIME;
