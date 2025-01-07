import * as Yup from 'yup';

export const usuarioSchema = Yup.object().shape({
	// roles_idrol debe ser un número positivo
	roles_idrol: Yup.number().required('El id del rol no puede ir vacío').positive('El id del rol debe ser un número positivo').integer('El id del rol debe ser un número entero'),

	// cui debe ser un número positivo
	cui: Yup.number().required('El CUI no puede ir vacío').positive('El CUI debe ser un número positivo').integer('El CUI debe ser un número entero'),

	// nombre no puede estar vacío
	nombre: Yup.string().required('El nombre no puede ir vacío').min(1, 'El nombre debe tener al menos 1 carácter'),

	// apellido no puede estar vacío
	apellido: Yup.string().required('El apellido no puede ir vacío').min(1, 'El apellido debe tener al menos 1 carácter'),

	// // fecha_nacimiento debe ser una fecha válida
	// fecha_nacimiento: Yup.date()
	// 	.required('La fecha de nacimiento no puede ir vacía')
	// 	.max(new Date(), 'La fecha de nacimiento no puede ser en el futuro')
	// 	.typeError('La fecha de nacimiento debe ser una fecha válida'),

	// correo_electronico debe ser un correo válido
	correo_electronico: Yup.string().required('El correo electrónico no puede ir vacío').email('El correo electrónico debe ser válido'),

	// telefono debe ser un número y no puede estar vacío
	telefono: Yup.number()
		.required('El teléfono no puede ir vacío')
		.positive('El teléfono debe ser un número positivo')
		.integer('El teléfono debe ser un número entero')
		.min(10000000, 'El teléfono debe tener al menos 8 dígitos'),

	// nit debe ser un texto, no vacío
	nit: Yup.string().required('El NIT no puede ir vacío').min(1, 'El NIT debe tener al menos 1 carácter'),

	// direccion no puede estar vacía
	direccion: Yup.string().required('La dirección no puede ir vacía').min(1, 'La dirección debe tener al menos 1 carácter'),

	// contrasena no puede estar vacía
	contrasena: Yup.string().required('La contraseña no puede ir vacía').min(6, 'La contraseña debe tener al menos 6 caracteres'),
});
