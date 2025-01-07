import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

type DynamicSelectProps<T> = {
	options: T[];
	selectedId: number | null;
	onChange: (id: number) => void;
	label: string;
	valueKey: string;
	labelKey: string;
};

export const DynamicSelect = <T extends {}>({ options = [], selectedId, onChange, label, valueKey, labelKey }: DynamicSelectProps<T>) => {
	return (
		<FormControl fullWidth>
			<InputLabel id='select-label'>{label}</InputLabel>
			<Select
				labelId='select-label'
				value={selectedId ?? ''} // El valor seleccionado
				label={label}
				onChange={(e) => onChange(Number(e.target.value))} // Se asegura de pasar un número al onChange
			>
				{/* Renderizamos las opciones dinámicamente basadas en las claves que pasamos */}
				{options.map((option: T) => (
					<MenuItem
						key={(option as any)[valueKey]}
						value={(option as any)[valueKey]}
					>
						{(option as any)[labelKey]}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
};
