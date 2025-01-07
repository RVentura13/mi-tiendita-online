import AddIcon from '@mui/icons-material/Add';
import { Button, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { createUsuario, getUsuarios, updateEstadoUsuario, updateUsuario } from '../api/UsuariosApi';
import { DynamicModal } from '../components/ModalDynamic';
import { TableData } from '../components/TableData';
import { usuarioSchema } from '../schemas/usuariosSchema';
import { usuariosType } from '../types';

const columns = [
	{ id: 'nombre_rol', label: 'Rol', align: 'right' },
	{ id: 'nombre_persona', label: 'Nombre', align: 'center' },
	{ id: 'apellido_persona', label: 'Apellido', align: 'center' },
	{ id: 'correo_electronico', label: 'Correo', align: 'right' },
	{ id: 'estados_idestado', label: 'Estado', align: 'right' },
];

export const Usuarios = () => {
	const [reload, setReload] = useState(false);
	const [usuarios, setUsuarios] = useState<usuariosType[]>([]);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [selectetUsuario, setSelectedUsuario] = useState<usuariosType | null>(null);

	const [open, setOpen] = useState(false);

	// Para abrir el modal
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	// Obtener los productos desde la API
	const fetchData = async () => {
		try {
			const data: usuariosType[] = await getUsuarios();
			setUsuarios(data);
		} catch (error) {
			console.error(error);
		}
	};

	// Manejo del estado de cada producto
	const handleEstado = async (id: number, currentEstado: number) => {
		const newEstado = currentEstado === 1 ? 2 : 1;
		const response = await updateEstadoUsuario(id, newEstado);

		if (response) {
			setReload(!reload);
		}
	};

	// campos para el formulario crear
	const fields = [
		{ name: 'roles_idrol', label: 'Rol', type: 'number' },
		{ name: 'cui', label: 'Cui', type: 'number' },
		{ name: 'nombre', label: 'Nombre', type: 'text' },
		{ name: 'apellido', label: 'Apellido', type: 'text' },
		{ name: 'fecha_nacimiento', label: '', type: 'date' },
		{ name: 'correo_electronico', label: 'Correo', type: 'email' },
		{ name: 'telefono', label: 'Teléfono', type: 'number' },
		{ name: 'nit', label: 'Nit', type: 'text' },
		{ name: 'direccion', label: 'Dirección', type: 'text' },
		{ name: 'contrasena', label: 'Contraseña', type: 'password' },
	];

	// // Funcion para envio de datos del formulario crear
	const onSubmit = async (data: usuariosType) => {
		try {
			let response;
			if (data.idusuario) {
				response = await updateUsuario(
					data.idusuario,
					data.roles_idrol,
					data.cui,
					data.nombre,
					data.apellido,
					data.fecha_nacimiento,
					data.correo_electronico,
					data.telefono,
					data.nit,
					data.direccion,
					data.contrasena
				);
			} else {
			}
			response = await createUsuario(data.roles_idrol, data.cui, data.nombre, data.apellido, data.fecha_nacimiento, data.correo_electronico, data.telefono, data.nit, data.direccion, data.contrasena);

			if (!response) {
				throw new Error('Credenciales incorrectas');
			}

			setReload(!reload); // Recargar la tabla tras crear el producto
			handleClose(); // Cerrar el modal tras una operación exitosa
		} catch (error) {
			console.error('Error al iniciar sesión: ', error);
		}
	};

	// Funcion para editar
	const handleEdit = (usuario: usuariosType) => {
		setSelectedUsuario(usuario); // Establece el producto seleccionado
		setOpen(true); // Abre el modal
	};

	// Manejo del select
	const handleChange = (id: number) => {
		setSelectedId(id);
	};

	// Efecto para recargar los datos cuando se actualiza el estado
	useEffect(() => {
		fetchData();
	}, [reload]);

	return (
		<Container
			sx={{
				width: '100%',
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				display: 'flex',
				flexWrap: 'wrap',
				gap: 2,
				justifyContent: 'left',
				alignItems: 'center',
				marginY: 2,
			}}
		>
			<DynamicModal
				open={open}
				handleClose={() => {
					setOpen(false);
					setSelectedUsuario(null);
				}}
				fields={fields}
				validationSchema={usuarioSchema}
				onSubmit={onSubmit}
				initialValues={selectetUsuario || {}}
				onChange={handleChange}
				options={[]} // Mapear opciones de select
				label='Forma de pago'
				valueKey='value'
				labelKey='label'
				selectedId={selectedId}
			/>
			<Typography
				variant='h4'
				align='center'
			>
				Usuarios
			</Typography>
			<Button
				onClick={handleOpen}
				variant='contained'
				color='success'
				sx={{ fontSize: 16 }}
			>
				Crear
				<AddIcon />
			</Button>

			<TableData
				columns={columns}
				data={usuarios}
				handleEstado={handleEstado}
				handleEdit={handleEdit}
			/>
		</Container>
	);
};
