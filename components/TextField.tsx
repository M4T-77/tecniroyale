import { useState } from 'react';
import { TextInput, TextInputProps, View } from 'react-native';

interface TextFieldProps extends TextInputProps {
  variant?: 'default' | 'dragonball';
}

const TextField = ({ variant = 'dragonball', ...props }: TextFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  if (variant === 'dragonball') {
    return (
      <View className={`relative ${isFocused ? 'scale-105' : 'scale-100'} transition-transform duration-200 flex-1`}>
        <TextInput
          className={`
            w-full bg-white/95 backdrop-blur-sm
            border-4 rounded-l-full
            px-6 py-4 text-lg font-bold text-gray-800
            shadow-2xl
            ${isFocused 
              ? 'border-yellow-400 shadow-yellow-400/50' 
              : 'border-orange-400 shadow-orange-400/30'
            }
          `}
          placeholderTextColor="#999"
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
      </View>
    );
  }

  // Default variant
  return (
    <TextInput
      className="flex-1 bg-black/10 border-2 border-white/20 text-white rounded-l-lg p-4 text-lg focus:border-white/40"
      placeholderTextColor="#ccc"
      {...props}
    />
  );
};

export default TextField;
