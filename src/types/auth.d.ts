type AuthLoginDto = {
  email: string;
  password: string;
};

type ReadUserAuthDto = {
  uuid: string;
  name: string;
  email: string;
  role: RoleEnum;
  createdAt: string;
  updatedAt: string;
};

type ReadAuthLoginDto = {
  accessToken: string;
  user: ReadUserAuthDto;
};

type RegisterAuthDto = {
  name: string;
  email: string;
  password: string;
  role: RoleEnum;
};
