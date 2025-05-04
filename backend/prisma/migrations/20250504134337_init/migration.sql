-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "street_number" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "locality" TEXT NOT NULL,
    "administrative_area" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tartar" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "taste_rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "texture_rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "presentation_rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "restaurantId" TEXT NOT NULL,

    CONSTRAINT "Tartar_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tartar" ADD CONSTRAINT "Tartar_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
