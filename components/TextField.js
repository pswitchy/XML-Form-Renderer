import React, { useRef } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const TextField = ({ label, value, onChangeText, length = 12 }) => {
  const inputRefs = useRef(Array(length).fill(null));
  
  const handleCharChange = (text, index) => {
    const newValue = value.split('');
    newValue[index] = text;
    
    // Move to next input if character is entered
    if (text.length === 1 && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    
    onChangeText(newValue.join(''));
  };

  const handleKeyPress = (e, index) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Create an array of TextInput fields based on length
  const inputs = Array.from({ length }, (_, index) => {
    return (
      <TextInput
        key={`input-${index}`}
        ref={ref => inputRefs.current[index] = ref}
        style={styles.charInput}
        maxLength={1}
        value={value[index] || ''}
        onChangeText={(text) => handleCharChange(text, index)}
        onKeyPress={(e) => handleKeyPress(e, index)}
        keyboardType="default"
        autoCapitalize="characters"
        selectTextOnFocus={true}
      />
    );
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        {inputs}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 1, // Very small space between inputs
  },
  charInput: {
    width: 30,
    height: 40,
    borderWidth: 1.5, // Slightly thicker border
    borderColor: '#333', // Darker border color
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: '#fff',
  },
});

export default TextField;