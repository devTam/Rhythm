import Selector from 'components/Selector';
import {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from 'utils/colors';

interface Props {}

const Upload: FC<Props> = props => {
  return (
    <View style={styles.container}>
      <View style={styles.fileSelectorContainer}>
        <Selector
          icon={
            <MaterialIcon
              name="image-outline"
              size={35}
              color={colors.SECONDARY}
            />
          }
          btnTitle="Select Poster"
        />
        <Selector
          icon={
            <MaterialIcon
              name="file-music-outline"
              size={35}
              color={colors.SECONDARY}
            />
          }
          btnTitle="Select Audio"
          style={{marginLeft: 20}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  fileSelectorContainer: {
    flexDirection: 'row',
  },
});

export default Upload;
