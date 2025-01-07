import AddIcon from '@mui/icons-material/Add';
import { Button, Container, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { createCategoria, getCategorias, updateCategoria, updateEstadoCategorias } from '../api/CategoriasApi';
import { DynamicModal } from '../components/ModalDynamic';
import { TableData } from '../components/TableData';
import { useAuth } from '../context/authContext';
import { categoriasSchema } from '../schemas/categoriasSchema';
import { categoriasType } from '../types';

const columns = [
	{ id: 'idcategoria', label: 'ID', align: 'right' },
	{ id: 'nombre', label: 'Nombre', align: 'center' },
	{ id: 'estados_idestado', label: 'Estado', align: 'right' },
];

export const Categories = () => {
	const { idusuario } = useAuth();
	const [reload, setReload] = useState(false);
	const [categoria, setCategoria] = useState<categoriasType[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<categoriasType | null>(null);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [options] = useState<categoriasType[]>([]);
	const [open, setOpen] = useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setSelectedId(null); // Restablece el ID seleccionado
		setSelectedCategories(null); // Restablece el registro seleccionado
		setOpen(false);
	};

	const handleEstado = async (idcategoria: number, currentEstado: number) => {
		const newEstado = currentEstado === 1 ? 2 : 1;
		const response = await updateEstadoCategorias(idcategoria, newEstado);

		if (response) {
			setReload(!reload);
		}
	};

	const fields = [{ name: 'nombre', label: 'Nombre', type: 'text' }];

	const onSubmit = async (data: categoriasType) => {
		try {
			let response;

			if (data.idcategoria) {
				response = await updateCategoria(data.idcategoria, idusuario, 1, data.nombre);
			} else {
				response = await createCategoria(idusuario, 1, data.nombre);
			}

			if (!response) {
				throw new Error('Error al enviar la información');
			}

			setReload(!reload);
			handleClose();
			setSelectedId(null);
		} catch (error) {
			console.error('Error: ', error);
		}
	};

	const handleEdit = (category: categoriasType) => {
		setSelectedCategories(category);
		setOpen(true);
	};

	// Llamado a la api para traer los metodos de pago desde la base de datos
	const fetchCategorias = async () => {
		try {
			const data = await getCategorias();
			setCategoria(data);
		} catch (error) {
			console.error(error);
		}
	};

	// Manejo del select
	const handleChange = (id: number) => {
		setSelectedId(id);
	};

	useEffect(() => {
		fetchCategorias();
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
					setSelectedCategories(null);
				}}
				fields={fields}
				validationSchema={categoriasSchema}
				onSubmit={onSubmit}
				initialValues={{
					...selectedCategories,
				}}
				onChange={handleChange}
				options={options.map((option) => ({
					value: option.idcategoria,
					label: option.nombre,
				}))} // Mapear categorías a opciones
				label='Categorias'
				valueKey='value'
				labelKey='label'
				selectedId={selectedId}
			/>
			<Typography
				variant='h4'
				align='center'
			>
				Categorías
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
				data={categoria}
				handleEstado={handleEstado}
				handleEdit={handleEdit}
			/>
		</Container>
	);
};
