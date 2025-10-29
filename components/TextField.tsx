import { TextInput, TextInputProps } from 'react-native';

interface TextFieldProps extends TextInputProps {
  // Aquí puedes añadir props personalizadas si lo necesitas
}

const TextField = (props: TextFieldProps) => {
  return (
    <TextInput
      className="flex-1 bg-slate-800 border-2 border-slate-700 text-white rounded-l-lg p-4 text-lg focus:border-yellow-400"
      placeholderTextColor="#9ca3af"
      {...props}
    />
  );
};

export default TextField;
