import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

/**
 * AppButton — reusable button with loading state support.
 *
 * Props:
 *  title       (string)   - button label
 *  onPress     (fn)       - press handler
 *  loading     (bool)     - shows spinner when true, disables presses
 *  variant     (string)   - 'primary' | 'secondary' | 'danger'
 *  disabled    (bool)     - disables the button
 *  style       (object)   - extra container style overrides
 *  textStyle   (object)   - extra text style overrides
 */
const AppButton = ({
  title,
  onPress,
  loading = false,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  const containerStyle = [
    styles.base,
    styles[variant] ?? styles.primary,
    isDisabled && styles.disabled,
    style,
  ];

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primary: {
    backgroundColor: '#4A90D9',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#4A90D9',
  },
  danger: {
    backgroundColor: '#E74C3C',
  },
  disabled: {
    opacity: 0.55,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default AppButton;