import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";


export default function AdminadminCaseDetailsScreen({ route }) {
  const { adminCaseDetails } = route.params;
  const [onWork, setOnWork] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coordinates, setCoordinates] = useState<number[] | null>(null);

  useEffect(() => {
    const getPermissions = async () => {
      // const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();

      // setHasPermission(cameraStatus === "granted" && locationStatus === "granted");

      if (locationStatus === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setCoordinates([loc.coords.latitude, loc.coords.longitude]);

      } else {
        Alert.alert("Location permission denied", "Cannot report without location.");
      }
    };

    getPermissions();
  }, []);


  const handleCapture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setPhoto(photo.uri);
    }
  };

  const handleSubmit = async () => {
    if (!comment && !photo) {
      alert("Please provide a comment or capture a photo.");
      return;
    }

    try {
      setIsSubmitting(true); // Start loading indicator

      const token = await AsyncStorage.getItem("userToken"); // Retrieve JWT token from storage

      const formData = new FormData();
      formData.append("ticket_id", adminCaseDetails.ticket_id); // Include the ticket ID
      if (coordinates) formData.append("resolved_coordinates", JSON.stringify(coordinates)); // Send coordinates as a JSON string
      if (comment) formData.append("comment", comment); // Add comment if available
      if (photo) {
        formData.append("resolved_image", {
          uri: photo,
          type: "image/jpeg",
          name: "resolved_image.jpg",
        }); // Add photo if available
      }

      console.log(formData);

      const response = await fetch("http://192.168.0.200:8000/api/update-case", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        alert("Case updated successfully!");
        console.log("Response data:", responseData);

        // Reset state after submission
        setComment("");
        setPhoto(null);
      } else {
        const errorData = await response.json();
        console.error("Error updating case:", errorData);
        alert("Failed to update the case. Please try again.");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert("An error occurred while updating the case.");
    } finally {
      setIsSubmitting(false); // Stop loading indicator
    }
  };


  const handleStartWork = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');  // Retrieve JWT token from storage
      const response = await fetch("http://192.168.0.200:8000/api/start-work", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticket_id: adminCaseDetails.ticket_id,
        }),
      });

      if (response.ok) {
        alert("Work started successfully!");
        setOnWork(true); // Switch to the "onWork" state
      } else {
        const errorData = await response.json();
        console.error("Error starting work:", errorData);
        alert("Failed to start work. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while starting work.");
    }
  };


  if (onWork) {
    // Work-in-progress view
    return (

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView style={styles.container}>
            <Text style={styles.title}>Update Case</Text>

            {/* Camera */}
            <CameraView style={styles.camera} ref={(ref) => setCameraRef(ref)} />

            <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
              <Text style={styles.captureButtonText}>Capture Photo</Text>
            </TouchableOpacity>

            {photo && (
              <Image source={{ uri: photo }} style={styles.previewImage} />
            )}

            {/* Comment Input */}
            <TextInput
              style={styles.input}
              placeholder="Add your comments here..."
              value={comment}
              onChangeText={setComment}
              multiline
            />

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Submit</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }

  // Default case details view
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Case Details</Text>

      <Text style={styles.detail}>
        <Text style={styles.label}>Status: </Text>
        {adminCaseDetails.stage}
      </Text>
      {adminCaseDetails.resolved_image && (
        <View>
          <Text>Resolved Image</Text>
          <Image source={{ uri: adminCaseDetails.resolved_image }} style={styles.image} />
        </View>
      )}
      {adminCaseDetails.image && (
        <Image source={{ uri: adminCaseDetails.image }} style={styles.image} />
      )}

      <View style={styles.detailsContainer}>
        <Text style={styles.detail}>
          <Text style={styles.label}>Ticket ID: </Text>
          {adminCaseDetails.ticket_id}
        </Text>

        <Text style={styles.detail}>
          <Text style={styles.label}>Description: </Text>
          {adminCaseDetails.description}
        </Text>

        <Text style={styles.detail}>
          <Text style={styles.label}>Coordinates: </Text>
          {adminCaseDetails.coordinates
            ? adminCaseDetails.coordinates.join(", ")
            : "N/A"}
        </Text>

        {adminCaseDetails.resolved_coordinates && (
          <Text style={styles.detail}>
            <Text style={styles.label}>Resolved Coordinates: </Text>
            {adminCaseDetails.resolved_coordinates}
          </Text>
        )}


        <Text style={styles.detail}>
          <Text style={styles.label}>Reported At: </Text>
          {new Date(adminCaseDetails.reported_at).toLocaleString()}
        </Text>
      </View>

      {/* Start Working Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartWork} // Use the new function
        >
          <Text style={styles.startButtonText}>Start Working</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  title: { fontSize: 28, fontWeight: "700", textAlign: "center", marginBottom: 20, color: "#333" },
  detailsContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  detail: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 24,
    color: "#555",
  },
  label: {
    fontWeight: "600",
    color: "#333",
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    resizeMode: "cover",
    marginBottom: 16,
  },
  buttonContainer: { marginTop: 20 },
  startButton: {
    backgroundColor: "#007BFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  startButtonText: { color: "#fff", fontWeight: "bold" },
  camera: { height: 300, borderRadius: 8, overflow: "hidden", marginBottom: 16 },
  captureButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  captureButtonText: { color: "#fff", fontWeight: "bold" },
  input: {
    height: 100,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: { color: "#fff", fontWeight: "bold" },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    resizeMode: "cover",
    marginBottom: 16,
  },
});
