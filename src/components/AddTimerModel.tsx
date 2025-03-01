import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {addTimer} from '../module/Home/store/homeReducer';

interface AddTimerModelProps {
  visible: boolean;
  close: () => void;
  isDarkMode: boolean;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Timer name is required'),
  duration: Yup.number()
    .positive('Duration must be positive')
    .required('Duration is required'),
  category: Yup.string().required('Category is required'),
});

const AddTimerModel: React.FC<AddTimerModelProps> = ({
  visible,
  close,
  isDarkMode,
}) => {
  const dispatch = useDispatch();
  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  const formik = useFormik({
    initialValues: {name: '', duration: '', category: ''},
    validationSchema,
    onSubmit: values => {
      dispatch(addTimer(values));
      formik.resetForm();
      close();
    },
  });

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={themeStyles.container}>
        <ScrollView contentContainerStyle={themeStyles.scrollContainer}>
          <View style={themeStyles.modalContent}>
            <Text style={themeStyles.title}>Add Timer</Text>
            <TextInput
              style={themeStyles.input}
              placeholder="Timer Name"
              placeholderTextColor={isDarkMode ? '#ccc' : '#333'}
              onChangeText={formik.handleChange('name')}
              onBlur={formik.handleBlur('name')}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name && (
              <Text style={themeStyles.error}>{formik.errors.name}</Text>
            )}

            <TextInput
              style={themeStyles.input}
              placeholder="Duration (seconds)"
              placeholderTextColor={isDarkMode ? '#ccc' : '#333'}
              keyboardType="numeric"
              onChangeText={formik.handleChange('duration')}
              onBlur={formik.handleBlur('duration')}
              value={formik.values.duration}
            />
            {formik.touched.duration && formik.errors.duration && (
              <Text style={themeStyles.error}>{formik.errors.duration}</Text>
            )}

            <TextInput
              style={themeStyles.input}
              placeholder="Category"
              placeholderTextColor={isDarkMode ? '#ccc' : '#333'}
              onChangeText={formik.handleChange('category')}
              onBlur={formik.handleBlur('category')}
              value={formik.values.category}
            />
            {formik.touched.category && formik.errors.category && (
              <Text style={themeStyles.error}>{formik.errors.category}</Text>
            )}

            <TouchableOpacity
              style={themeStyles.button}
              onPress={formik.handleSubmit}>
              <Text style={themeStyles.buttonText}>Add Timer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={themeStyles.closeButton} onPress={close}>
              <Text style={themeStyles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const baseStyles = {
  container: {flex: 1},
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {fontSize: 18, fontWeight: 'bold', marginBottom: 10},
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  error: {fontSize: 12, marginBottom: 5},
  button: {
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {fontWeight: 'bold'},
  closeButton: {
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
};

const lightStyles = StyleSheet.create({
  ...baseStyles,
  container: {...baseStyles.container, backgroundColor: 'rgba(0,0,0,0.5)'},
  modalContent: {...baseStyles.modalContent, backgroundColor: 'white'},
  input: {...baseStyles.input, borderColor: '#ccc', color: '#000'},
  error: {...baseStyles.error, color: 'red'},
  button: {...baseStyles.button, backgroundColor: '#007bff'},
  buttonText: {...baseStyles.buttonText, color: 'white'},
  closeButton: {...baseStyles.closeButton, backgroundColor: 'gray'},
});

const darkStyles = StyleSheet.create({
  ...baseStyles,
  container: {
    ...baseStyles.container,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  modalContent: {...baseStyles.modalContent, backgroundColor: '#333'},
  input: {...baseStyles.input, borderColor: '#555', color: '#fff'},
  error: {...baseStyles.error, color: '#ff6b6b'},
  button: {...baseStyles.button, backgroundColor: '#1e90ff'},
  buttonText: {...baseStyles.buttonText, color: 'white'},
  closeButton: {...baseStyles.closeButton, backgroundColor: '#666'},
});

export default AddTimerModel;
