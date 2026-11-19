import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import '../styles/raiz-editorial.css'

const ENLACES = [
  { a: '/', texto: 'Inicio', numero: '01' },
  { a: '/catalogo', texto: 'Colección', numero: '02' },
  { a: '/contacto', texto: 'Contacto', numero: '03' },
]

export default function Navbar() {
  const [abierto, setAbierto] = useState(false)
  const { pathname } = useLocation()
  const esInicio = pathname === '/'
  const esAdmin = pathname.startsWith('/admin')
  useEffect(() => { setAbierto(false) }, [pathname])

  // El administrador conserva el menú y los enlaces de la versión original.
  if (esAdmin) {
    return (
      <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-arena/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="font-serif text-2xl font-semibold tracking-tight text-musgo-900">Raíz</Link>
          <ul className="hidden gap-8 sm:flex">
            {ENLACES.map(({ a, texto }) => <li key={a}><NavLink to={a} end className={({ isActive }) => `transition-colors hover:text-musgo-700 ${isActive ? 'font-medium text-musgo-800' : 'text-stone-600'}`}>{texto}</NavLink></li>)}
          </ul>
          <button type="button" onClick={() => setAbierto(!abierto)} className="rounded-md p-2 text-musgo-900 sm:hidden" aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={abierto} aria-controls="menu-admin-movil">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">{abierto ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
          </button>
        </nav>
        <AnimatePresence>
          {abierto && <motion.ul id="menu-admin-movil" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-stone-200 px-4 sm:hidden">
            {ENLACES.map(({ a, texto }) => <li key={a}><NavLink to={a} end onClick={() => setAbierto(false)} className="block py-3 text-stone-700">{texto}</NavLink></li>)}
          </motion.ul>}
        </AnimatePresence>
      </header>
    )
  }

  return (
    <header className={`rb-nav ${esInicio ? 'rb-nav--home' : 'rb-nav--internal'}`}>
      <nav className="rb-nav__inner" aria-label="Navegación principal">
        <Link to="/" className="rb-nav__brand" aria-label="Raíz Bonsái, volver al inicio">
          <span>RAÍZ</span><small>BONSAI STUDIO</small>
        </Link>
        <div className="rb-nav__volume" aria-hidden="true">VOL. 01 &nbsp; / &nbsp; VIVERO EN COLOMBIA</div>
        <ul className="rb-nav__links">
          {ENLACES.map(({ a, texto, numero }) => (
            <li key={a}><NavLink to={a} end className={({ isActive }) => isActive ? 'rb-nav__link rb-nav__link--active' : 'rb-nav__link'}><small>{numero}</small>{texto}</NavLink></li>
          ))}
        </ul>
        <div className="rb-nav__right">
          <NavLink to="/cuenta" className={({ isActive }) => `flex items-center gap-2 whitespace-nowrap text-[9px] font-semibold tracking-[.16em] transition-colors hover:text-[#548060] ${isActive ? 'text-[#548060]' : 'text-[#334d3b]'}`} aria-label="Acceder a mi cuenta">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="8" r="3.25"/><path d="M5.75 19c.4-3.45 2.7-5 6.25-5s5.85 1.55 6.25 5"/></svg>
            <span className="hidden sm:inline">MI CUENTA</span>
          </NavLink>
          <Link className="rb-nav__action" to="/catalogo">EXPLORAR <span aria-hidden="true">↗</span></Link>
          <button type="button" className="rb-nav__toggle" onClick={() => setAbierto(!abierto)} aria-label={abierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'} aria-expanded={abierto} aria-controls="rb-menu-mobile">
            <span aria-hidden="true">{abierto ? 'CERRAR' : 'MENÚ'}</span>
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round">{abierto ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M3 7h18M8 12h13M3 17h18" />}</svg>
          </button>
        </div>
      </nav>
      <AnimatePresence initial={false}>
        {abierto && (
          <motion.div id="rb-menu-mobile" className="rb-nav__mobile" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32 }}>
            {ENLACES.map(({ a, texto, numero }) => <NavLink key={a} to={a} end onClick={() => setAbierto(false)}><small>{numero}</small>{texto}<span aria-hidden="true">↗</span></NavLink>)}
            <NavLink to="/cuenta" onClick={() => setAbierto(false)}><small>04</small>Mi cuenta<span aria-hidden="true">↗</span></NavLink>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
