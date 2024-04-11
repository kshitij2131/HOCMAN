import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const FullComplaintScreen = ({ route }) => {
  const { complaint } = route.params;

  return (
    <View style={styles.container}>
      <Text>Date: {complaint.createdAt}</Text>
      <Text>Type: {complaint.type}</Text>
      <Text>Location: {complaint.location}</Text>
      <Text>Description: {complaint.description}</Text>
      <Text>Status: {complaint.status}</Text>
      <View style={styles.imageContainer}>
        {complaint.imgDownloadUrl ? (
          <>
            <Text style={styles.label}>Image for the Complaint</Text>
            <Image
              style={{
                width: '100%',
                height: 400
              }}
              source={{ uri: complaint.imgDownloadUrl }}
            />
          </>
        ) : (
          <Text style={styles.label}>No image Uploaded</Text>
        )}
      </View>
    </View>
  );
};

export default FullComplaintScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5
  }
});
