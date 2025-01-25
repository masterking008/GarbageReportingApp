import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function UserHomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the User Home Page!</Text>
      <Button
        title="My Cases"
        onPress={() => navigation.navigate("MyCases")}
      />
      <Button
        title="Report a Problem"
        onPress={() => navigation.navigate("ReportProblem")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 20, marginBottom: 20 },
});
