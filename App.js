import { useState, useEffect } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View, Image, Pressable, Platform, RefreshControl } from "react-native";
import axios from "axios";
import { SafeAreaProvider } from "react-native-safe-area-context";
import UserAvatar from 'react-native-user-avatar';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


export default function App() {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => {
    getUsers()
  }, []);

  const getUsers = () => {
    axios
    .get("https://random-data-api.com/api/v2/users?size=10")
    .then((response) => {
      setRefreshing(false);
      setUsers(response.data)
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    });
  }


  const fabPressed = () => {
    getOneUser();
  }

  const getOneUser = () => {
    axios
    .get("https://random-data-api.com/api/users/random_user")
    .then((response) => {
      let newUser = response.data
      setUsers(prevUsers => [newUser, ...prevUsers])
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
    });
  }

  // Item renderer for FlatList
  const renderItem = ({ item }) => (
    <View style={styles.userItem}>
      <UserAvatar size={65} name={item.first_name + ' ' + item.last_name} src={item.avatar} />
      <View style={styles.fullName}>
        <Text style={styles.firstName}>{item.first_name}</Text>
        <Text style={styles.lastName}>{item.last_name}</Text>
      </View>
    </View>
  );

  // Key extractor for FlatList
  const keyExtractor = (item) => item.id.toString();

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView>
          <Text style={styles.title}>Welcome to the User List</Text>
          <FlatList
            data={users}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={getUsers} />
            }
          />
          <Pressable style={styles.fabContainer}
            onPress={fabPressed}>
            <MaterialCommunityIcons name="plus-thick" size={24} color="black" />
          </Pressable>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
  },
  userItem: {
    padding: 15,
    shadowColor: "#000",
    backgroundColor: "#fff",
    elevation: 2,
    borderBottomWidth: 1,
    borderColor: "#cccccc",
    flexDirection: Platform.OS === 'ios' ? 'row-reverse' : "row",
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: 'center'
  },
  fullName: {
    alignItems: Platform.OS === 'ios' ? 'flex-start' : "flex-end",
  }, 
  firstName: {
    fontSize: 20,
  }, 
  lastName: {
    fontSize: 20,
  }, 
  fabContainer: {
    /* position the content inside the FAB */
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15, 
    /* for the FAB itself */
    borderRadius: 50,
    position: 'absolute',
    bottom: 40,
    right: 10,
    backgroundColor: '#C0AFE2',
  }
});
