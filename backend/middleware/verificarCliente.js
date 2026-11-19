import jwt from 'jsonwebtoken'

// Aislamiento de cuentas públicas: un JWT de cliente jamás puede abrir /api/admin.
// Usa CLIENT_JWT_SECRET distinto de JWT_SECRET (que permanece exclusivo del admin).
export function verificarCliente(req, res, next) {
  const [tipo, token] = (req.headers.authorization ?? '').split(' ')
  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Inicia sesión para continuar.' })
  }

  try {
    const sesion = jwt.verify(token, process.env.CLIENT_JWT_SECRET, {
      issuer: 'raiz-bonsai',
      audience: 'raiz-clientes',
      algorithms: ['HS256'],
    })
    if (sesion.rol !== 'cliente' || !sesion.sub) {
      return res.status(401).json({ error: 'Tu sesión no es válida.' })
    }
    req.clienteId = sesion.sub
    next()
  } catch {
    return res.status(401).json({ error: 'Tu sesión expiró. Inicia sesión nuevamente.' })
  }
}
