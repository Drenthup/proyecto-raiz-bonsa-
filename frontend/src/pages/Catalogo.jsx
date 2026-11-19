import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Pagina from '../components/Pagina.jsx'
import ColeccionEscena from '../components/ColeccionEscena.jsx'
import BonsaiCard from '../components/BonsaiCard.jsx'
import { MensajeError, SkeletonTarjetas } from '../components/Estados.jsx'
import { useApi } from '../hooks/useApi.js'

export default function Catalogo() {
  const { datos: bonsais, cargando, error, reintentar } = useApi('/api/bonsais')
  const reducirMovimiento = useReducedMotion()

  return (
    <Pagina className="rb-catalog">
      <div className="rb-catalog__opening">
        <div className="rb-catalog__opening-top"><span>ARCHIVO BOTÁNICO / RAÍZ</span><span>PIEZAS VIVAS · COLOMBIA</span></div>
        <div className="rb-catalog__opening-content">
          <div><p className="rb-eyebrow">LA COLECCIÓN / EDICIÓN NO. 01</p><h1>El arte de <em>elegir lento.</em></h1></div>
          <p>Una colección para descubrir con calma. Cada flecha revela un nuevo árbol; cada árbol, una historia distinta.</p>
        </div>
      </div>
      <div className="rb-catalog__showcase">
        {cargando && <div className="rb-catalog__feedback"><SkeletonTarjetas cantidad={3} /></div>}
        {error && <div className="rb-catalog__feedback"><MensajeError mensaje={error.message} onReintentar={reintentar} /></div>}
        {!cargando && !error && bonsais?.length === 0 && <div className="rb-catalog__feedback">Estamos preparando nuevas piezas. Pronto volverán a estar disponibles.</div>}
        {bonsais?.length > 0 && <ColeccionEscena bonsais={bonsais} origen="catalogo" />}
      </div>
      {bonsais?.length > 0 && (
        <section className="rb-catalog__inventory" aria-labelledby="inventario-titulo">
          <div className="rb-catalog__inventory-head">
            <div><span className="rb-eyebrow">OTRA FORMA DE EXPLORAR / INVENTARIO</span><h2 id="inventario-titulo">Todas las piezas, <em>de un vistazo.</em></h2></div>
            <p>{String(bonsais.length).padStart(2, '0')} ÁRBOLES EN LA COLECCIÓN</p>
          </div>
          <motion.ul initial={reducirMovimiento ? false : 'oculto'} whileInView="visible" viewport={{ once: true, amount: 0.1 }} className="rb-cards-grid rb-cards-grid--catalog">
            {bonsais.map((bonsai, i) => <BonsaiCard key={bonsai.id} bonsai={bonsai} indice={i} />)}
          </motion.ul>
        </section>
      )}
      <div className="rb-catalog__end"><span>CADA ÁRBOL ENCUENTRA SU LUGAR.</span><Link to="/contacto">¿BUSCAS ALGO ESPECIAL? ESCRÍBENOS <span aria-hidden="true">↗</span></Link></div>
    </Pagina>
  )
}
