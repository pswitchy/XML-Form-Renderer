import React, { useState } from 'react';
import { View, Button, TextInput, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import FormRenderer from '../components/FormRenderer';
import { default as importedFormXml } from '../assets/form.xml.js';

const HomeScreen = () => {
  const [xmlInput, setXmlInput] = useState('');
  const [formXml, setFormXml] = useState('');

  const loadFromFile = () => {
    try {
      // Use the imported XML directly
      setFormXml(importedFormXml);
      setXmlInput(''); // Clear input field when loading from file
    } catch (error) {
      console.error('Error loading XML file:', error);
    }
  };

  const loadFromInput = () => {
    if (xmlInput.trim()) {
      setFormXml(xmlInput);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.buttonContainer}>
          <Button 
            title="Load Sample Form" 
            onPress={loadFromFile}
          />
        </View>
        
        <TextInput
          placeholder="Or paste your XML here"
          value={xmlInput}
          onChangeText={setXmlInput}
          multiline
          style={styles.input}
          textAlignVertical="top"
        />
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Render Custom XML" 
            onPress={loadFromInput}
            disabled={!xmlInput.trim()}
          />
        </View>

        {formXml ? (
          <View style={styles.formContainer}>
            <FormRenderer xml={formXml} />
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
  },
  buttonContainer: {
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    minHeight: 100,
    marginVertical: 8,
    padding: 8,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  formContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
});

export default HomeScreen;