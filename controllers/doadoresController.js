import prisma from '../prisma/client.js';
import { encrypt, decrypt, hash } from "../utils/crypto.js";
import { calculaDisponibilidade } from '../utils/disponibilidade.js';
import { formataTipo, transformaTipo } from '../utils/tipoSang.js';
import { formataSexo, transformaSexo } from '../utils/genero.js';

const doadorSelect = {
    id: true,
    nome: true,
    cpf: true,
    rg: true,
    cartaoSus: true,
    dataNasc: true,
    sexo: true,
    tipoSang: true,
    endereco: true,
    viagens: {
        orderBy: { dataSaida: 'desc' },
        select: {
            id: true,
            dataSaida: true
        }
    },
    criadoEm: true
};

// GET /doadores - lista todos os doadores
export async function listarDoadores(req, res, next){
    try{
        const doadores = await prisma.doador.findMany({
            select: doadorSelect
        });
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
            where: { nome: { contains: nome, mode: "insensitive" } },
            select: doadorSelect
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
        const doador = await prisma.doador.findUnique({
            where: { cpfHash: hash(cpf.replace(/\D/g, "")) },
            select: doadorSelect
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

// GET /doadores/rg - busca doador pelo RG
export async function buscarDoadorRg(req, res, next){
    try{
        const { rg } = req.body;
        if (!rg) {
            return res.status(400).json({ erro: 'O campo RG é obrigatório' });
        }
        const doador = await prisma.doador.findUnique({
            where: { rgHash: hash(rg.replace(/\D/g, "")) },
            select: doadorSelect
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

// GET /doadores/sus - busca doador pelo cartão SUS
export async function buscarDoadorSus(req, res, next){
    try{
        const { cartaoSus } = req.body;
        if (!cartaoSus) {
            return res.status(400).json({ erro: 'O campo Cartão SUS é obrigatório' });
        }
        const doador = await prisma.doador.findUnique({
            where: { cartaoSusHash: hash(cartaoSus.replace(/\D/g, "")) },
            select: doadorSelect
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

// GET /doadores/tipo - busca doadores pelo tipo sanguíneo
export async function listarDoadoresTipo(req, res, next){
    try{
        const { tipoSang } = req.body;
        if (!tipoSang) {
            return res.status(400).json({ erro: 'O campo tipo sanguíneo é obrigatório' });
        }
        let sangue
        try{
            sangue = transformaTipo(tipoSang)
        }
        catch(error){
            return res.status(400).json({ erro: error.message });
        }
        const doadores = await prisma.doador.findMany({
            where: { tipoSang: sangue },
            select: doadorSelect
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
        if (isNaN(Number(id)) || !Number.isInteger(Number(id))) {
            return res.status(400).json({ erro: 'ID inválido' });
        }
        const doador = await prisma.doador.findUnique({
            where: { id: Number(id) },
            select: doadorSelect
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
        const dataNascimento = new Date(dataNasc);
        if (isNaN(dataNascimento.getTime())) {
            return res.status(400).json({ erro: 'Data de nascimento inválida' });
        }
        let sangue, genero
        try{
            sangue = transformaTipo(tipoSang)
            genero = transformaSexo(sexo)
        }
        catch(error){
            return res.status(400).json({ erro: error.message });
        }
        const novoDoador = await prisma.doador.create({
            data: {
                cpf: encrypt(cpf.replace(/\D/g, "")),
                cpfHash: hash(cpf.replace(/\D/g, "")),
                rg: encrypt(rg.replace(/\D/g, "")),
                rgHash: hash(rg.replace(/\D/g, "")),
                cartaoSus: encrypt(cartaoSus.replace(/\D/g, "")),
                cartaoSusHash: hash(cartaoSus.replace(/\D/g, "")),
                nome: nome,
                dataNasc: dataNascimento,
                sexo: genero,
                tipoSang: sangue,
                endereco: endereco
            },
            select: doadorSelect
        });
        res.status(201).json(descriptografarDoador(novoDoador));
    }
    catch(erro){
        if (erro.code === "P2002") {
            return res.status(409).json({ erro: "CPF, RG e/ou Cartão SUS já cadastrado(s)" });
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
        if (isNaN(Number(id)) || !Number.isInteger(Number(id))) {
            return res.status(400).json({ erro: 'ID inválido' });
        }
        const dataNascimento = new Date(dataNasc);
        if (isNaN(dataNascimento.getTime())) {
            return res.status(400).json({ erro: 'Data de nascimento inválida' });
        }
        let sangue, genero
        try{
            sangue = transformaTipo(tipoSang)
            genero = transformaSexo(sexo)
        }
        catch(error){
            return res.status(400).json({ erro: error.message });
        }
        const doador = await prisma.doador.update({
            where: { id: Number(id) },
            data: {
                cpf: encrypt(cpf.replace(/\D/g, "")),
                cpfHash: hash(cpf.replace(/\D/g, "")),
                rg: encrypt(rg.replace(/\D/g, "")),
                rgHash: hash(rg.replace(/\D/g, "")),
                cartaoSus: encrypt(cartaoSus.replace(/\D/g, "")),
                cartaoSusHash: hash(cartaoSus.replace(/\D/g, "")),
                nome: nome,
                dataNasc: dataNascimento,
                sexo: genero,
                tipoSang: sangue,
                endereco: endereco
            },
            select: doadorSelect
        });
        res.json(descriptografarDoador(doador));
    }
    catch(erro){
        if (erro.code === "P2025"){
            return res.status(404).json({ erro: 'Doador não encontrado' });
        }
        if (erro.code === "P2002") {
            return res.status(409).json({ erro: "CPF, RG e/ou Cartão SUS já cadastrado(s)" });
        }
        next(erro);
    }
}

// DELETE /doadores/:id - deleta um doador
export async function deletarDoador(req, res, next){
    try{
        const { id } = req.params;
        if (isNaN(Number(id)) || !Number.isInteger(Number(id))) {
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
        sexo: formataSexo(doador.sexo),
        tipoSang: formataTipo(doador.tipoSang),
        cartaoSus: decrypt(doador.cartaoSus),
        disponivel: calculaDisponibilidade(doador)
    };
}