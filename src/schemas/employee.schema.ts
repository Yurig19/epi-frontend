import { z } from 'zod';

export const createEmployeeSchema: z.ZodType<CreateEmployeeDto> = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  phone: z.string().optional(),
  document: z.string().optional(),
  position: z.string().optional(),
  birthDate: z.coerce
    .date()
    .refine((date) => date instanceof Date && !Number.isNaN(date.getTime()), {
      message: 'Data de nascimento inválida',
    }),
  dateOfAdmission: z.coerce
    .date()
    .optional()
    .refine((date) => date instanceof Date && !Number.isNaN(date.getTime()), {
      message: 'Data de admissão inválida',
    }),
  departmentUuid: z.string().uuid('Departamento inválido').optional(),
});
