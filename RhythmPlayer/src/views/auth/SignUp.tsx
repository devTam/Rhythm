import {FC, useState} from 'react';
import {StyleSheet, SafeAreaView, View} from 'react-native';
import * as yup from 'yup';

import colors from 'utils/colors';
import AuthInputField from 'components/form/AuthInputField';
import Form from 'components/form';
import SubmitBtn from 'components/form/SubmitBtn';
import PasswordVisibilityIcon from 'ui/PasswordVisibilityIcon';

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
      'Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
    )
    .required('Password is required!'),
});

interface Props {}

const initialValues = {
  name: '',
  email: '',
  password: '',
};

const SignUp: FC<Props> = props => {
  const [secureEntry, setSecureEntry] = useState(true);

  const togglePasswordView = () => {
    setSecureEntry(!secureEntry);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Form
        initialValues={initialValues}
        validationSchema={signupSchema}
        onSubmit={values => {
          return console.log(values);
        }}>
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
        </View>
      </Form>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 15,
  },
  marginBottom: {
    marginBottom: 20,
  },
});

export default SignUp;
