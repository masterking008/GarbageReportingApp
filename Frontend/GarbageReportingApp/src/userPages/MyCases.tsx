import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For JWT token storage
import { useNavigation } from '@react-navigation/native';

const MyCasesScreen = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();


  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');  // Retrieve JWT token from storage
        if (!token) {
          setError('User is not authenticated');
          return;
        }

        // Decode the JWT token to get user info (you can use a library like jwt-decode for this)
        const decodedToken = decodeJWT(token); // Decode the JWT token to get user info
        const userId = decodedToken.user_id; // Assuming user_id is included in the JWT token

        const response = await axios.get('http://192.168.0.200:8000/api/reports/', {
          headers: {
            Authorization: `Bearer ${token}`,  // Send token in the Authorization header
          },
        });

        // Filter the reports for the logged-in user
        const userReports = response.data.filter(report => report.user === userId);

        setReports(userReports);
      } catch (err) {
        setError('Failed to fetch reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Function to decode JWT (you can use a library like jwt-decode for this)
  const decodeJWT = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading your reports...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Render reports
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Reports</Text>
      {reports.length === 0 ? (
        <Text style={styles.noCasesText}>You have no reports yet.</Text>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.ticket_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate("CaseDetails", { caseDetails: item })}
            >
              <Text style={styles.caseNumber}>Case Number {item.case_number}</Text>
              <Text style={styles.ticketId}>Ticket ID: {item.ticket_id}</Text>
              <Text style={styles.stage}>Status: {item.stage}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f7f7f7" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 16 },
  list: { paddingBottom: 16 },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  caseNumber: { fontSize: 18, fontWeight: "bold", color: "#121212", marginBottom: 4 },
  ticketId: { fontSize: 14, fontWeight: "bold", color: "#007BFF", marginBottom: 4 },
  stage: { fontSize: 14, color: "#28a745", fontWeight: "bold" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  noCasesText: { fontSize: 16, color: "#888", textAlign: "center", marginTop: 20 },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 18, color: "red", fontWeight: "bold" },
});

export default MyCasesScreen;
