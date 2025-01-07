import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, TextField } from '@mui/material';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { DynamicSelect } from './SelectDynamic';

type FormField = {
	name: string;
	label: string;
	type: string;
	options?: { value: number | string; label: string }[]; // Ajustado para usar el mismo formato que en DynamicSelect
};

type DynamicFormProps = {
	fields: FormField[];
	validationSchema: yup.ObjectSchema<any>;
	onSubmit: (data: any) => void;
	initialValues?: Record<string, any>;
	nombreBoton: string;
	options?: { value: number | string; label: string }[]; // Opciones para selects
	selectedId?: number; // ID seleccionado
	onChange?: (id: number) => void; // Función para manejar cambios en el select
};

export const DynamicForm: React.FC<DynamicFormProps> = ({ fields, validationSchema, onSubmit, initialValues, nombreBoton, selectedId, onChange }) => {
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		resolver: yupResolver(validationSchema),
		defaultValues: initialValues || {},
	});

	const onSubmitWrapper = (data: any) => {
		onSubmit(data);
	};

	useEffect(() => {
		if (initialValues) {
			reset(initialValues);
		}
	}, [initialValues, reset]);

	return (
		<form onSubmit={handleSubmit(onSubmitWrapper)}>
			{fields.map((field) => (
				<Controller
					key={field.name}
					name={field.name}
					control={control}
					defaultValue={initialValues?.[field.name] || ''}
					render={({ field: controllerField }) => {
						const errorMessage = errors[field.name]?.message;

						if (field.type === 'file') {
							return (
								<Box>
									<input
										type='file'
										accept='image/jpeg, image/png, image/jpg'
										style={{ display: 'none' }}
										id={field.name}
										onChange={(e) => {
											const files = e.target.files;
											controllerField.onChange(files?.[0]);
										}}
									/>
									<Button
										variant='contained'
										color='primary'
										component='label'
										htmlFor={field.name}
										sx={{ marginTop: 1 }}
									>
										{field.label}
									</Button>
								</Box>
							);
						} else if (field.type === 'select' && field.options) {
							return (
								<DynamicSelect
									options={field.options} // Pasamos las opciones específicas del campo
									selectedId={selectedId || 0} // ID seleccionado actual
									onChange={onChange || (() => {})} // Función para manejar cambios
									label={field.label}
									valueKey='value'
									labelKey='label'
								/>
							);
						} else {
							return (
								<TextField
									{...controllerField}
									label={field.label}
									type={field.type}
									fullWidth
									margin='normal'
									error={!!errorMessage}
									helperText={typeof errorMessage === 'string' ? errorMessage : ''}
								/>
							);
						}
					}}
				/>
			))}
			<Button
				type='submit'
				variant='contained'
				color='primary'
				fullWidth
				sx={{ marginTop: 2 }}
			>
				{nombreBoton}
			</Button>
		</form>
	);
};
