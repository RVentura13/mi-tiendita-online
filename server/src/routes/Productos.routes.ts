import express from 'express';
import { body, param } from 'express-validator';

import { createProducto, getAllProductos, getProducto, updateEstadoProducto, updateProducto } from '../controllers/Productos.controller';
import { authenticate, checkRoleUsuario } from '../middleware/authMiddleware';
import { rolesPermitidos } from '../config/rolesConfig';
import { validateRequest } from '../middleware/validateRequest';
import { upload } from '../config/multerConfig';
import { validateFileUpload } from '../middleware/validateFileUpload';

export const productoRoutes = express.Router();

// Se verifica si usuario está autenticado correctamente en toda la ruta
productoRoutes.use(authenticate);

// Rutas para el CRUD, se valída parametros y datos con express validator, se verifica el rol para determinar permisos y el controlador

/************************* GET ALL *************************/
productoRoutes.get('/', checkRoleUsuario(rolesPermitidos.productos.get), getAllProductos);

/************************* GET BY ID *************************/
productoRoutes.get(
	'/:id',
	[
		param('id')
			.isNumeric()
			.withMessage('ID no válido')
			.custom((value) => value > 0)
			.withMessage('El id debe ser un número positivo'),
	],
	validateRequest,
	checkRoleUsuario(rolesPermitidos.productos.get),
	getProducto
);

/************************* CREATE *************************/
productoRoutes.post(
	'/',
	upload.single('foto'),
	[
		body('categoriasproductos_idcategoria')
			.notEmpty()
			.withMessage('El id de la categoría no puede ir vacía')
			.isNumeric()
			.withMessage('El id de la categoría debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id de la categoria debe ser un número positivo'),
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
		body('marca').notEmpty().withMessage('La marca no puede ir vacía').isLength({ max: 50 }).withMessage('La marca no debe exceder los 50 caracteres'),
		body('codigo').notEmpty().withMessage('El código no puede ir vacío').isLength({ max: 50 }).withMessage('El código no debe exceder los 50 caracteres'),
		body('stock')
			.notEmpty()
			.withMessage('El stock no puede ir vacío')
			.isNumeric()
			.withMessage('El stock debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El stock debe ser un número positivo'),
		body('precio')
			.notEmpty()
			.withMessage('El precio no puede ir vacío')
			.isDecimal()
			.withMessage('El precio debe ser un valor decimal')
			.custom((value) => value > 0)
			.withMessage('El precio debe ser un valor positivo'),
	],
	validateRequest,
	validateFileUpload,
	checkRoleUsuario(rolesPermitidos.productos.post),
	createProducto
);

/************************* UPDATE *************************/
productoRoutes.put(
	'/:id',
	upload.single('foto'),
	[
		param('id')
			.isNumeric()
			.withMessage('ID no válido')
			.custom((value) => value > 0)
			.withMessage('El id debe ser un número positivo'),
		body('categoriasproductos_idcategoria')
			.notEmpty()
			.withMessage('El id de la categoría no puede ir vacía')
			.isNumeric()
			.withMessage('El id de la categoría debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El id de la categoria debe ser un número positivo'),
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
		body('marca').notEmpty().withMessage('La marca no puede ir vacía').isLength({ max: 50 }).withMessage('La marca no debe exceder los 50 caracteres'),
		body('codigo').notEmpty().withMessage('El código no puede ir vacío').isLength({ max: 50 }).withMessage('El código no debe exceder los 50 caracteres'),
		body('stock')
			.notEmpty()
			.withMessage('El stock no puede ir vacío')
			.isNumeric()
			.withMessage('El stock debe ser un número')
			.custom((value) => value > 0)
			.withMessage('El stock debe ser un número positivo'),
		body('precio')
			.notEmpty()
			.withMessage('El precio no puede ir vacío')
			.isDecimal()
			.withMessage('El precio debe ser un valor decimal')
			.custom((value) => value > 0)
			.withMessage('El precio debe ser un valor positivo'),
	],
	validateRequest,
	validateFileUpload,
	checkRoleUsuario(rolesPermitidos.productos.put),
	updateProducto
);

/************************* UPDATE ESTADO *************************/
productoRoutes.patch(
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
	checkRoleUsuario(rolesPermitidos.productos.patch),
	updateEstadoProducto
);
