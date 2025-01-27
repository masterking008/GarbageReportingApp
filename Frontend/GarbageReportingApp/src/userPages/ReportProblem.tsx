import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import * as Location from "expo-location";
import { Camera, CameraView } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import pointInPolygon from "point-in-polygon";
import { API } from "../api/axios";
import { useNavigation } from "@react-navigation/native";

export default function ReportProblemScreen({ username }) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [coordinates, setCoordinates] = useState<number[] | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [zone, setZone] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  const navigation = useNavigation();
  // Fetch zones when the component mounts
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const response = await API.get("/api/zones/");
        setZones(response.data);
      } catch (error) {
        console.error("Error fetching zones:", error);
      }
    };

    fetchZones();
  }, []);

  // Determine the user's zone when zones and coordinates are available
  useEffect(() => {
    const determineUserZone = async () => {
      if (zones.length > 0 && coordinates) {
        const [latitude, longitude] = coordinates;

        let foundZone = null;

        for (const zone of zones) {
          const polygon = zone.coordinates.map((coord) => [coord.latitude, coord.longitude]);
          if (pointInPolygon([latitude, longitude], polygon)) {
            foundZone = zone.name;
            break;
          }
        }

        if (!foundZone) {
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

          foundZone = pointInPolygon([latitude, longitude], iitbAreaPolygon)
            ? "Inside IITB Area"
            : "Outside IITB";
        }

        setZone(foundZone);
      }
    };

    determineUserZone();
  }, [zones, coordinates]);

  // Request permissions and get location
  useEffect(() => {
    const getPermissionsAndLocation = async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();

      setHasPermission(cameraStatus === "granted" && locationStatus === "granted");

      if (locationStatus === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setCoordinates([loc.coords.latitude, loc.coords.longitude]);
      } else {
        Alert.alert("Location permission denied", "Cannot report without location.");
      }
    };

    getPermissionsAndLocation();
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
    if (zones.length === 0) {
      Alert.alert("Zones Data Loading", "Please wait while we load the zones data. Try again shortly.");
      return;
    }

    if (!photo || !feedback || !coordinates || !zone) {
      Alert.alert("Error", "Please provide all required details before submitting.");
      return;
    }

    setIsSubmitting(true);

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

      const token = await AsyncStorage.getItem("userToken");

      const response = await API.post("/api/reports/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        Alert.alert("Success", "Your report has been submitted!");
        setPhoto(null);
        setFeedback("");
        navigation.navigate("MyCases" as never); // Navigate to the MyCasesScreen
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong while submitting your report.");
    } finally {
      setIsSubmitting(false);
    }
  };



  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting Permissions...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera or location</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="position" enabled keyboardVerticalOffset={80}
    >

      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}>Report a Problem</Text>

          {/* Camera */}
          {photo ? (
            <>
              <View style={styles.cameraPreview}>
                <Image source={{ uri: photo }} style={styles.previewImage} />
              </View>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={retakePicture}
              >
                <Text style={styles.captureButtonText}>Retake Photo</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <CameraView style={styles.camera} ref={cameraRef} />
              <TouchableOpacity
                style={styles.captureButton}
                onPress={takePicture}
              >
                <Text style={styles.captureButtonText}>Capture Photo</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Comment Input */}
          <TextInput
            style={styles.input}
            placeholder="Provide feedback..."
            value={feedback}
            onChangeText={setFeedback}
            multiline
            numberOfLines={4}
            placeholderTextColor="#8a8a8a"
          />

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              zones.length === 0 || isSubmitting ? { backgroundColor: "#ccc" } : {},
            ]}
            onPress={handleSubmit}
            disabled={zones.length === 0 || isSubmitting}
          >
            {isSubmitting || zones.length === 0 ? (
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: "#333",
    marginBottom: 12,
  },
  camera: {
    width: "80%",
    aspectRatio: 3 / 4,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16
  },

  cameraPreview: {
    width: "80%",
    aspectRatio: 3 / 4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 13,
    borderWidth: 3,
    borderColor: "#28a745",
    marginBottom: 20,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  captureButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  captureButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 120,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
    textAlignVertical: "top",
  },
  submitButton: {
    width: "100%",
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
