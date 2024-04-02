import {FC, useEffect, useRef, useState} from 'react';
import {Keyboard, StyleSheet, Text, TextInput, View} from 'react-native';

import AppLink from 'ui/AppLink';
import AuthFormContainer from 'components/AuthFormContainer';
import OTPField from 'ui/OTPField';
import AppBtn from 'ui/AppBtn';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {IAuthStackParamList} from 'types/navigation';
import client from 'api/client';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import colors from 'utils/colors';

type Props = NativeStackScreenProps<IAuthStackParamList, 'Verification'>;

const otpFields = new Array(6).fill('');

const Verification: FC<Props> = props => {
  const inputRef = useRef<TextInput>(null);
  const [otp, setOtp] = useState([...otpFields]);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countDown, setCountDown] = useState(60);
  const [canSendOtp, setCanSendOtp] = useState(false);

  const navigation = useNavigation<NavigationProp<IAuthStackParamList>>();

  const {userInfo} = props.route.params;

  const handleChange = (value: string, i: number) => {
    const newOtp = [...otp];
    if (value === 'Backspace') {
      if (!newOtp[i]) {
        setActiveOtpIndex(i - 1);
      }
      newOtp[i] = '';
    } else {
      newOtp[i] = value;
      setActiveOtpIndex(i + 1);
    }

    setOtp([...newOtp]);
  };

  const handlePaste = (value: string) => {
    if (value.length === 6) {
      Keyboard.dismiss();
      const newOtp = value.split('');
      setOtp([...newOtp]);
    }
  };

  const isValidOtp = otp.every(value => {
    return value.trim();
  });

  const handleSubmit = async () => {
    if (!isValidOtp) return;
    setIsSubmitting(true);
    try {
      const {data} = await client.post('/auth/verify-email', {
        userId: userInfo.id,
        token: otp.join(''),
      });
      navigation.navigate('SignIn');
    } catch (error) {
      console.log('Verification  Error', error);
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  useEffect(() => {
    if (canSendOtp) return;
    const interval = setInterval(() => {
      setCountDown((oldCountDown) => {
        if (oldCountDown <= 0) {
          setCanSendOtp(true);
          clearInterval(interval);
          return 0;
        }
        return oldCountDown - 1

      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [canSendOtp]);

  const requestOtp = async () => {
    setCountDown(60);
    setCanSendOtp(false)
    try {
      const {data} = await client.post('/auth/re-verify-email', {
        userId: userInfo.id,
      });
    } catch (error) {
      console.log('Resend Otp Error', error);
    }
  };

  return (
    <AuthFormContainer heading="Enter the One Time Password sent to your Email">
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          {otpFields.map((_, i) => {
            return (
              <OTPField
                ref={activeOtpIndex === i ? inputRef : null}
                key={i}
                placeholder="*"
                onKeyPress={({nativeEvent}) => {
                  handleChange(nativeEvent.key, i);
                }}
                keyboardType="numeric"
                onChangeText={handlePaste}
                value={otp[i] || ''}
              />
            );
          })}
        </View>

        <AppBtn loading={isSubmitting} title="Submit" onPress={handleSubmit} />
        <View style={styles.linkContainer}>
          {countDown > 0 ? (
            <Text style={styles.countDown}>{countDown}s</Text>
          ) : null}
          <AppLink active={canSendOtp} title="Re-send OTP" onPress={requestOtp} />
        </View>
      </View>
    </AuthFormContainer>
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
    marginTop: 20,
    width: '100%',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  countDown: {
    color: colors.SECONDARY,
    marginRight: 7,
  },
});

export default Verification;
