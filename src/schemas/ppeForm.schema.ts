import { z } from 'zod';

export const createPpeFormSchema = z.object({
  employeeUuid: z.string().uuid(),
  expirationAt: z.date(),
  status: z.string().min(1),
  linkedEquipments: z
    .array(
      z.object({
        ppeUuid: z.string().uuid(),
        quantity: z.number().min(1),
      })
    )
    .min(1),
});
