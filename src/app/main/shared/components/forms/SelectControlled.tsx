import { Controller } from 'react-hook-form';
import { FormControl, FormHelperText, InputLabel, Select, MenuItem } from '@mui/material';

interface TOptionSelect {
  label: string;
  value: string | number;
}

export type FormSelectProps<T> = {
  name: T extends object ? keyof T : string;
  control: any;
  label: string;
  options: TOptionSelect[];
} & React.ComponentProps<typeof Select>;

/**
 * @param helperText Is defined internally based on the schema validation
 * @param error Is defined internally based on the schema validation
 */
export function SelectControlled<T = unknown>({ name, control, label, ...restProps }: FormSelectProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl error={fieldState.invalid} fullWidth>
          <InputLabel id={name}>{label}</InputLabel>
          <Select {...field} value={field.value || ''} labelId={name} label={label} fullWidth {...restProps}>
            {restProps.options.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{fieldState.error?.message}</FormHelperText>
        </FormControl>
      )}
    />
  );
}
