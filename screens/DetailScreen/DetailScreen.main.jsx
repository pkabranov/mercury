import { Box, Button, Heading, Input, Text, Image, VStack } from "native-base";
import firebase from "firebase/app";
import "firebase/firestore";
import React, { useState, useEffect, SearchBar } from "react";
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { MarkerAnimated } from "react-native-maps";
import { Marker } from "react-native-maps";

export default function DetailScreen({ route, navigation }) {
    const { object } = route.params;
    const [newLocation, setNewLocation] = useState("");
    console.log(object)
    console.log(object.preciseLocation)
    console.log(route.params)

    if (object.found) {
        return (
            <Box alignItems="center">
                <VStack alignItems="center" space="3" >
                    <Box bgColor="gray.200" borderRadius="xl" margin="5" padding="5">
                        <VStack alignItems="center" space="3">
                            <Heading>Found object: {object.shortDescription}</Heading>
                            <Image
                                source={{ uri: object.image }}
                                alt={`Image of ${object.shortDescription}`}
                                size="150"
                                borderRadius="15"
                            />

                        </VStack>
                    </Box>
                    <Heading>Where Item was Found</Heading>
                    <Box style={styles.container}>
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: 37.8719,
                                longitude: -122.2585,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                        >
                            <Marker title={object.location} coordinate={{
                                latitude: object.preciseLocation.latitude,
                                longitude: object.preciseLocation.longitude,
                            }}>

                            </Marker>
                        </MapView>
                    </Box>
                    <Box margin="3">
                        <VStack space="2" alignItems="center">
                            <Heading size="sm">New Location is At: {object.newLocation}</Heading>
                            <Heading size="sm">Is this object yours?</Heading>
                        </VStack>
                    </Box>
                    {/* <Input size="xl" placeholder="Where did you find it?" value={newLocation} onChangeText={setNewLocation}></Input> */}
                    <Button size="lg" onPress={() => {
                        firebase.firestore().collection("items").doc(object.id).update({
                            resolved: true,
                        })
                        navigation.navigate("Feed");
                    }

                    }>Resolve object</Button>
                </VStack>
            </Box>

        );
    } else {

        return (
            <Box alignItems="center">
                <VStack alignItems="center" space="3" >
                    <Box bgColor="gray.200" borderRadius="xl" margin="5" padding="5">
                        <VStack alignItems="center" space="3">
                            <Heading>Lost object: {object.shortDescription}</Heading>
                            <Image
                                source={{ uri: object.image }}
                                alt={`Image of ${object.shortDescription}`}
                                size="150"
                                borderRadius="15"
                            />

                        </VStack>
                    </Box>
                    <Heading>Last Known Location</Heading>
                    <Box style={styles.container}>
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: 37.8719,
                                longitude: -122.2585,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                            }}
                        >
                            <Marker title={object.location} coordinate={{
                                latitude: object.preciseLocation.latitude,
                                longitude: object.preciseLocation.longitude,
                            }}>

                            </Marker>
                        </MapView>
                    </Box>
                    <Heading>Did you find this object?</Heading>
                    <Input size="xl" placeholder="Where did you find it?" value={newLocation} onChangeText={setNewLocation}></Input>
                    <Button size="lg" onPress={() => {
                        firebase.firestore().collection("items").doc(object.id).update({
                            resolved: true,
                            newLocation: newLocation
                        })
                        navigation.navigate("Feed");
                    }

                    }>Resolve object</Button>
                </VStack>
            </Box>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height / 4,
    },
});