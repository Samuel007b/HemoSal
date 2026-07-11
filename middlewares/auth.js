import 'dotenv/config';
import jwt from "jsonwebtoken";
const secretToken = process.env.SECRET_TOKEN;

export const verifyToken = (req, res, next) => {
  const authHeader  = req.header('Authorization');
  if (!authHeader ) {
    return res.status(401).json({ mensagem: 'Token não fornecido' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, secretToken);
    req.user = decoded;
    next();
  } catch (erro) {
    return res.status(401).json({ mensagem: 'Token inválido' });
  }
};