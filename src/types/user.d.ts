type UpdatePasswordDto = {
  currentPassword: string;
  newPassword: string;
};

type ReadUpdatePasswordDto = {
  success: boolean;
};

type UpdateUserDto = {
  name: string;
  email: string;
};

type ReadUserDto = {
  uuid: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};
