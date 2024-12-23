import express from 'express';
import { body, param } from 'express-validator';

import { createCategoriaProducto, getAllCategoriasProductos, getCategoriaProducto, updateCategoriaProducto, updateEstadoCategoriaProducto } from '../controllers/CategoriasProductos.controller';
import { authenticate, checkRoleUsuario } from '../middleware/authMiddleware';
import { rolesPermitidos } from '../config/rolesConfig';
import { validateRequest } from '../middleware/validateRequest';

export const categoriaProductoRoutes = express.Router();

// Se verifica si usuario está autenticado correctamente en toda la ruta
categoriaProductoRoutes.use(authenticate);

// Rutas para el CRUD, se valída parametros y datos con express validator, se verifica el rol para determinar permisos y el controlador

/************************* GET ALL *************************/
categoriaProductoRoutes.get('/', checkRoleUsuario(rolesPermitidos.categoriasProductos.get), getAllCategoriasProductos);

/************************* GET BY ID *************************/
categoriaProductoRoutes.get(
	'/:id',
	[
		param('id')
			.isNumeric()
			.withMessage('ID no válido')
			.custom((value) => value > 0)
			.withMessage('El id debe ser un número positivo'),
	],
	validateRequest,
	checkRoleUsuario(rolesPermitidos.categoriasProductos.get),
	getCategoriaProducto
);

/************************* CREATE *************************/
categoriaProductoRoutes.post(
	'/',
	[
		body('usuarios_idusuario')
			.notEmpty()
			.withMessage('El id del usuario no puede ir vacío')
			.isNumeric()
			.withMessage('El id del usuario debe ser un número')
			.custom((value) => value > 0)
			.withMessage('E id del usuario debe ser un número positivo'),
		body('estados_idestado')
			.notEmpty()
			.withMessage('El id del estado no puede ir vacío')
			.isNumeric()
			.withMessage('El id del estado debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id del estado debe ser un número positivo'),
		body('nombre').notEmpty().withMessage('El nombre no puede ir vacío').isLength({ max: 50 }).withMessage('El nombre no debe exceder los 50 caracteres'),
	],
	validateRequest,
	checkRoleUsuario(rolesPermitidos.categoriasProductos.post),
	createCategoriaProducto
);

/************************* UPDATE *************************/
categoriaProductoRoutes.put(
	'/:id',
	[
		param('id')
			.isNumeric()
			.withMessage('ID no válido')
			.custom((value) => value > 0)
			.withMessage('El id debe ser un número positivo'),
		body('usuarios_idusuario')
			.notEmpty()
			.withMessage('El id del usuario no puede ir vacío')
			.isNumeric()
			.withMessage('El id del usuario debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id del usuario debe ser un número positivo'),
		body('estados_idestado')
			.notEmpty()
			.withMessage('El id del estado no puede ir vacío')
			.isNumeric()
			.withMessage('El id del estado debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id del estado debe ser un número positivo'),
		body('nombre').notEmpty().withMessage('El nombre no puede ir vacío').isLength({ max: 50 }).withMessage('El nombre no debe exceder los 50 caracteres'),
	],
	validateRequest,
	checkRoleUsuario(rolesPermitidos.categoriasProductos.put),
	updateCategoriaProducto
);

/************************* UPDATE ESTADO *************************/
categoriaProductoRoutes.patch(
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
	checkRoleUsuario(rolesPermitidos.categoriasProductos.patch),
	updateEstadoCategoriaProducto
);
