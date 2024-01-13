import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { useMutation } from "@apollo/client";
import { REGISTER_USER } from "../configs/queries";
import { LinearGradient } from "expo-linear-gradient";

// Halaman pendaftaran user baru
const RegisterPage = ({ navigation }) => {

  // State untuk menyimpan data input
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Mutation
  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    onCompleted: (data) => {
      if (data.register.statusCode === 200) {
        navigation.navigate("Login");
      } else {
        setErrorMessage(data.register.message);
      }
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const handleRegister = () => {
    const emailFormat = /\S+@\S+\.\S+/;

    // Validasi input
    if (!username || !email || !password) {
      setErrorMessage("Username, email, and password are required");
      return;
    }
    if (!emailFormat.test(email)) {
      setErrorMessage("Invalid email format");
      return;
    }
    if (password.length < 5) {
      setErrorMessage("Password must be at least 5 characters");
      return;
    }

    registerUser({
      variables: {
        input: {
          username,
          name,
          email,
          password,
        },
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
          colors={["#F9CE34", "#EE2A7B", "#6228D7"]}
          style={styles.container}
        >
          <Text style={styles.headerText}>Register</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#B6BBC4"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#B6BBC4"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#B6BBC4"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor="#B6BBC4"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text
              style={styles.buttonText}
              onPress={() => navigation.navigate("Login")}
            >
              {loading ? "Registering..." : "Register"}
            </Text>
          </TouchableOpacity>
          {!!errorMessage && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3D3B40",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 24,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFFBF5",
    color: "#22092C",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    width: "100%",
    backgroundColor: "#3C79F5",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});

export default RegisterPage;
