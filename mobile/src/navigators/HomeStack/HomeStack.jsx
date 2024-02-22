import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "@screens/Home";

const Nav = createNativeStackNavigator();
export default function HomeStack() {
  return (
    <Nav.Navigator>
      <Nav.Screen
        name='Home'
        component={Home}
        options={{
          headerShown: false,
          animationEnabled: false,
          animation: "none",
        }}
      />
    </Nav.Navigator>
  );
}
