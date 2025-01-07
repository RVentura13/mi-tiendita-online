import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

type responseDataProps = {
	usuario: {
		correo_electronico: string;
		rol: string;
		idusuario: number;
		personas_idpersona: number;
	};
	token: string;
};

type responseProps = {
	success: string;
	message: string;
	data?: responseDataProps;
};

// Envio de datos del login para verificar existencia del usuario y retorno del token

export const login = async (correo_electronico: string, contrasena: string): Promise<responseDataProps | null> => {
	try {
		const response = await fetch(`${API_BASE_URL}/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ correo_electronico, contrasena }),
		});

		const responseData: responseProps = await response.json();

		if (!response.ok) {
			throw new Error(responseData.message || 'Credenciales inválidas');
		}

		toast.success('Bienvenido');
		return responseData.data!;
	} catch (error: any) {
		// Mostrar el mensaje de error con toastify
		toast.error(error.message || 'Error desconocido');
		return null;
	}
};
