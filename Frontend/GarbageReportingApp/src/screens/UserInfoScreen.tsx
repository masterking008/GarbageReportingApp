import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const UserInfoScreen = ({ setUserType }) => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      // Clear user type
      setUserType(null);

      // Remove user data from AsyncStorage
      await AsyncStorage.multiRemove([
        'userToken',
        'userName',
        'userRole',
        'userZone',
      ]);

      // Navigate to the Login screen
      navigation.navigate('Login');

      // Optional: Alert after navigation
      Alert.alert('Success', 'You have been logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Something went wrong while logging out');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You are logged in as Reporter!</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    padding: 15,
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default UserInfoScreen;
