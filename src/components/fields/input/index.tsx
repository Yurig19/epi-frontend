import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { InputHTMLAttributes } from 'react';
import type {
  Control,
  RegisterOptions,
  FieldValues,
  Path,
} from 'react-hook-form';

interface InputFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  rules?: RegisterOptions<T>;
  type?: InputHTMLAttributes<HTMLInputElement>['type'];
}

const InputField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled,
  rules,
  type,
}: InputFieldProps<T>) => (
  <FormField
    control={control}
    name={name}
    rules={rules}
    render={({ field, fieldState }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            placeholder={placeholder}
            {...field}
            disabled={disabled}
            type={type ?? 'text'}
          />
        </FormControl>
        <FormMessage>{fieldState.error?.message}</FormMessage>
      </FormItem>
    )}
  />
);

export default InputField;
