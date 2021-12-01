import React, { useState, useEffect, SearchBar} from "react";
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
  Input
} from "native-base";
import firebase from "firebase/app";
import "firebase/firestore";

export default function FeedScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("seeker");

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
    if (mode === 'finder'){
      meetsModeCriteria = item.lost
    }
    if (mode === 'seeker'){
      meetsModeCriteria = item.found
    }

    if (meetsSearchCriteria && meetsModeCriteria && !item.resolved) {
      return (
        <Box>
          <Button onPress={() => navigation.navigate("Detail", { object: item })}>
            <HStack>
              <Image
                source={{ uri: item.image }}
                alt={`Image of ${item.shortDescription}`}
                size="xl"
              />
              <VStack>
                <Text>{item.shortDescription}</Text>
                <Text>{item.location}</Text>
                <Text>{lostOrFound(item)}</Text>
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
        <Heading>Item Listing</Heading>
        <HStack>
          <Button onPress = {() => setMode("finder")}>
            Finder Mode
          </Button>
          <Button onPress = {() => setMode("seeker")}>
            Seeker Mode
          </Button>
        </HStack>
        <Input
          placeholder="Search"
          onChangeText={setSearch}
          value={search}
        />
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        ></FlatList>
      </Box>
    </NativeBaseProvider>
  );
}