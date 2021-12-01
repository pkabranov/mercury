import React, { useState, useEffect, SearchBar } from "react";
import {
  NativeBaseProvider,
  Box,
  HStack,
  Image,
  VStack,
  Text,
  Heading,
  FlatList,
  Button,
  Input,
  Switch,
  Icon
} from "native-base";
import firebase from "firebase/app";
import "firebase/firestore";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function FeedScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("Seeker");

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("items")
      .onSnapshot((querySnapshot) => {
        let newItems = [];
        querySnapshot.forEach((item) => {
          const newItem = item.data();
          newItem.id = item.id;
          newItems.push(newItem);
        });
        setItems(newItems);
      });
    return unsubscribe;
  }, []);

  const changeMode = () => {
    if (mode == "Seeker") {
      setMode("Finder")
    } else {
      setMode("Seeker")
    }
  }

  const lostOrFound = (item) => {
    if (item.found) {
      return "Found";
    }
    if (item.lost) {
      return "Lost";
    }
  };
  const renderItem = ({ item }) => {
    let meetsSearchCriteria =
      item.shortDescription.includes(search) || item.location.includes(search);

    let meetsModeCriteria = true
    if (mode === 'Finder') {
      meetsModeCriteria = item.lost
    }
    if (mode === 'Seeker') {
      meetsModeCriteria = item.found
    }

    if (meetsSearchCriteria && meetsModeCriteria && !item.resolved) {
      return (
        <Box m="2" >
          <Button justifyContent="flex-start" width="350" borderRadius="10" onPress={() => navigation.navigate("Detail", { object: item })}>
            <HStack space={5} alignItems="center">
              <Image
                source={{ uri: item.image }}
                alt={`Image of ${item.shortDescription}`}
                size="120"
                borderRadius="10"
              />
              <VStack space={2}>
                <Text>
                  <Text fontsize="md" bold color="white">Description: </Text>
                  <Text color="white">{item.shortDescription}</Text>
                </Text>
                <Text>
                  <Text fontsize="md" bold color="white">Located Near: </Text>
                  <Text color="white">{item.location}</Text>
                </Text>
                <Text>
                  <Text fontsize="md" bold color="white">Status: </Text>
                  <Text color="white">{lostOrFound(item)}</Text>
                </Text>
              </VStack>
            </HStack>
          </Button>
        </Box>
      );
    } else {
      return null;
    }
  };

  return (
    <NativeBaseProvider>
      <Box
        safeArea
        flex={1}
        bg="#fff"
        alignItems="center"
        justifyContent="center"
      >
        <Box m="3" alignItems="center">
          <HStack alignItems="center" space={5}>
            <Input
              placeholder="Search"
              onChangeText={setSearch}
              value={search}
              width="50%"
              size="2xl"
            />
            <Switch isChecked={mode == "Seeker"} onToggle={changeMode} />
            <Text fontSize="xl">{mode}</Text>
          </HStack>
        </Box>
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        ></FlatList>
        <Button m="5" height="65" width="65" borderRadius="100" alignSelf="flex-end" onPress={() => navigation.navigate("Report", {mode})}>
          <Text fontSize="3xl" bold color="white">+</Text>
        </Button>

      </Box>
    </NativeBaseProvider>
  );
}