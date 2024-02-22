import * as React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

import HomeStack from "@navigators/HomeStack";

const Tab = createBottomTabNavigator();

const options = {
  animationEnabled: false,
  headerShown: false,
  animation: "none",
};

export default function TabNav() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Главная") {
              iconName = focused ? "ios-home" : "ios-home-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#DE3905",
          tabBarInactiveTintColor: "gray",
        })}
      ></Tab.Navigator>
    </NavigationContainer>
  );
}
