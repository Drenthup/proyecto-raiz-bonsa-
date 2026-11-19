import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import Pagina from '../components/Pagina.jsx'
import ColeccionEscena from '../components/ColeccionEscena.jsx'
import BonsaiCard from '../components/BonsaiCard.jsx'
import { MensajeError, SkeletonTarjetas } from '../components/Estados.jsx'
import { useApi } from '../hooks/useApi.js'
import bonsaiHero from '../assets/bonsai-hero.webp'

const VALORES = [
  { numero: '01', titulo: 'Cultivados aquí', texto: 'Cada árbol crece en nuestro vivero, adaptado al clima colombiano desde el primer brote.' },
  { numero: '02', titulo: 'Para cada ritmo', texto: 'Te contamos cuánta luz, riego y atención necesita cada bonsái antes de llevarlo a casa.' },
  { numero: '03', titulo: 'Te acompañamos', texto: 'Seguimos contigo después de la compra: resolvemos tus dudas de poda, riego y trasplante.' },
]

const revelar = {
  oculto: { opacity: 0, y: 38 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
}

function PortadaCinematografica() {
  const ref = useRef(null)
  const reducirMovimiento = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const progreso = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.4 })
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const cursorSuaveX = useSpring(cursorX, { stiffness: 45, damping: 21 })
  const cursorSuaveY = useSpring(cursorY, { stiffness: 45, damping: 21 })
  const moverLuz = (evento) => {
    if (reducirMovimiento || evento.pointerType !== 'mouse') return
    const caja = evento.currentTarget.getBoundingClientRect()
    cursorX.set(((evento.clientX - caja.left) / caja.width - 0.5) * 24)
    cursorY.set(((evento.clientY - caja.top) / caja.height - 0.5) * 15)
  }

  // Tres actos unidos a la rueda del ratón: editorial, transición y descubrimiento.
  const fondo = useTransform(progreso, [0, 0.32, 0.66, 1], ['#e9e2cd', '#e4ddc6', '#59664a', '#152c24'])
  const titularOp = useTransform(progreso, [0, 0.16, 0.42], [1, 1, 0])
  const titularY = useTransform(progreso, [0, 0.42], ['0%', '-46%'])
  const introOp = useTransform(progreso, [0, 0.15, 0.36], [1, 1, 0])
  const imagenEscala = useTransform(progreso, [0, 0.22, 0.55, 0.82, 1], [1, 1.13, 1.19, 0.87, 0.85])
  const imagenX = useTransform(progreso, [0, 0.28, 0.6, 1], ['0%', '5%', '-10%', '-17%'])
  const imagenY = useTransform(progreso, [0, 0.45, 1], ['0%', '-4%', '5%'])
  const imagenRot = useTransform(progreso, [0, 0.45, 1], [0, -1.2, 0.8])
  const circuloEscala = useTransform(progreso, [0, 0.4, 1], [0.8, 1.34, 2.1])
  const circuloOp = useTransform(progreso, [0, 0.34, 0.77], [0.6, 0.5, 0])
  const intermedioOp = useTransform(progreso, [0.21, 0.4, 0.54, 0.69], [0, 1, 1, 0])
  const intermedioY = useTransform(progreso, [0.2, 0.45, 0.68], ['30px', '0px', '-25px'])
  const finalOp = useTransform(progreso, [0.68, 0.85, 1], [0, 1, 1])
  const finalY = useTransform(progreso, [0.64, 0.9], ['55px', '0px'])
  const indicadorOp = useTransform(progreso, [0, 0.1, 0.24], [1, 1, 0])
  const barra = useTransform(progreso, [0, 1], [0, 1])
  const estilo = (valor, alternativo) => reducirMovimiento ? alternativo : valor

  return (
    <section className={`rb-story ${reducirMovimiento ? 'rb-story--reduced' : ''}`} ref={ref} aria-label="Raíz Bonsái, una experiencia botánica">
      <motion.div className="rb-story__stage" style={{ backgroundColor: estilo(fondo, '#e9e2cd') }} onPointerMove={moverLuz} onPointerLeave={() => { cursorX.set(0); cursorY.set(0) }}>
        <div className="rb-story__paper" aria-hidden="true" />
        <motion.div className="rb-story__sun" aria-hidden="true" style={{ opacity: estilo(circuloOp, 0.45), scale: estilo(circuloEscala, 1) }} />
        <div className="rb-story__particles" aria-hidden="true">{[0, 1, 2, 3, 4, 5, 6].map((n) => <i key={n} style={{ left: `${18 + n * 10}%`, top: `${24 + n * 8}%`, animationDuration: `${6 + n * 0.83}s`, animationDelay: `${n * -1.3}s` }} />)}</div>
        <div className="rb-story__top-note" aria-hidden="true"><span>UN VIVERO, INFINITAS HISTORIAS</span><span>EST. EN COLOMBIA</span></div>
        <motion.div className="rb-story__headline" style={{ opacity: estilo(titularOp, 1), y: estilo(titularY, '0%') }}>
          <p>LA BELLEZA DE LO QUE PERMANECE</p>
          <h1>BONSAI</h1>
          <span className="rb-story__script">con alma</span>
        </motion.div>
        <motion.div className="rb-story__tree" style={{ x: estilo(imagenX, '0%'), y: estilo(imagenY, '0%'), scale: estilo(imagenEscala, 1), rotate: estilo(imagenRot, 0) }}>
          <motion.img src={bonsaiHero} style={{ x: estilo(cursorSuaveX, 0), y: estilo(cursorSuaveY, 0) }} fetchPriority="high" decoding="async" alt="Bonsái de junípero con tronco escultórico y ramas verdes, protagonista de Raíz" draggable="false" />
        </motion.div>
        <motion.div className="rb-story__intro" style={{ opacity: estilo(introOp, 1) }}>
          <p className="rb-eyebrow">01 / EL ARTE DE CULTIVAR</p>
          <h2>Una pequeña forma de <em>eternidad.</em></h2>
          <p>Árboles que nos recuerdan que todo lo valioso necesita tiempo, paciencia y un poco de luz.</p>
          <Link to="/catalogo" className="rb-text-link rb-text-link--dark">EXPLORAR LA COLECCIÓN <span aria-hidden="true">↗</span></Link>
        </motion.div>
        <motion.div className="rb-story__middle" style={{ opacity: estilo(intermedioOp, 0), y: estilo(intermedioY, '0px') }} aria-hidden="true">
          <span className="rb-eyebrow">EL TIEMPO ES PARTE DE LA OBRA</span>
          <p>Hay belleza en <em>ir despacio.</em></p>
          <span className="rb-story__middle-line" />
        </motion.div>
        <motion.div className="rb-story__reveal" style={{ opacity: estilo(finalOp, 0), y: estilo(finalY, '0px') }} aria-hidden="true">
          <span className="rb-eyebrow">CAPÍTULO II / DESCUBRIR</span>
          <p>La naturaleza tiene <em>nombre propio.</em></p>
          <span>Continúa el recorrido ↓</span>
        </motion.div>
        <motion.div className="rb-story__scroll" style={{ opacity: estilo(indicadorOp, 1) }}>
          <button
            type="button"
            onClick={() => reducirMovimiento ? document.getElementById('coleccion-viva')?.scrollIntoView({ behavior: 'auto' }) : window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' })}
            aria-label="Continuar la experiencia hacia la colección"
          >
            DESLIZA PARA DESCUBRIR
            <span aria-hidden="true" className="rb-story__scroll-mouse"><i /></span>
          </button>
        </motion.div>
        <div className="rb-story__vertical" aria-hidden="true">RAÍZ — UN DIÁLOGO CON LA NATURALEZA</div>
        <div className="rb-story__step" aria-hidden="true"><span>01</span><div><motion.i style={{ scaleY: estilo(barra, 0) }} /></div><span>02</span></div>
      </motion.div>
    </section>
  )
}

export default function Home() {
  const { datos: bonsais, cargando, error, reintentar } = useApi('/api/bonsais')
  const reducirMovimiento = useReducedMotion()

  return (
    <Pagina className="rb-home">
      <PortadaCinematografica />

      <div id="coleccion-viva" className="rb-home__collection">
        <header className="rb-home__collection-lead">
          <div><span className="rb-eyebrow">CAPÍTULO II / LA COLECCIÓN</span><h2>Elige tu propia <em>historia.</em></h2></div>
          <p>Un universo en miniatura. Una colección viva que se descubre árbol por árbol, sin prisas.</p>
        </header>
        {cargando && <div className="rb-home__loading"><SkeletonTarjetas cantidad={3} /></div>}
        {error && <div className="rb-home__loading"><MensajeError mensaje={error.message} onReintentar={reintentar} /></div>}
        {!cargando && !error && (!bonsais || bonsais.length === 0) && <p className="rb-home__empty">Nuevos árboles están creciendo. Vuelve pronto para descubrirlos.</p>}
        {bonsais?.length > 0 && <ColeccionEscena bonsais={bonsais} origen="inicio" />}
        <div className="rb-home__collection-end">
          <span>LA BELLEZA ESTÁ EN LOS DETALLES</span>
          <Link className="rb-home__all-link" to="/catalogo">VER LA COLECCIÓN COMPLETA <span aria-hidden="true">↗</span></Link>
        </div>
      </div>

      <section className="rb-values" aria-labelledby="filosofia-titulo">
        <motion.div initial={reducirMovimiento ? false : 'oculto'} whileInView="visible" variants={revelar} viewport={{ once: true, amount: 0.25 }} className="rb-values__title">
          <span className="rb-eyebrow">CAPÍTULO III / NUESTRA FILOSOFÍA</span>
          <h2 id="filosofia-titulo">No cultivamos árboles.<br /><em>Cultivamos momentos.</em></h2>
          <p>El bonsái no es una decoración. Es una invitación a observar, respirar y cuidar lo que crece contigo.</p>
        </motion.div>
        <div className="rb-values__list">
          {VALORES.map((valor) => (
            <motion.article key={valor.numero} initial={reducirMovimiento ? false : 'oculto'} whileInView="visible" variants={revelar} viewport={{ once: true, amount: 0.25 }}>
              <span>{valor.numero} / RAÍZ</span>
              <h3>{valor.titulo}</h3>
              <p>{valor.texto}</p>
              <span aria-hidden="true" className="rb-values__symbol">↗</span>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="rb-featured" aria-labelledby="destacados-titulo">
        <div className="rb-featured__heading">
          <div><span className="rb-eyebrow">SELECCIÓN DEL VIVERO / 001—003</span><h2 id="destacados-titulo">Piezas para <em>enamorarse.</em></h2></div>
          <Link to="/catalogo" className="rb-text-link rb-text-link--dark">VER TODOS LOS BONSAÍS <span aria-hidden="true">↗</span></Link>
        </div>
        {cargando && <SkeletonTarjetas cantidad={3} />}
        {error && <MensajeError mensaje={error.message} onReintentar={reintentar} />}
        {bonsais?.length > 0 && (
          <motion.ul initial={reducirMovimiento ? false : 'oculto'} whileInView="visible" viewport={{ once: true, amount: 0.2 }} transition={{ staggerChildren: 0.12 }} className="rb-cards-grid">
            {bonsais.slice(0, 3).map((bonsai, i) => <BonsaiCard key={bonsai.id} bonsai={bonsai} indice={i} />)}
          </motion.ul>
        )}
      </section>

      <section className="rb-home__last-word">
        <span className="rb-eyebrow">UNA PAUSA QUE ECHA RAÍCES</span>
        <h2>Todo gran árbol<br />comienza con <em>un cuidado.</em></h2>
        <Link to="/contacto" className="rb-home__last-button">CONVERSEMOS <span aria-hidden="true">↗</span></Link>
      </section>
    </Pagina>
  )
}
