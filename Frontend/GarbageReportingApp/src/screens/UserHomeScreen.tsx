import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

export default function UserHomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Dashboard</Text>
   
      {/* My Cases Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("MyCases")}
      >
        <MaterialIcons name="folder" size={24} color="#fff" />
        <Text style={styles.buttonText}>View My Cases</Text>
      </TouchableOpacity>

      {/* Report a Problem Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("ReportProblem")}
      >
        <FontAwesome name="exclamation-circle" size={24} color="#fff" />
        <Text style={styles.buttonText}>Report a Problem</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
