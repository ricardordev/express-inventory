-- CreateTable
CREATE TABLE "products" (
    "product_id" SERIAL NOT NULL,
    "product_name" VARCHAR(199) NOT NULL,
    "product_code" VARCHAR(99) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "stock_movement" (
    "move_id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "type" VARCHAR(10) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_movement_pkey" PRIMARY KEY ("move_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "products_product_code_key" ON "products"("product_code");

-- CreateIndex
CREATE INDEX "stock_movement_product_id_idx" ON "stock_movement"("product_id");

-- CreateIndex
CREATE INDEX "stock_movement_timestamp_idx" ON "stock_movement"("timestamp");

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;
