import { QueryTypes } from 'sequelize';
import db from '../config/database';

type productoDataProps = {
	categoriasproductos_idcategoria: number;
	usuarios_idusuario: number;
	estados_idestado: number;
	nombre: string;
	marca: string;
	codigo: string;
	stock: number;
	precio: number;
	foto: string | null;
};

/************************* OBTENER TODOS *************************/

export const getAllProductosService = async (userRol: string | undefined): Promise<productoDataProps[]> => {
	try {
		const queryAdmin = 'SELECT * FROM Productos ORDER BY idproducto;';
		const queryOtros = 'SELECT * FROM Productos WHERE stock > 0 AND estados_idestado = 1 ORDER BY idproducto;';
		//Hacer la consulta a la base de datos y traer todos los registros
		const productos = (await db.query(userRol === 'Administrador' ? queryAdmin : queryOtros, {
			type: QueryTypes.SELECT,
		})) as productoDataProps[];

		//Se retornan los datos encontrados
		return productos;
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw new Error('Error en el servidor: ' + error);
	}
};

/************************* OBTENER POR ID *************************/

export const getProductoService = async (id: number): Promise<productoDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar id
		const producto = (await db.query('SELECT * FROM Productos WHERE idproducto = :id;', {
			replacements: { id },
			type: QueryTypes.SELECT,
		})) as productoDataProps[];

		//Si id no existe retorna un error
		if (producto.length === 0) {
			throw new Error('id no existe');
		}

		// Retorna datos encontrados
		return producto[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};

/************************* CREAR *************************/

export const createProductoService = async (productoData: productoDataProps): Promise<productoDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar si existe el nombre
		const existeNombre = (await db.query('SELECT * FROM Productos WHERE nombre = :nombre;', {
			replacements: {
				nombre: productoData.nombre,
			},
			type: QueryTypes.SELECT,
		})) as productoDataProps[];

		//Si nombre existe retorna un error
		if (existeNombre.length > 0) {
			throw new Error('nombre existe');
		}

		//Hacer la consulta a la base de datos para verificar si existe el codigo
		const existeCodigo = (await db.query('SELECT * FROM Productos WHERE codigo = :codigo;', {
			replacements: {
				codigo: productoData.codigo,
			},
			type: QueryTypes.SELECT,
		})) as productoDataProps[];

		//Si codigo existe retorna un error
		if (existeCodigo.length > 0) {
			throw new Error('codigo existe');
		}

		// Llamada al procedimiento almacenado
		const producto = (await db.query(
			'EXEC sp_insertar_producto @idcategoria = :idcategoria, @idusuario = :idusuario, @idestado = :idestado, @nombre = :nombre, @marca = :marca, @codigo = :codigo, @stock = :stock, @precio = :precio, @foto = :foto;',
			{
				replacements: {
					idcategoria: productoData.categoriasproductos_idcategoria,
					idusuario: productoData.usuarios_idusuario,
					idestado: productoData.estados_idestado,
					nombre: productoData.nombre,
					marca: productoData.marca,
					codigo: productoData.codigo,
					stock: productoData.stock,
					precio: productoData.precio,
					foto: productoData.foto,
				},
				type: QueryTypes.INSERT,
			}
		)) as productoDataProps[];

		// Retorna datos ingresados
		return producto[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};

/************************* ACTUALIZAR *************************/

export const updateProductoService = async (id: number, productoData: productoDataProps): Promise<productoDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar id
		const existeId = (await db.query('SELECT * FROM Productos WHERE idproducto = :id;', {
			replacements: { id },
			type: QueryTypes.SELECT,
		})) as productoDataProps[];

		//Si id no existe retorna un error
		if (existeId.length === 0) {
			throw new Error('id no existe');
		}

		//Hacer la consulta a la base de datos para verificar si existe el nombre
		const existeNombre = (await db.query('SELECT * FROM Productos WHERE nombre = :nombre and idproducto <> :id;', {
			replacements: {
				nombre: productoData.nombre,
				id,
			},
			type: QueryTypes.SELECT,
		})) as productoDataProps[];

		//Si nombre existe retorna un error
		if (existeNombre.length > 0) {
			throw new Error('nombre existe');
		}

		//Hacer la consulta a la base de datos para verificar si existe el codigo
		const existeCodigo = (await db.query('SELECT * FROM Productos WHERE codigo = :codigo and idproducto <> :id;', {
			replacements: {
				codigo: productoData.codigo,
				id,
			},
			type: QueryTypes.SELECT,
		})) as productoDataProps[];

		//Si codigo existe retorna un error
		if (existeCodigo.length > 0) {
			throw new Error('codigo existe');
		}

		// Llamada al procedimiento almacenado
		const producto = (await db.query(
			'EXEC sp_actualizar_producto @idproducto = :id, @idcategoria = :idcategoria, @idusuario = :idusuario, @idestado = :idestado, @nombre = :nombre, @marca = :marca, @codigo = :codigo, @stock = :stock, @precio = :precio, @foto = :foto;',
			{
				replacements: {
					id,
					idcategoria: productoData.categoriasproductos_idcategoria,
					idusuario: productoData.usuarios_idusuario,
					idestado: productoData.estados_idestado,
					nombre: productoData.nombre,
					marca: productoData.marca,
					codigo: productoData.codigo,
					stock: productoData.stock,
					precio: productoData.precio,
					foto: productoData.foto,
				},
				type: QueryTypes.UPDATE,
			}
		)) as productoDataProps[];

		// Retorna datos ingresados
		return producto[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};

/************************* ACTUALIZAR ESTADO *************************/

export const updateEstadoProductoService = async (id: number, idestado: number): Promise<productoDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar id
		const existeId = (await db.query('SELECT * FROM Productos WHERE idproducto = :id;', {
			replacements: { id },
			type: QueryTypes.SELECT,
		})) as productoDataProps[];

		//Si id no existe retorna un error
		if (existeId.length === 0) {
			throw new Error('id no existe');
		}

		//Hacer la consulta a la base de datos para verificar si estado existe
		const existeEstado = (await db.query('SELECT * FROM Estados WHERE idestado = :idestado', {
			replacements: {
				idestado,
			},
			type: QueryTypes.SELECT,
		})) as productoDataProps[];

		//Si id no existe retorna un error
		if (existeEstado.length === 0) {
			throw new Error('estado no existe');
		}

		// Llamada al procedimiento almacenado
		const producto = (await db.query('EXEC sp_actualizar_estado_producto @idproducto = :id, @idestado = :idestado;', {
			replacements: {
				id,
				idestado,
			},
			type: QueryTypes.UPDATE,
		})) as productoDataProps[];

		// Retorna datos actualizados;
		return producto[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};
