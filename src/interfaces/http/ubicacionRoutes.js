import express from 'express';
import axios from 'axios';
import prisma from '../../config/prisma.js';

const router = express.Router();

// filepath: c:\Users\ALGS\Documents\JS_CORE_SERVER\src\interfaces\http\ubicacionRoutes.js
router.post('/cercanos', async (req, res) => {
  try {
    const { userId, radius, id_especialidad, nombre_especialidad } = req.body;

    // 1. Llama al microservicio Redis
    const { data } = await axios.post(
      process.env.REDIS_MICROSERVICE_URL + '/nearby',
      { userId, radius }
    );
    console.log('IDs cercanos:', data);

    // Extrae el array de la propiedad 'nearby'
    const idsArray = Array.isArray(data.nearby) ? data.nearby : [];
    const idsNumericos = idsArray
      .map(obj => Number(String(obj.userId).trim()))
      .filter(id => !isNaN(id));
    console.log('IDs numéricos:', idsNumericos);

    if (idsNumericos.length === 0) {
      return res.status(200).json([]);
    }

    // 2. Filtra solo usuarios que sean reparadores
    const reparadores = await prisma.reparador.findMany({
      where: {
        id_usuario: { in: idsNumericos }
      },
      include: {
        usuario: true,
        reparador_especialidad: {
          include: { especialidad: true }
        }
      }
    });
    console.log('Reparadores encontrados:', reparadores.length);

    // 3. Filtra por especialidad (por id o nombre)
    let reparadoresFiltrados = reparadores;
    if (id_especialidad) {
      reparadoresFiltrados = reparadoresFiltrados.filter(r =>
        r.reparador_especialidad.some(re => re.id_especialidad === id_especialidad)
      );
    } else if (nombre_especialidad) {
      reparadoresFiltrados = reparadoresFiltrados.filter(r =>
        r.reparador_especialidad.some(re => re.especialidad.nombre === nombre_especialidad)
      );
    }

    // Opción 2: Elimina el array de especialidades del resultado
    reparadoresFiltrados = reparadoresFiltrados.map(r => {
      const { reparador_especialidad, ...rest } = r;
      return rest;
    });

    res.json(reparadoresFiltrados);
  } catch (error) {
    console.error('Error en /cercanos:', error);
    res.status(500).json({ error: error.message || String(error) });
  }
});

export default router;