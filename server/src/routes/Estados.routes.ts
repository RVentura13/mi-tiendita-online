import express from 'express';
import { body, param } from 'express-validator';

import { createEstado, getEstado, getAllEstados, updateEstado } from '../controllers/Estados.controller';
import { authenticate, checkRoleUsuario } from '../middleware/authMiddleware';
import { rolesPermitidos } from '../config/rolesConfig';
import { validateRequest } from '../middleware/validateRequest';

export const estadoRoutes = express.Router();

// Se verifica si usuario está autenticado correctamente en toda la ruta
estadoRoutes.use(authenticate);

// Rutas para el CRUD, se valída parametros y datos con express validator, se verifica el rol para determinar permisos y el controlador

/************************* GET ALL *************************/
estadoRoutes.get('/', checkRoleUsuario(rolesPermitidos.estados.get), getAllEstados);

/************************* GET BY ID *************************/
estadoRoutes.get(
	'/:id',
	[
		param('id')
			.isNumeric()
			.withMessage('Id debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id debe ser un número positivo'),
	],
	validateRequest,
	checkRoleUsuario(rolesPermitidos.estados.get),
	getEstado
);

/************************* CREATE *************************/
estadoRoutes.post(
	'/',
	[body('nombre').notEmpty().withMessage('El nombre no puede ir vacío').isLength({ max: 50 }).withMessage('El nombre no debe exceder los 50 caracteres')],
	validateRequest,
	checkRoleUsuario(rolesPermitidos.estados.post),
	createEstado
);

/************************* UPDATE *************************/
estadoRoutes.put(
	'/:id',
	[
		param('id')
			.isNumeric()
			.withMessage('Id debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id debe ser un número positivo'),
		body('nombre').notEmpty().withMessage('El nombre no puede ir vacío').isLength({ max: 50 }).withMessage('El nombre no debe exceder los 50 caracteres'),
	],
	validateRequest,
	checkRoleUsuario(rolesPermitidos.estados.put),
	updateEstado
);
