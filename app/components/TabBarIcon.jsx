import Ionicons from "react-native-vector-icons/Ionicons";

// Komponen untuk menampilkan ikon pada tab bar
const TabBarIcon = ({ routeName, focused }) => {
  // Mapping ikon sesuai nama rute dan focused status
  let iconName;
  const icons = {
    Login: focused ? "log-in" : "log-in-outline",
    Home: focused ? "home" : "home-outline",
    Register: focused ? "person-add" : "person-add-outline",
    AddPost: focused ? "add-circle" : "add-circle-outline",
    Search: focused ? "search" : "search-outline",
    UserProfile: focused ? "person" : "person-outline",
  };

  // Memilih ikon sesuai nama rute atau menggunakan ikon default jika tidak ditemukan
  iconName = icons[routeName] || "alert-circle-outline";

  // Menampilkan ikon menggunakan Ionicons
  return (
    <Ionicons name={iconName} size={25} color={focused ? "#000" : "#657786"} />
  );
};

// Export
export default TabBarIcon;
