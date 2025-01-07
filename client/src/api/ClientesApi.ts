import { toast } from 'react-toastify';
import { clienteTypes } from '../types';
import { getCookie } from '../utils/cookies';

// URL base de los endpoin
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

type responseProps = {
	success: string;
	message: string;
	data?: clienteTypes;
};

// Obtener todos los datos
export const getClientes = async (idpersona: number): Promise<clienteTypes | null> => {
	try {
		// Obtener el token desde la cookie
		const token = getCookie('authToken');
		const response = await fetch(`${API_BASE_URL}/clientes/${idpersona}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
			},
		});

		const responseData: responseProps = await response.json();

		if (!response.ok) {
			throw new Error(responseData.message || 'Credenciales inválidas');
		}

		return responseData.data!;
	} catch (error: any) {
		// Mostrar el mensaje de error con toastify
		toast.error(error.message || 'Error desconocido');
		return null;
	}
};
