//import prisma from '../prisma/client.js';

// GET /viagens - lista todas as viagens
export async function listarViagens(req, res, next){
    return res.status(200).json({ mensagem: 'GET /viagens' });
}

// GET /viagens/:id - busca uma viagem pelo id
export async function buscarViagem(req, res, next){
    return res.status(200).json({ mensagem: 'GET /viagens/:id' });
}

// POST /viagens - cria uma nova viagem
export async function criarViagem(req, res, next){
    return res.status(200).json({ mensagem: 'POST /viagens' });
}

// PUT /viagens/:id - atualiza uma viagem existente
export async function atualizarViagem(req, res, next){
    return res.status(200).json({ mensagem: 'PUT /viagens/:id' });
}

// DELETE /viagens/:id - deleta uma viagem
export async function deletarViagem(req, res, next){
    return res.status(200).json({ mensagem: 'DELETE /viagens/:id' });
}