import {FC, ReactNode} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import colors from 'utils/colors';

interface Props {
  heading?: string;
  subHeading?: string;
  children: ReactNode;
}

const AuthFormContainer: FC<Props> = ({heading, subHeading, children}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          style={{height: 200, objectFit: 'contain'}}
          source={require('../assets/logo-white.png')}
        />
        <Text style={styles.heading}>{heading}</Text>
        <Text style={styles.subheading}>{subHeading}</Text>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  heading: {
    color: colors.SECONDARY,
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 5,
    marginTop: -20,
  },
  subheading: {color: colors.CONTRAST, fontSize: 16},
  headerContainer: {width: '100%', marginBottom: 20, paddingHorizontal: 15},
});

export default AuthFormContainer;
