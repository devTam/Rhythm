import {FC, useState} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import colors from 'utils/colors';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props<T> {
  data: T[];
  visible?: boolean;
  title?: string;
  renderItem(item: T): JSX.Element;
  onSelect(item: T, idx: number): void;
  onRequestClose?(): void;
}

const CategorySelector = <T extends any>({
  data,
  title,
  visible = false,
  renderItem,
  onSelect,
  onRequestClose,
}: Props<T>) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const handleSelect = (item: T, idx: number) => {
    setSelectedIdx(idx);
    onSelect(item, idx);
    onRequestClose && onRequestClose();
  };
  return (
    <Modal onRequestClose={onRequestClose} visible={visible} transparent>
      <Pressable onPress={onRequestClose} style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <Text style={styles.title}>{title}</Text>
            <ScrollView>
              {data.map((item, idx) => {
                return (
                  <Pressable
                    onPress={() => handleSelect(item, idx)}
                    key={idx}
                    style={styles.selectorContainer}>
                    {selectedIdx === idx ? (
                      <MaterialIcon
                        name="radiobox-marked"
                        color={colors.SECONDARY}
                      />
                    ) : (
                      <MaterialIcon
                        name="radiobox-blank"
                        color={colors.SECONDARY}
                      />
                    )}
                    {renderItem(item)}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.INACTIVE_CONTRAST,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  modal: {
    width: '90%',
    maxHeight: '50%',
    borderRadius: 10,
    padding: 10,
    backgroundColor: colors.CONTRAST,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.PRIMARY,
    paddingVertical: 10,
  },
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default CategorySelector;
