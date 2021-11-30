import { Box, Button, Heading, Input, Text } from "native-base";
import firebase from "firebase/app";
import "firebase/firestore";

export default function DetailScreen({ route, navigation }) {
  const { item } = route.params;
  const [newLocation, setNewLocation] = useState("");

  // const Bar = () => {
  //   return (
  //     <Appbar.Header>
  //       <Appbar.BackAction onPress={() => navigation.navigate("FeedScreen")} />
  //       <Appbar.Content title="Socials" />
  //     </Appbar.Header>
  //   );
  // };

  if (item.found) {
    return (
      <Box>
        <Button onPress={() => navigation.navigate("FeedScreen")}>Done</Button>
        <Heading>Found Item: {item.shortDescription}</Heading>
        <Image
                source={{ uri: item.image }}
                alt={`Image of ${item.shortDescription}`}
                size="xl"
              />
        <Text>Found At: {item.location}</Text>
        <Text>New Location is At: {item.newLocation}</Text>

        <Heading>Is this your item?</Heading>
        <Button onPress={() => firebase.firestore().collection("items").doc(item.id).update({
            resolved: true
        })}>Resolve Item</Button>

      </Box>
    );
  } else {
    return (
        <Box>
          <Button onPress={() => navigation.navigate("FeedScreen")}>Done</Button>
          <Heading>Lost Item: {item.shortDescription}</Heading>
          <Image
                  source={{ uri: item.image }}
                  alt={`Image of ${item.shortDescription}`}
                  size="xl"
                />
          <Text>Last Known Location At: {item.location}</Text>
          
          <Heading>Found Item?</Heading>
          <Input placeholder="New location of item (lost and found, personal home, etc.)" value = {newLocation} onChangeText = {setNewLocation}></Input>
          <Button onPress={() => firebase.firestore().collection("items").doc(item.id).update({
            resolved: true,
            newLocation: newLocation
        })}>Resolve Item</Button>
        </Box>
      );
  }
}
