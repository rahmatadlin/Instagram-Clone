import { useState, useContext } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useLazyQuery } from "@apollo/client";
import * as SecureStore from "expo-secure-store";
import { LoginContext } from "../context/LoginContext";
import { LOGIN_USER } from "../configs/queries";
import { LinearGradient } from 'expo-linear-gradient';

const LoginPage = ({ navigation }) => {
  const { setIsLoggedIn, setUserId } = useContext(LoginContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [dispatcher, { loading }] = useLazyQuery(LOGIN_USER, {
    fetchPolicy: "network-only",
    onCompleted: async (res) => {
      const token = res?.login?.data?.token;
      const userId = res?.login?.data?.userId;
      if (token && userId) {
        await SecureStore.setItemAsync("token", token);
        await SecureStore.setItemAsync("userId", userId);
        setIsLoggedIn(true);
        setUserId(userId);
        navigation.navigate("Home");
      } else {
        setLoginError("Login failed, please try again.");
      }
    },
    onError: (error) => {
      setLoginError(error.message);
    },
  });

  const onLoginPress = () => {
    setLoginError("");
    dispatcher({
      variables: {
        email,
        password,
      },
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={['#F9CE34', '#EE2A7B', '#6228D7']}
          style={styles.container}
        >
          <Image
            source={require("../assets/pinpng.com-instagram-png-22951.png")}
            style={styles.logo}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#B6BBC4"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#B6BBC4"
            secureTextEntry={true}
            keyboardType="default"
            value={password}
            onChangeText={setPassword}
          />
          <Pressable
            style={styles.button}
            onPress={onLoginPress}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Logging in..." : "Log In"}
            </Text>
          </Pressable>
          {loginError ? (
            <Text style={styles.errorText}>{loginError}</Text>
          ) : null}
          <Text style={styles.signUpText}>
            Don't have an account?{" "}
            <Text
              style={styles.signUpLink}
              onPress={() => navigation.navigate("Register")}
            >
              Sign up
            </Text>
          </Text>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const fontFamily = Platform.OS === 'android' ? 'Roboto' : 'Helvetica'; // Roboto untuk android dan Helvetica untuk IOS

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3D3B40",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFFBF5",
    color: "#22092C",
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    fontFamily: fontFamily,
    marginBottom: 15,
  },
  button: {
    width: "100%",
    backgroundColor: "#3C79F5",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#fff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: fontFamily,
  },
  linkText: {
    color: "#4c8bf5",
    fontSize: 16,
    fontFamily: fontFamily,
    marginBottom: 24,
  },
  signUpText: {
    color: "#999",
    fontSize: 16,
    fontFamily: fontFamily,
  },
  signUpLink: {
    color: "#4c8bf5",
    fontWeight: "bold",
    fontFamily: fontFamily,
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});

export default LoginPage;
