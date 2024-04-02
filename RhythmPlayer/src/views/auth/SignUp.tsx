import {FC, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import * as yup from 'yup';

import AuthInputField from 'components/form/AuthInputField';
import Form from 'components/form';
import SubmitBtn from 'components/form/SubmitBtn';
import PasswordVisibilityIcon from 'ui/PasswordVisibilityIcon';
import AppLink from 'ui/AppLink';
import AuthFormContainer from 'components/AuthFormContainer';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {IAuthStackParamList} from 'types/navigation';
import {FormikHelpers} from 'formik';
import axios from 'axios';
import client from 'api/client';

const signupSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(3, 'Invalid name!')
    .required('Name is required!'),
  email: yup
    .string()
    .trim()
    .email('Invalid email!')
    .required('Email is required!'),
  password: yup
    .string()
    .trim()
    .min(8, 'Password is too short!')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Minimum 8 characters, 1 uppercase, 1 lowercase, 1 num and 1 special character',
    )
    .required('Password is required!'),
});

interface Props {}

export interface NewUser {
  name: string;
  email: string;
  password: string;
}

const initialValues = {
  name: '',
  email: '',
  password: '',
};

const SignUp: FC<Props> = props => {
  const [secureEntry, setSecureEntry] = useState(true);
  const navigation = useNavigation<NavigationProp<IAuthStackParamList>>();

  const togglePasswordView = () => {
    setSecureEntry(!secureEntry);
  };

  const handleSubmit = async (
    values: NewUser,
    actions: FormikHelpers<NewUser>,
  ) => {
    actions.setSubmitting(true);
    try {
      const {data} = await client.post('/auth/signup', {...values});
      navigation.navigate('Verification', {
        userInfo: data.user,
      });
    } catch (error) {
      console.log('Sign up error', error);
    }
    actions.setSubmitting(false);
  };

  return (
    <Form
      initialValues={initialValues}
      validationSchema={signupSchema}
      onSubmit={handleSubmit}>
      <AuthFormContainer
        heading="Welcome to Rhythm!"
        subHeading="Let's get started by creating your account.">
        <View style={styles.formContainer}>
          <AuthInputField
            name="name"
            label="Name"
            placeholder="John Doe"
            containerStyle={styles.marginBottom}
          />
          <AuthInputField
            name="email"
            label="Email"
            placeholder="john@email.com"
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
          />
          <AuthInputField
            name="password"
            label="Password"
            placeholder="*********"
            autoCapitalize="none"
            secureTextEntry={secureEntry}
            containerStyle={styles.marginBottom}
            rightIcon={<PasswordVisibilityIcon privateIcon={secureEntry} />}
            onRightIconPress={togglePasswordView}
          />
          <SubmitBtn title="Sign up" />
          <View style={styles.linkContainer}>
            <AppLink
              title="Forgot Password"
              onPress={() => {
                navigation.navigate('ForgotPassword');
              }}
            />
            <AppLink
              title="Sign in"
              onPress={() => {
                navigation.navigate('SignIn');
              }}
            />
          </View>
        </View>
      </AuthFormContainer>
    </Form>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
  },
  marginBottom: {
    marginBottom: 20,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default SignUp;
