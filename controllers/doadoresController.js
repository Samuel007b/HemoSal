import prisma from '../prisma/client.js';
import { encrypt, decrypt } from "../utils/crypto.js";

// GET /doadores - lista todos os doadores
export async function listarDoadores(req, res, next){
    try{
        const doadores = await prisma.doador.findMany();
        res.json(doadores.map(descriptografarDoador));
    }
    catch(erro){
        next(erro);
    }
}

// GET /doadores/nome - busca doadores pelo nome
export async function listarDoadoresNome(req, res, next){
    try{
        const { nome } = req.body;
        if (!nome) {
            return res.status(400).json({ erro: 'O campo nome é obrigatório' });
        }
        const doadores = await prisma.doador.findMany({
            where: { nome: { contains: nome, mode: "insensitive" } }
        });
        res.json(doadores.map(descriptografarDoador));
    }
    catch(erro){
        next(erro);
    }
}

// GET /doadores/cpf - busca doador pelo CPF
export async function buscarDoadorCpf(req, res, next){
    try{
        const { cpf } = req.body;
        if (!cpf) {
            return res.status(400).json({ erro: 'O campo CPF é obrigatório' });
        }
        const doadores = await prisma.doador.findMany();
        const doador = doadores.find(d => decrypt(d.cpf) === cpf);
        if (!doador) {
            return res.status(404).json({ erro: 'Doador não encontrado' });
        }
        res.json(descriptografarDoador(doador));
    }
    catch(erro){
        next(erro);
    }
}

// GET /doadores/rg - busca doador pelo RG
export async function buscarDoadorRg(req, res, next){
    try{
        const { rg } = req.body;
        if (!rg) {
            return res.status(400).json({ erro: 'O campo RG é obrigatório' });
        }
        const doadores = await prisma.doador.findMany();
        const doador = doadores.find(d => decrypt(d.rg) === rg);
        if (!doador) {
            return res.status(404).json({ erro: 'Doador não encontrado' });
        }
        res.json(descriptografarDoador(doador));
    }
    catch(erro){
        next(erro);
    }
}

// GET /doadores/sus - busca doador pelo cartão SUS
export async function buscarDoadorSus(req, res, next){
    try{
        const { cartaoSus } = req.body;
        if (!cartaoSus) {
            return res.status(400).json({ erro: 'O campo Cartão SUS é obrigatório' });
        }
        const doadores = await prisma.doador.findMany();
        const doador = doadores.find(d => decrypt(d.cartaoSus) === cartaoSus);
        if (!doador) {
            return res.status(404).json({ erro: 'Doador não encontrado' });
        }
        res.json(descriptografarDoador(doador));
    }
    catch(erro){
        next(erro);
    }
}

// GET /doadores/tipo - busca doadores pelo tipo sanguíneo
export async function listarDoadoresTipo(req, res, next){
    try{
        const { tipoSang } = req.body;
        if (!tipoSang) {
            return res.status(400).json({ erro: 'O campo tipo sanguíneo é obrigatório' });
        }
        const doadores = await prisma.doador.findMany({
            where: { tipoSang: tipoSang }
        });
        res.json(doadores.map(descriptografarDoador));
    }
    catch(erro){
        next(erro);
    }
}

// GET /doadores/:id - busca um doador pelo id
export async function buscarDoador(req, res, next){
    try{
        const { id } = req.params;
        if (isNaN(Number(id))) {
            return res.status(400).json({ erro: 'ID inválido' });
        }
        const doador = await prisma.doador.findUnique({
            where: { id: Number(id) }
        });
        if (!doador) {
            return res.status(404).json({ erro: 'Doador não encontrado' });
        }
        res.json(descriptografarDoador(doador));
    }
    catch(erro){
        next(erro);
    }
}

// POST /doadores - cria um novo doador
export async function criarDoador(req, res, next){
    try {
        const { cpf, rg, cartaoSus, nome, dataNasc, sexo, tipoSang, endereco } = req.body;
        if (!cpf || !rg || !cartaoSus || !nome || !dataNasc || !sexo || !tipoSang || !endereco) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }
        const novoDoador = await prisma.doador.create({
            data: {
                cpf: encrypt(cpf),
                rg: encrypt(rg),
                cartaoSus: encrypt(cartaoSus),
                nome: nome,
                dataNasc: dataNasc,
                sexo: sexo,
                tipoSang: tipoSang,
                endereco: endereco,
                disponivel: false
            }
        });
        res.status(201).json(descriptografarDoador(novoDoador));
    }
    catch(erro){
        if (erro.code === "P2002") {
            return res.status(409).json({ erro: "CPF, RG ou Cartão SUS já cadastrado" });
        }
        next(erro);
    }
}

// PUT /doadores/:id - atualiza um doador existente
export async function atualizarDoador(req, res, next){
    try {
        const { id } = req.params;
        const { cpf, rg, cartaoSus, nome, dataNasc, sexo, tipoSang, endereco } = req.body;
        if (!cpf || !rg || !cartaoSus || !nome || !dataNasc || !sexo || !tipoSang || !endereco) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios" });
        }
        if (isNaN(Number(id))) {
            return res.status(400).json({ erro: 'ID inválido' });
        }
        const doador = await prisma.doador.update({
            where: { id: Number(id) },
            data: {
                cpf: encrypt(cpf),
                rg: encrypt(rg),
                cartaoSus: encrypt(cartaoSus),
                nome: nome,
                dataNasc: dataNasc,
                sexo: sexo,
                tipoSang: tipoSang,
                endereco: endereco
            }
        });
        res.json(descriptografarDoador(doador));
    }
    catch(erro){
        if (erro.code === "P2025"){
            return res.status(404).json({ erro: 'Doador não encontrado' });
        }
        if (erro.code === "P2002") {
            return res.status(409).json({ erro: "CPF, RG ou Cartão SUS já cadastrado" });
        }
        next(erro);
    }
}

// DELETE /doadores/:id - deleta um doador
export async function deletarDoador(req, res, next){
    try{
        const { id } = req.params;
        if (isNaN(Number(id))) {
            return res.status(400).json({ erro: 'ID inválido' });
        }
        await prisma.doador.delete({
            where: { id: Number(id) }
        })
        res.status(204).end()
    }
    catch(erro){
        if (erro.code === 'P2003') {
            return res.status(409).json({ erro: 'Doador com viagens cadastradas'});
        }
        if (erro.code === "P2025"){
            return res.status(404).json({ erro: 'Doador não encontrado' });
        }
        next(erro);
    }
}

function descriptografarDoador(doador) {
    if (!doador) return null;
    return {
        ...doador,
        cpf: decrypt(doador.cpf),
        rg: decrypt(doador.rg),
        cartaoSus: decrypt(doador.cartaoSus)
    };
}