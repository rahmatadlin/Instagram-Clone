import { View, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

// Komponen ProfileHeader untuk menampilkan header profil
const ProfileHeader = ({ user }) => {
  // console.log(user, "<<<<<<");
  return (
    // Render komponen
    <View style={styles.container}>
      <Ionicons name="person-circle" size={100} color="#4c8bf5" />
      <Text style={styles.username}>{user.username}</Text>
      {/* <Text style={styles.name}>{user.name}</Text> */}
      <Text style={styles.email}>{user.email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#000",
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 10,
  },
  email: {
    fontSize: 16,
    color: "gray",
  },
});

// Export
export default ProfileHeader;
