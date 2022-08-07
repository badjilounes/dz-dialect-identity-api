import { UserInformation } from 'src/users/user-information';

export type UserProviderInformation = {
  id: string;
  information: UserInformation;
};

export interface AuthProvider {
  authorizeUrl: string;
  getUserInformation: (code: string) => Promise<UserProviderInformation>;
}
