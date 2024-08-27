/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `BookListing` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BookListing_title_key" ON "BookListing"("title");
