import { createStackNavigator } from "@react-navigation/stack";
import HomePage from "../screens/Home";
import PostDetailsPage from "../screens/PostDetails";

// Membuat stack navigator untuk halaman Home
const HomeStack = createStackNavigator();

// Komponen untuk menangani stack navigation di halaman Home
const HomeStackNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="Welcome to Instagram" component={HomePage} />
    <HomeStack.Screen name="PostDetails" component={PostDetailsPage} />
  </HomeStack.Navigator>
);

// Export
export default HomeStackNavigator;
