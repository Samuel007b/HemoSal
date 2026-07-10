-- CreateTable
CREATE TABLE "Viagem" (
    "id" SERIAL NOT NULL,
    "dataSaida" TIMESTAMP(3) NOT NULL,
    "numVagas" INTEGER NOT NULL,

    CONSTRAINT "Viagem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doador" (
    "id" SERIAL NOT NULL,
    "cpf" TEXT NOT NULL,
    "rg" TEXT NOT NULL,
    "cartaoSus" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "dataNasc" TIMESTAMP(3) NOT NULL,
    "sexo" TEXT NOT NULL,
    "tipoSang" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "disponivel" BOOLEAN NOT NULL,

    CONSTRAINT "Doador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAdmin" (
    "id" SERIAL NOT NULL,
    "login" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL,

    CONSTRAINT "UserAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DoadorToViagem" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DoadorToViagem_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Doador_cpf_key" ON "Doador"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Doador_rg_key" ON "Doador"("rg");

-- CreateIndex
CREATE UNIQUE INDEX "Doador_cartaoSus_key" ON "Doador"("cartaoSus");

-- CreateIndex
CREATE UNIQUE INDEX "UserAdmin_login_key" ON "UserAdmin"("login");

-- CreateIndex
CREATE INDEX "_DoadorToViagem_B_index" ON "_DoadorToViagem"("B");

-- AddForeignKey
ALTER TABLE "_DoadorToViagem" ADD CONSTRAINT "_DoadorToViagem_A_fkey" FOREIGN KEY ("A") REFERENCES "Doador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DoadorToViagem" ADD CONSTRAINT "_DoadorToViagem_B_fkey" FOREIGN KEY ("B") REFERENCES "Viagem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
