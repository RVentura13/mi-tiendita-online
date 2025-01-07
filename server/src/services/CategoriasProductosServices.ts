import { QueryTypes } from 'sequelize';
import db from '../config/database';

type categoriaProductoDataProps = {
	usuarios_idusuario: number;
	estados_idestado: number;
	nombre: string;
};

/************************* OBTENER TODOS *************************/

export const getAllCategoriasProductosService = async (useTo: string | undefined): Promise<categoriaProductoDataProps[]> => {
	try {
		const queryAll = 'SELECT idcategoria as id, * FROM CategoriasProductos ORDER BY idcategoria;';
		const querySelect = 'SELECT idcategoria as id, * FROM CategoriasProductos WHERE estados_idestado = 1 ORDER BY idcategoria;';

		// Decide la query según el valor de useTo
		const query = useTo === 'select' ? querySelect : queryAll;

		// Hacer la consulta a la base de datos
		const categorias = (await db.query(query, {
			type: QueryTypes.SELECT,
		})) as categoriaProductoDataProps[];

		return categorias;
	} catch (error) {
		console.error('Error en el servidor: ', error);
		throw new Error('Error en el servidor: ' + error);
	}
};

/************************* OBTENER POR ID *************************/

export const getCategoriaProductoService = async (id: number): Promise<categoriaProductoDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar id
		const categoria = (await db.query('SELECT * FROM CategoriasProductos WHERE idcategoria = :id;', {
			replacements: { id },
			type: QueryTypes.SELECT,
		})) as categoriaProductoDataProps[];

		//Si id no existe retorna un error
		if (categoria.length === 0) {
			throw new Error('id no existe');
		}

		// Retorna datos encontrados
		return categoria[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};

/************************* CREAR *************************/

export const createCategoriaProductoService = async (categoriaData: categoriaProductoDataProps): Promise<categoriaProductoDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar si existe el nombre
		const existeNombre = (await db.query('SELECT * FROM CategoriasProductos WHERE nombre = :nombre;', {
			replacements: {
				nombre: categoriaData.nombre,
			},
			type: QueryTypes.SELECT,
		})) as categoriaProductoDataProps[];

		//Si nombre existe retorna un error
		if (existeNombre.length > 0) {
			throw new Error('nombre existe');
		}

		// Llamada al procedimiento almacenado
		const categoria = (await db.query('EXEC sp_insertar_categoria_producto @idusuario = :idusuario, @idestado = :idestado, @nombre = :nombre;', {
			replacements: {
				idusuario: categoriaData.usuarios_idusuario,
				idestado: categoriaData.estados_idestado,
				nombre: categoriaData.nombre,
			},
			type: QueryTypes.INSERT,
		})) as categoriaProductoDataProps[];

		// Retorna datos ingresados
		return categoria[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};

/************************* ACTUALIZAR *************************/

export const updateCategoriaProductoService = async (id: number, categoriaData: categoriaProductoDataProps): Promise<categoriaProductoDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar id
		const existeId = (await db.query('SELECT * FROM CategoriasProductos WHERE idcategoria = :id;', {
			replacements: { id },
			type: QueryTypes.SELECT,
		})) as categoriaProductoDataProps[];

		//Si id no existe retorna un error
		if (existeId.length === 0) {
			throw new Error('id no existe');
		}

		//Hacer la consulta a la base de datos para verificar si existe el nombre
		const existeNombre = (await db.query('SELECT * FROM CategoriasProductos WHERE nombre = :nombre and idcategoria <> :id;', {
			replacements: {
				nombre: categoriaData.nombre,
				id,
			},
			type: QueryTypes.SELECT,
		})) as categoriaProductoDataProps[];

		//Si nombre existe retorna un error
		if (existeNombre.length > 0) {
			throw new Error('nombre existe');
		}

		// Llamada al procedimiento almacenado
		const categoria = (await db.query('EXEC sp_actualizar_categoria_producto @idcategoria = :id, @idusuario = :idusuario, @idestado = :idestado, @nombre = :nombre;', {
			replacements: {
				id,
				idusuario: categoriaData.usuarios_idusuario,
				idestado: categoriaData.estados_idestado,
				nombre: categoriaData.nombre,
			},
			type: QueryTypes.UPDATE,
		})) as categoriaProductoDataProps[];

		// Retorna datos actualizados
		return categoria[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};

/************************* ACTUALIZAR ESTADO *************************/

export const updateEstadoCategoriaProductoService = async (id: number, idestado: number): Promise<categoriaProductoDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar id
		const existeId = (await db.query('SELECT * FROM CategoriasProductos WHERE idcategoria = :id;', {
			replacements: { id },
			type: QueryTypes.SELECT,
		})) as categoriaProductoDataProps[];

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
		})) as categoriaProductoDataProps[];

		//Si id no existe retorna un error
		if (existeEstado.length === 0) {
			throw new Error('estado no existe');
		}

		// Llamada al procedimiento almacenado
		const categoria = (await db.query('EXEC sp_actualizar_estado_categoria_producto @idcategoria = :id,  @idestado = :idestado;', {
			replacements: {
				id,
				idestado,
			},
			type: QueryTypes.UPDATE,
		})) as categoriaProductoDataProps[];

		// Retorna datos actualizados
		return categoria[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};
