import { z } from 'zod';

export const createPpeSchema: z.ZodType<CreatePpeDto> = z.object({
  name: z.string().min(1, 'O nome do equipamento é obrigatório!'),
  caCode: z.string().min(1, 'O código CA é obrigatório!'),
  status: z.enum(['active', 'inactive']).default('active'),
  description: z.string().optional(),
});
