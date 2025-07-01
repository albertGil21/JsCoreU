import express from 'express';
import prisma from '../../config/prisma.js';

const router = express.Router();

router.post('/crear-desde-ia', async (req, res) => {
  try {
    const { id_usuario, descripcion, ubicacion } = req.body;

    // Buscar el id_cliente a partir del id_usuario
    const cliente = await prisma.cliente.findUnique({
      where: { id_usuario: Number(id_usuario) }
    });
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado para ese usuario.' });
    }

    // Crear la solicitud sin ubicación
    const solicitud = await prisma.solicitud.create({
      data: {
        id_cliente: cliente.id_cliente,
        descripcion
      }
    });

    // Si hay ubicación, actualiza con SQL raw
    if (ubicacion && typeof ubicacion.lat === 'number' && typeof ubicacion.lng === 'number') {
      await prisma.$executeRawUnsafe(
        `UPDATE solicitud SET ubicacion = ST_GeomFromText(?) WHERE id_solicitud = ?`,
        `POINT(${ubicacion.lat} ${ubicacion.lng})`,
        solicitud.id_solicitud
      );
    }

    res.status(201).json({ ...solicitud, ubicacion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;