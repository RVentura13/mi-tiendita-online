import { toast } from 'react-toastify';
import { productosTypes } from '../types';
import { getCookie } from '../utils/cookies';

// URL base de los endpoin
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

type responseProps = {
	success: string;
	message: string;
	data?: productosTypes[];
};

type createResponseProps = {
	success: string;
	message: string;
	data?: productosTypes;
};

// Obtener todos los datos
export const getProductos = async (): Promise<productosTypes[]> => {
	try {
		// Obtener el token desde la cookie
		const token = getCookie('authToken');

		const response = await fetch(`${API_BASE_URL}/productos`, {
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

export const createProducto = async (
	categoriasproductos_idcategoria: number,
	usuarios_idusuario: number,
	estados_idestado: number,
	nombre: string,
	marca: string,
	codigo: string,
	stock: number,
	precio: number,
	foto?: File
): Promise<productosTypes | null> => {
	try {
		// Obtener el token desde la cookie
		const token = getCookie('authToken');

		// Crear instancia de FormData
		const formData = new FormData();
		formData.append('categoriasproductos_idcategoria', categoriasproductos_idcategoria.toString());
		formData.append('usuarios_idusuario', usuarios_idusuario.toString());
		formData.append('estados_idestado', estados_idestado.toString());
		formData.append('nombre', nombre);
		formData.append('marca', marca);
		formData.append('codigo', codigo);
		formData.append('stock', stock.toString());
		formData.append('precio', precio.toString());

		// Verificar si 'foto' tiene valor antes de añadirlo
		if (foto) {
			formData.append('foto', foto); // Añadir archivo solo si existe
		}

		// Enviar FormData
		const response = await fetch(`${API_BASE_URL}/productos`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
			},
			body: formData, // No se necesita 'Content-Type', fetch lo maneja automáticamente
		});

		const responseData: createResponseProps = await response.json();

		if (!response.ok) {
			throw new Error(responseData.message || 'Error al crear el producto');
		}

		toast.success('Producto creado correctamente');
		return responseData.data!;
	} catch (error: any) {
		toast.error(error.message || 'Error desconocido');
		return null;
	}
};

export const updateProducto = async (
	idproducto: number,
	categoriasproductos_idcategoria: number,
	usuarios_idusuario: number,
	estados_idestado: number,
	nombre: string,
	marca: string,
	codigo: string,
	stock: number,
	precio: number,
	foto?: File
): Promise<productosTypes | null> => {
	try {
		// Obtener el token desde la cookie
		const token = getCookie('authToken');

		// Crear instancia de FormData
		const formData = new FormData();
		formData.append('categoriasproductos_idcategoria', categoriasproductos_idcategoria.toString());
		formData.append('usuarios_idusuario', usuarios_idusuario.toString());
		formData.append('estados_idestado', estados_idestado.toString());
		formData.append('nombre', nombre);
		formData.append('marca', marca);
		formData.append('codigo', codigo);
		formData.append('stock', stock.toString());
		formData.append('precio', precio.toString());
		// Verificar si 'foto' tiene valor antes de añadirlo
		if (foto) {
			formData.append('foto', foto); // Añadir archivo solo si existe
		}

		// Enviar FormData
		const response = await fetch(`${API_BASE_URL}/productos/${idproducto}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
			},
			body: formData, // No se necesita 'Content-Type', fetch lo maneja automáticamente
		});

		const responseData: createResponseProps = await response.json();

		if (!response.ok) {
			throw new Error(responseData.message || 'Error al crear el producto');
		}

		toast.success('Producto Actualizado correctamente');
		return responseData.data!;
	} catch (error: any) {
		toast.error(error.message || 'Error desconocido');
		return null;
	}
};

export const updateEstadoProducto = async (idproducto: number, estados_idestado: number) => {
	try {
		// Obtener el token desde la cookie
		const token = getCookie('authToken');
		const response = await fetch(`${API_BASE_URL}/productos/${idproducto}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
			},

			body: JSON.stringify({ idproducto, estados_idestado }),
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
