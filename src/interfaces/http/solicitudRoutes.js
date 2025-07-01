import express from 'express';
import prisma from '../../config/prisma.js';
import { crearSolicitud } from '../../usecases/crearSolicitud.js';

const router = express.Router();

// POST /solicitudes → Crear una nueva solicitud con ubicación tipo POINT
router.post('/', async (req, res) => {
  try {
    const { id_cliente, id_reparador, id_estado_solicitud, descripcion, ubicacion } = req.body;
    if (!ubicacion || typeof ubicacion.lat !== 'number' || typeof ubicacion.lng !== 'number') {
      return res.status(400).json({ error: 'ubicacion debe ser un objeto con lat y lng numéricos' });
    }

    // Inserta la solicitud usando SQL raw (incluyendo el campo POINT)
    const result = await prisma.$executeRawUnsafe(
      `INSERT INTO solicitud (id_cliente, id_reparador, id_estado_solicitud, descripcion, ubicacion) VALUES (?, ?, ?, ?, ST_GeomFromText(?))`,
      id_cliente,
      id_reparador,
      id_estado_solicitud,
      descripcion,
      `POINT(${ubicacion.lat} ${ubicacion.lng})`
    );

    // Obtén el id de la última solicitud insertada
    const [last] = await prisma.$queryRawUnsafe(`SELECT LAST_INSERT_ID() as id`);
    const id_solicitud = Number(last.id);

    res.status(201).json({
      id_solicitud,
      id_cliente,
      id_reparador,
      id_estado_solicitud,
      descripcion,
      ubicacion
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /solicitudes/:id → Obtener una solicitud
router.get('/:id', async (req, res) => {
  try {
    const solicitud = await prisma.solicitud.findUnique({
      where: { id_solicitud: Number(req.params.id) },
      include: {
        cliente: { include: { usuario: true } },
        reparador: { include: { usuario: true } },
        historial_estado_solicitud: true,
        reparador_especialidad_solicitud: true
      }
    });
    if (!solicitud) return res.status(404).json({ error: 'Solicitud no encontrada' });
    res.json(solicitud);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /solicitudes?cliente=ID → Listar solicitudes de un cliente
// GET /solicitudes?reparador=ID → Listar solicitudes de un reparador
router.get('/', async (req, res) => {
  try {
    const { cliente, reparador } = req.query;
    let where = {};
    if (cliente) where.id_cliente = Number(cliente);
    if (reparador) where.id_reparador = Number(reparador);

    const solicitudes = await prisma.solicitud.findMany({
      where,
      include: {
        cliente: { include: { usuario: true } },
        reparador: { include: { usuario: true } },
        historial_estado_solicitud: true,
        reparador_especialidad_solicitud: true
      }
    });
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /solicitudes/:id/asignar-reparador → Asignar un reparador a una solicitud
// Incluye el monto y la fecha del contrato
router.put('/:id/asignar-reparador', async (req, res) => {
  try {
    const id_solicitud = Number(req.params.id);
    const { id_reparador, monto, fecha_contrato, id_especialidad } = req.body;

    // 1. Actualiza la solicitud con el reparador, monto y fecha_contrato
    const solicitud = await prisma.solicitud.update({
      where: { id_solicitud },
      data: {
        id_reparador,
        monto,
        fecha_contrato: new Date(fecha_contrato)
      }
    });

    // 2. Busca la relación reparador-especialidad
    const reparadorEspecialidad = await prisma.reparador_especialidad.findFirst({
      where: {
        id_reparador,
        id_especialidad
      }
    });

    if (!reparadorEspecialidad) {
      return res.status(400).json({ error: 'El reparador no tiene esa especialidad.' });
    }

    // 3. Crea la relación en reparador_especialidad_solicitud
    await prisma.reparador_especialidad_solicitud.create({
      data: {
        id_reparador_especialidad: reparadorEspecialidad.id_reparador_especialidad,
        id_solicitud
      }
    });

    res.json({ message: 'Reparador asignado a la solicitud', solicitud });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /solicitudes/:id → Actualizar solicitud (estado, asignar reparador, etc.)
router.put('/:id', async (req, res) => {
  try {
    const solicitud = await prisma.solicitud.update({
      where: { id_solicitud: Number(req.params.id) },
      data: req.body
    });
    res.json(solicitud);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /solicitudes/:id → Eliminar solicitud
router.delete('/:id', async (req, res) => {
  try {
    await prisma.solicitud.delete({
      where: { id_solicitud: Number(req.params.id) }
    });
    res.json({ message: 'Solicitud eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
