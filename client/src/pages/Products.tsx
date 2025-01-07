import { useEffect, useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { createProducto, getProductos, updateEstadoProducto, updateProducto } from '../api/ProductosApi';
import { TableData } from '../components/TableData';
import { categoriasType, productosTypes } from '../types';
import AddIcon from '@mui/icons-material/Add';
import { DynamicModal } from '../components/ModalDynamic';
import { productosSchema } from '../schemas/productosSchema';
import { getCategorias } from '../api/CategoriasApi';
import { useAuth } from '../context/authContext';

const columns = [
	{ id: 'marca', label: 'Marca', align: 'right' },
	{ id: 'nombre', label: 'Producto', align: 'center' },
	{ id: 'foto', label: 'Foto', align: 'center' },
	{ id: 'precio', label: 'Precio c/u', align: 'right' },
	{ id: 'stock', label: 'Stock', align: 'right' },
	{ id: 'estados_idestado', label: 'Estado', align: 'right' },
];

export const Products = () => {
	const { idusuario } = useAuth();
	const [reload, setReload] = useState(false);
	const [productos, setProductos] = useState<productosTypes[]>([]);
	const [selectedProduct, setSelectedProduct] = useState<productosTypes | null>(null);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [options, setOptions] = useState<categoriasType[]>([]);
	const [open, setOpen] = useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setSelectedId(null); // Restablece el ID seleccionado
		setSelectedProduct(null); // Restablece el producto seleccionado
		setOpen(false);
	};

	const fetchData = async () => {
		try {
			const data: productosTypes[] = await getProductos();
			setProductos(data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleEstado = async (idproducto: number, currentEstado: number) => {
		const newEstado = currentEstado === 1 ? 2 : 1;
		const response = await updateEstadoProducto(idproducto, newEstado);

		if (response) {
			setReload(!reload);
		}
	};

	const fields = [
		{
			name: 'categoriasproductos_idcategoria',
			label: 'Categoría',
			type: 'select',
			options: options.map((categoria) => ({
				value: categoria.idcategoria,
				label: categoria.nombre,
			})),
		},
		{ name: 'nombre', label: 'Nombre', type: 'text' },
		{ name: 'marca', label: 'Marca', type: 'text' },
		{ name: 'codigo', label: 'Código', type: 'text' },
		{ name: 'stock', label: 'Stock', type: 'number' },
		{ name: 'precio', label: 'Precio', type: 'number' },
		{ name: 'foto', label: 'Foto', type: 'file' },
	];

	const onSubmit = async (data: productosTypes) => {
		try {
			let response;

			// Si no se envía una nueva foto, usa la foto existente
			const fotoFinal = data.foto || selectedProduct?.foto;

			if (data.idproducto) {
				response = await updateProducto(
					data.idproducto,
					selectedId!,
					idusuario,
					1,
					data.nombre,
					data.marca,
					data.codigo,
					data.stock,
					data.precio,
					fotoFinal // Usar la foto final (nueva o existente)
				);
			} else {
				response = await createProducto(selectedId!, idusuario, 1, data.nombre, data.marca, data.codigo, data.stock, data.precio, fotoFinal);
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

	const handleEdit = (product: productosTypes) => {
		setSelectedProduct(product);
		setSelectedId(product.categoriasproductos_idcategoria); // Establece la categoría del producto como valor inicial
		setOpen(true);
	};

	// Llamado a la api para traer los metodos de pago desde la base de datos
	const fetchCategorias = async () => {
		const useto = 'select';
		try {
			const data = await getCategorias(useto);
			setOptions(data);
		} catch (error) {
			console.error(error);
		}
	};

	// Manejo del select
	const handleChange = (id: number) => {
		setSelectedId(id);
		setSelectedProduct((prev) => {
			if (!prev) return null; // Si no hay producto seleccionado, regresa null.

			return {
				...prev,
				categoriasproductos_idcategoria: id,
			} as productosTypes; // Aseguramos el tipo con una aserción explícita.
		});
	};

	useEffect(() => {
		fetchData();
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
					setSelectedProduct(null);
				}}
				fields={fields}
				validationSchema={productosSchema}
				onSubmit={onSubmit}
				initialValues={{
					...selectedProduct,
					categoriasproductos_idcategoria: selectedProduct?.categoriasproductos_idcategoria || '',
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
				Productos
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
				data={productos}
				handleEstado={handleEstado}
				handleEdit={handleEdit}
			/>
		</Container>
	);
};
