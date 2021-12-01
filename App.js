import { StatusBar } from "expo-status-bar";
import React from "react";
import { AppRegistry, StyleSheet, Text, View } from "react-native";
import { NativeBaseProvider, Box } from "native-base";
import SignInScreen from "./screens/AuthStack/SignInScreen";
import SignUpScreen from "./screens/AuthStack/SignUpScreen";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthStackScreen } from "./screens/AuthStack/AuthStackScreen";
import { NavigationContainer } from "@react-navigation/native";
import FeedScreen from "./screens/AuthStack/FeedScreen/FeedScreen.main";
import DetailScreen from "./screens/AuthStack/DetailScreen/DetailScreen.main";
import firebase from 'firebase'

AppRegistry.registerComponent('main', () => App);

const firebaseConfig = require("./keys.json");
if (firebase.apps.length == 0) {
  firebase.initializeApp(firebaseConfig);
}
const Stack = createStackNavigator();

export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Feed"
            component={FeedScreen}
          />
          <Stack.Screen
            name="Detail"
            component={DetailScreen}
          />
        </Stack.Navigator>
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
