import express from 'express';
import { body, param } from 'express-validator';

import { createMetodoPago, getAllMetodosPago, getMetodoPago, updateEstadoMetodoPago, updateMetodoPago } from '../controllers/MetodosPago.controller';
import { authenticate, checkRoleUsuario } from '../middleware/authMiddleware';
import { rolesPermitidos } from '../config/rolesConfig';
import { validateRequest } from '../middleware/validateRequest';

export const metodoPagoRoutes = express.Router();

// Se verifica si usuario está autenticado correctamente en toda la ruta
metodoPagoRoutes.use(authenticate);

// Rutas para el CRUD, se valída parametros y datos con express validator, se verifica el rol para determinar permisos y el controlador

/************************* GET ALL *************************/
metodoPagoRoutes.get('/', checkRoleUsuario(rolesPermitidos.metodosPago.get), getAllMetodosPago);

/************************* GET BY ID *************************/
metodoPagoRoutes.get(
	'/:id',
	[
		param('id')
			.isNumeric()
			.withMessage('ID no válido')
			.custom((value) => value > 0)
			.withMessage('El id debe ser un número positivo'),
	],
	validateRequest,
	checkRoleUsuario(rolesPermitidos.metodosPago.get),
	getMetodoPago
);

/************************* CREATE *************************/
metodoPagoRoutes.post(
	'/',
	[
		body('estados_idestado')
			.notEmpty()
			.withMessage('El id del estado no puede ir vacío')
			.isNumeric()
			.withMessage('El id del estado debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id del estado debe ser un número positivo'),
		body('nombre').notEmpty().withMessage('El nombre no puede ir vacío').isLength({ max: 30 }).withMessage('El nombre no debe exceder los 30 caracteres'),
	],
	validateRequest,
	checkRoleUsuario(rolesPermitidos.metodosPago.post),
	createMetodoPago
);

/************************* UPDATE *************************/
metodoPagoRoutes.put(
	'/:id',
	[
		param('id')
			.isNumeric()
			.withMessage('ID no válido')
			.custom((value) => value > 0)
			.withMessage('El id debe ser un número positivo'),
		body('estados_idestado')
			.notEmpty()
			.withMessage('El id del estado no puede ir vacío')
			.isNumeric()
			.withMessage('El id del estado debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id del estado debe ser un número positivo'),
		body('nombre').notEmpty().withMessage('El nombre no puede ir vacío').isLength({ max: 30 }).withMessage('El nombre no debe exceder los 30 caracteres'),
	],
	validateRequest,
	checkRoleUsuario(rolesPermitidos.metodosPago.put),
	updateMetodoPago
);

/************************* UPDATE ESTADO *************************/
metodoPagoRoutes.patch(
	'/:id',
	[
		param('id')
			.isNumeric()
			.withMessage('ID no válido')
			.custom((value) => value > 0)
			.withMessage('El id debe ser un número positivo'),
		body('estados_idestado')
			.notEmpty()
			.withMessage('El id del estado no puede ir vacío')
			.isNumeric()
			.withMessage('El id del estado debe ser un número válido')
			.custom((value) => value > 0)
			.withMessage('El id del estado debe ser un número positivo'),
	],
	validateRequest,
	checkRoleUsuario(rolesPermitidos.metodosPago.patch),
	updateEstadoMetodoPago
);
