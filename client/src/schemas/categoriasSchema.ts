import * as Yup from 'yup';

export const categoriasSchema = Yup.object({
	// estados_idestado: Yup.number().required('El ID del estado es obligatorio').integer('El ID del estado debe ser un número entero').positive('El ID del estado debe ser un número positivo'),

	nombre: Yup.string()
		.required('El nombre es obligatorio')
		.min(3, 'El nombre debe tener al menos 3 caracteres')
		.max(50, 'El nombre no puede tener más de 50 caracteres')
		.matches(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, 'El nombre solo puede contener letras y espacios'),
});
