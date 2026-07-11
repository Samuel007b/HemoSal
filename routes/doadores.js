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
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

router.get('/', verifyToken, listarDoadores);            // GET /doadores
router.get('/nome', verifyToken, listarDoadoresNome);    // GET /doadores/nome
router.get('/cpf', verifyToken, buscarDoadorCpf);        // GET /doadores/cpf
router.get('/rg', verifyToken, buscarDoadorRg);          // GET /doadores/rg
router.get('/sus', verifyToken, buscarDoadorSus);        // GET /doadores/sus
router.get('/tipo', verifyToken, listarDoadoresTipo);    // GET /doadores/tipo
router.get('/:id', verifyToken, buscarDoador);           // GET /doadores/:id
router.post('/', verifyToken, criarDoador);              // POST /doadores
router.put('/:id', verifyToken, atualizarDoador);        // PUT /doadores/:id
router.delete('/:id', verifyToken, deletarDoador);       // DELETE /doadores/:id

export default router;