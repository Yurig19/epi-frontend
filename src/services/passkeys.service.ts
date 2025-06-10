import api from '@/client/api';

export function createPasskey(
  createWebauthnPasskeyBodyDto: CreateWebauthnPasskeyBodyDto,
  employeeUuid: string,
  challenge?: string
) {
  return api.post<ReadPasskeyDto>(
    `/passkey/create?employeeUuid=${employeeUuid}&challenge=${challenge}`,
    createWebauthnPasskeyBodyDto
  );
}

export function getByEmployeeUuid(employeeUuid: string) {
  return api.get<ReadPasskeyDto[]>(
    `/passkey/get-by-employee-uuid?employeeUuid=${employeeUuid}`
  );
}

export function verifyPasskey(
  verifyWebauthnPasskeyBodyDto: VerifyWebauthnPasskeyBodyDto,
  employeeUuid: string
) {
  return api.post<ReadVerifyPasskeyDto>(
    `/passkey/verify?employeeUuid=${employeeUuid}`,
    verifyWebauthnPasskeyBodyDto
  );
}

export function deletePasskey(uuid: string) {
  return api.delete<DeleteDto>(`/passkey/delete?uuid=${uuid}`);
}
