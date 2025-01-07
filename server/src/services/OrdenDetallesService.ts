import { QueryTypes } from 'sequelize';
import db from '../config/database';

type detallesDataProps = {
	idorden?: number; // Opcional
	idproducto?: number; // Opcional
	cantidad: number;
	precio: number;
	descuento?: number;
	subtotal?: number;
	nombre_producto: string;
	foto: string;
	nota?: string; // Opcional
};

type ordenDetallesDataProps = {
	idorden?: number;
	usuarios_idusuario: number;
	estados_idestado: number;
	nombre_cliente?: string;
	apellido_cliente?: string;
	nombre_forma_pago?: string;
	nombre_estado?: string;
	clientes_idcliente: number;
	fecha_envio?: Date;
	fecha_entregada?: Date;
	total_orden?: number;
	metodo_pago: string;
	nota?: string;
	fecha_creacion?: Date;
	detalles?: detallesDataProps[];
};

/************************* OBTENER ORDENES CON DETALLES *************************/

export const getAllOrdenesDetallesService = async (idusuario: number): Promise<ordenDetallesDataProps[]> => {
	try {
		//Hacer la consulta a la base de datos y traer todos los registros
		const rows = await db.query(
			`SELECT 
        o.idorden,
        per.nombre AS nombre_cliente,
        per.apellido AS apellido_cliente,
        mp.nombre AS nombre_forma_pago,
        e.nombre AS nombre_estado,
        do.productos_idproducto,
        p.nombre AS nombre_producto,
        p.idproducto,
        do.cantidad,
        p.precio,
        o.total_orden,
        p.foto,
        o.fecha_creacion AS fecha_creacion_orden
    FROM Ordenes o
    LEFT JOIN Clientes c ON o.clientes_idcliente = c.idcliente
    LEFT JOIN Estados e ON o.estados_idestado = e.idestado
    LEFT JOIN MetodosPago mp ON o.metodo_pago = mp.idmetodo
    LEFT JOIN DetallesOrdenes do ON o.idorden = do.ordenes_idorden
    LEFT JOIN Productos p ON do.productos_idproducto = p.idproducto
    LEFT JOIN Personas per ON c.personas_idpersona = per.idpersona
    ${idusuario !== 0 ? 'WHERE o.usuarios_idusuario = ?' : ''}
    ORDER BY o.idorden DESC;`,
			{
				replacements: idusuario !== 0 ? [idusuario] : [],
				type: QueryTypes.SELECT,
			}
		);

		// Procesar los datos para agrupar órdenes y sus detalles
		const ordenesMap = new Map<number, ordenDetallesDataProps>();

		rows.forEach((row: any) => {
			if (!ordenesMap.has(row['idorden'])) {
				ordenesMap.set(row['idorden'], {
					idorden: row['idorden'],
					usuarios_idusuario: row['usuarios_idusuario'] || 0, // Valor por defecto
					estados_idestado: row['estados_idestado'] || 0, // Valor por defecto
					clientes_idcliente: row['clientes_idcliente'] || 0, // Valor por defecto
					metodo_pago: row['metodo_pago'] || '', // Valor por defecto
					nombre_cliente: row['nombre_cliente'] || '',
					apellido_cliente: row['apellido_cliente'] || '',
					nombre_forma_pago: row['nombre_forma_pago'] || '',
					nombre_estado: row['nombre_estado'] || '',
					total_orden: row['total_orden'],
					fecha_creacion: row['fecha_creacion_orden'],
					detalles: [],
				});
			}

			// Añadir el detalle si existe
			if (row['nombre_producto']) {
				// agregar la url completa de la imagen
				const fotoUrl = `http://${process.env.HOST_SERVER || 'localhost'}:${process.env.PORT || 4000}${row['foto'] || ''}`;

				ordenesMap.get(row['idorden'])!.detalles!.push({
					nombre_producto: row['nombre_producto'] || '',
					idproducto: row['idproducto'],
					cantidad: row['cantidad'],
					precio: row['precio'],
					foto: fotoUrl,
				});
			}
		});

		//Se retornan los datos encontrados
		return Array.from(ordenesMap.values());
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw new Error('Error en el servidor: ' + error);
	}
};

/************************* OBTENER POR ID *************************/

export const getOrdenDetallesService = async (id: number): Promise<ordenDetallesDataProps[]> => {
	try {
		//Hacer la consulta a la base de datos para verificar id
		const ordenes = (await db.query('SELECT * FROM Ordenes WHERE idorden = :id', {
			replacements: { id },
			type: QueryTypes.SELECT,
		})) as ordenDetallesDataProps[];

		//Si id no existe retorna un error
		if (ordenes.length === 0) {
			throw new Error('id no existe');
		}

		// Ejecutamos la consulta para traer todas las órdenes
		const rows = await db.query(
			`SELECT o.*, do.*, p.precio
			FROM Ordenes o
			LEFT JOIN DetallesOrdenes do ON o.idorden = do.ordenes_idorden
			LEFT JOIN Productos p ON do.productos_idproducto = p.idproducto
			WHERE o.idorden = :id;`,
			{ replacements: { id }, type: QueryTypes.SELECT }
		);

		// Procesar los datos para agrupar órdenes y sus detalles
		const ordenesMap = new Map<number, ordenDetallesDataProps>();

		rows.forEach((row: any) => {
			if (!ordenesMap.has(row['idorden'])) {
				ordenesMap.set(row['idorden'], {
					idorden: row['idorden'],
					usuarios_idusuario: row['usuarios_idusuario'] || 0, // Valor por defecto
					estados_idestado: row['estados_idestado'] || 0, // Valor por defecto
					clientes_idcliente: row['clientes_idcliente'] || 0, // Valor por defecto
					metodo_pago: row['metodo_pago'] || '', // Valor por defecto
					nombre_cliente: row['nombre_cliente'] || '',
					apellido_cliente: row['apellido_cliente'] || '',
					nombre_forma_pago: row['nombre_forma_pago'] || '',
					nombre_estado: row['nombre_estado'] || '',
					total_orden: row['total_orden'],
					fecha_creacion: row['fecha_creacion_orden'],
					detalles: [],
				});
			}

			// Añadir el detalle si existe
			if (row['nombre_producto']) {
				ordenesMap.get(row['idorden'])!.detalles!.push({
					nombre_producto: row['nombre_producto'] || '',
					idproducto: row['idproducto'],
					cantidad: row['cantidad'],
					precio: row['precio'],
					foto: row['foto'],
				});
			}
		});

		// Retorna los datos encontrados
		return Array.from(ordenesMap.values());
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};

/************************* CREAR *************************/

export const createOrdenDetallesService = async (ordenDetallesData: ordenDetallesDataProps): Promise<ordenDetallesDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar si existe el cliente
		const existeCliente = (await db.query('SELECT * FROM Clientes WHERE idcliente = :idcliente', {
			replacements: {
				idcliente: ordenDetallesData.clientes_idcliente,
			},
			type: QueryTypes.SELECT,
		})) as ordenDetallesDataProps[];

		//Si cliente no existe retorna un error
		if (existeCliente.length === 0) {
			throw new Error('cliente no existe');
		}

		// Llamada al procedimiento almacenado
		const ordenDetalles = (await db.query(
			`
            EXEC sp_insertar_orden_y_detalles
            @idusuario = :idusuario,
            @idestado = :idestado,
            @idcliente = :idcliente,
            @fecha_envio = :fecha_envio,
            @fecha_entregada = :fecha_entregada,
            @metodo_pago = :metodo_pago,
            @nota = :nota,
            @detalles = :detalles
          `,
			{
				replacements: {
					idusuario: ordenDetallesData.usuarios_idusuario,
					idestado: ordenDetallesData.estados_idestado,
					idcliente: ordenDetallesData.clientes_idcliente,
					fecha_envio: ordenDetallesData.fecha_envio,
					fecha_entregada: ordenDetallesData.fecha_entregada,
					metodo_pago: ordenDetallesData.metodo_pago,
					nota: ordenDetallesData.nota,
					detalles: JSON.stringify(ordenDetallesData.detalles), // Convertir a JSON
				},
				type: QueryTypes.INSERT,
			}
		)) as ordenDetallesDataProps[];

		// Retorna datos ingresados
		return ordenDetalles[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};

/************************* ACTUALIZAR *************************/

export const updateOrdenDetallesService = async (id: number, ordenDetallesData: ordenDetallesDataProps): Promise<ordenDetallesDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar id
		const existeId = (await db.query('SELECT * FROM Ordenes WHERE idorden = :id', {
			replacements: {
				id,
			},
			type: QueryTypes.SELECT,
		})) as ordenDetallesDataProps[];

		//Si id no existe retorna un error
		if (existeId.length === 0) {
			throw new Error('id no existe');
		}
		//Hacer la consulta a la base de datos para verificar si existe el cliente
		const existeCliente = (await db.query('SELECT * FROM Clientes WHERE idcliente = :idcliente', {
			replacements: {
				idcliente: ordenDetallesData.clientes_idcliente,
			},
			type: QueryTypes.SELECT,
		})) as ordenDetallesDataProps[];

		//Si cliente no existe retorna un error
		if (existeCliente.length === 0) {
			throw new Error('cliente no existe');
		}

		// Llamada al procedimiento almacenado
		const ordenDetalles = (await db.query(
			`
            EXEC sp_actualizar_orden_y_detalles
            @idorden = :id,
            @idusuario = :idusuario,
            @idestado = :idestado,
            @idcliente = :idcliente,
            @fecha_envio = :fecha_envio,
            @fecha_entregada = :fecha_entregada,
            @metodo_pago = :metodo_pago,
            @nota = :nota,
            @detalles = :detalles
          `,
			{
				replacements: {
					id,
					idusuario: ordenDetallesData.usuarios_idusuario,
					idestado: ordenDetallesData.estados_idestado,
					idcliente: ordenDetallesData.clientes_idcliente,
					fecha_envio: ordenDetallesData.fecha_envio,
					fecha_entregada: ordenDetallesData.fecha_entregada,
					metodo_pago: ordenDetallesData.metodo_pago,
					nota: ordenDetallesData.nota,
					detalles: JSON.stringify(ordenDetallesData.detalles), // Convertir a JSON
				},
				type: QueryTypes.UPDATE,
			}
		)) as ordenDetallesDataProps[];

		// Retorna datos actualizados
		return ordenDetalles[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};

/************************* ACTUALIZAR ESTADO *************************/

export const updateEstadoOrdenService = async (id: number, idestado: number): Promise<ordenDetallesDataProps> => {
	try {
		//Hacer la consulta a la base de datos para verificar id
		const existeId = (await db.query('SELECT * FROM Ordenes WHERE idorden = :id', {
			replacements: {
				id,
			},
			type: QueryTypes.SELECT,
		})) as ordenDetallesDataProps[];

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
		})) as ordenDetallesDataProps[];

		//Si id no existe retorna un error
		if (existeEstado.length === 0) {
			throw new Error('estado no existe');
		}

		// Llamada al procedimiento almacenado
		const orden = (await db.query('EXEC sp_actualizar_estado_orden @idorden = :id, @idestado = :idestado', {
			replacements: {
				id,
				idestado,
			},
			type: QueryTypes.UPDATE,
		})) as ordenDetallesDataProps[];

		// Retorna datos actualizados
		return orden[0];
	} catch (error) {
		// Captura y envio de errores
		console.error('Error en el servidor: ', error);
		throw error;
	}
};
