import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeBaseProvider, Box } from "native-base";
import SignInScreen from "./screens/AuthStack/SignInScreen";
import SignUpScreen from "./screens/AuthStack/SignUpScreen";
import { createStackNavigator } from "@react-navigation/native-stack";
import { AuthStackScreen } from "./screens/AuthStack/AuthStackScreen";
import { NavigationContainer } from "@react-navigation/native";

// const Stack = createStackNavigator();

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <AuthStackScreen />
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
