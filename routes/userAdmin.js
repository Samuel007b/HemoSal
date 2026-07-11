import express from 'express';
import {
    listarUsuarios,
    buscarUsuario,
    criarUsuario,
    atualizarUsuario,
    deletarUsuario,
    loginUsuario
} from '../controllers/userAdminController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', verifyToken, listarUsuarios);            // GET /user
router.get('/:id', verifyToken, buscarUsuario);          // GET /user/:id
router.post('/', verifyToken, criarUsuario);             // POST /user
router.put('/:id', verifyToken, atualizarUsuario);       // PUT /user/:id
router.delete('/:id', verifyToken, deletarUsuario);      // DELETE /user/:id
router.post('/login', loginUsuario);                     // POST /user/login

export default router;