import { Control, Controller, ControllerRenderProps, FieldValues } from 'react-hook-form';
import TextField from '@mui/material/TextField';

type TextFieldControlledProps<T extends Control> = {
  name: T extends { _defaultValues: infer U } ? keyof U : T extends object ? keyof T : string;
  control: any;
  label: string;
  customOnChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: ControllerRenderProps<FieldValues, string>
  ) => void;
} & React.ComponentProps<typeof TextField>;

/**
 * @param helperText Is defined internally based on the schema validation
 * @param error Is defined internally based on the schema validation
 */
export function TextFieldControlled<T extends Control = Control>({
  name,
  control,
  label,
  customOnChange,
  ...props
}: TextFieldControlledProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          label={label}
          error={!!error}
          helperText={error?.message}
          variant="outlined"
          {...props}
          {...(customOnChange && {
            onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
              // @ts-expect-error - Erro de tipagem, T não está sendo inferido
              customOnChange(event, field)
          })}
          InputLabelProps={{
            shrink: !!field.value
          }}
        />
      )}
    />
  );
}
