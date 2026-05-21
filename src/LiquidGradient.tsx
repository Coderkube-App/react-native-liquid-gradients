import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, StyleSheet, Image, LayoutChangeEvent, StyleProp, ViewStyle, Easing } from 'react-native';
import { GRADIENT_BLOB } from './assets';

export interface LiquidGradientProps {
  colors?: string[];
  backgroundColor?: string;
  speed?: number; // base duration in ms for floating animations (higher = slower, more relaxing)
  style?: StyleProp<ViewStyle>;
  blobSize?: number; // custom base size of individual blurred blobs (otherwise automatically scaled)
  opacity?: number; // opacity of the overlay blobs (0 to 1)
}

export const LiquidGradient: React.FC<LiquidGradientProps> = ({
  colors = ['#C084FC', '#38BDF8', '#F472B6', '#FBBF24'], // purple, cyan, pink, amber (cyberpunk neon sunset theme)
  backgroundColor = '#09090B', // zinc-950 (deep matte space background)
  speed = 14000,
  style,
  blobSize,
  opacity = 0.45,
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  };

  const finalBlobSize = blobSize || Math.max(dimensions.width || 300, dimensions.height || 600) * 0.8;

  // Store the animated values in a mutable ref to preserve them across re-renders
  const animsRef = useRef<{
    x: Animated.Value;
    y: Animated.Value;
    scale: Animated.Value;
  }[]>([]);

  // Dynamically initialize the X, Y, and Scale animations for each color blob
  if (animsRef.current.length !== colors.length && dimensions.width > 0 && dimensions.height > 0) {
    animsRef.current = colors.map((_, index) => {
      // Distribute blobs evenly in a loose circular cluster on start to prevent stacking in the corner
      const angle = (index / colors.length) * Math.PI * 2;
      const radiusX = dimensions.width * 0.2;
      const radiusY = dimensions.height * 0.2;
      const initX = Math.cos(angle) * radiusX + (dimensions.width * 0.3);
      const initY = Math.sin(angle) * radiusY + (dimensions.height * 0.3);
      return {
        x: new Animated.Value(initX),
        y: new Animated.Value(initY),
        scale: new Animated.Value(0.9 + Math.random() * 0.4),
      };
    });
  }

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const activeAnimations: Animated.CompositeAnimation[] = [];

    animsRef.current.forEach((anim, index) => {
      // Establish movement boundaries so the blobs stay close to the viewport
      const xRange: [number, number] = [-finalBlobSize * 0.4, dimensions.width - finalBlobSize * 0.4];
      const yRange: [number, number] = [-finalBlobSize * 0.4, dimensions.height - finalBlobSize * 0.4];
      
      const animateAxis = (
        val: Animated.Value,
        range: [number, number],
        baseDuration: number
      ) => {
        const target = Math.random() * (range[1] - range[0]) + range[0];
        // Add random variations to duration to keep the fluid motion organic and unique
        const duration = baseDuration * (0.8 + Math.random() * 0.45);

        const activeAnim = Animated.timing(val, {
          toValue: target,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        });

        activeAnimations.push(activeAnim);

        activeAnim.start(() => {
          // Recursively launch next floating coordinate if the element is still valid
          if (animsRef.current[index]) {
            animateAxis(val, range, baseDuration);
          }
        });
      };

      const animateScale = (val: Animated.Value, baseDuration: number) => {
        const target = 0.8 + Math.random() * 1.4; // breathing scaling from 0.8x to 2.2x
        const duration = baseDuration * 1.4 * (0.85 + Math.random() * 0.3);

        const activeAnim = Animated.timing(val, {
          toValue: target,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        });

        activeAnimations.push(activeAnim);

        activeAnim.start(() => {
          if (animsRef.current[index]) {
            animateScale(val, baseDuration);
          }
        });
      };

      animateAxis(anim.x, xRange, speed);
      animateAxis(anim.y, yRange, speed);
      animateScale(anim.scale, speed);
    });

    return () => {
      // Safely cancel all active animation cycles on unmount or layout updates
      activeAnimations.forEach((anim) => anim.stop());
    };
  }, [dimensions, colors, speed, finalBlobSize]);

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.container,
        { backgroundColor },
        style,
      ]}
    >
      {dimensions.width > 0 &&
        dimensions.height > 0 &&
        colors.map((color, index) => {
          const anim = animsRef.current[index];
          if (!anim) return null;

          return (
            <Animated.View
              key={`${color}-${index}`}
              style={[
                styles.blobContainer,
                {
                  width: finalBlobSize,
                  height: finalBlobSize,
                  opacity,
                  transform: [
                    { translateX: anim.x },
                    { translateY: anim.y },
                    { scale: anim.scale },
                  ],
                },
              ]}
            >
              <Image
                source={{ uri: GRADIENT_BLOB }}
                style={[styles.blobImage, { tintColor: color }]}
                resizeMode="contain"
              />
            </Animated.View>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  blobContainer: {
    position: 'absolute',
  },
  blobImage: {
    width: '100%',
    height: '100%',
  },
});
