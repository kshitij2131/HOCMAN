import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const types = ['AC', 'Fan', 'Tubelight', 'Furniture', 'Watercooler', 'Geyser', 'Construction', 'Equipments', 'Others', 'None'];
const statuses = ['done', 'pending', 'None'];

const ViewComplaintsScreen = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [filterOptions, setFilterOptions] = useState({ type: 'None', status: 'None' });
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
      <Text>Name: {item.userName}</Text>
      <Text>Roll No: {item.userRollNo}</Text>
      <Text>Date: {item.createdAt}</Text>
      <Text>Type: {item.type}</Text>
      <Text>Status: {item.status}</Text>
      {item.status !== 'done' ? (
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => handleUpdateStatus(item.id, item.complaintUserId)}
            >
              <Text style={styles.buttonText}>Mark as Done</Text>
            </TouchableOpacity>
          ) : null}
      <TouchableOpacity
        style={styles.viewFullButton}
        onPress={() => handleViewFullComplaint(item)}
      >
        <Text style={styles.buttonText}>View Full Complaint</Text>
      </TouchableOpacity>
    </View>
  );

  const applyFilters = (data) => {
    let filteredData = [...data];
    if (filterOptions.type !== 'None') {
      filteredData = filteredData.filter(complaint => complaint.type === filterOptions.type);
    }
    if (filterOptions.status !== 'None') {
      filteredData = filteredData.filter(complaint => complaint.status === filterOptions.status);
    }
    if (rollNoFilter !== '') {
      filteredData = filteredData.filter(complaint => complaint.userRollNo.toLowerCase() === rollNoFilter.toLowerCase());
    }
    setFilteredComplaints(filteredData);
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Complaints from Your Hostel
      </Text>
      <View style={{ marginBottom: 20 }}>
        {/* Type Filter */}
        <Picker
          style={styles.inputBox}
          selectedValue={filterOptions.type}
          onValueChange={(value) => setFilterOptions({ ...filterOptions, type: value })}
        >
          {types.map((type, index) => (
            <Picker.Item key={index} label={type} value={type} />
          ))}
        </Picker>

        {/* Status Filter */}
        <Picker
          style={styles.inputBox}
          selectedValue={filterOptions.status}
          onValueChange={(value) => setFilterOptions({ ...filterOptions, status: value })}
        >
          {statuses.map((status, index) => (
            <Picker.Item key={index} label={status} value={status} />
          ))}
        </Picker>

        {/* Roll No Filter */}
        <TextInput
          style={styles.inputBox}
          placeholder="Enter Roll No"
          value={rollNoFilter}
          onChangeText={(value) => setRollNoFilter(value)}
        />

        <TouchableOpacity
          style={styles.applyFiltersButton}
          onPress={() => applyFilters(complaints)}
        >
          <Text style={styles.buttonText}>Apply filter</Text>
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
    padding: 20,
  },
  complaintItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  viewFullButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  applyFiltersButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default ViewComplaintsScreen;
