import { Box, Input, Button, VStack, Heading } from "native-base";
import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import MapView, { MarkerAnimated, Marker } from "react-native-maps";
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { getFileObjectAsync } from "../../utils";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import firebase from "firebase/app";
import "firebase/firestore";
//FOR IMPORTS: LOOK AT MDB SOCIALS
//Left to do: MapView and split into finder/seeker modes

export default function ReportScreen({ route, navigation }) {
    const [shortDescription, setShortDescription] = useState("");
    const [timeLost, setTimeLost] = useState();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [location, setLocation] = useState("");
    const [image, setImage] = useState(undefined);
    const [lat, setLat] = useState(37.8719);
    const [long, setLong] = useState(-122.2585);
    const [loading, setLoading] = useState(false)
    const [newLocation, setNewLocation] = useState("");

    const mode = route.params.mode
    console.log(mode)

    const onMarkerDragEnd = (coord) => {
        console.log(coord.latitude)
        console.log(coord.longitude)
        setLat(coord.latitude);
        setLong(coord.longitude);
    };

    // Code for DatePicker (from docs)
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    // Code for DatePicker (from docs)
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    // Code for DatePicker (from docs)
    const handleConfirm = (date) => {
        date.setSeconds(0);
        setTimeLost(date);
        hideDatePicker();
    };

    useEffect(() => {
        (async () => {
            if (Platform.OS !== "web") {
                const { status } =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== "granted") {
                    alert("Sorry, we need camera roll permissions to make this work!");
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        console.log("picking image");
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        console.log("done");
        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const saveItem = async () => {
        // if (!shortD) {
        //   showError("Please enter an event name.");
        //   return;
        // } else if (!timeLost) {
        //   showError("Please choose an event date.");
        //   return;
        // } else if (!eventLocation) {
        //   showError("Please enter an event location.");
        //   return;
        // } else if (!eventDescription) {
        //   showError("Please enter an event description.");
        //   return;
        // } else if (!eventImage) {
        //   showError("Please choose an event image.");
        //   return;
        // } else {
        //   setLoading(true);
        // }

        try {
            setLoading(true)
            // Firestore wants a File Object, so we first convert the file path
            // saved in eventImage to a file object.
            console.log("getting file object");
            const object = (await getFileObjectAsync(image));

            // Generate a brand new doc ID by calling .doc() on the socials node.
            const ref = firebase.firestore().collection("items").doc();
            console.log("putting file object");
            const result = await firebase
                .storage()
                .ref()
                .child(ref.id + ".jpg")
                .put(object);
            console.log("getting download url");
            const downloadURL = await result.ref.getDownloadURL();
            // TODO: You may want to update this SocialModel's default
            // fields by adding one or two attributes to help you with
            // interested/likes & deletes
            const doc = {
                preciseLocation: new firebase.firestore.GeoPoint(lat, long),
                location: location,
                timeLost: timeLost.getTime(),
                shortDescription: shortDescription,
                image: downloadURL,
                found: false,
                lost: true,
                newLocation: newLocation,
                resolved: false,
                id: ref.id
            };
            console.log("setting download url");
            await ref.set(doc);
            setLoading(false)
            navigation.goBack();
        } catch (error) {
            console.log(error.message);
            setLoading(false)
        }
    };

    const whatDoWithItem = () => {
        if (mode === 'Finder') {
            return (<Input size="2xl" m="2" placeholder="What did you do with the item?" onChangeText={setNewLocation} value={newLocation}></Input>);
        }
    }

    const showDate = () => {
        if (mode === 'Seeker') {
            return (<Button
                mode="outlined"
                onPress={showDatePicker}
                style={{ marginTop: 20 }}
            >
                {timeLost ? timeLost.toLocaleString() : "Choose a Date"}
            </Button>)
        }
    }

    return (
        <Box alignItems="center">
            <VStack alignItems="center">
                <Box m="3">
                    <Input size="2xl" m="2" placeholder="Item Description" onChangeText={setShortDescription} value={shortDescription}></Input>
                    <Input size="2xl" m="2" placeholder="Rough Location of Item" onChangeText={setLocation} value={location}></Input>
                    <Heading m="2" size="md"> Where did you {mode === "Seeker" ? "lose" : "find"} the item? </Heading>
                </Box>
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
                        <Marker draggable coordinate={{
                            latitude: lat,
                            longitude: long,
                        }} onDragEnd={(e) => onMarkerDragEnd(e.nativeEvent.coordinate)}>

                        </Marker>
                    </MapView>
                </Box>
                <Box margin="3">
                    <VStack space="3" alignItems="center">
                        {whatDoWithItem()}
                        {showDate()}
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="datetime"
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />
                        <Button size="lg" onPress={pickImage}>
                            {image ? "Change Image" : "Add an Image of the Item?"}
                        </Button>

                        <Button isLoading={loading} size="lg" onPress={saveItem}>
                            {"Submit"}
                        </Button>
                    </VStack>
                </Box>
            </VStack>
        </Box>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height / 2.4,
    },
});