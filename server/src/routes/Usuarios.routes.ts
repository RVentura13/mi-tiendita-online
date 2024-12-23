import express from 'express';
import { body, param } from 'express-validator';

import { createUsuario, getAllUsuarios, getUsuario, updateEstadoUsuario, updateUsuario } from '../controllers/Usuarios.controller';
import { authenticate, checkRoleUsuario } from '../middleware/authMiddleware';
import { rolesPermitidos } from '../config/rolesConfig';
import { validateRequest } from '../middleware/validateRequest';

export const usuarioRoutes = express();

// Se verifica si usuario está autenticado correctamente en toda la ruta
usuarioRoutes.use(authenticate);

// Rutas para el CRUD, se valída parametros y datos con express validator, se verifica el rol para determinar permisos y el controlador

/************************* GET ALL *************************/
usuarioRoutes.get('/', checkRoleUsuario(rolesPermitidos.usuarios.get), getAllUsuarios);

/************************* GET BY ID *************************/
usuarioRoutes.get(
	'/:id',
	[
		param('id')
			.isNumeric()
			.withMessage('ID no válido')
			.custom((value) => value > 0)
			.withMessage('El id debe ser un número positivo'),
	],
	validateRequest,
	checkRoleUsuario(rolesPermitidos.usuarios.get),
	getUsuario
);

/************************* CREATE *************************/
usuarioRoutes.post(
	'/',
	[
		body('roles_idrol')
			.notEmpty()
			.withMessage('El id del rol no puede ir vacío')
			.isNumeric()
			.withMessage('El id del rol debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id del rol debe ser un número positivo'),
		body('estados_idestado')
			.notEmpty()
			.withMessage('El id del estado no puede ir vacío')
			.isNumeric()
			.withMessage('El id del estado debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id del estado debe ser un número positivo'),
		body('personas_idpersona')
			.notEmpty()
			.withMessage('El id de la persona no puede ir vacía')
			.isNumeric()
			.withMessage('El id de la persona debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id de la persona debe ser un número positivo'),
		body('contrasena').notEmpty().withMessage('La contraseña no puede ir vacía'),
	],
	validateRequest,
	checkRoleUsuario(rolesPermitidos.usuarios.post),
	createUsuario
);

/************************* UPDATE *************************/
usuarioRoutes.put(
	'/:id',
	[
		param('id')
			.isNumeric()
			.withMessage('ID no válido')
			.custom((value) => value > 0)
			.withMessage('El id debe ser un número positivo'),
	],
	body('roles_idrol')
		.notEmpty()
		.withMessage('El id del rol no puede ir vacío')
		.isNumeric()
		.withMessage('El id del rol debe ser un número')
		.custom((value) => value > 0)
		.withMessage('El id del rol debe ser un número positivo'),
	body('estados_idestado')
		.notEmpty()
		.withMessage('El id del estado no puede ir vacío')
		.isNumeric()
		.withMessage('El id del estado debe ser un número')
		.custom((value) => value > 0)
		.withMessage('El id del estado debe ser un número positivo'),
	body('personas_idpersona')
		.notEmpty()
		.withMessage('El id de la persona no puede ir vacía')
		.isNumeric()
		.withMessage('El id de la persona debe ser un número')
		.custom((value) => value > 0)
		.withMessage('El id de la persona debe ser un número positivo'),
	body('contrasena').notEmpty().withMessage('La contraseña no puede ir vacía'),
	validateRequest,
	checkRoleUsuario(rolesPermitidos.usuarios.put),
	updateUsuario
);

/************************* UPDATE ESTADO *************************/
usuarioRoutes.patch(
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
	checkRoleUsuario(rolesPermitidos.usuarios.patch),
	updateEstadoUsuario
);
