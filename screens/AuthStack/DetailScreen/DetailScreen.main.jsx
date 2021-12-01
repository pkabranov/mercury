import { Box, Button, Heading, Input, Text, Image } from "native-base";
import firebase from "firebase/app";
import "firebase/firestore";
import React, { useState, useEffect, SearchBar } from "react";


export default function DetailScreen({ route, navigation }) {
    const { object } = route.params;
    const [newLocation, setNewLocation] = useState("");
    console.log(object)
    console.log(route.params)

    if (object.found) {
        return (
            <Box>
                <Heading>Found object: {object.shortDescription}</Heading>
                <Image
                    source={{ uri: object.image }}
                    alt={`Image of ${object.shortDescription}`}
                    size="xl"
                />
                <Text>Found At: {object.location}</Text>
                <Text>New Location is At: {object.newLocation}</Text>

                <Heading>Is this your object?</Heading>
                <Button onPress={() => {
                    firebase.firestore().collection("items").doc(object.id).update({
                        resolved: true
                    })
                    navigation.navigate("Feed");
                }}>Resolve object</Button>

            </Box>
        );
    } else {
        return (
            <Box>
                <Heading>Lost object: {object.shortDescription}</Heading>
                <Image
                    source={{ uri: object.image }}
                    alt={`Image of ${object.shortDescription}`}
                    size="xl"
                />
                <Text>Last Known Location At: {object.location}</Text>

                <Heading>Found object?</Heading>
                <Input placeholder="New location of object (lost and found, personal home, etc.)" value={newLocation} onChangeText={setNewLocation}></Input>
                <Button onPress={() => {
                    firebase.firestore().collection("items").doc(object.id).update({
                        resolved: true,
                        newLocation: newLocation
                    })
                    navigation.navigate("Feed");
                }

                }>Resolve object</Button>
            </Box>
        );
    }
}