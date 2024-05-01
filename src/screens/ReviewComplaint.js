import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';

const types = ['Select Type', 'AC', 'Fan', 'Tubelight', 'Furniture', 'Watercooler', 'Geyser', 'Construction', 'Equipments', 'Others'];
const statuses = ['Select Status', 'done', 'pending'];

desc_prefix_len = 15;

const ViewComplaintsScreen = () => {
  const navigation = useNavigation();

  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    fromDate: new Date(2024, 3, 1),
    toDate: new Date(),
    type: 'Select Type',
    status: 'Select Status'
  });
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const userId = auth().currentUser.uid;
      const complaintsRef = firestore().collection(`users/${userId}/complaints`);
      const snapshot = await complaintsRef.get();
      const complaintList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComplaints(complaintList);
      applyFilters(complaintList);
    } catch (error) {
      console.error('Error fetching complaints: ', error);
    }
  };

  const handleUpdateStatus = (complaintId) => {
    const userId = auth().currentUser.uid;
    Alert.alert(
      'Confirmation',
      'Do you want to mark this complaint as "done"?',
      [
        {
          text: 'No',
          onPress: () => console.log('Complaint status not updated'),
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => updateComplaintStatus(complaintId, userId) },
      ],
      { cancelable: false }
    );
  };

  const updateComplaintStatus = async (complaintId, userId) => {
    try {
      const complaintRef = firestore().collection(`users/${userId}/complaints`).doc(complaintId);
      await complaintRef.update({ status: 'done' });
      Alert.alert('Success', 'Complaint status updated successfully.');
      fetchComplaints();
    } catch (error) {
      console.error('Error updating status: ', error);
      Alert.alert('Error', 'Failed to update complaint status.');
    }
  };

  const handleViewFullComplaint = (complaint) => {
    navigation.navigate('FullComplaint', { complaint });
  };

  const applyFilters = (data) => {
    let filteredData = [...data];
    if (filterOptions.type !== 'Select Type') {
      filteredData = filteredData.filter(complaint => complaint.type === filterOptions.type);
    }
    if (filterOptions.status !== 'Select Status') {
      filteredData = filteredData.filter(complaint => complaint.status === filterOptions.status);
    }
    filteredData = filteredData.filter(complaint => {
      const complaintDate = new Date(complaint.createdAt);
      return complaintDate >= filterOptions.fromDate && complaintDate <= filterOptions.toDate;
    });
    setFilteredComplaints(filteredData);
  };

  const handleFromDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || filterOptions.fromDate;
    setShowFromDatePicker(false);
    setFilterOptions({ ...filterOptions, fromDate: currentDate });
  };

  const handleToDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || filterOptions.toDate;
    setShowToDatePicker(false);
    setFilterOptions({ ...filterOptions, toDate: currentDate });
  };

const renderItem = ({ item }) => {
  const truncatedDescription = item.description.length > 15
    ? `${item.description.substring(0, 15)}..[${item.description.length} chars]`
    : item.description;

  return (
    <View style={styles.complaintItem}>
      <Text style={styles.text}>Date: {item.createdAt}</Text>
      <Text style={styles.text}>Type: {item.type}</Text>
      <Text style={styles.text}>Description: {truncatedDescription}</Text>
      <Text style={styles.text}>Status: {item.status}</Text>
      <View style={styles.buttonContainer}>
        {item.status !== 'done' ? (
          <TouchableOpacity
            style={[styles.button, styles.updateButton]}
            onPress={() => handleUpdateStatus(item.id)}
          >
            <Text style={styles.buttonText}>Mark as Done</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          style={[styles.button, styles.viewFullButton]}
          onPress={() => handleViewFullComplaint(item)}
        >
          <Text style={styles.buttonText}>View Full Complaint</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Complaints</Text>
      <View style={styles.filtersContainer}>
        <Picker
          style={styles.picker}
          selectedValue={filterOptions.type}
          onValueChange={(value) => setFilterOptions({ ...filterOptions, type: value })}
        >
          {types.map((type, index) => (
            <Picker.Item key={index} label={type} value={type} />
          ))}
        </Picker>

        <Picker
          style={styles.picker}
          selectedValue={filterOptions.status}
          onValueChange={(value) => setFilterOptions({ ...filterOptions, status: value })}
        >
          {statuses.map((status, index) => (
            <Picker.Item key={index} label={status} value={status} />
          ))}
        </Picker>
      </View>

      <Text style={styles.timePeriodText}>Select Time Period</Text>
      <View style={styles.dateContainer}>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowFromDatePicker(true)}
        >
          <Text style={styles.dateText}>{`From: ${filterOptions.fromDate.toLocaleDateString()}`}</Text>
        </TouchableOpacity>
        {showFromDatePicker && (
          <DateTimePicker
            value={filterOptions.fromDate}
            mode="date"
            display="default"
            onChange={handleFromDateChange}
          />
        )}

        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => setShowToDatePicker(true)}
        >
          <Text style={styles.dateText}>{`To: ${filterOptions.toDate.toLocaleDateString()}`}</Text>
        </TouchableOpacity>
        {showToDatePicker && (
          <DateTimePicker
            value={filterOptions.toDate}
            mode="date"
            display="default"
            onChange={handleToDateChange}
          />
        )}
      </View>

      <TouchableOpacity
        style={styles.applyFiltersButton}
        onPress={() => applyFilters(complaints)}
      >
        <Text style={styles.buttonText}>Apply Filter</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredComplaints}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#212121', // Dark background color
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text color
    marginBottom: 20,
    textAlign: 'center',
  },
  filtersContainer: {
    marginBottom: 20,
  },
  picker: {
    backgroundColor: '#424242', // Dark gray background color
    color: '#FFFFFF', // White text color
    borderRadius: 5,
    marginBottom: 10,
  },
  datePickerButton: {
    backgroundColor: '#424242', // Dark gray background color
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  dateContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  timePeriodText: {
    color: '#FFFFFF', // White text color
    marginBottom: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  applyFiltersButton: {
    backgroundColor: '#960067', // Red button color
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    width: '40%',
    marginBottom: 30,
  },
  complaintItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: '#009688', // Blue button color
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  viewFullButton: {
    backgroundColor: '#009688', // Green button color
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF', // White text color
    fontWeight: 'bold',
  },
  text: {
    color: '#FFFFFF', // White text color
  },
  dateText: {
    color: '#FFFFFF', // White text color
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default ViewComplaintsScreen;
