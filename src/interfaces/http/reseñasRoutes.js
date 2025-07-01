import express from 'express';
import prisma from '../../config/prisma.js';

const router = express.Router();

// POST /reseñas/cliente → Crear reseña para cliente
router.post('/cliente', async (req, res) => {
  try {
    const { id_solicitud, calificacion, comentario } = req.body;
    const resena = await prisma.rese_a_a_cliente.create({
      data: { id_solicitud, calificacion, comentario }
    });
    res.status(201).json(resena);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /reseñas/reparador → Crear reseña para reparador
router.post('/reparador', async (req, res) => {
  try {
    const { id_solicitud, calificacion, comentario } = req.body;
    const resena = await prisma.rese_a_a_reparador.create({
      data: { id_solicitud, calificacion, comentario }
    });
    res.status(201).json(resena);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /reseñas/cliente/:id_cliente → Obtener reseñas de un cliente
router.get('/cliente/:id_cliente', async (req, res) => {
  try {
    const reseñas = await prisma.rese_a_a_cliente.findMany({
      where: {
        solicitud: {
          id_cliente: Number(req.params.id_cliente)
        }
      },
      include: {
        solicitud: true
      }
    });
    res.json(reseñas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /reseñas/reparador/:id_reparador → Obtener reseñas de un reparador
router.get('/reparador/:id_reparador', async (req, res) => {
  try {
    const reseñas = await prisma.rese_a_a_reparador.findMany({
      where: {
        solicitud: {
          id_reparador: Number(req.params.id_reparador)
        }
      },
      include: {
        solicitud: true
      }
    });
    res.json(reseñas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;