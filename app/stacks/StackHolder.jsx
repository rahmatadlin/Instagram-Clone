import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AddPostPage from "../screens/AddPost";
import LoginPage from "../screens/Login";
import RegisterPage from "../screens/Register";
import SearchPage from "../screens/Search";
import { LoginContext } from "../context/LoginContext";
import UserProfilePage from "../screens/UserProfile";
import TabBarIcon from "../components/TabBarIcon";
import HomeStackNavigator from "./StackHome";

const Tab = createBottomTabNavigator();

// Komponen untuk menangani tab navigation dan menentukan tampilan berdasarkan status login
const StackHolder = () => {
  const { isLoggedIn } = useContext(LoginContext);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <TabBarIcon routeName={route.name} focused={focused} />
          ),
        })}
      >
        {/* Jika user sudah login, tampilkan tab navigasi berikut */}
        {isLoggedIn ? (
          <>
            <Tab.Screen name="Home" component={HomeStackNavigator} />
            <Tab.Screen name="AddPost" component={AddPostPage} />
            <Tab.Screen name="Search" component={SearchPage} />
            <Tab.Screen name="UserProfile" component={UserProfilePage} />
          </>
        ) : (
          <>
            {/* Jika pengguna belum login, tampilkan tab navigasi berikut */}
            <Tab.Screen name="Login" component={LoginPage} />
            <Tab.Screen name="Register" component={RegisterPage} />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default StackHolder;
