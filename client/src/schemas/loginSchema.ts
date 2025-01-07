import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
	email: Yup.string().email('Correo electrónico inválido').required('El correo es obligatorio'),
	password: Yup.string().required('La contraseña es obligatoria'),
});
