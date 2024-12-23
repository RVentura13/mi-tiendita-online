import express from 'express';
import { body, param } from 'express-validator';

import { createPersona, getAllPersonas, getPersona, updateEstadoPersona, updatePersona } from '../controllers/Personas.controller';
import { authenticate, checkRoleUsuario } from '../middleware/authMiddleware';
import { rolesPermitidos } from '../config/rolesConfig';
import { validateRequest } from '../middleware/validateRequest';

export const personaRoutes = express.Router();

// Se verifica si usuario está autenticado correctamente en toda la ruta
personaRoutes.use(authenticate);

// Rutas para el CRUD, se valída parametros y datos con express validator, se verifica el rol para determinar permisos y el controlador

/************************* GET ALL *************************/
personaRoutes.get('/', checkRoleUsuario(rolesPermitidos.personas.get), getAllPersonas);

/************************* GET BY ID *************************/
personaRoutes.get(
	'/:id',
	[
		param('id')
			.isNumeric()
			.withMessage('ID no válido')
			.custom((value) => value > 0)
			.withMessage('El id debe ser un número positivo'),
	],
	validateRequest,
	checkRoleUsuario(rolesPermitidos.personas.get),
	getPersona
);

/************************* CREATE *************************/
personaRoutes.post(
	'/',
	[
		body('estados_idestado')
			.notEmpty()
			.withMessage('El id del estado no puede ir vacío')
			.isNumeric()
			.withMessage('El id del estado debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id del estado debe ser un número positivo'),
		body('cui')
			.isNumeric()
			.withMessage('El CUI debe ser un número')
			.isLength({ min: 13, max: 13 })
			.withMessage('El CUI debe contener 13 dígitos')
			.custom((value) => value > 0)
			.withMessage('El CUI debe ser un número positivo'),
		body('nombre').notEmpty().withMessage('El nombre no puede ir vacío').isLength({ max: 30 }).withMessage('El nombre no debe exceder los 30 caracteres'),
		body('apellido').notEmpty().withMessage('El apellido no puede ir vacío').isLength({ max: 30 }).withMessage('El apellido no debe exceder los 30 caracteres'),
		body('fecha_nacimiento').notEmpty().withMessage('La fecha de nacimiento no puede ir vacía').isISO8601().withMessage('La fecha de nacimiento debe tener un formato válido (ISO 8601)'),
		body('correo_electronico').notEmpty().withMessage('El correo electrónico no puede ir vacío').isEmail().withMessage('El correo electrónico debe tener un formato válido'),
		body('telefono')
			.notEmpty()
			.withMessage('El teléfono no puede ir vacío')
			.isNumeric()
			.withMessage('El teléfono debe ser un número')
			.isLength({ min: 8, max: 8 })
			.withMessage('El teléfono debe tener 8 dígitos')
			.custom((value) => value > 0)
			.withMessage('El telefono debe ser un número positivo'),
		body('direccion').notEmpty().withMessage('La dirección no puede ir vacía').isLength({ max: 100 }).withMessage('La dirección no debe exceder los 100 caracteres'),
	],
	validateRequest,
	checkRoleUsuario(rolesPermitidos.personas.post),
	createPersona
);

/************************* UPDATE *************************/
personaRoutes.put(
	'/:id',
	[
		param('id')
			.isNumeric()
			.withMessage('ID no válido')
			.custom((value) => value > 0)
			.withMessage('El id debe ser un número positivo'),
		body('estados_idestado')
			.notEmpty()
			.withMessage('El id del id del estado no puede ir vacío')
			.isNumeric()
			.withMessage('El id del id del estado debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id del id del estado debe ser un número positivo'),
		body('cui')
			.isNumeric()
			.withMessage('El CUI debe ser un número')
			.isLength({ min: 13, max: 13 })
			.withMessage('El CUI debe contener 13 dígitos')
			.custom((value) => value > 0)
			.withMessage('El CUI debe ser un número positivo'),
		body('nombre').notEmpty().withMessage('El nombre no puede ir vacío').isLength({ max: 30 }).withMessage('El nombre no debe exceder los 30 caracteres'),
		body('apellido').notEmpty().withMessage('El apellido no puede ir vacío').isLength({ max: 30 }).withMessage('El apellido no debe exceder los 30 caracteres'),
		body('fecha_nacimiento').notEmpty().withMessage('La fecha de nacimiento no puede ir vacía').isISO8601().withMessage('La fecha de nacimiento debe tener un formato válido (ISO 8601)'),
		body('correo_electronico').notEmpty().withMessage('El correo electrónico no puede ir vacío').isEmail().withMessage('El correo electrónico debe tener un formato válido'),
		body('telefono')
			.notEmpty()
			.withMessage('El teléfono no puede ir vacío')
			.isNumeric()
			.withMessage('El teléfono debe ser un número')
			.isLength({ min: 8, max: 8 })
			.withMessage('El teléfono debe tener 8 dígitos')
			.custom((value) => value > 0)
			.withMessage('El telefono debe ser un número positivo'),
		body('direccion').notEmpty().withMessage('La dirección no puede ir vacía').isLength({ max: 100 }).withMessage('La dirección no debe exceder los 100 caracteres'),
	],
	validateRequest,
	checkRoleUsuario(rolesPermitidos.personas.put),
	updatePersona
);

/************************* UPDATE ESTADO *************************/
personaRoutes.patch(
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
	checkRoleUsuario(rolesPermitidos.personas.patch),
	updateEstadoPersona
);
