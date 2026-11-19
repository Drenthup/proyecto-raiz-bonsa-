// Almacenamiento de sesión de CLIENTES, separado del token de administración.
// sessionStorage la conserva al refrescar la pestaña, pero la descarta al cerrarla.
const CLAVE = 'raiz_cliente_sesion'
export const EVENTO_CLIENTE = 'raiz-cliente-sesion-cambio'

function avisar() {
  window.dispatchEvent(new Event(EVENTO_CLIENTE))
}

function tokenVigente(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const datos = JSON.parse(atob(base64))
    // Solo lectura de la fecha: la firma la verifica siempre el backend.
    return datos.rol === 'cliente' && datos.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

export function obtenerTokenCliente() {
  const token = sessionStorage.getItem(CLAVE)
  if (!token) return null
  if (!tokenVigente(token)) {
    sessionStorage.removeItem(CLAVE)
    return null
  }
  return token
}

export function guardarCliente(token) {
  sessionStorage.setItem(CLAVE, token)
  avisar()
}

export function cerrarCliente() {
  sessionStorage.removeItem(CLAVE)
  avisar()
}
