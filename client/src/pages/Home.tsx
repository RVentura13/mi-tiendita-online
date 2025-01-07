import { Container } from '@mui/material';
import { CardProduct } from '../components/CardProduct';
import { useEffect, useState } from 'react';
import { productosTypes } from '../types';
import { getProductos } from '../api/ProductosApi';

export const Home = () => {
	const [productos, setProductos] = useState<productosTypes[]>([]);
	const fetchData = async () => {
		try {
			const data: productosTypes[] = await getProductos();

			setProductos(data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<Container
			sx={{
				width: '100%',
				minHeight: '80vh',
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				display: 'flex',
				flexWrap: 'wrap',
				gap: 5,
				justifyContent: 'center',
				alignItems: 'center',
				marginY: 10,
			}}
		>
			{productos.map((producto) => (
				<CardProduct
					key={producto.codigo}
					idproducto={producto.idproducto}
					nombre={producto.nombre}
					marca={producto.marca}
					stock={producto.stock}
					precio={producto.precio}
					foto={producto.foto}
					estados_idestado={producto.estados_idestado}
				/>
			))}
		</Container>
	);
};
