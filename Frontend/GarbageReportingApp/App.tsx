import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AppNavigator from "./src/navigation/AppNavigator";
import { StatusBar } from "expo-status-bar";
import { Platform, SafeAreaView, StyleSheet } from "react-native";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        {/* <SafeAreaView style={styles.safeArea}> */}
          <AppNavigator />
        {/* </SafeAreaView> */}
        {/* Properly configure StatusBar */}
        <StatusBar
          style={Platform.OS === "ios" ? "dark" : "light"} // Handle iOS/Android styles
          backgroundColor="#fff" // Background color for Android
          // translucent={true} // Allow content to appear under the status bar
        />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff", // Matches your app background to avoid flashes
  },
});
