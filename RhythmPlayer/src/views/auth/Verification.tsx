import {FC, useEffect, useRef, useState} from 'react';
import {Keyboard, StyleSheet, TextInput, View} from 'react-native';

import AppLink from 'ui/AppLink';
import AuthFormContainer from 'components/AuthFormContainer';
import OTPField from 'ui/OTPField';
import AppBtn from 'ui/AppBtn';

interface Props {}

const otpFields = new Array(6).fill('');

const Verification: FC<Props> = props => {
  const inputRef = useRef<TextInput>(null);
  const [otp, setOtp] = useState([...otpFields]);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);

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

  const handleSubmit = () => {
    
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);
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

        <AppBtn title="Submit" onPress={handleSubmit} />
        <View style={styles.linkContainer}>
          <AppLink title="Re-send OTP" />
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
    alignItems: 'flex-end',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default Verification;
