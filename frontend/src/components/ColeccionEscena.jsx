import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import BadgeDificultad from './BadgeDificultad.jsx'
import { formatearPrecio } from '../lib/formato.js'

// Mismo componente en Inicio y Catálogo: una sola lógica y un único origen de datos.
const TRANSICION = [0.22, 1, 0.36, 1]

function Flecha({ izquierda = false }) {
  return (
    <svg viewBox="0 0 44 24" width="33" height="20" fill="none" aria-hidden="true">
      <path d={izquierda ? 'M42 12H3m0 0 9-9m-9 9 9 9' : 'M2 12h39m0 0-9-9m9 9-9 9'} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Fotografia({ bonsai, avanzar, retroceder, reducirMovimiento, direccion }) {
  const [fallo, setFallo] = useState(false)
  return (
    <motion.figure
      className="rb-gallery__image-wrap"
      key={bonsai.id}
      initial={reducirMovimiento ? false : { opacity: 0, x: direccion > 0 ? 86 : -86, scale: 0.94, filter: 'blur(8px)' }}
      animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
      exit={reducirMovimiento ? undefined : { opacity: 0, x: direccion > 0 ? -90 : 90, scale: 1.035, filter: 'blur(8px)' }}
      transition={{ duration: reducirMovimiento ? 0 : 0.72, ease: TRANSICION }}
      drag={reducirMovimiento ? false : 'x'}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.12}
      onDragEnd={(_, info) => {
        if (info.offset.x < -65) avanzar()
        if (info.offset.x > 65) retroceder()
      }}
    >
      {fallo || !bonsai.imagen_url ? (
        <div className="rb-gallery__image-fallback" role="img" aria-label={`Fotografía no disponible para ${bonsai.nombre}`}>
          <span aria-hidden="true">✳</span>
          <span>Una historia por descubrir</span>
        </div>
      ) : (
        <img src={bonsai.imagen_url} alt={`Bonsái ${bonsai.nombre}`} onError={() => setFallo(true)} loading="eager" decoding="async" draggable="false" />
      )}
    </motion.figure>
  )
}

export default function ColeccionEscena({ bonsais, origen = 'catalogo' }) {
  const [indice, setIndice] = useState(0)
  const [direccion, setDireccion] = useState(1)
  const reducirMovimiento = useReducedMotion()
  const cantidad = bonsais?.length ?? 0
  if (!cantidad) return null
  const actual = ((indice % cantidad) + cantidad) % cantidad
  const bonsai = bonsais[actual]
  const irA = (n, dir) => {
    if (cantidad < 2) return
    setDireccion(dir)
    setIndice(((n % cantidad) + cantidad) % cantidad)
  }
  const avanzar = () => irA(actual + 1, 1)
  const retroceder = () => irA(actual - 1, -1)
  const cambiaTecla = (evento) => {
    if (evento.key === 'ArrowRight') { evento.preventDefault(); avanzar() }
    if (evento.key === 'ArrowLeft') { evento.preventDefault(); retroceder() }
  }

  return (
    <section
      className={`rb-gallery rb-gallery--${origen}`}
      aria-roledescription="carrusel"
      aria-label="Recorrido por la colección de bonsáis"
      tabIndex={0}
      onKeyDown={cambiaTecla}
    >
      <div className="rb-gallery__header">
        <div className="rb-gallery__eyebrow"><span className="rb-star" aria-hidden="true">✳</span> ARCHIVO VIVO <span className="rb-gallery__slash">/</span> EDICIÓN BOTÁNICA</div>
        <div className="rb-gallery__issue">RAÍZ BONSAI <span>—</span> SELECCIÓN {String(cantidad).padStart(2, '0')}</div>
      </div>

      <div className="rb-gallery__stage">
        <div className="rb-gallery__art">
          <span className="rb-gallery__number-ghost" aria-hidden="true">{String(actual + 1).padStart(2, '0')}</span>
          <span className="rb-gallery__frame-tag">FIG. {String(actual + 1).padStart(2, '0')} <span>—</span> COLECCIÓN RAÍZ</span>
          <div className="rb-gallery__image-stage">
            <AnimatePresence initial={false} custom={direccion} mode="wait">
              <Fotografia key={bonsai.id} bonsai={bonsai} reducirMovimiento={reducirMovimiento} direccion={direccion} avanzar={avanzar} retroceder={retroceder} />
            </AnimatePresence>
          </div>
          <p className="rb-gallery__art-caption">EL ARTE DE DAR FORMA AL TIEMPO <span>·</span> COLOMBIA</p>
        </div>

        <div className="rb-gallery__info">
          <div className="rb-gallery__intro">
            <span className="rb-gallery__serif-script">Una pieza viva</span>
            <span className="rb-gallery__counter">{String(actual + 1).padStart(2, '0')} <span>/</span> {String(cantidad).padStart(2, '0')}</span>
          </div>
          <AnimatePresence initial={false} custom={direccion} mode="wait">
            <motion.div
              key={bonsai.id}
              custom={direccion}
              initial={reducirMovimiento ? false : { opacity: 0, y: 24, x: direccion * 18 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={reducirMovimiento ? undefined : { opacity: 0, y: -17, x: direccion * -18 }}
              transition={{ duration: reducirMovimiento ? 0 : 0.45, ease: TRANSICION }}
              className="rb-gallery__content"
              aria-live="polite"
              aria-atomic="true"
            >
              <p className="rb-gallery__scientific">{bonsai.especie || 'Cultivado con paciencia'}</p>
              <h2 className="rb-gallery__title">{bonsai.nombre}</h2>
              <div className="rb-gallery__tags">
                <BadgeDificultad dificultad={bonsai.dificultad} />
                <span>{bonsai.disponible === false ? 'No disponible' : 'Disponible en el vivero'}</span>
              </div>
              <p className="rb-gallery__description">{bonsai.descripcion || 'Una pieza irrepetible de naturaleza viva. Cada rama cuenta una historia de paciencia.'}</p>
              <div className="rb-gallery__purchase">
                <div className="rb-gallery__price">
                  <span>VALOR DE LA PIEZA</span>
                  <strong>{formatearPrecio(bonsai.precio)}</strong>
                </div>
                <Link className="rb-gallery__discover" to={`/bonsai/${bonsai.id}`}>
                  EXPLORAR PIEZA <Flecha />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="rb-gallery__controls">
            <div className="rb-gallery__progress" aria-label={`Pieza ${actual + 1} de ${cantidad}`}>
              <div className="rb-gallery__progress-track"><motion.span animate={{ width: `${((actual + 1) / cantidad) * 100}%` }} transition={{ duration: reducirMovimiento ? 0 : 0.55 }} /></div>
              <span>RECORRIDO {String(actual + 1).padStart(2, '0')}—{String(cantidad).padStart(2, '0')}</span>
            </div>
            <div className="rb-gallery__arrows">
              <button type="button" onClick={retroceder} disabled={cantidad < 2} aria-label="Ver bonsái anterior" className="rb-gallery__arrow rb-gallery__arrow--prev"><Flecha izquierda /></button>
              <button type="button" onClick={avanzar} disabled={cantidad < 2} aria-label="Ver siguiente bonsái" className="rb-gallery__arrow rb-gallery__arrow--next"><span className="rb-gallery__arrow-pulse" /><Flecha /></button>
            </div>
          </div>
        </div>
      </div>
      <div className="rb-gallery__footer"><span>DESLIZA LA FOTOGRAFÍA O UTILIZA LAS FLECHAS</span><span>LA NATURALEZA NO TIENE PRISA</span></div>
    </section>
  )
}
