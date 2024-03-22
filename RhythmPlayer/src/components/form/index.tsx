import {Formik, FormikHelpers} from 'formik';
import {ReactNode} from 'react';

interface Props<T> {
  initialValues: any;
  validationSchema: any;
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => void;
  children: ReactNode;
}

const Form = <T extends object>({
  initialValues,
  validationSchema,
  onSubmit,
  children,
}: Props<T>) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}>
      {children}
    </Formik>
  );
};

export default Form;
