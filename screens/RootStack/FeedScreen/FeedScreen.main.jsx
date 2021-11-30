import React, { useState, useEffect } from "react";
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
} from "native-base";
import firebase from "firebase/app";
import "firebase/firestore";

export default function FeedScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("");

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
          <Button onPress={() => navigation.navigate("DetailScreen", { object: item })}>
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
  //   return (
  //     <Box>
  //       <Heading>Item Listing</Heading>
  //       <FlatList data={itemList} renderItem={renderItem}></FlatList>
  //     </Box>
  //   );
  // const renderItem = (item) => {
  //     return (<Text>Hello!</Text>);
  // }
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
        <SearchBar
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
