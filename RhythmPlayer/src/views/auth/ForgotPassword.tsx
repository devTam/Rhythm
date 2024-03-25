import {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import * as yup from 'yup';

import AuthInputField from 'components/form/AuthInputField';
import Form from 'components/form';
import SubmitBtn from 'components/form/SubmitBtn';
import AppLink from 'ui/AppLink';
import AuthFormContainer from 'components/AuthFormContainer';

const ForgotPasswordSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email('Invalid email!')
    .required('Email is required!'),
});

interface Props {}

const initialValues = {
  email: '',
};

const ForgotPassword: FC<Props> = props => {
  return (
    <Form
      initialValues={initialValues}
      validationSchema={ForgotPasswordSchema}
      onSubmit={values => {
        return console.log(values);
      }}>
      <AuthFormContainer
        heading="Forgot password?"
        subHeading="Don't worry, we will help you get back in.">
        <View style={styles.formContainer}>
          <AuthInputField
            name="email"
            label="Email"
            placeholder="john@email.com"
            autoCapitalize="none"
            containerStyle={styles.marginBottom}
          />
          <SubmitBtn title="Send Link" />
          <View style={styles.linkContainer}>
            <AppLink title="Sign in" />
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

export default ForgotPassword;
