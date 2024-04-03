import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const FullComplaintScreen = ({ route }) => {
  const { complaint } = route.params;
  console.log(complaint.imgDownloadUrl);
  const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==';


  return (
    <View style={styles.container}>
      <Text>Date: {complaint.createdAt}</Text>
      <Text>Type: {complaint.type}</Text>
      <Text>Location: {complaint.location}</Text>
      <Text>Description: {complaint.description}</Text>
      <Text>Status: {complaint.status}</Text>

     <Image
       source={{ uri: base64Image }}

       onError={(error) => console.log('Image error:', error)}
     />

     </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default FullComplaintScreen;
