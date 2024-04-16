import {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface Props {}

const Upload: FC<Props> = props => {
  return (
    <View style={styles.container}>
      <Text style={{color: 'white', fontSize: 30}}>Upload</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Upload;
