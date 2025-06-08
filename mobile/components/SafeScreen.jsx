import { View } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors.js';

/**
 * SafeScreen wraps children with safe area and background color.
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export default function SafeScreen({ children }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ paddingTop: insets.top, flex: 1, backgroundColor: COLORS.background }}>
      {children}
    </View>
  );
}