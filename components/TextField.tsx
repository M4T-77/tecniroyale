import { TextInput, TextInputProps } from 'react-native';

interface TextFieldProps extends TextInputProps {
}

const TextField = (props: TextFieldProps) => {
  return (
    <TextInput
      className="flex-1 bg-white border-2 border-blue-500 text-gray-800 rounded-l-lg p-4 text-lg focus:border-blue-700 w-screen"
      placeholderTextColor="#6b7280"
      {...props}
    />
  );
};

export default TextField;
