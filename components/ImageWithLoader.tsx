import React, { useState } from 'react';
import { View, Image, ActivityIndicator, ImageProps as RNImageProps, StyleProp, ViewStyle } from 'react-native';

interface ImageWithLoaderProps extends RNImageProps {
    containerClassName?: string;
    containerStyle?: StyleProp<ViewStyle>;
}

const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({ containerClassName, containerStyle, style, ...props }) => {
  const [loading, setLoading] = useState(false);

  return (
    <View style={containerStyle} className={`${containerClassName} justify-center items-center`}>
      <Image
        {...props}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        style={[{ opacity: loading ? 0 : 1, width: '100%', height: '100%' }, style]}
      />
      {loading && (
        <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center">
          <ActivityIndicator size="large" color="#facc15" />
        </View>
      )}
    </View>
  );
};

export default ImageWithLoader;
