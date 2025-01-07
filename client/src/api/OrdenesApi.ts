import { toast } from 'react-toastify';
import { ordenDetallesData, ordenType } from '../types';
import { getCookie } from '../utils/cookies';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

type responseDataProps = {
	ordenes: ordenType;
};

type responseProps = {
	success: string;
	message: string;
	data?: responseDataProps;
};

type responseGetProps = {
	success: string;
	message: string;
	data?: ordenDetallesData[];
};

// export const createOrden = async (usuarios_idusuario: number, clientes_idcliente: number, metodo_pago: number, detalles: []) => {
export const createOrden = async (ordenData: any) => {
	try {
		// Obtener el token desde la cookie
		const token = getCookie('authToken');
		const response = await fetch(`${API_BASE_URL}/ordenesdetalles`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
			},
			// body: JSON.stringify({ usuarios_idusuario, clientes_idcliente, metodo_pago, detalles }),
			body: JSON.stringify(ordenData),
		});

		const responseData: responseProps = await response.json();

		if (!response.ok) {
			throw new Error(responseData.message || 'Error en los datos');
		}

		toast.success('Orden Creada exitosamente');
		return responseData.data!;
	} catch (error: any) {
		// Mostrar el mensaje de error con toastify
		toast.error(error.message || 'Error desconocido');
		return null;
	}
};

// Obtener todos los datos
export const getOrdenes = async (idusuario: number = 0): Promise<ordenDetallesData[]> => {
	try {
		// Obtener el token desde la cookie
		const token = getCookie('authToken');

		const response = await fetch(`${API_BASE_URL}/ordenesdetalles?idusuario=${idusuario}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
			},
		});

		const responseData: responseGetProps = await response.json();

		if (!response.ok) {
			throw new Error(responseData.message || 'Credenciales inválidas');
		}

		return responseData.data!;
	} catch (error: any) {
		// Mostrar el mensaje de error con toastify
		toast.error(error.message || 'Error desconocido');
		return [];
	}
};

export const updateEstadoOrden = async (idorden: number, estados_idestado: number) => {
	try {
		// Obtener el token desde la cookie
		const token = getCookie('authToken');
		const response = await fetch(`${API_BASE_URL}/ordenesdetalles/${idorden}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
			},

			body: JSON.stringify({ idorden, estados_idestado }),
		});

		const responseData: responseProps = await response.json();

		if (!response.ok) {
			throw new Error(responseData.message || 'Error en los datos');
		}

		toast.success('Actualizado exitosamente');
		return responseData.data!;
	} catch (error: any) {
		// Mostrar el mensaje de error con toastify
		toast.error(error.message || 'Error desconocido');
		return null;
	}
};
