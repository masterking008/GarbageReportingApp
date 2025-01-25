import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Screens
import LoginScreen from "../screens/LoginScreen";
import AdminHomeScreen from "../screens/AdminHomeScreen";
import AdminInfoScreen from "../screens/AdminInfoScreen";
import ProfileScreen from "../screens/ProfileScreen";
import UserHomeScreen from "../screens/UserHomeScreen";
import UserInfoScreen from "../screens/UserInfoScreen";
import MyCasesScreen from "../userPages/MyCases";
import ReportProblemScreen from "../userPages/ReportProblem";
import CaseDetailsScreen from "../userPages/CaseDetailsScreen"; // Import the CaseDetailsScreen
import AdminadminCaseDetailsScreen from "../adminPages/AdminCaseDetailsScreen";

// Stack and Tabs
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// User Tabs
function UserTabs({ setUserType }) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={UserHomeScreen} />
      <Tab.Screen name="Info">
        {(props) => <UserInfoScreen {...props} setUserType={setUserType} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Admin Tabs
function AdminTabs({ setUserType }) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={AdminHomeScreen} />
      <Tab.Screen name="Info">
        {(props) => <AdminInfoScreen {...props} setUserType={setUserType} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Main Navigator
export default function AppNavigator() {
  const [userType, setUserType] = useState<string | null>(null); // null, "user", "admin"

  return (
    <Stack.Navigator>
      {/* Login */}
      {!userType ? (
        <Stack.Screen name="Login">
          {(props) => <LoginScreen {...props} setUserType={setUserType} />}
        </Stack.Screen>
      ) : (
        <>
          {/* User/Admin Tabs */}
          {userType === "user" ? (
            <Stack.Screen
              name="UserTabs"
              options={{ headerShown: false }}
            >
              {(props) => <UserTabs {...props} setUserType={setUserType} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen
              name="AdminTabs"
              options={{ headerShown: false }}
            >
              {(props) => <AdminTabs {...props} setUserType={setUserType} />}
            </Stack.Screen>
          )}

          {/* User Pages */}
          <Stack.Screen name="MyCases" component={MyCasesScreen} />
          <Stack.Screen name="ReportProblem" component={ReportProblemScreen} />

          {/* Case Details */}
          <Stack.Screen
            name="CaseDetails"
            component={CaseDetailsScreen}
            options={{ title: "Case Details" }}
          />
          {/* Admin Case Details */}
          <Stack.Screen
            name="AdminCaseDetails"
            component={AdminadminCaseDetailsScreen}
            options={{ title: "Case Details" }}
          />

          {/* Profile Screen */}
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              title: "Profile",
              presentation: "modal",
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
