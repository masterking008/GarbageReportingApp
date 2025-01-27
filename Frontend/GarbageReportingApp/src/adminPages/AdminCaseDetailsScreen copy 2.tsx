// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   Keyboard,
//   TouchableWithoutFeedback,
//   Alert,
// } from "react-native";
// import { Camera, CameraView } from "expo-camera"; // Change from CameraView to Camera
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as Location from "expo-location";
// import { API } from "../api/axios";

// export default function AdminadminCaseDetailsScreen({ route }) {
//   // const { adminCaseDetails } = route.params;
//   const [cameraPermission, setCameraPermission] = useState(false);
//   const [locationPermission, setLocationPermission] = useState(false);
//   const [cameraRef, setCameraRef] = useState(null);
//   const [photo, setPhoto] = useState(null);
//   const [comment, setComment] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [coordinates, setCoordinates] = useState<number[] | null>(null);

//   const [adminCaseDetails, setAdminCaseDetails] = useState(route.params.adminCaseDetails);

//   useEffect(() => {
//     const getPermissions = async () => {
//       const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
//       setLocationPermission(locationStatus === "granted");
//       if (locationStatus === "granted") {
//         const loc = await Location.getCurrentPositionAsync({});
//         setCoordinates([loc.coords.latitude, loc.coords.longitude]);
//       } else {
//         Alert.alert("Location permission denied", "Cannot report without location.");
//       }

//       const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
//       setCameraPermission(cameraStatus === "granted");
//     };

//     getPermissions();
//   }, []);

//   const handleCapture = async () => {
//     if (cameraRef) {
//       const photo = await cameraRef.takePictureAsync();
//       setPhoto(photo.uri);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!comment && !photo) {
//       alert("Please provide a comment or capture a photo.");
//       return;
//     }

//     try {
//       setIsSubmitting(true);

//       const token = await AsyncStorage.getItem("userToken");

//       const formData = new FormData();
//       formData.append("ticket_id", adminCaseDetails.ticket_id);
//       if (coordinates) formData.append("resolved_coordinates", JSON.stringify(coordinates));
//       if (comment) formData.append("comment", comment);
//       if (photo) {
//         formData.append("resolved_image", {
//           uri: photo,
//           type: "image/jpeg",
//           name: "resolved_image.jpg",
//         });
//       }

//       const response = await API.post("/api/update-case", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       if (response.status === 200) {
//         alert("Case updated successfully!");
//         // Reset comment and photo to trigger rerender
//         setComment("");
//         setPhoto(null);
//         // To update the case details and trigger re-render:
//         setAdminCaseDetails((prevDetails) => ({
//           ...prevDetails,
//           stage: "Resolved",  // Assume you want to mark it as resolved
//         }));
//       } else {
//         alert("Failed to update the case. Please try again.");
//       }
//     } catch (error) {
//       alert("An error occurred while updating the case.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };


//   const handleStartWork = async () => {
//     try {
//       const token = await AsyncStorage.getItem("userToken");

//       const response = await API.post("/api/start-work", {
//         ticket_id: adminCaseDetails.ticket_id,
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.status === 200) {
//         alert("Work started successfully!");
//         // Update the stage to "Work Started" and rerender the page
//         setAdminCaseDetails((prevDetails) => ({
//           ...prevDetails,
//           stage: "Work Started",
//         }));
//       } else {
//         alert("Failed to start work. Please try again.");
//       }
//     } catch (error) {
//       alert("An error occurred while starting work.");
//     }
//   };




//   const renderWorkInProgress = () => (
//     <KeyboardAvoidingView style={styles.container} behavior="position" enabled keyboardVerticalOffset={80} >
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center' }} >
//           <Text style={styles.title}>Update Case</Text>

//           {/* Camera */}
//           {cameraPermission ? (
//             <CameraView style={styles.camera} ref={(ref) => setCameraRef(ref)} />
//           ) : (
//             <Text>No camera access granted</Text>
//           )}

//           <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
//             <Text style={styles.captureButtonText}>Capture Photo</Text>
//           </TouchableOpacity>

//           {photo && <Image source={{ uri: photo }} style={styles.previewImage} />}

//           {/* Comment Input */}
//           <TextInput
//             style={styles.input}
//             placeholder="Add your comments here..."
//             value={comment}
//             onChangeText={setComment}
//             multiline
//             placeholderTextColor={"#999"}
//           />

//           {/* Submit Button */}
//           <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
//             {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Submit</Text>}
//           </TouchableOpacity>
//         </ScrollView>
//       </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
//   );


//   const renderResolvedCase = () => (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Case Resolved</Text>
//       {adminCaseDetails.resolved_image && (
//         <View>
//           <Text style={styles.detail}>

//             <Text style={styles.label}>Resolved Image:

//             </Text>
//           </Text>
//           <Image source={{ uri: adminCaseDetails.resolved_image }} style={styles.image} />
//         </View>
//       )}
//       <View style={styles.detailsContainer}>
//         <Text style={styles.detail}>
//           <Text style={styles.label}>Ticket ID: </Text>{adminCaseDetails.ticket_id}
//         </Text>
//         <Text style={styles.detail}>
//           <Text style={styles.label}>Description: </Text>{adminCaseDetails.description}
//         </Text>
//         <Text style={styles.detail}>
//           <Text style={styles.label}>Coordinates: </Text>{adminCaseDetails.coordinates ? adminCaseDetails.coordinates.join(", ") : "N/A"}
//         </Text>
//         <Text style={styles.detail}>
//           <Text style={styles.label}>Resolved Coordinates: </Text>{adminCaseDetails.resolved_coordinates || "N/A"}
//         </Text>
//         <Text style={styles.detail}>
//           <Text style={styles.label}>Reported At: </Text>{new Date(adminCaseDetails.reported_at).toLocaleString()}
//         </Text>
//       </View>
//     </ScrollView>
//   );

//   const renderReportedCase = () => (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Case Details</Text>
//       {adminCaseDetails.image && <Image source={{ uri: adminCaseDetails.image }} style={styles.image} />}
//       <View style={styles.detailsContainer}>
//         <Text style={styles.detail}>
//           <Text style={styles.label}>Ticket ID: </Text>{adminCaseDetails.ticket_id}
//         </Text>
//         <Text style={styles.detail}>
//           <Text style={styles.label}>Description: </Text>{adminCaseDetails.description}
//         </Text>
//         <Text style={styles.detail}>
//           <Text style={styles.label}>Coordinates: </Text>{adminCaseDetails.coordinates ? adminCaseDetails.coordinates.join(", ") : "N/A"}
//         </Text>
//         <Text style={styles.detail}>
//           <Text style={styles.label}>Reported At: </Text>{new Date(adminCaseDetails.reported_at).toLocaleString()}
//         </Text>
//       </View>
//       {/* Start Working Button */}
//       <TouchableOpacity style={styles.startButton} onPress={handleStartWork}>
//         <Text style={styles.startButtonText}>Start Working</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );

//   switch (adminCaseDetails.stage) {
//     case "Work Started":
//       return renderWorkInProgress();
//     case "Resolved":
//       return renderResolvedCase();
//     case "Reported":
//     default:
//       return renderReportedCase();
//   }
// }

// const styles = StyleSheet.create({
//   container: { padding: 16, backgroundColor: "#f5f5f5" },
//   title: { fontSize: 28, fontWeight: "700", textAlign: "center", marginBottom: 20, color: "#333" },
//   detailsContainer: { backgroundColor: "#fff", borderRadius: 10, padding: 20, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, marginBottom: 20 },
//   detail: { fontSize: 16, marginBottom: 12, lineHeight: 24, color: "#555" },
//   label: { fontWeight: "600", color: "#333" },
//   image: { width: "100%", aspectRatio: 3/4, borderRadius: 10, resizeMode: "cover", marginBottom: 16 },
//   startButton: { backgroundColor: "#007BFF", padding: 14, borderRadius: 8, alignItems: "center", marginBottom: 16 },
//   startButtonText: { color: "#fff", fontWeight: "bold" },
//   camera: { width: '80%', aspectRatio: 3 / 4, borderRadius: 8, overflow: "hidden", marginBottom: 16 },
//   captureButton: { width: '100%', backgroundColor: "#007BFF", padding: 10, borderRadius: 8, alignItems: "center", marginBottom: 16 },
//   captureButtonText: { color: "#fff", fontWeight: "bold" },
//   input: { width: '100%', height: 100, backgroundColor: "#fff", borderRadius: 8, padding: 10, textAlignVertical: "top", marginBottom: 16 },
//   submitButton: { width: '100%', backgroundColor: "#28a745", padding: 14, borderRadius: 8, alignItems: "center" },
//   submitButtonText: { color: "#fff", fontWeight: "bold" },
//   previewImage: { width: "100%", height: 200, borderRadius: 8, resizeMode: "cover", marginBottom: 16 },
// });
