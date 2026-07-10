//import prisma from '../prisma/client.js';

// GET /doadores - lista todos os doadores
export async function listarDoadores(req, res, next){
    return res.status(200).json({ mensagem: 'GET /doadores' });
}

// GET /doadores/nome - busca doadores pelo nome
export async function listarDoadoresNome(req, res, next){
    return res.status(200).json({ mensagem: 'GET /doadores/nome' });
}

// GET /doadores/cpf - busca doador pelo CPF
export async function listarDoadoresCpf(req, res, next){
    return res.status(200).json({ mensagem: 'GET /doadores/cpf' });
}

// GET /doadores/rg - busca doador pelo RG
export async function listarDoadoresRg(req, res, next){
    return res.status(200).json({ mensagem: 'GET /doadores/rg' });
}

// GET /doadores/sus - busca doador pelo cartão SUS
export async function listarDoadoresSus(req, res, next){
    return res.status(200).json({ mensagem: 'GET /doadores/sus' });
}

// GET /doadores/tipo - busca doadores pelo tipo sanguíneo
export async function listarDoadoresTipo(req, res, next){
    return res.status(200).json({ mensagem: 'GET /doadores/tipo' });
}

// GET /doadores/:id - busca um doador pelo id
export async function buscarDoador(req, res, next){
    return res.status(200).json({ mensagem: 'GET /doadores/:id' });
}

// POST /doadores - cria um novo doador
export async function criarDoador(req, res, next){
    return res.status(200).json({ mensagem: 'POST /doadores' });
}

// PUT /doadores/:id - atualiza um doador existente
export async function atualizarDoador(req, res, next){
    return res.status(200).json({ mensagem: 'PUT /doadores/:id' });
}

// DELETE /doadores/:id - deleta um doador
export async function deletarDoador(req, res, next){
    return res.status(200).json({ mensagem: 'DELETE /doadores/:id' });
}