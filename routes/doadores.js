import { Router } from 'express';
import {
  listarDoadores,
  listarDoadoresNome,
  buscarDoadorCpf,
  buscarDoadorRg,
  buscarDoadorSus,
  listarDoadoresTipo,
  buscarDoador,
  criarDoador,
  atualizarDoador,
  deletarDoador,
} from '../controllers/doadoresController.js';

const router = Router();

router.get('/', listarDoadores);        // GET /doadores
router.get('/nome', listarDoadoresNome);    // GET /doadores/nome
router.get('/cpf', buscarDoadorCpf);     // GET /doadores/cpf
router.get('/rg', buscarDoadorRg);      // GET /doadores/rg
router.get('/sus', buscarDoadorSus);     // GET /doadores/sus
router.get('/tipo', listarDoadoresTipo);    // GET /doadores/tipo
router.get('/:id', buscarDoador);       // GET /doadores/:id
router.post('/', criarDoador);          // POST /doadores
router.put('/:id', atualizarDoador);    // PUT /doadores/:id
router.delete('/:id', deletarDoador);   // DELETE /doadores/:id

export default router;