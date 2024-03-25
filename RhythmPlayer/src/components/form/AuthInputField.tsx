import {FC, ReactNode, useEffect} from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
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
  rightIcon?: ReactNode;
  onRightIconPress?: () => void
}

const AuthInputField: FC<Props> = ({
  name,
  label,
  placeholder,
  keyboardType,
  autoCapitalize,
  secureTextEntry,
  containerStyle,
  rightIcon,
  onRightIconPress
}) => {
  const inputTransformValue = useSharedValue(0);
  const {handleChange, values, errors, handleBlur, touched} = useFormikContext<{
    [key: string]: string;
  }>();

  const errorMsg = touched[name] && errors[name] ? errors[name] : '';

  const shakeUI = () => {
    inputTransformValue.value = withSequence(
      withTiming(-10, {duration: 50}),
      withSpring(0, {
        damping: 8,
        mass: 0.5,
        stiffness: 1000,
        restDisplacementThreshold: 0.1,
      }),
    );
  };
  const inputStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: inputTransformValue.value}],
    };
  });

  useEffect(() => {
    if (errorMsg) {
      shakeUI();
    }
  }, [errorMsg]);
  return (
    <Animated.View style={[containerStyle, inputStyle]}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.errorMsg}>{errorMsg}</Text>
      </View>
      <View>
        <AppInput
          placeholder={placeholder}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          onChangeText={handleChange(name)}
          value={values[name]}
          onBlur={handleBlur(name)}
        />
        {rightIcon && (
          <Pressable onPress={onRightIconPress} style={styles.rightIcon}>{rightIcon}</Pressable>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
  rightIcon: {
    width: 45,
    height: 45,
    position: 'absolute',
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthInputField;
