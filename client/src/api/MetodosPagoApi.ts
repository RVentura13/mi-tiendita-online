import { toast } from 'react-toastify';
import { metodosPagoTypes } from '../types';
import { getCookie } from '../utils/cookies';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

type responseProps = {
	success: string;
	message: string;
	data?: metodosPagoTypes[];
};

export const getMetodosPago = async (): Promise<metodosPagoTypes[]> => {
	try {
		// Obtener el token desde la cookie
		const token = getCookie('authToken');

		const response = await fetch(`${API_BASE_URL}/metodospago`, {
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
		return [];
	}
};
