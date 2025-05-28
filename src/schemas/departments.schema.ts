import { DepartmentsStatusEnum } from '@/enums/departments.enum';
import { z } from 'zod';

export const createDepartmentSchema: z.ZodType<CreateDepartmentDto> = z.object({
  name: z.string().min(1, 'O nome do departamento é obrigatório!'),
  status: z
    .nativeEnum(DepartmentsStatusEnum, {
      required_error: 'O status do departamento é obrigatório!',
      invalid_type_error: 'Status do departamento inválido!',
    })
    .default(DepartmentsStatusEnum.ACTIVE),
});
