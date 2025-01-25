import React, { useState, useRef, useEffect, useCallback } from "react";
import { View, Text, Button, StyleSheet, TextInput, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import * as Location from "expo-location";
import { Camera, CameraView } from "expo-camera";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import pointInPolygon from 'point-in-polygon';

export default function ReportProblemScreen(username: string) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [coordinates, setCoordinates] = useState<number[] | null>(null);
  const cameraRef = useRef<CameraView | null>(null);

  const ZONES_API_URL = 'http://192.168.0.200:8000/api/zones/';

  const [zones, setZones] = useState<Zone[]>([]);
  const [zone, setZone] = useState<string | null>(null);


  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await axios.get(ZONES_API_URL);
        setZones(response.data);
      } catch (error) {
        console.error('Error fetching zones:', error);
      }
    };

    fetchZones();
  }, []);


  const determineZone = useCallback(async (latitude: number, longitude: number) => {
    const iitbAreaPolygon = [
      [19.12878878557306, 72.92002852900411],
      [19.124933823043452, 72.91650895942533],
      [19.123675868437882, 72.91170174243969],
      [19.12347297163687, 72.90852554550274],
      [19.135605245074277, 72.9024314258418],
      [19.13852413379344, 72.9127363304844],
      [19.14112095737054, 72.91526843967284],
      [19.138402406686048, 72.91921681332263],
    ];

    let foundZone = null;

    for (const zone of zones) {
      const polygon = zone.coordinates.map((coord) => [coord.latitude, coord.longitude]);
      if (pointInPolygon([latitude, longitude], polygon)) {
        foundZone = zone.name;
        break;
      }
    }

    if (!foundZone) {
      foundZone = pointInPolygon([latitude, longitude], iitbAreaPolygon)
        ? 'Inside IITB Area'
        : 'Outside IITB';
    }

    setZone(foundZone);
  }, [zones]);

  // console.log(zone);


  // Request camera and location permissions
  useEffect(() => {
    const getPermissions = async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();

      setHasPermission(cameraStatus === "granted" && locationStatus === "granted");

      if (locationStatus === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setCoordinates([loc.coords.latitude, loc.coords.longitude]);
        determineZone(loc.coords.latitude, loc.coords.longitude);

      } else {
        Alert.alert("Location permission denied", "Cannot report without location.");
      }
    };

    getPermissions();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhoto(photo.uri);
    }
  };

  const retakePicture = () => {
    setPhoto(null);
  };
  const handleSubmit = async () => {
    if (!photo || !feedback || !coordinates) {
      Alert.alert("Error", "Please provide all required details before submitting.");
      return;
    }


    try {
      const formData = new FormData();
      formData.append("user", username); // Send username as the user
      formData.append("image", {
        uri: photo,
        name: "photo.jpg",
        type: "image/jpeg",
      });
      formData.append("description", feedback);
      formData.append("zone_name", zone || "Unknown"); // Send zone name or "Unknown" if not found
      formData.append("coordinates", JSON.stringify(coordinates)); // Send coordinates as a JSON string
      formData.append("stage", "Reported"); // Initial stage is "Reported"

      // console.log(formData);


      // Get JWT token from storage or context (replace `YOUR_TOKEN` with actual method to fetch token)
      const token = await AsyncStorage.getItem('userToken');
      // console.log("User Token:", token);

      // Send data to the backend with Authorization header
      const response = await axios.post("http://192.168.0.200:8000/api/reports/", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
        },
    });

      if (response.status === 201) {
        Alert.alert("Success", "Your report has been submitted!");
        setPhoto(null);
        setFeedback("");
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong while submitting your report.");
    }
  };


  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting Permissions...</Text></View>;
  }

  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera or location</Text></View>;
  }


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Report a Problem</Text>

        {photo ? (
          <View style={styles.cameraPreview}>
            <Image source={{ uri: photo }} style={styles.previewImage} />
            <Button title="Retake Photo" onPress={retakePicture} color="#FF6347" />
          </View>
        ) : (
          <CameraView style={styles.camera} ref={cameraRef}>
            <View style={styles.cameraControls}>
              <Button title="Take Photo" onPress={takePicture} color="#4682B4" />
            </View>
          </CameraView>
        )}

        <TextInput
          style={styles.input}
          placeholder="Provide feedback..."
          value={feedback}
          onChangeText={setFeedback}
          multiline
          numberOfLines={4}
          placeholderTextColor="#8a8a8a"
        />

        <Button title="Submit" onPress={handleSubmit} color="#32CD32" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f5f5f5" },
  scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center", paddingBottom: 20 },
  header: { fontSize: 28, fontWeight: "bold", color: "#333", marginBottom: 20 },
  camera: { width: "100%", height: 300, backgroundColor: "#000", borderRadius: 15, overflow: "hidden", marginBottom: 20 },
  cameraPreview: { width: "100%", height: 300, justifyContent: "center", alignItems: "center", borderRadius: 15, borderWidth: 2, borderColor: "#ddd", marginBottom: 20 },
  previewImage: { width: "100%", height: "100%", borderRadius: 10 },
  input: { width: "100%", height: 120, borderColor: "#ddd", borderWidth: 1, borderRadius: 8, padding: 15, marginTop: 10, marginBottom: 20, fontSize: 16, backgroundColor: "#fff", color: "#333", textAlignVertical: "top" },
});
