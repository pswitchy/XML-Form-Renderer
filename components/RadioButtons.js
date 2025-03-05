// File Location: XMLFormRenderer/components/RadioButtons.js
// Component to render radio buttons for single-selection options.
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RadioButtons = ({ label, options, selectedValue, onSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.optionsContainer}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={`${option.value}-${index}`}
            style={styles.optionRow}
            onPress={() => onSelect(option.value)}
          >
            <View style={styles.radioOuter}>
              {selectedValue === option.value && (
                <View style={styles.radioInner} />
              )}
            </View>
            <Text style={styles.optionLabel}>{option.label}</Text>
          </TouchableOpacity>
        ))}
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
  },
  optionsContainer: {
    marginLeft: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000',
  },
  optionLabel: {
    fontSize: 16,
    color: '#000',
  },
});

export default RadioButtons;