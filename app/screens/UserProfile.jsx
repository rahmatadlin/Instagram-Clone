import { useContext, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useQuery } from "@apollo/client";
import { GET_USER } from "../configs/queries";
import { LoginContext } from "../context/LoginContext";
import ProfileHeader from "../components/ProfileHeader";
import FollowList from "../components/FollowList";
import PostList from "../components/PostList";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as SecureStore from "expo-secure-store";

// Komponen utama untuk halaman profil user
const UserProfilePage = ({ navigation }) => {
  // Mengambil informasi pengguna dan fungsi logout dari context login
  const { userId, setIsLoggedIn } = useContext(LoginContext);

  // Menggunakan hook useQuery untuk mendapatkan data user dari server
  const { data, loading, error, refetch } = useQuery(GET_USER, {
    variables: { id: userId },
  });

  // State untuk menampilkan atau menyembunyikan daftar pengikut dan yang diikuti
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  // Fungsi logout user
  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("userId");
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Fungsi refresh untuk mereload data user
  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

   // Menampilkan indikator loading selama data sedang diambil dari server
  if (loading) return <ActivityIndicator size="large" color="#ffffff" />;

  // Menampilkan pesan error jika terjadi kesalahan saat mengambil data
  if (error)
    return <Text style={styles.errorText}>Error: {error.message}</Text>;

  // Mendapatkan data pengguna dari hasil query
  const user = data?.getUser?.data;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
      >
        <ProfileHeader user={user} />
        <FollowList
          user={user}
          showFollowers={showFollowers}
          setShowFollowers={setShowFollowers}
          showFollowing={showFollowing}
          setShowFollowing={setShowFollowing}
        />
        <PostList posts={user?.posts} navigation={navigation} />
      </ScrollView>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="exit-outline" size={24} color="#fff" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
  },
  scrollView: {
    flexGrow: 1,
  },
  logoutButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    marginLeft: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});


// Export
export default UserProfilePage;
