import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  Button
} from "react-native";
import Sound from "react-native-sound";

export default class TSound1 extends React.Component {
  play = () => {
    const sound = new Sound(
      "https://youthevoice.com/v3.mp3",
      undefined,
      error => {
        if (error) {
          console.log(error);
        } else {
          sound.play(() => {
            console.log("Playing sound");
            // Release when it's done so we're not using up resources
            sound.release();
          });
        }
      }
    );
  };

  render() {
    return (
      <View>
        <Button title="hello" onPress={this.play} />
      </View>
    );
  }
}
