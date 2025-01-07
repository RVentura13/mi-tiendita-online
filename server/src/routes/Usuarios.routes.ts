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
		// roles_idrol debe ser un número positivo
		body('roles_idrol')
			.notEmpty()
			.withMessage('El id del rol no puede ir vacío')
			.isNumeric()
			.withMessage('El id del rol debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id del rol debe ser un número positivo'),

		// cui debe ser un número positivo
		body('cui')
			.notEmpty()
			.withMessage('El CUI no puede ir vacío')
			.isNumeric()
			.withMessage('El CUI debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El CUI debe ser un número positivo'),

		// nombre no puede estar vacío
		body('nombre').notEmpty().withMessage('El nombre no puede ir vacío').isString().withMessage('El nombre debe ser un texto'),

		// apellido no puede estar vacío
		body('apellido').notEmpty().withMessage('El apellido no puede ir vacío').isString().withMessage('El apellido debe ser un texto'),

		// fecha_nacimiento debe ser una fecha válida
		body('fecha_nacimiento').notEmpty().withMessage('La fecha de nacimiento no puede ir vacía').isDate().withMessage('La fecha de nacimiento debe ser una fecha válida'),

		// correo_electronico debe ser un correo válido
		body('correo_electronico').notEmpty().withMessage('El correo electrónico no puede ir vacío').isEmail().withMessage('El correo electrónico debe ser válido'),

		// telefono debe ser un número y no puede estar vacío
		body('telefono')
			.notEmpty()
			.withMessage('El teléfono no puede ir vacío')
			.isNumeric()
			.withMessage('El teléfono debe ser un número')
			.isLength({ min: 8 })
			.withMessage('El teléfono debe tener al menos 8 dígitos'),

		// nit debe ser un texto, no vacío
		body('nit').notEmpty().withMessage('El NIT no puede ir vacío').isString().withMessage('El NIT debe ser un texto'),

		// direccion no puede estar vacía
		body('direccion').notEmpty().withMessage('La dirección no puede ir vacía').isString().withMessage('La dirección debe ser un texto'),

		// contrasena no puede estar vacía
		body('contrasena').notEmpty().withMessage('La contraseña no puede ir vacía').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
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
