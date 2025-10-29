import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

interface IconButtonProps extends TouchableOpacityProps {
  text: string;
}

const IconButton = ({ text, ...props }: IconButtonProps) => {
  return (
    <TouchableOpacity 
      className="bg-blue-500 p-4 rounded-r-lg justify-center items-center disabled:opacity-50 active:bg-blue-600"
      {...props}
    >
      <Text className="text-black font-bold text-lg">{text}</Text>
    </TouchableOpacity>
  );
};

export default IconButton;