import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";

export default function CaseDetailsScreen({ route }) {
    const { caseDetails } = route.params;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Case Details</Text>

            {caseDetails.resolved_image && (
                <View>
                    <Text>Resolved Image</Text>
                    <Image source={{ uri: caseDetails.image }} style={styles.image} />
                </View>
            )}
            {caseDetails.image && (
                <Image source={{ uri: caseDetails.image }} style={styles.image} />
            )}

            <View style={styles.detailsContainer}>
                <Text style={styles.detail}>
                    <Text style={styles.label}>Ticket ID: </Text>{caseDetails.ticket_id}
                </Text>

                <Text style={styles.detail}>
                    <Text style={styles.label}>Status: </Text>{caseDetails.stage}
                </Text>

                <Text style={styles.detail}>
                    <Text style={styles.label}>Description: </Text>{caseDetails.description}
                </Text>

                <Text style={styles.detail}>
                    <Text style={styles.label}>Zone: </Text>{caseDetails.zone_name}
                </Text>

                <Text style={styles.detail}>
                    <Text style={styles.label}>Coordinates: </Text>
                    {caseDetails.coordinates ? caseDetails.coordinates.join(", ") : "N/A"}
                </Text>


                <Text style={styles.detail}>
                    <Text style={styles.label}>Reported At: </Text>
                    {new Date(caseDetails.reported_at).toLocaleString()}
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 20,
        color: "#333",
    },
    detailsContainer: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        elevation: 3, // Add shadow for Android
        shadowColor: "#000", // iOS shadow
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
        // height: 200,
        aspectRatio: 0.75,
        borderRadius: 10,
        resizeMode: "cover",
        marginBottom: 16,
    },
});
