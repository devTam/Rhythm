import {FC} from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import colors from 'utils/colors';
import AppInput from 'ui/AppInput';
import {useFormikContext} from 'formik';

interface Props {
  name: string;
  label?: string;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  secureTextEntry?: TextInputProps['secureTextEntry'];
  containerStyle?: StyleProp<ViewStyle>;
}

const AuthInputField: FC<Props> = ({
  name,
  label,
  placeholder,
  keyboardType,
  autoCapitalize,
  secureTextEntry,
  containerStyle,
}) => {
  const {handleChange, values, errors, handleBlur, touched} = useFormikContext<{
    [key: string]: string;
  }>();

  const errorMsg = touched[name] && errors[name] ? errors[name] : '';
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.errorMsg}>{errorMsg}</Text>
      </View>
      <AppInput
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        onChangeText={handleChange(name)}
        value={values[name]}
        onBlur={handleBlur(name)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
  },
  label: {
    color: colors.CONTRAST,
  },
  errorMsg: {color: colors.ERROR},
});

export default AuthInputField;
