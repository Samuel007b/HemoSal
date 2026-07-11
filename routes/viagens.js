import { Router } from 'express';
import {
  listarViagens,
  buscarViagem,
  criarViagem,
  atualizarViagem,
  deletarViagem,
} from '../controllers/viagensController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

router.get('/', verifyToken, listarViagens);         // GET /viagens
router.get('/:id', verifyToken, buscarViagem);       // GET /viagens/:id
router.post('/', verifyToken, criarViagem);          // POST /viagens
router.put('/:id', verifyToken, atualizarViagem);    // PUT /viagens/:id
router.delete('/:id', verifyToken, deletarViagem);   // DELETE /viagens/:id

export default router;