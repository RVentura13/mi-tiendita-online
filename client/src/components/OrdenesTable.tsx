import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Dispatch, Fragment, SetStateAction, useState } from 'react';
import { ordenDetallesData } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import { updateEstadoOrden } from '../api/OrdenesApi';
import { useAuth } from '../context/authContext';

const imgNotFound = '/image-not-found.jpg';

type RowProps = {
	row: ordenDetallesData; // Recibe un objeto de tipo ordenesDetallesType
};

interface OrdenesTableProps {
	ordenes: ordenDetallesData[]; // Un array de objetos de tipo ordenesDetallesType
	reload: boolean;
	setReload: Dispatch<SetStateAction<boolean>>;
}

export const OrdenesTable = ({ ordenes, reload, setReload }: OrdenesTableProps) => {
	const { role } = useAuth();

	const handleEstado = async (idorden: number, idestado: number) => {
		const response = await updateEstadoOrden(idorden, idestado);
		if (response) {
			setReload(!reload);
		}
	};
	const Row = ({ row }: RowProps) => {
		const [open, setOpen] = useState(false);

		return (
			<Fragment>
				<TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
					<TableCell>
						<IconButton
							aria-label='expand row'
							size='small'
							onClick={() => setOpen(!open)}
						>
							{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
						</IconButton>
					</TableCell>
					<TableCell
						component='th'
						scope='row'
					>
						{row.idorden}
					</TableCell>
					<TableCell align='center'>{`${row.nombre_cliente} ${row.apellido_cliente}`}</TableCell>
					<TableCell align='center'>{formatCurrency(row.total_orden!)}</TableCell>
					<TableCell align='center'>{row.nombre_forma_pago}</TableCell>
					<TableCell align='center'>{row.fecha_creacion ? new Date(row.fecha_creacion).toLocaleDateString('es-ES') : 'N/A'}</TableCell>
					<TableCell align='center'>
						<span style={{ padding: 4, borderRadius: 5, color: '#fff', backgroundColor: row.nombre_estado === 'Pendiente' ? '#1976d2' : row.nombre_estado === 'Autorizado' ? '#307e34' : 'red' }}>
							{row.nombre_estado}
						</span>
					</TableCell>
					<TableCell align='center'>
						{role !== 'Cliente' && (
							<IconButton
								onClick={() => handleEstado(row.idorden!, 4)}
								aria-label='Autorizar'
								color='success'
								disabled={row.nombre_estado !== 'Pendiente'}
							>
								<DoneIcon />
							</IconButton>
						)}
						<IconButton
							onClick={() => handleEstado(row.idorden!, 5)}
							aria-label='Cancelar'
							color='error'
							disabled={row.nombre_estado !== 'Pendiente'}
						>
							<CloseIcon />
						</IconButton>
					</TableCell>
				</TableRow>
				<TableRow>
					<TableCell
						style={{ paddingBottom: 0, paddingTop: 0 }}
						colSpan={role === 'Cliente' ? 7 : 8}
					>
						<Collapse
							in={open}
							timeout='auto'
							unmountOnExit
						>
							<Box sx={{ margin: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
								<Typography
									variant='h6'
									gutterBottom
									component='div'
								>
									Productos
								</Typography>
								<Table
									size='small'
									aria-label='purchases'
								>
									<TableHead>
										<TableRow>
											<TableCell align='center'>Nombre</TableCell>
											<TableCell align='center'>Foto</TableCell>
											<TableCell align='center'>Cantidad</TableCell>
											<TableCell align='center'>Precio</TableCell>
											<TableCell align='center'>Subtotal</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{row.detalles!.map((historyRow) => (
											<TableRow key={historyRow.idproducto}>
												<TableCell
													component='th'
													scope='row'
													align='center'
												>
													{historyRow.nombre_producto}
												</TableCell>
												<TableCell align='center'>
													<img
														src={historyRow.foto ? historyRow.foto : imgNotFound}
														height={50}
														alt='Foto del producto'
														onError={(e) => (e.currentTarget.src = imgNotFound)}
													/>
												</TableCell>
												<TableCell align='center'>{historyRow.cantidad}</TableCell>
												<TableCell align='center'>{formatCurrency(historyRow.precio)}</TableCell>
												<TableCell align='center'>{formatCurrency(historyRow.cantidad * historyRow.precio)}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</Box>
						</Collapse>
					</TableCell>
				</TableRow>
			</Fragment>
		);
	};

	return (
		<TableContainer component={Paper}>
			<Table aria-label='collapsible table'>
				<TableHead>
					<TableRow>
						<TableCell />
						<TableCell>Orden</TableCell>
						<TableCell align='center'>Cliente</TableCell>
						<TableCell align='center'>Total</TableCell>
						<TableCell align='center'>Forma de pago</TableCell>
						<TableCell align='center'>Fecha de creación</TableCell>
						<TableCell align='center'>Estado</TableCell>
						{role !== 'Cliente' && <TableCell align='center'>Acciones</TableCell>}
					</TableRow>
				</TableHead>
				<TableBody>
					{ordenes.map((row) => (
						<Row
							key={row.idorden}
							row={row}
						/>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};
