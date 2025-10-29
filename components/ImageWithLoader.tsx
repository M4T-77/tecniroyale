import React, { useState } from 'react';
import { View, Image, ActivityIndicator, ImageProps as RNImageProps } from 'react-native';

interface ImageWithLoaderProps extends RNImageProps {
    className?: string;
}

const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({className, ...props}) => {
  const [loading, setLoading] = useState(false);

  return (
    <View className="w-full h-96 justify-center items-center">
      
      <Image
        {...props}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        className={className}
        style={[{opacity: loading ? 0 : 1}, props.style]}
      />
      {loading && (
        <ActivityIndicator
          size="large"
          color="#facc15"
          style={{ position: 'absolute' }}
        />
      )}
    </View>
  );
};

export default ImageWithLoader;
