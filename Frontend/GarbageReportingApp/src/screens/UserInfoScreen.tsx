
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const UserInfoScreen = (setUserType) => {
    const navigation = useNavigation();

    const handleLogout = async () => {
        try {
            // Remove the user data from AsyncStorage
            // Remove the user data from AsyncStorage
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userName');
            await AsyncStorage.removeItem('userRole');
            await AsyncStorage.removeItem('userZone');  // Remove the user's zone
            console.log('User logged out successfully');

            setUserType = "login" // This will now work as expected

            // Show a success alert
            Alert.alert('Success', 'You have been logged out');
            // Navigate to the Login screen after logging out
            // navigation.replace('Login');  // Replace with your login screen's name

        } catch (error) {
            console.error('Error logging out:', error);
            Alert.alert('Error', 'Something went wrong while logging out');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>You are logged in!</Text>
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
