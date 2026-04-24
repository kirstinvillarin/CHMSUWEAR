import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * AppInput — reusable input field with label, error message, and password toggle.
 *
 * Props:
 *  label         (string)   - field label shown above the input
 *  value         (string)   - controlled value
 *  onChangeText  (fn)       - change handler
 *  error         (string)   - inline error message (shown in red below input)
 *  secureEntry   (bool)     - renders as a password field with show/hide toggle
 *  placeholder   (string)
 *  keyboardType  (string)
 *  autoCapitalize(string)
 *  style         (object)   - extra container styles
 */
const AppInput = ({
  label,
  value,
  onChangeText,
  error,
  secureEntry = false,
  placeholder = '',
  keyboardType = 'default',
  autoCapitalize = 'none',
  style,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={[styles.wrapper, style]}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputRow, !!error && styles.inputError]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          secureTextEntry={secureEntry && !visible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
        />
        {secureEntry && (
          <TouchableOpacity onPress={() => setVisible(v => !v)} style={styles.eyeBtn}>
            <Text style={styles.eyeText}>{visible ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fafafa',
    paddingHorizontal: 14,
  },
  inputError: {
    borderColor: '#E74C3C',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: '#222',
  },
  eyeBtn: {
    padding: 4,
  },
  eyeText: {
    fontSize: 18,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: '#E74C3C',
  },
});

export default AppInput;