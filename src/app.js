import express from 'express';
import solicitudRoutes from './interfaces/http/solicitudRoutes.js';
import ubicacionRoutes from './interfaces/http/ubicacionRoutes.js';
import especialidadRoutes from './interfaces/http/especialidadRoutes.js';
import solicitudCreacionRoutes from './interfaces/http/solicitudCreacion.js';
import reparadoresRoutes from './interfaces/http/reparadorRoutes.js';
import clienteRoutes from './interfaces/http/clienteRoutes.js';
import crudUsuarioRoutes from './interfaces/http/crudUsuario.js';
import reseñasRoutes from './interfaces/http/reseñasRoutes.js';
import login from './interfaces/http/loginRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

app.use('/auth', login);

app.use('/solicitudes', solicitudRoutes);

app.use('/reseñas', reseñasRoutes);

app.use('/solicitudes', solicitudCreacionRoutes);

app.use('/usuarios', clienteRoutes);

app.use('/usuarios', reparadoresRoutes);

app.use('/usuarios', crudUsuarioRoutes);

app.use('/ubicacion', ubicacionRoutes);

app.use('/especialidades', especialidadRoutes);



export default app;
