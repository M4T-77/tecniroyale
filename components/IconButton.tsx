import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

interface IconButtonProps extends TouchableOpacityProps {
  text: string;
}

const IconButton = ({ text, ...props }: IconButtonProps) => {
  return (
    <TouchableOpacity 
      className="bg-yellow-400 p-4 rounded-r-lg justify-center items-center"
      {...props}
    >
      <Text className="text-slate-900 font-bold text-lg">{text}</Text>
    </TouchableOpacity>
  );
};

export default IconButton;
