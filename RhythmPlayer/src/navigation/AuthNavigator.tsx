import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { IAuthStackParamList } from 'types/navigation';
import ForgotPassword from 'views/auth/ForgotPassword';
import SignIn from 'views/auth/SignIn';
import SignUp from 'views/auth/SignUp';
import Verification from 'views/auth/Verification';

const Stack = createNativeStackNavigator<IAuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="Verification" component={Verification} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
