import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import DateTimePicker from '@react-native-community/datetimepicker';

const types = ['Select Type', 'AC', 'Fan', 'Tubelight', 'Furniture', 'Watercooler', 'Geyser', 'Construction', 'Equipments', 'Others'];
const statuses = ['Select Status', 'done', 'pending'];

const ViewComplaintsScreen = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [filterOptions, setFilterOptions] = useState({ type: 'Select Type', status: 'Select Status' });
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [rollNoFilter, setRollNoFilter] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const adminId = auth().currentUser.uid;
      const adminRef = firestore().collection('admins').doc(adminId);
      const adminDoc = await adminRef.get();
      const adminData = adminDoc.data();
      const hostel = adminData.hostel;
      const allComplaints = [];

      const usersRef = firestore().collection('users').where('hostelName', '==', hostel);
      usersRef.get().then(querySnapshot => {
        const userPromises = [];
        querySnapshot.forEach(userDoc => {
          const userId = userDoc.id;
          const complaintsRef = firestore().collection(`users/${userId}/complaints`);
          const userPromise = complaintsRef.get().then(complaintsSnapshot => {
            const userComplaints = complaintsSnapshot.docs.map(doc => {
              const complaintData = doc.data();
              return {
                id: doc.id,
                ...complaintData,
                complaintUserId: userId,
                userName: userDoc.data().name,
                userRollNo: userDoc.data().rollNo,
              };
            });
            allComplaints.push(...userComplaints);
          });
          userPromises.push(userPromise);
        });

        Promise.all(userPromises).then(() => {
          setComplaints(allComplaints);
          applyFilters(allComplaints);
        });
      }).catch(error => {
        console.error('Error fetching users: ', error);
      });

    } catch (error) {
      console.error('Error fetching complaints: ', error);
    }
  };

  const handleUpdateStatus = (complaintId, userId) => {
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

  const renderItem = ({ item }) => (
    <View style={styles.complaintItem}>
      <Text style={styles.complaintText}>Name: {item.userName}</Text>
      <Text style={styles.complaintText}>Roll No: {item.userRollNo}</Text>
      <Text style={styles.complaintText}>Date: {item.createdAt}</Text>
      <Text style={styles.complaintText}>Type: {item.type}</Text>
      <Text style={styles.complaintText}>Status: {item.status}</Text>
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

  const applyFilters = (data) => {
    let filteredData = [...data];
    if (filterOptions.type !== 'Select Type') {
      filteredData = filteredData.filter(complaint => complaint.type === filterOptions.type);
    }
    if (filterOptions.status !== 'Select Status') {
      filteredData = filteredData.filter(complaint => complaint.status === filterOptions.status);
    }
    if (rollNoFilter !== '') {
      filteredData = filteredData.filter(complaint => complaint.userRollNo.toLowerCase() === rollNoFilter.toLowerCase());
    }
    setFilteredComplaints(filteredData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Complaints from Your Hostel</Text>
      <View style={styles.filterContainer}>
        <Picker
          style={[styles.picker, {color: '#FFFFFF'}]} // Set color to white
          selectedValue={filterOptions.type}
          onValueChange={(value) => setFilterOptions({ ...filterOptions, type: value })}
        >
          {types.map((type, index) => (
            <Picker.Item key={index} label={type} value={type} />
          ))}
        </Picker>
        <Picker
          style={[styles.picker, {color: '#FFFFFF'}]} // Set color to white
          selectedValue={filterOptions.status}
          onValueChange={(value) => setFilterOptions({ ...filterOptions, status: value })}
        >
          {statuses.map((status, index) => (
            <Picker.Item key={index} label={status} value={status} />
          ))}
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Enter Roll Number"
          placeholderTextColor="#FFFFFF"
          value={rollNoFilter}
          onChangeText={(value) => setRollNoFilter(value)}
        />

        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => applyFilters(complaints)}
        >
          <Text style={styles.buttonText}>Apply Filter</Text>
        </TouchableOpacity>
      </View>
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
    backgroundColor: '#212121',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  picker: {
    backgroundColor: '#424242',
    color: '#FFFFFF',
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },
  input: {
    backgroundColor: '#424242',
    color: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '100%',
  },
  applyButton: {
    backgroundColor: '#960067',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '50%',
  },
  complaintItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  complaintText: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  updateButton: {
    backgroundColor: '#009688',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    flex: 1,
    marginRight: 5,
  },
  viewFullButton: {
    backgroundColor: '#009688',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default ViewComplaintsScreen;
