import api from '@/client/api';

export async function login(authLoginDto: AuthLoginDto) {
  return await api.post<ReadAuthLoginDto>('/auth/login', authLoginDto);
}

export async function checkToken() {
  return await api.get<ReadUserAuthDto>('/auth/verify-token');
}

export async function register(registerAuthDto: RegisterAuthDto) {
  return await api.post<ReadAuthLoginDto>('/auth/register', registerAuthDto);
}
