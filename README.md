# react-native-liquid-gradients 🌊✨

A premium, GPU-accelerated, zero-dependency fluid animated mesh gradient background library for React Native and Expo (iOS, Android, and Web).

Create stunning, floating "Stripe-like" or "Apple-like" dynamic neon mesh backgrounds with absolute ease. Every single color blob slides, breathes, and morphs in an organic, non-repeating pattern, rendering fluidly at a solid **60FPS** directly on the device hardware thread.

---

## Features

* **GPU Hardware Accelerated**: All movement and scale translations are executed entirely on the native UI driver thread (`useNativeDriver: true`), ensuring zero JS main-thread overhead.
* **100% Zero Native Dependencies**: Requires no native linking, SVG packages, or canvas canvas bindings. Works perfectly out-of-the-box in managed Expo and bare React Native.
* **Completely Adaptive**: Automatically measures its wrapper boundary (`onLayout`) to scale and float blobs proportionally, making it perfect for full-screen backdrops, headers, or smaller card components.
* **Infinite Customization**: Feed any color array, tweak animation velocities, adjust individual opacities, and control blob sizing to build unique UI themes.
* **Pure Platform Independence**: Renders identically on iOS, Android, and Web browsers.

---

## Installation

```bash
npm install react-native-liquid-gradients
```
or with Yarn:
```bash
yarn add react-native-liquid-gradients
```

---

## Usage

### 1. Minimalistic Backdrop

Create a gorgeous neon cyberpunk sunset space behind your screen elements:

```tsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LiquidGradient } from 'react-native-liquid-gradients';

export default function App() {
  return (
    <View style={styles.container}>
      {/* Dynamic background */}
      <LiquidGradient 
        colors={['#C084FC', '#38BDF8', '#F472B6', '#FBBF24']} // purple, cyan, pink, amber
        backgroundColor="#080710" // deep rich dark indigo/black space
        speed={15000} // relaxed slow drift
        opacity={0.4}
      />
      
      {/* Foreground elements */}
      <View style={styles.content}>
        <Text style={styles.title}>Liquid Gradients</Text>
        <Text style={styles.subtitle}>Fluid 60FPS native mesh animations</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 8,
  },
});
```

---

### 2. Perfect synergy with `react-native-glassmorphic` 🔮

Combine this package with your frosted glass component library for a breath-taking Glassmorphic UI:

```tsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LiquidGradient } from 'react-native-liquid-gradients';
import { GlassmorphicCard } from 'react-native-glassmorphic'; // Your custom glassmorphic package!

export default function GlassLoginScreen() {
  return (
    <View style={styles.screen}>
      {/* Liquid background mesh */}
      <LiquidGradient 
        colors={['#F43F5E', '#10B981', '#3B82F6', '#8B5CF6']} // rose, emerald, blue, violet
        backgroundColor="#09090B"
        speed={12000}
      />

      {/* Floating glassmorphic card on top */}
      <GlassmorphicCard 
        intensity={35} 
        tint="light" 
        borderRadius={24}
        style={styles.card}
      >
        <Text style={styles.logo}>Whimo</Text>
        <Text style={styles.welcome}>Welcome to the Future</Text>
        <Text style={styles.details}>Secure account credentials parsed in real-time.</Text>
      </GlassmorphicCard>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    padding: 32,
    width: 340,
    alignItems: 'center',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  welcome: {
    fontSize: 18,
    color: '#F4F4F5',
    fontWeight: '600',
    marginTop: 12,
  },
  details: {
    fontSize: 14,
    color: 'rgba(244, 244, 245, 0.6)',
    textAlign: 'center',
    marginTop: 6,
  },
});
```

---

## Component API Reference

### `LiquidGradient` Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `colors` | `string[]` | `['#C084FC', '#38BDF8', '#F472B6', '#FBBF24']` | Array of hex color strings to assign to floating blobs. |
| `backgroundColor` | `string` | `'#09090B'` | Base background canvas color underneath the blobs. |
| `speed` | `number` | `14000` | Base duration (ms) for anim loop. A higher number is slower and more relaxing. |
| `opacity` | `number` | `0.45` | Translucency level of individual floating color circles ($0.0$ to $1.0$). |
| `blobSize` | `number` | *Auto-Calculated* | Base size (pixels) of the blurred circles. Overridden for custom densities. |
| `style` | `StyleProp<ViewStyle>` | `undefined` | Custom layout overrides for the outer container absolute canvas. |

---

## License

This package is licensed under the MIT License.
