import React from "react";
import { AsyncStorage, View, Text, Button } from "react-native";

export default class AsyncText extends React.Component {
  asyncPlay = () => {
    try {
      AsyncStorage.setItem("hahah123", "devaaaa", err => {
        console.log(err);
      });
    } catch (error) {
      console.log(error);
    }
  };

  asyncGet = async () => {
    try {
      isAuthenticated = await AsyncStorage.getItem("isAuthenticated");
      authMethod = await AsyncStorage.getItem("authMethod");
      userId = await AsyncStorage.getItem("userId");
      sname = await AsyncStorage.getItem("sName");
      console.log(isAuthenticated, authMethod, userId, sname);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <View>
        <Button title="Confirm Code" color="#841584" onPress={this.asyncPlay} />
        <Text> Hellllloo</Text>
        <Button title="Confirm Code" color="#841584" onPress={this.asyncGet} />
      </View>
    );
  }
}
