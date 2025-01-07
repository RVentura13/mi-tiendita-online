import * as yup from 'yup';

export const productosSchema = yup.object().shape({
	// categoriasproductos_idcategoria: yup
	// 	.string()
	// 	.required('La categoría del producto es obligatoria')
	// 	.transform((value, originalValue) => (originalValue ? Number(originalValue) : value)),

	// estados_idestado: yup.number().required('El estado del producto es obligatorio').positive('El ID del estado debe ser un número positivo').integer('El ID del estado debe ser un número entero'),

	nombre: yup.string().required('El nombre del producto es obligatorio').max(255, 'El nombre no puede exceder los 255 caracteres'),

	marca: yup.string().required('La marca del producto es obligatoria').max(255, 'La marca no puede exceder los 255 caracteres'),

	codigo: yup.string().required('El código del producto es obligatorio').max(50, 'El código no puede exceder los 50 caracteres'),

	stock: yup.number().required('El stock del producto es obligatorio').integer('El stock debe ser un número entero').min(0, 'El stock no puede ser negativo'),

	precio: yup.number().required('El precio del producto es obligatorio').min(0, 'El precio no puede ser negativo'),

	// foto: yup
	// 	.mixed<File>()
	// 	.test('fileRequired', 'Debe adjuntar un archivo si va a enviar una foto', (value) => {
	// 		// Si no hay archivo, no es obligatorio
	// 		if (!value) return true;
	// 		return true;
	// 	})
	// 	.test('fileType', 'El archivo debe ser una imagen válida (jpg, jpeg, png)', (value) => {
	// 		// Solo valida el tipo si existe un archivo
	// 		if (!value) return true; // Si no hay archivo, no valida
	// 		return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
	// 	})
	// 	.test('fileSize', 'El tamaño del archivo debe ser menor a 2MB', (value) => {
	// 		// Solo valida el tamaño si existe un archivo
	// 		if (!value) return true; // Si no hay archivo, no valida
	// 		return value.size <= 2 * 1024 * 1024; // Máximo 2MB
	// 	}),
});
