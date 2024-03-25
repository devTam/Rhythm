import {FC} from 'react';
import { useFormikContext } from 'formik';
import {Button, StyleSheet} from 'react-native';
import AppBtn from 'ui/AppBtn';

interface Props {
  title: string;
}

const SubmitBtn: FC<Props> = ({title}) => {
    const {handleSubmit} = useFormikContext()
  return <AppBtn onPress={() => handleSubmit()} title={title} />;
};

const styles = StyleSheet.create({
  container: {},
});

export default SubmitBtn;
