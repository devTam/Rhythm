import {FC} from 'react';
import { useFormikContext } from 'formik';
import {Button, StyleSheet} from 'react-native';

interface Props {
  title: string;
}

const SubmitBtn: FC<Props> = ({title}) => {
    const {handleSubmit} = useFormikContext()
  return <Button onPress={() => handleSubmit()} title={title} />;
};

const styles = StyleSheet.create({
  container: {},
});

export default SubmitBtn;
