import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import db from './config/database';
import { categoriaProductoRoutes } from './routes/CategoriasProductos.routes';
import { clienteRoutes } from './routes/Clientes.routes';
import { estadoRoutes } from './routes/Estados.routes';
import { loginRoutes } from './routes/Login.routes';
import { metodoPagoRoutes } from './routes/MetodosPago.routes';
import { ordenDetallesRoutes } from './routes/OrdenDetalles.routes';
import { personaRoutes } from './routes/Persona.routes';
import { productoRoutes } from './routes/Productos.routes';
import { rolRoutes } from './routes/Roles.routes';
import { usuarioRoutes } from './routes/Usuarios.routes';

// Inicializar variables de entorno
dotenv.config();

// Asignación de puerto
const PORT = process.env.PORT || 4000;

const server = express();

// Conexion con la base de datos
const connectionDB = async () => {
	try {
		await db.authenticate();
		console.log('***** Conexión exitosa con la BD *****');
	} catch (error) {
		console.log('Error al conectar con la base de datos', error);
	}
};

connectionDB();

//Midlesware
server.use(express.json());
server.use(cors());

//Rutas
server.use('/api/estados', estadoRoutes);
server.use('/api/roles', rolRoutes);
server.use('/api/personas', personaRoutes);
server.use('/api/clientes', clienteRoutes);
server.use('/api/usuarios', usuarioRoutes);
server.use('/api/categoriasproductos', categoriaProductoRoutes);
server.use('/api/productos', productoRoutes);
server.use('/api/metodospago', metodoPagoRoutes);
server.use('/api/ordenesdetalles', ordenDetallesRoutes);
server.use('/api/login', loginRoutes);

// Mensaje en ruta raiz de la api
server.use('/api', (req, res) => {
	res.send('Servidor backend proyecto Desafio 360');
});

// Comprobar si puerto esta escuchando
server.listen(PORT, () => {
	console.log(`Servidor corriendo en el puerto ${PORT}`);
});
