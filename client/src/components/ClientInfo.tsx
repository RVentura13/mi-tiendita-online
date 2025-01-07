import { Box, Container, Typography } from '@mui/material';
import { clienteTypes } from '../types';

type clienteInfoProps = {
	cliente: clienteTypes;
};

const fieldsData = ['Nombre:', 'Correo:', 'Dirección de entrega:', 'Teléfono', 'nit'];

const ClientInfo = ({ cliente }: clienteInfoProps) => {
	return (
		<Container
			sx={{
				display: 'flex',
				flexDirection: 'column',
				flexWrap: 'wrap',
				gap: 5,
			}}
		>
			<Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', justifyContent: 'left' }}>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', justifyContent: 'left' }}>
					{fieldsData.map((data) => (
						<Typography
							key={data}
							variant='body1'
							fontWeight='bold'
						>
							{data}
						</Typography>
					))}
				</Box>
				{cliente && (
					<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start', justifyContent: 'left' }}>
						<Typography variant='body1'>{`${cliente.nombre} ${cliente.apellido}`}</Typography>
						<Typography variant='body1'>{cliente.correo_electronico}</Typography>
						<Typography variant='body1'>{cliente.direccion_entrega}</Typography>
						<Typography variant='body1'>{cliente.telefono}</Typography>
						<Typography variant='body1'>{cliente.nit}</Typography>
					</Box>
				)}
			</Box>
		</Container>
	);
};

export default ClientInfo;
