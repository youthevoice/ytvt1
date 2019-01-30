import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";

import VideoPlayer from "react-native-video-controls";
import Orientation from "react-native-orientation";
var RNFS = require("react-native-fs");

export default class PlayVideo extends Component {
  static navigationOptions = {
    headerVisible: false
  };
  componentWillMount() {
    Orientation.lockToLandscape();
  }
  _back() {
    const { goBack } = this.props.navigation;
    Orientation.lockToPortrait();
    goBack();
  }
  _onEnd() {
    const { goBack } = this.props.navigation;
    Orientation.lockToPortrait();
    goBack();
  }

  render() {
    //alert("file://" + RNFS.DocumentDirectoryPath + "/test.mp4");
    return (
      <View style={styles.container}>
        <VideoPlayer
          source={{ uri: "https://youthevoice.com/test.mp4" }}
          //source={{ uri: "file://" + RNFS.DocumentDirectoryPath + "/test.mp4" }}
          //title={this.props.title}
          title="Apppuuuu"
          onBack={() => this._back()}
          onEnd={() => this._onEnd()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
