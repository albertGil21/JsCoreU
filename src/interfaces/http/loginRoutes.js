import express from 'express';
import prisma from '../../config/prisma.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

// POST /login
router.post('/login', async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    // --- CAMBIO CLAVE AQUÍ ---
    // Usamos 'include' para traer también los datos de la tabla 'reparador'
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: {
        reparador: true, // Esto incluirá el perfil de reparador si existe
      },
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Compara la contraseña (usando el método que prefieras)
    if (usuario.contrasena !== contrasena) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, email: usuario.email },
      process.env.JWT_SECRET || 'secreto',
      { expiresIn: '1d' }
    );

    // No es necesario enviar la contraseña en la respuesta
    delete usuario.contrasena;

    res.json({ token, usuario });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /logout (opcional, solo si manejas sesiones en backend)
router.post('/logout', (req, res) => {
  // Si usas JWT, el logout se maneja en frontend (borrar token)
  res.json({ message: 'Logout exitoso (solo borra el token en el frontend)' });
});

export default router;