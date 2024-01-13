import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

// Komponen LogoutButton untuk tombol logout
const LogoutButton = ({ onLogout }) => {
  return (
     // Komponen TouchableOpacity untuk memberikan efek tekan pada tombol
    <TouchableOpacity style={styles.button} onPress={onLogout}>
      <Ionicons name="exit-outline" size={20} color="#FF004D" />
      <Text style={styles.buttonText}>Logout</Text>
    </TouchableOpacity>
  );
};

// Styles untuk komponen LogoutButton
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
});

// Export
export default LogoutButton;
