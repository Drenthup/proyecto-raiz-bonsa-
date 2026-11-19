import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../db/pool.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Evita diferencias grandes de tiempo al consultar un correo inexistente.
const HASH_FICTICIO = '$2y$12$QueMmNwkjZFRG6YB7XgP3uRNrgyKFlQRpegLijaV0eW6zPs4x0.E6'

function configuracionLista() {
  const clave = process.env.CLIENT_JWT_SECRET
  if (!clave || clave.length < 32 || clave === process.env.JWT_SECRET) {
    throw new Error('Configura CLIENT_JWT_SECRET (mínimo 32 caracteres y diferente de JWT_SECRET) en backend/.env')
  }
  return clave
}

// La configuración debe existir antes de activar cuentas. Nunca escribir el secreto en logs.
const toPublic = (c) => ({ id: c.id, nombre: c.nombre, email: c.email, creado_en: c.creado_en })
const correoNormalizado = (email) => typeof email === 'string' ? email.trim().toLowerCase() : ''
const contrasenaValida = (valor) => typeof valor === 'string' && valor.length >= 10 && Buffer.byteLength(valor, 'utf8') <= 72

function nuevaSesion(cliente, clave) {
  return jwt.sign({ rol: 'cliente' }, clave, {
    subject: String(cliente.id),
    issuer: 'raiz-bonsai',
    audience: 'raiz-clientes',
    expiresIn: '2h',
    algorithm: 'HS256',
  })
}

export async function registrarCliente(req, res) {
  const clave = configuracionLista()
  const nombre = typeof req.body?.nombre === 'string' ? req.body.nombre.trim().replace(/\s+/g, ' ') : ''
  const email = correoNormalizado(req.body?.email)
  const password = req.body?.password

  if (nombre.length < 2 || nombre.length > 80) {
    return res.status(400).json({ error: 'Escribe un nombre entre 2 y 80 caracteres.' })
  }
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Escribe un correo electrónico válido.' })
  }
  if (!contrasenaValida(password)) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 10 caracteres y no superar 72 bytes.' })
  }

  const hash = await bcrypt.hash(password, 12)
  try {
    const { rows } = await pool.query(
      `INSERT INTO public.clientes (nombre, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, nombre, email, creado_en`,
      [nombre, email, hash],
    )
    const cliente = rows[0]
    return res.status(201).json({ cliente: toPublic(cliente), token: nuevaSesion(cliente, clave) })
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ese correo ya está registrado. Puedes iniciar sesión.' })
    }
    throw error
  }
}

export async function iniciarSesionCliente(req, res) {
  const clave = configuracionLista()
  const email = correoNormalizado(req.body?.email)
  const password = req.body?.password
  if (!email || email.length > 254 || !EMAIL_RE.test(email) ||
      typeof password !== 'string' || Buffer.byteLength(password, 'utf8') > 72 || !password) {
    return res.status(400).json({ error: 'Escribe tu correo y contraseña.' })
  }

  const { rows } = await pool.query(
    'SELECT id, nombre, email, password_hash, creado_en FROM public.clientes WHERE email = $1', [email],
  )
  const cliente = rows[0]
  // Respuesta indistinguible cuando el correo o contraseña no coinciden.
  const coincide = await bcrypt.compare(password, cliente?.password_hash ?? HASH_FICTICIO)
  if (!cliente || !coincide) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos.' })
  }

  return res.json({ cliente: toPublic(cliente), token: nuevaSesion(cliente, clave) })
}

export async function datosMiCuenta(req, res) {
  const { rows } = await pool.query(
    'SELECT id, nombre, email, creado_en FROM public.clientes WHERE id = $1', [req.clienteId],
  )
  if (!rows[0]) return res.status(401).json({ error: 'No encontramos tu cuenta.' })
  return res.json({ cliente: toPublic(rows[0]) })
}
