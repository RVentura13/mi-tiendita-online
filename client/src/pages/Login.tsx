import { useNavigate } from 'react-router-dom';

import { Box, Container, Typography } from '@mui/material';

import { loginSchema } from '../schemas/loginSchema';
import { setCookie } from '../utils/cookies';

import { login } from '../api/auth';
import { DynamicForm } from '../components/FormDynamic';
import { useAuth } from '../context/authContext';
import { loginTypes } from '../types';

export const Login = () => {
	const { setRole, setEmail, setIdusuario, setIdpersona } = useAuth();

	const navigate = useNavigate();

	const fields = [
		{ name: 'email', label: 'Correo electrónico', type: 'email' },
		{ name: 'password', label: 'Contraseña', type: 'password' },
	];

	// Funcion para guardar en localStorage
	const saveToLocalStorage = (role: string, email: string, idusuario: number, idpersona: number) => {
		const data = { role, email, idusuario, idpersona };
		localStorage.setItem('userInfo', JSON.stringify(data));
	};

	const saveUserDataAndNavigate = (response: any) => {
		saveToLocalStorage(response.usuario.rol, response.usuario.correo_electronico, response.usuario.idusuario, response.usuario.personas_idpersona);

		setRole(response.usuario.rol);
		setEmail(response.usuario.correo_electronico);
		setIdusuario(response.usuario.idusuario);
		setIdpersona(response.usuario.personas_idpersona);

		// Navegar después de sincronización
		if (response.usuario.rol === 'Administrador' || response.usuario.rol === 'Cliente') {
			navigate('/');
		} else if (response.usuario.rol === 'Operador') {
			navigate('/ordenes');
		}
	};

	const onSubmit = async (data: loginTypes) => {
		try {
			const response = await login(data.email, data.password);

			if (!response) {
				throw new Error('Credenciales incorrectas');
			}

			setCookie('authToken', response.token, 1);
			saveUserDataAndNavigate(response);
		} catch (error) {
			console.error('Error al iniciar sesión: ', error);
		}
	};

	return (
		<Box
			sx={{
				position: 'relative',
				width: '100%',
				minHeight: '100vh',
				backgroundImage: 'url(/backgorund.jpg)',
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			{/* Capa con blur */}
			<Box
				sx={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: 'rgba(255, 255, 255, 0.3)',
					backdropFilter: 'blur(10px)',
					zIndex: 1,
				}}
			/>
			<Container
				component='main'
				maxWidth='xs'
				sx={{ zIndex: 2 }}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						padding: 3,
						backgroundColor: '#fff',
						borderRadius: 5,
						boxShadow: 5,
					}}
				>
					<Box sx={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 8 }}>
						<Box
							component='img'
							src='/logotipo.png'
							alt='Logo'
							sx={{
								borderRadius: 80,
								height: 100,
								marginRight: 1,
								paddingBottom: 1,
							}}
						/>
						<Typography
							variant='h4'
							color='primary'
							sx={{ textAlign: 'center' }}
						>
							MI TIENDITA ONLINE
						</Typography>
					</Box>
					<Typography
						variant='h5'
						color='primary'
					>
						Iniciar sesión
					</Typography>

					<DynamicForm
						fields={fields}
						validationSchema={loginSchema}
						onSubmit={onSubmit}
						nombreBoton={'Iniciar Sesión'}
					/>
				</Box>
			</Container>
		</Box>
	);
};
