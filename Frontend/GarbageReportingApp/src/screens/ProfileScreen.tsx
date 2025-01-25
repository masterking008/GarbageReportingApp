import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Name: John Doe</Text>
      <Text style={styles.text}>Email: john.doe@example.com</Text>
      <Button
        title="Logout"
        onPress={() => {
          // Assuming you want to clear user data here (e.g. AsyncStorage)
          // and navigate to Login
          navigation.replace("Login");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 18, marginBottom: 10 },
});
