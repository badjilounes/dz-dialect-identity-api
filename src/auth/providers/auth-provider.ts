export type UserProviderInformation = {
  id: string;
  name: string;
  username: string;
  imageUrl: string;
};

export interface AuthProvider {
  authorizeUrl: string;
  getUserInformation: (code: string) => Promise<UserProviderInformation>;
}
