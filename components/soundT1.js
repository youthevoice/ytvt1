import React, { Component } from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert
} from "react-native";
import Sound from "react-native-sound";

export class TSound1 extends React.Component {
  play = () => {
    const sound = new Sound(
      "https://youthevoice.com/test.mp4",
      (err, sound) => {
        sound.play(success => {
          if (success) {
          } else {
          }
        });
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
