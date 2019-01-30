import React, { Component } from "react";

import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  Linking,
  AlertIOS,
  TouchableHighlight,
  Platform,
  PermissionsAndroid,
  Button
} from "react-native";

var RNFS = require("react-native-fs");

import SoundRecorder from "react-native-sound-recorder";
import SoundPlayer from "react-native-sound-player";

export default class RAudio extends Component {
  record = () => {
    SoundRecorder.start(SoundRecorder.PATH_CACHE + "/test123.mp4").then(
      function() {
        console.log("started recording");
      }
    );
  };

  stop = () => {
    SoundRecorder.stop().then(function(result) {
      console.log("stopped recording, audio file saved at: " + result.path);
    });
  };

  play = () => {
    try {
      // play the file tone.mp3
      //SoundPlayer.playSoundFile("tone", "mp3");
      // or play from url
      SoundPlayer.playUrl("https://youthevoice.com/test123.mp4");
    } catch (e) {
      console.log(`cannot play the sound file`, e);
    }
  };

  render() {
    return (
      <View>
        <Button
          onPress={this.record}
          title="record"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />

        <Button
          onPress={this.stop}
          title="stop"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
        <Button
          onPress={this.play}
          title="play"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    );
  }
}
