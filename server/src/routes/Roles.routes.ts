import express from 'express';
import { body, param } from 'express-validator';

import { createRol, getRol, getAllRoles, updateEstadoRol, updateRol } from '../controllers/Roles.controller';
import { authenticate, checkRoleUsuario } from '../middleware/authMiddleware';
import { rolesPermitidos } from '../config/rolesConfig';
import { validateRequest } from '../middleware/validateRequest';

export const rolRoutes = express.Router();

// Se verifica si usuario está autenticado correctamente en toda la ruta
rolRoutes.use(authenticate);

// Rutas para el CRUD, se valída parametros y datos con express validator, se verifica el rol para determinar permisos y el controlador

/************************* GET ALL *************************/
rolRoutes.get('/', checkRoleUsuario(rolesPermitidos.roles.get), getAllRoles);

/************************* GET BY ID *************************/
rolRoutes.get(
	'/:id',
	[
		param('id')
			.isNumeric()
			.withMessage('ID no válido')
			.custom((value) => value > 0)
			.withMessage('El id debe ser un número positivo'),
	],
	validateRequest,
	checkRoleUsuario(rolesPermitidos.roles.get),
	getRol
);

/************************* CREATE *************************/
rolRoutes.post(
	'/',
	[
		body('estados_idestado')
			.notEmpty()
			.withMessage('El id del estado no puede ir vacío')
			.isNumeric()
			.withMessage('El id del estado debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id del estado debe ser un número positivo'),
		body('nombre').notEmpty().withMessage('El nombre no puede ir vacío').isLength({ max: 50 }).withMessage('El nombre no debe exceder los 50 caracteres'),
		body('descripcion').notEmpty().withMessage('La descripción no puede ir vacía').isLength({ max: 100 }).withMessage('La descripción no debe exceder los 100 caracteres'),
	],
	validateRequest,
	checkRoleUsuario(rolesPermitidos.roles.post),
	createRol
);

/************************* UPDATE *************************/
rolRoutes.put(
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
			.withMessage('El estado debe ser un número positivo'),
		body('nombre').notEmpty().withMessage('El nombre no puede ir vacío').isLength({ max: 50 }).withMessage('El nombre no debe exceder los 50 caracteres'),
		body('descripcion').notEmpty().withMessage('La descripción no puede ir vacía').isLength({ max: 100 }).withMessage('La descripción no debe exceder los 100 caracteres'),
	],
	validateRequest,
	checkRoleUsuario(rolesPermitidos.roles.put),
	updateRol
);

/************************* UPDATE ESTADO *************************/
rolRoutes.patch(
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
	checkRoleUsuario(rolesPermitidos.roles.patch),
	updateEstadoRol
);
