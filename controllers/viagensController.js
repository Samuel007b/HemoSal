import prisma from '../prisma/client.js';
import { decrypt } from "../utils/crypto.js";
import { formataTipo } from '../utils/tipoSang.js';
import { calculaDisponibilidade } from "../utils/disponibilidade.js";

const doadorSelect = {
    id: true,
    nome: true,
    cpf: true,
    tipoSang: true
};

// GET /viagens - lista todas as viagens
export async function listarViagens(req, res, next){
    try{
        const viagens = await prisma.viagem.findMany({
            orderBy: { dataSaida: 'desc' },
            include: {
                doadores: {
                    select: doadorSelect
                },
            },
        });
        res.json(viagens.map(viagem => ({
            ...viagem,
            doadores: viagem.doadores.map(descriptografarDoador)
        })));
    }
    catch(erro){
        next(erro);
    }
}

// GET /viagens/:id - busca uma viagem pelo id
export async function buscarViagem(req, res, next){
    try{
        const { id } = req.params;
        if (!Number.isInteger(Number(id)) || Number(id)<=0) {
            return res.status(400).json({ erro: 'ID inválido' });
        }
        const viagem = await prisma.viagem.findUnique({
            where: { id: Number(id) },
            include: {
                doadores: {
                    select: doadorSelect
                },
            },
        });
        if (!viagem) {
            return res.status(404).json({ erro: 'Viagem não encontrada' });
        }
        res.json({
            ...viagem,
            doadores: viagem.doadores.map(descriptografarDoador)
        });
    }
    catch(erro){
        next(erro);
    }
}

// POST /viagens - cria uma nova viagem
export async function criarViagem(req, res, next){
    try {
        const { dataSaida, limiteVagas, doadores } = req.body;
        try{
            await validarViagem(dataSaida, limiteVagas, doadores)
        }
        catch(error){
            return res.status(400).json({ erro: error.message });
        }
        const novaViagem = await prisma.viagem.create({
            data: {
                dataSaida: new Date(dataSaida),
                limiteVagas: limiteVagas,
                doadores: {
                    connect: doadores.map(id => ({
                        id: id
                    }))
                }
            },
            include: {
                doadores: {
                    select: doadorSelect
                },
            },
        });
        res.status(201).json({
            ...novaViagem,
            doadores: novaViagem.doadores.map(descriptografarDoador)
        });
    }
    catch(erro){
        next(erro);
    }
}

// PUT /viagens/:id - atualiza uma viagem existente
export async function atualizarViagem(req, res, next){
    try {
        const { id } = req.params;
        const { dataSaida, limiteVagas, doadores } = req.body;
        if (!Number.isInteger(Number(id)) || Number(id)<=0) {
            return res.status(400).json({ erro: 'ID inválido' });
        }
        try{
            await validarViagem(dataSaida, limiteVagas, doadores, Number(id))
        }
        catch(error){
            return res.status(400).json({ erro: error.message });
        }
        const viagem = await prisma.viagem.update({
            where: { id: Number(id) },
            data: {
                dataSaida: new Date(dataSaida),
                limiteVagas: limiteVagas,
                doadores: {
                    set: doadores.map(id => ({
                        id: id
                    }))
                }
            },
            include: {
                doadores: {
                    select: doadorSelect
                },
            },
        });
        res.json({
            ...viagem,
            doadores: viagem.doadores.map(descriptografarDoador)
        });
    }
    catch(erro){
        if (erro.code === "P2025"){
            return res.status(404).json({ erro: 'Viagem não encontrada' });
        }
        next(erro);
    }
}

// DELETE /viagens/:id - deleta uma viagem
export async function deletarViagem(req, res, next){
    try{
        const { id } = req.params;
        if (!Number.isInteger(Number(id)) || Number(id)<=0) {
            return res.status(400).json({ erro: 'ID inválido' });
        }
        await prisma.viagem.delete({
            where: { id: Number(id) }
        })
        res.status(204).end()
    }
    catch(erro){
        if (erro.code === "P2025"){
            return res.status(404).json({ erro: 'Viagem não encontrada' });
        }
        next(erro);
    }
}

function descriptografarDoador(doador) {
    return {
        ...doador,
        cpf: decrypt(doador.cpf),
        tipoSang: formataTipo(doador.tipoSang),
    };
}

async function validarViagem(dataSaida, limiteVagas, doadores, viagemId = null){
    const data = new Date(dataSaida);
    if (isNaN(data.getTime())) {
        throw new Error('Data inválida');
    }
    if (!Number.isInteger(limiteVagas) || limiteVagas <= 0) {
        throw new Error("Limite de vagas inválido");
    }
    if (!Array.isArray(doadores)) {
        throw new Error('O campo doadores é um array obrigatório');
    }
    if (doadores.length === 0) {
        throw new Error('Viagem sem doadores');
    }
    const idsUnicos = [...new Set(doadores)];
    if (idsUnicos.length !== doadores.length) {
        throw new Error('Doadores duplicados');
    }
    if (!doadores.every(id => Number.isInteger(id) && id > 0)) {
        throw new Error('Doadores inválidos');
    }
    if (doadores.length > limiteVagas) {
        throw new Error('Limite de doadores atingido');
    }
    const doadoresEncontrados = await prisma.doador.findMany({
        where: {
            id: {
                in: doadores
            }
        },
        select: {
            id: true,
            sexo: true,
            viagens: {
                where: viagemId
                    ? {
                        id: {
                            not: viagemId
                        }
                    }
                    : undefined,
                select: {
                    id: true,
                    dataSaida: true
                }
            }
        }
    });
    if (doadoresEncontrados.length !== doadores.length) {
        throw new Error("Doadores inválidos");
    }
    const indisponiveis = doadoresEncontrados.filter(
        doador => !calculaDisponibilidade(doador, data)
    );
    if (indisponiveis.length > 0) {
        throw new Error("Existem doadores não disponíveis na viagem");
    }
}