import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { parseXML } from '../utils/xmlParser';
import TextField from './TextField';
import DateTimeField from './DateTimeField';
import RadioButtons from './RadioButtons';
import DrawingField from './DrawingField';

const FormRenderer = ({ xml }) => {
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!xml) {
      setError('No XML data provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const xmlContent = typeof xml === 'string' ? xml : xml.default;

    parseXML(xmlContent)
      .then((fields) => {
        console.log('Parsed form fields:', fields);
        setFormFields(fields);
        
        // Initialize form data
        const initialData = {};
        fields.forEach(field => {
          switch (field.type) {
            case 'text':
              initialData[field.name] = '';
              break;
            case 'date':
              initialData[field.name] = new Date();
              break;
            case 'radio':
              initialData[field.name] = field.options[0]?.value || '';
              break;
            case 'drawing':
              initialData[field.name] = null;
              break;
          }
        });
        setFormData(initialData);
      })
      .catch((err) => {
        console.error('Form parse error:', err);
        setError(err.message);
        setFormFields([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [xml]);

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderField = (field, index) => {
    // Extract common props excluding 'key'
    const commonProps = {
      label: field.label,
      value: formData[field.name],
    };

    switch (field.type) {
      case 'text':
        return (
          <TextField
            key={`${field.name}-${index}`}
            {...commonProps}
            length={field.length}
            onChangeText={(value) => handleChange(field.name, value)}
          />
        );

      case 'date':
        return (
          <DateTimeField
            key={`${field.name}-${index}`}
            {...commonProps}
            onChange={(date) => handleChange(field.name, date)}
          />
        );

      case 'radio':
        return (
          <RadioButtons
            key={`${field.name}-${index}`}
            {...commonProps}
            options={field.options}
            selectedValue={formData[field.name]}
            onSelect={(value) => handleChange(field.name, value)}
          />
        );

      case 'drawing':
        return (
          <DrawingField
            key={`${field.name}-${index}`}
            {...commonProps}
            onDrawingChange={(drawing) => handleChange(field.name, drawing)}
          />
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <Text>Loading form...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {formFields.length === 0 ? (
          <Text style={styles.noFields}>No form fields found</Text>
        ) : (
          formFields.map((field, index) => renderField(field, index))
        )}
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
    paddingBottom: 32,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
  },
  noFields: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginVertical: 16,
  },
});

export default FormRenderer;