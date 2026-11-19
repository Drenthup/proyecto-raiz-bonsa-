import { Link, useLocation } from 'react-router-dom'

const ANIO = new Date().getFullYear()

export default function Footer() {
  const { pathname } = useLocation()
  // Mantiene el pie de página anterior en las rutas del administrador.
  if (pathname.startsWith('/admin')) return (
    <footer className="mt-24 bg-musgo-900 text-musgo-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div><p className="font-serif text-2xl text-white">Raíz</p><p className="mt-2 text-sm text-musgo-100/80">Bonsáis cultivados con paciencia en Colombia.</p></div>
        <nav className="flex flex-col gap-2 text-sm">
          <Link to="/" className="hover:text-white">Inicio</Link>
          <Link to="/catalogo" className="hover:text-white">Catálogo</Link>
          <Link to="/contacto" className="hover:text-white">Contacto</Link>
        </nav>
        <p className="text-sm text-musgo-100/80 sm:text-right">© {ANIO} Raíz · Vivero de bonsáis<Link to="/admin" className="mt-2 block text-xs text-musgo-100/50 hover:text-white">Acceso equipo</Link></p>
      </div>
    </footer>
  )
  return (
    <footer className="rb-footer">
      <div className="rb-footer__top"><span>EL VIVERO / COLOMBIA</span><span>DONDE LA CALMA ECHA RAÍCES</span></div>
      <div className="rb-footer__main"><p>Lo extraordinario<br />necesita <em>tiempo.</em></p><Link to="/contacto" aria-label="Escríbenos, ir a contacto" className="rb-footer__circle">↗</Link></div>
      <div className="rb-footer__bottom"><div className="rb-footer__brand">RAÍZ <span>BONSAI STUDIO</span></div><nav aria-label="Enlaces del pie de página"><Link to="/">INICIO</Link><Link to="/catalogo">COLECCIÓN</Link><Link to="/contacto">CONTACTO</Link><Link to="/admin">ACCESO EQUIPO</Link></nav><small>© {ANIO} RAÍZ. CULTIVADO CON PACIENCIA.</small></div>
    </footer>
  )
}
