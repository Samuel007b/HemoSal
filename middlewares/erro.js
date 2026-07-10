export default function tratarErro(err, req, res, next) {
  console.error('[ERRO]', err);
  res.status(500).json({
    erro: 'Erro interno do servidor',
  });
}