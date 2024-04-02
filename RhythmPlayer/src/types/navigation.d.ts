export interface INewUser {
  id: string;
  name: string;
  email: string;
}

export type IAuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Verification: {userInfo: INewUser};
};
