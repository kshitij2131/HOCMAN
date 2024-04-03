import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';


const ViewComplaintsScreen = () => {
  const [complaints, setComplaints] = useState([]);
  const navigation = useNavigation();

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
    } catch (error) {
      console.error('Error fetching complaints: ', error);
    }
  };

  const handleUpdateStatus = async (complaintId) => {
    try {
      const userId = auth().currentUser.uid;
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
      <Text>Date: {item.createdAt}</Text>
      <Text>Type: {item.type}</Text>
      <Text>Status: {item.status}</Text>
      <TouchableOpacity
        style={styles.updateButton}
        onPress={() => handleUpdateStatus(item.id)}
      >
        <Text style={styles.buttonText}>Update Status</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.viewFullButton}
        onPress={() => handleViewFullComplaint(item)}
      >
        <Text style={styles.buttonText}>View Full Complaint</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
                    Your Complaints
                  </Text>
      <FlatList
        data={complaints}
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
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ViewComplaintsScreen;
