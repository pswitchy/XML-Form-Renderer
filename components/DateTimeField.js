import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const DateTimeField = ({ label, value, onChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value || new Date());

  const formatDate = (date) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDateSelect = (amount, unit) => {
    const newDate = new Date(selectedDate);
    switch (unit) {
      case 'day':
        newDate.setDate(newDate.getDate() + amount);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + amount);
        break;
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + amount);
        break;
    }
    setSelectedDate(newDate);
  };

  const handleConfirm = () => {
    onChange(selectedDate);
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.dateText}>{formatDate(value)}</Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.dateDisplay}>{formatDate(selectedDate)}</Text>
            
            <View style={styles.controlRow}>
              <View style={styles.controlGroup}>
                <TouchableOpacity onPress={() => handleDateSelect(1, 'day')} style={styles.controlButton}>
                  <Text>+</Text>
                </TouchableOpacity>
                <Text style={styles.controlLabel}>Day</Text>
                <TouchableOpacity onPress={() => handleDateSelect(-1, 'day')} style={styles.controlButton}>
                  <Text>-</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.controlGroup}>
                <TouchableOpacity onPress={() => handleDateSelect(1, 'month')} style={styles.controlButton}>
                  <Text>+</Text>
                </TouchableOpacity>
                <Text style={styles.controlLabel}>Month</Text>
                <TouchableOpacity onPress={() => handleDateSelect(-1, 'month')} style={styles.controlButton}>
                  <Text>-</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.controlGroup}>
                <TouchableOpacity onPress={() => handleDateSelect(1, 'year')} style={styles.controlButton}>
                  <Text>+</Text>
                </TouchableOpacity>
                <Text style={styles.controlLabel}>Year</Text>
                <TouchableOpacity onPress={() => handleDateSelect(-1, 'year')} style={styles.controlButton}>
                  <Text>-</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.confirmButton]} 
                onPress={handleConfirm}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Arial',
    color: '#000',
    marginBottom: 5,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    borderRadius: 4,
    width: 150,
  },
  dateText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  dateDisplay: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  controlGroup: {
    alignItems: 'center',
  },
  controlButton: {
    width: 40,
    height: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 5,
  },
  controlLabel: {
    fontSize: 14,
    marginVertical: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
  },
  cancelButton: {
    backgroundColor: '#ff4444',
  },
  confirmButton: {
    backgroundColor: '#44ff44',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default DateTimeField;