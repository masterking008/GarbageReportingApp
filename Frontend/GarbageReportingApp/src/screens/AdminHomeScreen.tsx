import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AdminHomePage() {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState(null); // Track selected stage filter
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');  // Replace with a valid admin token
        const response = await axios.get(
          "http://192.168.0.200:8000/api/reports/",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token for authentication
            },
          }
        );
        setCases(response.data);
        setFilteredCases(response.data); // Initially show all cases
      } catch (error) {
        console.error("Error fetching cases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const handleFilter = (stage) => {
    setSelectedStage(stage);
    if (stage === "All") {
      setFilteredCases(cases); // Show all cases
    } else {
      const filtered = cases.filter((caseItem) => caseItem.stage === stage);
      setFilteredCases(filtered);
    }
  };

  const renderCase = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("AdminCaseDetails", { adminCaseDetails: item })}
    >
      <Text style={styles.ticketId}>Ticket ID: {item.ticket_id}</Text>
      <Text style={styles.stage}>Status: {item.stage}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading reported cases...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reported Cases</Text>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <Button title="All" onPress={() => handleFilter("All")} />
        <Button title="Reported" onPress={() => handleFilter("stage 1")} />
        <Button title="Working" onPress={() => handleFilter("stage 2")} />
        <Button title="Resolved" onPress={() => handleFilter("stage 3")} />
      </View>

      <FlatList
        data={filteredCases}
        keyExtractor={(item) => item.ticket_id}
        renderItem={renderCase}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f7f7f7" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
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
  ticketId: { fontSize: 16, fontWeight: "bold", color: "#007BFF", marginBottom: 4 },
  stage: { fontSize: 14, color: "#28a745", fontWeight: "bold" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
});
