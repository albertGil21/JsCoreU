import { guardarSolicitud } from '../infrastructure/mysql/solicitudRepo.js';

export async function crearSolicitud({ id_cliente, id_reparador, id_estado_solicitud, descripcion }) {
  // Aquí puedes agregar lógica de negocio, validaciones, etc.
  return await guardarSolicitud({ id_cliente, id_reparador, id_estado_solicitud, descripcion });
}
