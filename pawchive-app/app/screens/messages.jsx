import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessagesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      <Text>No new messages at the moment.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default MessagesScreen;