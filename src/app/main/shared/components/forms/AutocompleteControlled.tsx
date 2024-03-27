/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import Autocomplete from '@mui/material/Autocomplete';
import { useState } from 'react';

type TOption = {
  label: string;
  value: string;
};

type AutocompleteControlledProps<T> = {
  name: T extends object ? keyof T : string;
  control: any;
  label: string;
  options: TOption[];
  inputValue?: string;
  required?: boolean;
  onChangeHelperFields?: (value: any) => void;
  onInputChange?: (value: string) => void;
} & Omit<React.ComponentProps<typeof Autocomplete>, 'renderInput' | 'onInputChange' | 'getOptionLabel'>;

export function AutocompleteControlled<T = unknown>({
  control,
  onChangeHelperFields,
  label,
  name,
  options,
  onInputChange,
  inputValue,
  required,
  noOptionsText,
  ...restProps
}: AutocompleteControlledProps<T>) {
  const [inputValueState, setInputValueState] = useState(inputValue || '');

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value: fieldValue, ...restField }, fieldState }) => (
        <Autocomplete
          {...restField}
          {...restProps}
          options={options}
          value={options.find(option => option.value === fieldValue) || null}
          noOptionsText={noOptionsText || 'Nenhum resultado encontrado'}
          onChange={(e, data: TOption) => {
            onChange(data?.value || '');
            if (onChangeHelperFields) {
              onChangeHelperFields(data);
            }
          }}
          onInputChange={(event, newInputValue) => {
            setInputValueState(newInputValue);
            if (onInputChange) {
              onInputChange(newInputValue);
            }
          }}
          inputValue={inputValueState}
          getOptionLabel={(option: TOption) => option.label}
          renderInput={params => (
            <TextField
              {...params}
              required={required}
              label={label}
              variant="outlined"
              error={fieldState.invalid}
              helperText={fieldState.error?.message}
            />
          )}
        />
      )}
    />
  );
}
