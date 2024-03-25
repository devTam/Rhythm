import {FC, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import * as yup from 'yup';

import AuthInputField from 'components/form/AuthInputField';
import Form from 'components/form';
import SubmitBtn from 'components/form/SubmitBtn';
import PasswordVisibilityIcon from 'ui/PasswordVisibilityIcon';
import AppLink from 'ui/AppLink';
import AuthFormContainer from 'components/AuthFormContainer';

const SignInSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email('Invalid email!')
    .required('Email is required!'),
  password: yup
    .string()
    .trim()
    .min(8, 'Password is too short!')
    .required('Password is required!'),
});

interface Props {}

const initialValues = {
  email: '',
  password: '',
};

const SignIn: FC<Props> = props => {
  const [secureEntry, setSecureEntry] = useState(true);

  const togglePasswordView = () => {
    setSecureEntry(!secureEntry);
  };

  return (
    <Form
      initialValues={initialValues}
      validationSchema={SignInSchema}
      onSubmit={values => {
        return console.log(values);
      }}>
      <AuthFormContainer heading="Welcome back!">
        <View style={styles.formContainer}>
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
          <SubmitBtn title="Sign in" />
          <View style={styles.linkContainer}>
            <AppLink title="Forgot Password" />
            <AppLink title="Sign up" />
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

export default SignIn;
