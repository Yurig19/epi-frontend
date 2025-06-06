import api from '@/client/api';

export function createPasskey(
  createWebauthnPasskeyBodyDto: CreateWebauthnPasskeyBodyDto,
  employeeUuid: string,
  challenge?: string
) {
  return api.post<ReadPasskeyDto>(
    `/passkeys/create?employeeUuid=${employeeUuid}&challenge=${challenge}`,
    createWebauthnPasskeyBodyDto
  );
}

export function getByEmployeeUuid(employeeUuid: string) {
  return api.get<ReadPasskeyDto[]>(
    `/passkeys/get-by-employee-uuid?employeeUuid=${employeeUuid}`
  );
}

export function verifyPasskey(
  verifyWebauthnPasskeyBodyDto: VerifyWebauthnPasskeyBodyDto,
  employeeUuid: string
) {
  return api.post<ReadVerifyPasskeyDto>(
    `/passkeys/verify?employeeUuid=${employeeUuid}`,
    verifyWebauthnPasskeyBodyDto
  );
}
