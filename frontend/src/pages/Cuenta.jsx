import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Pagina from '../components/Pagina.jsx'
import { conJson, pedirApi } from '../lib/api.js'
import { cerrarCliente, guardarCliente, obtenerTokenCliente } from '../lib/clienteSesion.js'
import bonsaiHero from '../assets/bonsai-hero.webp'
import '../styles/raiz-cuenta.css'

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validacion(modo, valores) {
  if (modo === 'registro' && (valores.nombre.trim().length < 2 || valores.nombre.trim().length > 80)) {
    return 'Escribe tu nombre completo (entre 2 y 80 caracteres).'
  }
  if (!CORREO.test(valores.email.trim())) return 'Revisa tu correo electrónico.'
  if (modo === 'registro' && valores.password.length < 10) return 'Usa una contraseña de al menos 10 caracteres.'
  if (new TextEncoder().encode(valores.password).length > 72) return 'La contraseña es demasiado larga.'
  if (!valores.password) return 'Escribe tu contraseña.'
  return null
}

const diapositiva = {
  inicial: { opacity: 0, y: 22, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.52, ease: [0.22, 1, 0.36, 1] } },
  salir: { opacity: 0, y: -14, filter: 'blur(3px)', transition: { duration: 0.22 } },
}

export default function Cuenta() {
  const reducir = useReducedMotion()
  const location = useLocation()
  const [modo, setModo] = useState(location.state?.registro ? 'registro' : 'login')
  const [campos, setCampos] = useState({ nombre: '', email: '', password: '' })
  const [mostrarClave, setMostrarClave] = useState(false)
  const [esperando, setEsperando] = useState(false)
  const [cargandoPerfil, setCargandoPerfil] = useState(Boolean(obtenerTokenCliente()))
  const [perfil, setPerfil] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = obtenerTokenCliente()
    if (!token) { setCargandoPerfil(false); return }
    const abort = new AbortController()
    pedirApi('/api/clientes/yo', { headers: { Authorization: `Bearer ${token}` }, signal: abort.signal })
      .then(({ cliente }) => setPerfil(cliente))
      .catch((err) => {
        if (err.name === 'AbortError') return
        if (err.status === 401) cerrarCliente()
        else setError('No pudimos comprobar tu sesión. Revisa tu conexión e intenta de nuevo.')
      })
      .finally(() => { if (!abort.signal.aborted) setCargandoPerfil(false) })
    return () => abort.abort()
  }, [])

  const cambiarModo = (siguiente) => {
    if (esperando) return
    setModo(siguiente)
    setError('')
    setMostrarClave(false)
    setCampos((anterior) => ({ ...anterior, password: '' }))
  }

  const enviar = async (evento) => {
    evento.preventDefault()
    if (esperando) return
    const mensaje = validacion(modo, campos)
    if (mensaje) { setError(mensaje); return }
    setError('')
    setEsperando(true)
    try {
      const endpoint = modo === 'registro' ? '/api/clientes/registro' : '/api/clientes/login'
      const cuerpo = modo === 'registro'
        ? { nombre: campos.nombre.trim(), email: campos.email.trim(), password: campos.password }
        : { email: campos.email.trim(), password: campos.password }
      const { token, cliente } = await pedirApi(endpoint, conJson('POST', cuerpo))
      guardarCliente(token)
      setPerfil(cliente)
      setCampos({ nombre: '', email: '', password: '' })
    } catch (err) {
      setError(err.message || 'No se pudo acceder a tu cuenta. Intenta nuevamente.')
    } finally {
      setEsperando(false)
    }
  }

  const salir = () => {
    cerrarCliente()
    setPerfil(null)
    setError('')
    setModo('login')
  }

  const cambioCampo = (evento) => {
    setCampos((anterior) => ({ ...anterior, [evento.target.name]: evento.target.value }))
    if (error) setError('')
  }

  const esRegistro = modo === 'registro'
  const movimiento = reducir ? {} : { initial: 'inicial', animate: 'visible', exit: 'salir', variants: diapositiva }

  return (
    <Pagina className="rb-auth">
      <div className="rb-auth__topline"><span>RAÍZ / EXPERIENCIA PERSONAL</span><span>EL COMIENZO DE ALGO QUE CRECE</span></div>
      <div className="rb-auth__layout">
        <div className="rb-auth__art" aria-label="Fotografía de un bonsái escultórico sobre fondo verde bosque">
          <div className="rb-auth__art-grain" aria-hidden="true" />
          <motion.div className="rb-auth__moon" aria-hidden="true" initial={reducir ? false : { scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1.2 }} />
          <span className="rb-auth__art-index">01 — CRECER / PERTENECER</span>
          <motion.img src={bonsaiHero} alt="Bonsái de junípero con tronco escultural y copa verde" className="rb-auth__tree" initial={reducir ? false : { y: 45, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }} />
          <div className="rb-auth__art-copy">
            <span>UN ESPACIO PARA VOLVER</span>
            <p>Las cosas bellas<br />crecen <em>despacio.</em></p>
          </div>
          <span className="rb-auth__art-vertical" aria-hidden="true">RAÍZ BONSAI STUDIO / COLOMBIA</span>
        </div>
        <section className="rb-auth__panel" aria-labelledby="rb-auth-titulo">
          <div className="rb-auth__panel-top"><span className="rb-auth__eyebrow">CAPÍTULO V / TU ESPACIO</span><Link to="/" className="rb-auth__close" aria-label="Volver al inicio">↗ <span>VOLVER AL INICIO</span></Link></div>
          {cargandoPerfil ? (
            <div className="rb-auth__loading" role="status"><span className="rb-auth__spinner" /> Preparando tu espacio…</div>
          ) : perfil ? (
            <motion.div {...movimiento} className="rb-auth__form-body rb-auth__welcome" key="perfil">
              <span className="rb-auth__number">RAÍZ · CUENTA PERSONAL</span>
              <span className="rb-auth__spark" aria-hidden="true">✳</span>
              <h1 id="rb-auth-titulo">Bienvenido,<br /><em>{perfil.nombre.split(' ')[0]}.</em></h1>
              <p className="rb-auth__lead">Tu historia con Raíz continúa aquí. Gracias por cultivar con nosotros.</p>
              <div className="rb-auth__profile"><span>TU CUENTA</span><strong>{perfil.nombre}</strong><span>{perfil.email}</span></div>
              <div className="rb-auth__actions"><Link to="/catalogo" className="rb-auth__submit">VOLVER A LA COLECCIÓN <span>↗</span></Link><button className="rb-auth__text-button" type="button" onClick={salir}>CERRAR SESIÓN ↗</button></div>
            </motion.div>
          ) : (
            <div className="rb-auth__form-body">
              <span className="rb-auth__number">{esRegistro ? '02 / COMIENZA TU HISTORIA' : '01 / NOS VOLVEMOS A ENCONTRAR'}</span>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={modo} {...movimiento}>
                  <h1 id="rb-auth-titulo">{esRegistro ? <>Todo comienza<br />con una <em>raíz.</em></> : <>Qué bueno<br /><em>tenerte aquí.</em></>}</h1>
                  <p className="rb-auth__lead">{esRegistro ? 'Crea un espacio propio en nuestro pequeño universo botánico.' : 'Inicia sesión para continuar tu historia con nuestros bonsáis.'}</p>
                  <div className="rb-auth__tabs" role="group" aria-label="Elegir acceso o registro">
                    <button type="button" className={!esRegistro ? 'rb-auth__tab rb-auth__tab--active' : 'rb-auth__tab'} aria-pressed={!esRegistro} onClick={() => cambiarModo('login')}>INICIAR SESIÓN</button>
                    <button type="button" className={esRegistro ? 'rb-auth__tab rb-auth__tab--active' : 'rb-auth__tab'} aria-pressed={esRegistro} onClick={() => cambiarModo('registro')}>CREAR CUENTA</button>
                  </div>
                  <form className="rb-auth__form" onSubmit={enviar} noValidate>
                    {esRegistro && <label className="rb-auth__label" htmlFor="cliente-nombre">TU NOMBRE<input id="cliente-nombre" name="nombre" value={campos.nombre} onChange={cambioCampo} type="text" autoComplete="name" maxLength={80} placeholder="¿Cómo te llamas?" required /></label>}
                    <label className="rb-auth__label" htmlFor="cliente-email">CORREO ELECTRÓNICO<input id="cliente-email" name="email" value={campos.email} onChange={cambioCampo} type="email" autoComplete="email" maxLength={254} placeholder="tu@email.com" required /></label>
                    <label className="rb-auth__label" htmlFor="cliente-password">CONTRASEÑA
                      <span className="rb-auth__password-box"><input id="cliente-password" name="password" value={campos.password} onChange={cambioCampo} type={mostrarClave ? 'text' : 'password'} autoComplete={esRegistro ? 'new-password' : 'current-password'} placeholder={esRegistro ? 'Al menos 10 caracteres' : 'Tu contraseña'} required /><button type="button" onClick={() => setMostrarClave((v) => !v)} aria-pressed={mostrarClave} aria-label={mostrarClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}>{mostrarClave ? 'OCULTAR' : 'MOSTRAR'}</button></span>
                    </label>
                    {error && <p className="rb-auth__error" role="alert">{error}</p>}
                    <button className="rb-auth__submit" type="submit" disabled={esperando}>{esperando ? 'UN MOMENTO…' : esRegistro ? 'CREAR MI CUENTA' : 'ENTRAR A MI ESPACIO'} <span aria-hidden="true">↗</span></button>
                  </form>
                  <p className="rb-auth__footnote">{esRegistro ? 'Al crear una cuenta, aceptas que guardemos tus datos de registro para identificarte. No compartas tu contraseña.' : 'Tu espacio es personal. Por seguridad, la sesión termina al cerrar esta pestaña.'}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
          <div className="rb-auth__panel-bottom"><span>UN ÁRBOL A LA VEZ.</span><span>RAÍZ — 2026</span></div>
        </section>
      </div>
      <div className="rb-auth__bottomline"><span>EXPLORA CON CALMA</span><span>LA PACIENCIA TAMBIÉN FLORECE</span></div>
    </Pagina>
  )
}
