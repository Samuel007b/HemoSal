import { Router } from 'express';
import {
  listarDoadores,
  listarDoadoresNome,
  listarDoadoresCpf,
  listarDoadoresRg,
  listarDoadoresSus,
  listarDoadoresTipo,
  buscarDoador,
  criarDoador,
  atualizarDoador,
  deletarDoador,
} from '../controllers/doadoresController.js';

const router = Router();

router.get('/', listarDoadores);        // GET /doadores
router.get('/nome', listarDoadoresNome);    // GET /doadores/nome
router.get('/cpf', listarDoadoresCpf);     // GET /doadores/cpf
router.get('/rg', listarDoadoresRg);      // GET /doadores/rg
router.get('/sus', listarDoadoresSus);     // GET /doadores/sus
router.get('/tipo', listarDoadoresTipo);    // GET /doadores/tipo
router.get('/:id', buscarDoador);       // GET /doadores/:id
router.post('/', criarDoador);          // POST /doadores
router.put('/:id', atualizarDoador);    // PUT /doadores/:id
router.delete('/:id', deletarDoador);   // DELETE /doadores/:id

export default router;