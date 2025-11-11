import { Text, TouchableOpacity, TouchableOpacityProps, View } from 'react-native';

interface IconButtonProps extends TouchableOpacityProps {
  text: string;
  variant?: 'default' | 'dragonball';
}

const IconButton = ({ text, variant = 'dragonball', ...props }: IconButtonProps) => {

  if (variant === 'dragonball') {
    return (
      <TouchableOpacity 
        className={`
          relative overflow-hidden active:scale-105 transition-transform duration-200
        `}
        {...props}
      >
        <View 
          className="bg-orange-500 border-y-4 border-r-4 border-orange-400 rounded-r-full shadow-lg shadow-orange-500/50 px-8 py-4 justify-center items-center"
        >
          <Text className="text-white font-black text-xl tracking-wider uppercase">
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Default variant
  return (
    <TouchableOpacity 
      className="bg-black/25 p-4 rounded-r-lg justify-center items-center disabled:opacity-50 active:bg-black/40 border-2 border-l-0 border-white/20"
      {...props}
    >
      <Text className="text-white font-bold text-lg">{text}</Text>
    </TouchableOpacity>
  );
};

export default IconButton;
