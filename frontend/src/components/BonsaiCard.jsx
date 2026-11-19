import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import BadgeDificultad from './BadgeDificultad.jsx'
import { formatearPrecio } from '../lib/formato.js'

const aparecer = {
  oculto: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

export default function BonsaiCard({ bonsai, indice = 0 }) {
  const [fallo, setFallo] = useState(false)
  const reducirMovimiento = useReducedMotion()
  return (
    <motion.li variants={reducirMovimiento ? undefined : aparecer} className="rb-card">
      <Link className="rb-card__link" to={`/bonsai/${bonsai.id}`}>
        <div className="rb-card__image">
          <span className="rb-card__number">FIG. {String(indice + 1).padStart(2, '0')}</span>
          {fallo || !bonsai.imagen_url ? <div className="rb-card__fallback" aria-label="Fotografía no disponible">✳</div> : <img src={bonsai.imagen_url} alt={`Bonsái ${bonsai.nombre}`} loading="lazy" decoding="async" onError={() => setFallo(true)} />}
          <span className="rb-card__icon" aria-hidden="true">↗</span>
        </div>
        <div className="rb-card__meta"><span>PIEZA SELECCIONADA</span><BadgeDificultad dificultad={bonsai.dificultad} /></div>
        <div className="rb-card__heading"><div><h3>{bonsai.nombre}</h3><p>{bonsai.especie}</p></div></div>
        <div className="rb-card__bottom"><strong>{formatearPrecio(bonsai.precio)}</strong><span>DESCUBRIR <span aria-hidden="true">→</span></span></div>
      </Link>
    </motion.li>
  )
}
