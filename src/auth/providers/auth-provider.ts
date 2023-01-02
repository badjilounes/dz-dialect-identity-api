import { UserInformation } from 'src/users/user-information';

export type UserProviderInformation = {
  id: string;
  information: UserInformation;
};

export interface AuthProvider {
  authorizeUrl: string;
  adminAuthorizeUrl: string;
  getUserInformation: (code: string) => Promise<UserProviderInformation>;
  getAdminUserInformation: (code: string) => Promise<UserProviderInformation>;
}
