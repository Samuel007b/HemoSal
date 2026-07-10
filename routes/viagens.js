import { Router } from 'express';
import {
  listarViagens,
  buscarViagem,
  criarViagem,
  atualizarViagem,
  deletarViagem,
} from '../controllers/viagensController.js';

const router = Router();

router.get('/', listarViagens);         // GET /viagens
router.get('/:id', buscarViagem);       // GET /viagens/:id
router.post('/', criarViagem);          // POST /viagens
router.put('/:id', atualizarViagem);    // PUT /viagens/:id
router.delete('/:id', deletarViagem);   // DELETE /viagens/:id

export default router;