import {FC} from 'react';
import {StyleSheet, Pressable, Text} from 'react-native';
import colors from 'utils/colors';
import Loader from './Loader';

interface Props {
  title: string;
  onPress?: () => void;
  loading?: boolean;
}

const AppBtn: FC<Props> = ({title, onPress, loading}) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      {loading ? <Loader /> : <Text style={styles.title}>{title}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 45,
    backgroundColor: colors.SECONDARY,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  title: {
    color: colors.CONTRAST,
    fontSize: 18,
  },
});

export default AppBtn;
