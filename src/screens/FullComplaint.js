import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const FullComplaintScreen = ({ route }) => {
  const { complaint } = route.params;
//  console.log(complaint.imgDownloadUrl);


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Complaint Info</Text>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.text}>{complaint.createdAt}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Type:</Text>
          <Text style={styles.text}>{complaint.type}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.text}>{complaint.location}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.text}>{complaint.description}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.text}>{complaint.status}</Text>
        </View>
      </View>
      <View style={styles.imageContainer}>
        {complaint.imgDownloadUrl ? (
          <>
            <Text style={styles.label}>Image for the Complaint</Text>
            <Image
              style={styles.image}
              source={{ uri: complaint.imgDownloadUrl }}
              resizeMode="contain" // Adjusted to show the entire image
            />
          </>
        ) : (
          <Text style={styles.label}>No image uploaded</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121', // Dark background color
    padding: 20,
    justifyContent: 'center', // Center content vertically
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text color
    marginBottom: 20,
    textAlign: 'center', // Center text horizontally
  },
  content: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text color
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: '#FFFFFF', // White text color
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
  },
  image: {
    width: '100%', // Full width of the container
    height: 300, // Set a fixed height
    resizeMode: 'contain',
    borderRadius: 10,
    marginTop: 10,
  },
});

export default FullComplaintScreen;



//import React from 'react';
//import { View, Text, StyleSheet, Image } from 'react-native';
//
//const FullComplaintScreen = ({ route }) => {
//  const { complaint } = route.params;
//
//  return (
//    <View style={styles.container}>
//      <Text>Date: {complaint.createdAt}</Text>
//      <Text>Type: {complaint.type}</Text>
//      <Text>Location: {complaint.location}</Text>
//      <Text>Description: {complaint.description}</Text>
//      <Text>Status: {complaint.status}</Text>
//      <View style={styles.imageContainer}>
//        {complaint.imgDownloadUrl ? (
//          <>
//            <Text style={styles.label}>Image for the Complaint</Text>
//            <Image
//              style={{
//                width: '100%',
//                height: 400
//              }}
//              source={{ uri: complaint.imgDownloadUrl }}
//            />
//          </>
//        ) : (
//          <Text style={styles.label}>No image Uploaded</Text>
//        )}
//      </View>
//    </View>
//  );
//};
//
//export default FullComplaintScreen;
//
//const styles = StyleSheet.create({
//  container: {
//    flex: 1,
//    width: '100%',
//    justifyContent: 'center',
//    alignItems: 'center',
//  },
//  imageContainer: {
//    width: '100%',
//    paddingHorizontal: 16,
//    justifyContent: 'center',
//    alignItems: 'center'
//  },
//  label: {
//    fontSize: 20,
//    fontWeight: 'bold',
//    marginTop: 5
//  }
//});
