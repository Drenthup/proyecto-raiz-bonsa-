import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Pagina from '../components/Pagina.jsx'
import BadgeDificultad from '../components/BadgeDificultad.jsx'
import { MensajeError, Spinner } from '../components/Estados.jsx'
import { useApi } from '../hooks/useApi.js'
import { LUZ, formatearPrecio } from '../lib/formato.js'

function ImagenDetalle({ bonsai }) {
  const [fallo, setFallo] = useState(false)
  return fallo || !bonsai.imagen_url ? <div className="rb-detail__image-missing" role="img" aria-label="Imagen no disponible">✳</div> : <img src={bonsai.imagen_url} alt={`Bonsái ${bonsai.nombre}`} onError={() => setFallo(true)} decoding="async" fetchPriority="high" />
}

export default function DetalleBonsai() {
  const { id } = useParams()
  const { datos: bonsai, cargando, error, reintentar } = useApi(`/api/bonsais/${id}`)
  const reducirMovimiento = useReducedMotion()
  if (cargando) return <Spinner texto="Buscando tu bonsái…" />
  if (error) {
    const noExiste = error.status === 404 || error.status === 400
    return <Pagina className="px-4 py-24"><MensajeError mensaje={noExiste ? 'Este bonsái no existe o ya no está en el vivero.' : error.message} onReintentar={noExiste ? undefined : reintentar} /><p className="mt-6 text-center"><Link to="/catalogo" className="text-musgo-700 hover:underline">← Volver al catálogo</Link></p></Pagina>
  }
  if (!bonsai) return null
  const ficha = [
    { etiqueta: 'EDAD APROXIMADA', valor: bonsai.edad_anios ? `${bonsai.edad_anios} años` : '—', numero: '01' },
    { etiqueta: 'NECESIDAD DE LUZ', valor: LUZ[bonsai.luz] ?? bonsai.luz ?? '—', numero: '02' },
    { etiqueta: 'FRECUENCIA DE RIEGO', valor: bonsai.frecuencia_riego ?? '—', numero: '03' },
  ]
  return (
    <Pagina className="rb-detail">
      <div className="rb-detail__top"><Link to="/catalogo">← VOLVER A LA COLECCIÓN</Link><span>RAÍZ / PIEZAS VIVAS</span></div>
      <div className="rb-detail__grid">
        <motion.div initial={reducirMovimiento ? false : { opacity: 0, x: -28 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="rb-detail__art">
          <span className="rb-detail__art-label">PIEZA ÚNICA / RAÍZ BONSAI</span>
          <div className="rb-detail__photo"><ImagenDetalle key={bonsai.id} bonsai={bonsai} /></div>
          <span className="rb-detail__art-bottom">CULTIVADO CON PACIENCIA · COLOMBIA</span>
        </motion.div>
        <motion.div initial={reducirMovimiento ? false : { opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.12 }} className="rb-detail__info">
          <p className="rb-eyebrow">UNA VIDA EN MINIATURA</p>
          <h1>{bonsai.nombre}</h1>
          <p className="rb-detail__species">{bonsai.especie}</p>
          <div className="rb-detail__availability"><BadgeDificultad dificultad={bonsai.dificultad} /><span>{bonsai.disponible === false ? 'AGOTADO POR AHORA' : 'DISPONIBLE EN EL VIVERO'}</span></div>
          <p className="rb-detail__description">{bonsai.descripcion}</p>
          <div className="rb-detail__price"><span>VALOR DE LA PIEZA</span><strong>{formatearPrecio(bonsai.precio)}</strong></div>
          <Link className="rb-detail__cta" to={`/contacto?bonsai=${encodeURIComponent(bonsai.nombre)}`}>ME INTERESA ESTE BONSÁI <span aria-hidden="true">↗</span></Link>
          <p className="rb-detail__note">¿Tienes preguntas sobre sus cuidados? Nuestro equipo te acompaña para elegir con calma.</p>
        </motion.div>
      </div>
      <section className="rb-detail__care" aria-labelledby="cuidados-titulo"><div><span className="rb-eyebrow">UNA GUÍA PARA CUIDARLO</span><h2 id="cuidados-titulo">Conocerlo es <em>cuidarlo.</em></h2></div><dl>{ficha.map((f) => <div key={f.numero}><dt><span>{f.numero}</span> {f.etiqueta}</dt><dd>{f.valor}</dd></div>)}</dl></section>
      <div className="rb-detail__bottom"><span>CADA ÁRBOL MERECE UNA HISTORIA</span><Link to="/catalogo">SEGUIR EXPLORANDO <span aria-hidden="true">→</span></Link></div>
    </Pagina>
  )
}
