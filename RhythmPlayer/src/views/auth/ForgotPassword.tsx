import {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import * as yup from 'yup';

import AuthInputField from 'components/form/AuthInputField';
import Form from 'components/form';
import SubmitBtn from 'components/form/SubmitBtn';
import AppLink from 'ui/AppLink';
import AuthFormContainer from 'components/AuthFormContainer';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {IAuthStackParamList} from 'types/navigation';
import {FormikHelpers} from 'formik';
import client from 'api/client';

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
  const navigation = useNavigation<NavigationProp<IAuthStackParamList>>();

  const handleSubmit = async (
    values: {email: string},
    actions: FormikHelpers<{email: string}>,
  ) => {
    actions.setSubmitting(true);
    try {
      const {data} = await client.post('/auth/forgot-password', {...values});
      console.log(data);
    } catch (error) {
      console.log('Forgot Pass error', error);
    }
    actions.setSubmitting(false);
  };

  return (
    <Form
      initialValues={initialValues}
      validationSchema={ForgotPasswordSchema}
      onSubmit={handleSubmit}>
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
            <AppLink
              title="Sign in"
              onPress={() => {
                navigation.navigate('SignIn');
              }}
            />
            <AppLink
              title="Sign up"
              onPress={() => {
                navigation.navigate('SignUp');
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

export default ForgotPassword;
