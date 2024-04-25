import CategorySelector from 'components/CategorySelector';
import FileSelector from 'components/FileSelector';
import {FC, useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  ScrollView,
  Text,
  Pressable,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppBtn from 'ui/AppBtn';
import {Categories} from 'utils/categories';
import colors from 'utils/colors';

interface Props {}

const Upload: FC<Props> = props => {
  const [showModal, setShowModal] = useState(false);
  const [audioInfo, setAudioInfo] = useState({
    category: '',
  });
  return (
    <ScrollView style={styles.container}>
      <View style={styles.fileSelectorContainer}>
        <FileSelector
          icon={
            <MaterialIcon
              name="image-outline"
              size={35}
              color={colors.SECONDARY}
            />
          }
          btnTitle="Select Poster"
        />
        <FileSelector
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
      <View style={styles.formContainer}>
        <TextInput
          placeholder="Title"
          style={styles.input}
          placeholderTextColor={colors.INACTIVE_CONTRAST}
        />

        <Pressable
          onPress={() => setShowModal(true)}
          style={styles.categorySelector}>
          <Text style={styles.selectorTitle}>Category</Text>
          <Text style={styles.selectedCategory}>{audioInfo.category}</Text>
        </Pressable>
        <TextInput
          placeholder="About"
          style={styles.input}
          placeholderTextColor={colors.INACTIVE_CONTRAST}
          numberOfLines={10}
          multiline
        />
        <CategorySelector
          visible={showModal}
          title="Category"
          data={Categories}
          renderItem={item => {
            return <Text style={styles.category}>{item}</Text>;
          }}
          onSelect={item => {
            setAudioInfo({category: item});
          }}
          onRequestClose={() => {
            setShowModal(false);
          }}
        />
        <View style={{marginBottom: 20}} />
        <AppBtn title="Submit" borderRadius={7} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  fileSelectorContainer: {
    flexDirection: 'row',
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.SECONDARY,
    borderRadius: 7,
    padding: 10,
    fontSize: 18,
    color: colors.CONTRAST,
    textAlignVertical: 'top',
  },
  category: {
    padding: 10,
    color: colors.PRIMARY
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  selectorTitle: {
    color: colors.CONTRAST,
  },
  selectedCategory: {
    color: colors.SECONDARY,
    marginLeft: 5,
    fontStyle: 'italic',
  },
});

export default Upload;
