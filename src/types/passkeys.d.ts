type CreatePasskeyDto = {
  credentialId: string;
  publicKey: string;
  name?: string;
  signCount?: number;
  transports?: string;
  attestationFmt?: string;
  userUuid?: string;
  employeeUuid: string;
};

type CredentialInfoDto = {
  name?: string;
  transports?: string | string[];
};

type RegistrationInfoDto = {
  credentialID: string;
  credentialPublicKey: string;
  counter: number;
  attestationFormat: string;
};

type CreateWebauthnPasskeyBodyDto = {
  registrationInfo: RegistrationInfoDto;
  credential?: CredentialInfoDto;
};

type AssertionInfoDto = {
  credentialId: string;
  authenticatorData: string;
  clientDataJSON: string;
  signature: string;
  userHandle?: string;
};

type VerifyWebauthnPasskeyBodyDto = {
  assertion: AssertionInfoDto;
  employeeUuid: string;
};

type ReadPasskeyDto = {
  uuid: string;
  credentialId: string;
  publicKey: string;
  name: string;
  signCount: number;
  transports: string;
  attestationFmt: string;
  userUuid: string;
  employeeUuid: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

type ReadVerifyPasskeyDto = {
  authorized: boolean;
};
