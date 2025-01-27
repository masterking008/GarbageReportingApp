import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl, // Import RefreshControl
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API } from "../api/axios";

export default function AdminHomePage() {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState("All");
  const [userZone, setUserZone] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false); // New state for refresh
  const navigation = useNavigation();

  // Function to fetch cases and user zone
  const fetchUserZoneAndCases = async () => {
    try {
      setLoading(true); // Show loader while fetching
      const token = await AsyncStorage.getItem("userToken");
      const userZoneFromStorage = await AsyncStorage.getItem("userZone");
      setUserZone(userZoneFromStorage);

      const response = await API.get("api/reports/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const allCases = response.data;
      const zoneFilteredCases = allCases.filter(
        (caseItem) => caseItem.zone_name === userZoneFromStorage
      );

      setCases(zoneFilteredCases);
      setFilteredCases(zoneFilteredCases); // Show all cases initially
    } catch (error) {
      console.error("Error fetching cases:", error);
      Alert.alert("Error", "Failed to fetch cases or user zone");
    } finally {
      setLoading(false); // Hide loader when done
    }
  };

  // Trigger fetchUserZoneAndCases whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchUserZoneAndCases();
    }, [])
  );

  // Handle filtering by status
  const handleFilter = (stage) => {
    setSelectedStage(stage);
    if (stage === "All") {
      setFilteredCases(cases);
    } else {
      const filtered = cases.filter((caseItem) => caseItem.stage === stage);
      setFilteredCases(filtered);
    }
  };

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchUserZoneAndCases(); // Fetch new data
    setIsRefreshing(false); // End refreshing
  };

  // Render each case item
  const renderCase = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("AdminCaseDetails", { adminCaseDetails: item })
      }
    >
      <Text style={styles.ticketId}>Ticket ID: {item.ticket_id}</Text>
      <Text style={styles.stage}>Status: {item.stage}</Text>
      <Text style={styles.zone}>Zone: {item.zone_name}</Text>
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
        {["All", "Reported", "Work Started", "Resolved"].map((stage) => (
          <TouchableOpacity
            key={stage}
            style={[styles.filterButton, selectedStage === stage && styles.selectedFilterButton]}
            onPress={() => handleFilter(stage)}
          >
            <Text style={[styles.filterButtonText, selectedStage === stage && styles.selectedFilterButtonText]}>
              {stage}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredCases}
        keyExtractor={(item) => item.ticket_id.toString()}
        renderItem={renderCase}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing} // Indicate if refreshing
            onRefresh={handleRefresh} // Handle refresh action
            colors={["#007BFF"]} // Set color for refresh indicator
          />
        }
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
  zone: { fontSize: 14, color: "#6c757d" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  selectedFilterButton: {
    backgroundColor: "#007BFF",
  },
  filterButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedFilterButtonText: {
    color: "#fff",
  },
});
