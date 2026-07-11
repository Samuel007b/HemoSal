/*
  Warnings:

  - You are about to drop the column `disponivel` on the `Doador` table. All the data in the column will be lost.
  - You are about to drop the column `numVagas` on the `Viagem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpfHash]` on the table `Doador` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rgHash]` on the table `Doador` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cartaoSusHash]` on the table `Doador` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cartaoSusHash` to the `Doador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpfHash` to the `Doador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rgHash` to the `Doador` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `sexo` on the `Doador` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tipoSang` on the `Doador` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `limiteVagas` to the `Viagem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoSanguineo" AS ENUM ('A_POSITIVO', 'A_NEGATIVO', 'B_POSITIVO', 'B_NEGATIVO', 'AB_POSITIVO', 'AB_NEGATIVO', 'O_POSITIVO', 'O_NEGATIVO');

-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('MASCULINO', 'FEMININO', 'OUTRO');

-- DropIndex
DROP INDEX "Doador_cartaoSus_key";

-- DropIndex
DROP INDEX "Doador_cpf_key";

-- DropIndex
DROP INDEX "Doador_rg_key";

-- AlterTable
ALTER TABLE "Doador" DROP COLUMN "disponivel",
ADD COLUMN     "cartaoSusHash" TEXT NOT NULL,
ADD COLUMN     "cpfHash" TEXT NOT NULL,
ADD COLUMN     "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "rgHash" TEXT NOT NULL,
DROP COLUMN "sexo",
ADD COLUMN     "sexo" "Sexo" NOT NULL,
DROP COLUMN "tipoSang",
ADD COLUMN     "tipoSang" "TipoSanguineo" NOT NULL;

-- AlterTable
ALTER TABLE "UserAdmin" ADD COLUMN     "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Viagem" DROP COLUMN "numVagas",
ADD COLUMN     "limiteVagas" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Doador_cpfHash_key" ON "Doador"("cpfHash");

-- CreateIndex
CREATE UNIQUE INDEX "Doador_rgHash_key" ON "Doador"("rgHash");

-- CreateIndex
CREATE UNIQUE INDEX "Doador_cartaoSusHash_key" ON "Doador"("cartaoSusHash");
