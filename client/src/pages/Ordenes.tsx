import { Container, Typography } from '@mui/material';
import { OrdenesTable } from '../components/OrdenesTable';
import { useEffect, useState } from 'react';
import { ordenDetallesData } from '../types';
import { getOrdenes } from '../api/OrdenesApi';
import { useAuth } from '../context/authContext';

export const Ordenes = () => {
	const { role, idusuario } = useAuth();
	const [ordenes, setOrdenes] = useState<ordenDetallesData[]>([]);
	const [reload, setReload] = useState(false);

	const fetchData = async () => {
		try {
			if (role === 'Cliente') {
				const data: ordenDetallesData[] | null = await getOrdenes(idusuario);
				setOrdenes(data);
			} else {
				const data: ordenDetallesData[] | null = await getOrdenes();

				setOrdenes(data);
			}
		} catch (error) {
			console.error(error);
		}
	};

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
				justifyContent: 'center',
				alignItems: 'center',
				marginY: 10,
			}}
		>
			<Typography variant='h3'>Ordenes</Typography>
			<OrdenesTable
				ordenes={ordenes}
				reload={reload}
				setReload={setReload}
			/>
		</Container>
	);
};
