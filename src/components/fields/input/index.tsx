import { IMaskInput } from 'react-imask';
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
import { cn } from '@/lib/utils';

interface InputFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  rules?: RegisterOptions<T>;
  type?: InputHTMLAttributes<HTMLInputElement>['type'];
  defaultValue?: string | number | readonly string[] | undefined;
  mask?: string;
}

export function InputField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled,
  rules,
  type,
  mask,
}: InputFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {mask ? (
              <IMaskInput
                {...field}
                mask={mask}
                disabled={disabled}
                placeholder={placeholder}
                type={type ?? 'text'}
                onAccept={(value) => field.onChange(value)}
                value={field.value || ''}
                className={cn(
                  'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                  'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                  'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
                )}
              />
            ) : (
              <Input
                {...field}
                placeholder={placeholder}
                disabled={disabled}
                type={type ?? 'text'}
              />
            )}
          </FormControl>
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
}
