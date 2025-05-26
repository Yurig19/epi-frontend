import api from '@/client/api';

export async function updateUser(updateUserDto: UpdateUserDto) {
  return await api.put<ReadUserDto>('/users/update', updateUserDto);
}

export async function updatePassword(updatePasswordDto: UpdatePasswordDto) {
  return await api.put<ReadUpdatePasswordDto>(
    '/users/update-password',
    updatePasswordDto
  );
}
