import prisma from '../../config/prisma.js';

export async function guardarSolicitud({ id_cliente, id_reparador, id_estado_solicitud, descripcion }) {
  const solicitud = await prisma.solicitud.create({
    data: {
      id_cliente,
      id_reparador,
      id_estado_solicitud,
      descripcion
    }
  });
  return solicitud;
}