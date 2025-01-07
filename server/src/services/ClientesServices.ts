import { QueryTypes } from 'sequelize';
import db from '../config/database';

type clienteDataProps = {
	personas_idpersona: number;
	estados_idestado: number;
	tipo_cliente: string;
	nit: string;
	razon_social: string;
	nombre_comercial: string;
	direccion_entrega: string;
};

/************************* OBTENER TODOS *************************/

export const getAllClientesService = async (): Promise<clienteDataProps[]> => {
	try {
		//Hacer la consulta a la base de datos y traer todos los registros
		const clientes = (await db.query('SELECT * FROM Clientes ORDER BY idcliente;', {
			type: QueryTypes.SELECT,
		})) as clienteDataProps[];

		//Retorna datos encontrados
		return clientes;
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw new Error('Error en el servidor: ' + error);
	}
};

/************************* OBTENER POR ID *************************/

export const getClienteService = async (id: number): Promise<clienteDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar id
		const cliente = (await db.query(
			'SELECT c.idcliente, p.nombre, p.apellido, p.correo_electronico, c.nit, p.telefono, c.direccion_entrega FROM Clientes c INNER JOIN Personas p ON c.personas_idpersona = p.idpersona WHERE personas_idpersona = :id;',
			{
				replacements: { id },
				type: QueryTypes.SELECT,
			}
		)) as clienteDataProps[];

		//Si id no existe retorna un error
		if (cliente.length === 0) {
			throw new Error('id no existe');
		}

		// Retorna datos encontrados
		return cliente[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};

/************************* CREAR *************************/

export const createClienteService = async (clienteData: clienteDataProps): Promise<clienteDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar si existe el nit
		const existeNit = (await db.query('SELECT * FROM Clientes WHERE nit = :nit;', {
			replacements: { nit: clienteData.nit },
			type: QueryTypes.SELECT,
		})) as clienteDataProps[];

		//Si nit existe retorna un error
		if (existeNit.length > 0) {
			throw new Error('nit existe');
		}

		// Llamada al procedimiento almacenado
		const cliente = (await db.query(
			'EXEC sp_insertar_cliente @idpersona = :idpersona, @idestado = :idestado, @tipo_cliente = :tipo_cliente, @nit = :nit, @razon_social = :razon_social, @nombre_comercial = :nombre_comercial, @direccion_entrega = :direccion_entrega;',
			{
				replacements: {
					idpersona: clienteData.personas_idpersona,
					idestado: clienteData.estados_idestado,
					tipo_cliente: clienteData.tipo_cliente,
					nit: clienteData.nit,
					razon_social: clienteData.razon_social,
					nombre_comercial: clienteData.nombre_comercial,
					direccion_entrega: clienteData.direccion_entrega,
				},
				type: QueryTypes.INSERT,
			}
		)) as clienteDataProps[];

		// Retorna datos ingresados
		return cliente[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};

/************************* ACTUALIZAR *************************/

export const updateClienteService = async (id: number, clienteData: clienteDataProps): Promise<clienteDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar id
		const existeId = (await db.query('SELECT * FROM Clientes WHERE idcliente = :id;', {
			replacements: { id },
			type: QueryTypes.SELECT,
		})) as clienteDataProps[];

		//Si id no existe retorna un error
		if (existeId.length === 0) {
			throw new Error('id no existe');
		}
		// Hace la consulta a la base de datos para verificar si el nit existe
		const existeNit = (await db.query('SELECT * FROM Clientes WHERE nit = :nit and idcliente <> :id;', {
			replacements: { nit: clienteData.nit, id },
			type: QueryTypes.SELECT,
		})) as clienteDataProps[];

		//Si nit existe retorna un error
		if (existeNit.length > 0) {
			throw new Error('nit existe');
		}

		// Llamada al procedimiento almacenado
		const cliente = (await db.query(
			'EXEC sp_actualizar_cliente @idcliente = :id, @idpersona = :idpersona, @idestado = :idestado, @tipo_cliente = :tipo_cliente, @nit = :nit, @razon_social = :razon_social, @nombre_comercial = :nombre_comercial, @direccion_entrega = :direccion_entrega;',
			{
				replacements: {
					id,
					idpersona: clienteData.personas_idpersona,
					idestado: clienteData.estados_idestado,
					tipo_cliente: clienteData.tipo_cliente,
					nit: clienteData.nit,
					razon_social: clienteData.razon_social,
					nombre_comercial: clienteData.nombre_comercial,
					direccion_entrega: clienteData.direccion_entrega,
				},
				type: QueryTypes.UPDATE,
			}
		)) as clienteDataProps[];

		// Retorna datos actualizados
		return cliente[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};

/************************* ACTUALIZAR ESTADO *************************/

export const updateEstadoClienteService = async (id: number, idestado: number): Promise<clienteDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar id
		const existeId = (await db.query('SELECT * FROM Clientes WHERE idcliente = :id;', {
			replacements: { id },
			type: QueryTypes.SELECT,
		})) as clienteDataProps[];

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
		})) as clienteDataProps[];

		//Si id no existe retorna un error
		if (existeEstado.length === 0) {
			throw new Error('estado no existe');
		}

		// Llamada a la base de datos
		const cliente = (await db.query('EXEC sp_actualizar_estado_cliente @idcliente = :id, @idestado = :idestado;', {
			replacements: {
				id,
				idestado,
			},
			type: QueryTypes.UPDATE,
		})) as clienteDataProps[];

		// Retorna datos actualizados
		return cliente[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};
