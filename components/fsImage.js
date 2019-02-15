import React, { Component } from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";

// You can import from local files
//import AssetExample from "./components/AssetExample";

// or any pure javascript modules available in npm
import { Card } from "react-native-elements"; // 0.18.5

export default class FSImage extends Component {
  render() {
    return (
      <ScrollView horizontal={true}>
        <ScrollView>
          <Image
            resizeMode="cover"
            source={{
              uri:
                "https://cdn.pixabay.com/photo/2014/12/16/22/25/woman-570883_1280.jpg"
            }}
            style={styles.canvas}
          />
        </ScrollView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1"
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e"
  },
  canvas: {
    flex: 1
    //  width: 720
  }
});
