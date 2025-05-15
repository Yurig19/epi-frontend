import { z } from 'zod';

export const createEmployeeSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  position: z.string().optional(),
});
