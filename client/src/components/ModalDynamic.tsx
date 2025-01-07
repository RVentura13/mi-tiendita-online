import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { DynamicForm } from './FormDynamic';

type Option = { value: string | number; label: string };

type FormField = {
	name: string;
	label: string;
	type: string;
	options?: Option[]; // Opcional solo para selects
};

type ModalDataProps = {
	open: boolean;
	fields: FormField[];
	validationSchema: any; // Esquema de validación
	onSubmit: (data: any) => void; // Función para manejar el envío del formulario
	initialValues?: Record<string, any>; // Valores iniciales para el formulario
	handleClose: () => void; // Cierra el modal
	label: string;
	valueKey: string; // Clave de valor para opciones del select
	labelKey: string; // Clave de etiqueta para opciones del select
	onChange: (id: number) => void; // Maneja cambios en el select
	options: Option[]; // Opciones para el select
	selectedId: number | null; // ID seleccionado actualmente
};

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 500,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

export const DynamicModal = ({ open, handleClose, fields, validationSchema, onSubmit, initialValues, options, selectedId, onChange }: ModalDataProps) => {
	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'
		>
			<Box sx={style}>
				<DynamicForm
					fields={fields}
					validationSchema={validationSchema} // Esquema de validación dinámico
					onSubmit={onSubmit} // Función para manejar el submit
					initialValues={initialValues} // Valores iniciales
					nombreBoton='Enviar' // Texto del botón
					options={options} // Opciones para selects
					selectedId={selectedId ?? undefined} // ID seleccionado
					onChange={onChange} // Maneja cambios en el select
				/>
			</Box>
		</Modal>
	);
};
