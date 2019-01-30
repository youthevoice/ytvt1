import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Button,
  PermissionsAndroid,
  Platform
} from "react-native";
import ProgressCircle from "react-native-progress-circle";
import Fa5 from "react-native-vector-icons/FontAwesome5";

import VideoPlayer from "react-native-video-controls";
import Orientation from "react-native-orientation";
var RNFS = require("react-native-fs");
import Icon from "react-native-vector-icons/Ionicons";
import RNFetchBlob from "rn-fetch-blob";

var RNFS = require("react-native-fs");

export default class CVideo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadStatus: 0,
      uploading: false,
      uploadCancel: false
    };
  }

  static navigationOptions = {
    headerVisible: false
  };
  componentWillMount() {
    Orientation.lockToPortrait();
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

  _updateRNFB = (realPath, fileName1, onlyfileName) => async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        ); // I used redux saga here. 'yield' keywoard. You don't have to use that. You can use async - await or Promises.

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("upload started....");
          this.setState({ uploading: true });
          console.log(realPath, fileName1, onlyfileName);
          this.task = RNFetchBlob.fetch(
            "POST",
            "https://youthevoice.com/postcomment",
            {
              "Content-Type": "application/octet-stream"
            },
            [
              {
                name: onlyfileName,
                filename: fileName1,

                // upload a file from asset is also possible in version >= 0.6.2
                data: RNFetchBlob.wrap(realPath)
              }
            ]
          )
            .uploadProgress({ interval: 1000 }, (loaded, total) => {
              this.setState({
                uploadStatus: Math.floor((loaded / total) * 100)
              });
              console.log(
                "progress " + Math.floor((loaded / total) * 100) + "%"
              );
            })
            .then(res => {
              console.log(res.text());
              this.setState({
                uploadStatus: 100
              });
            })
            .catch(err => {
              console.log(err);
            });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  uploadCancel = () => {
    this.task.cancel();

    this.setState({ uploadCancel: true });
  };

  render() {
    // alert("file://" + RNFS.DocumentDirectoryPath + "/test.mp4");
    const { navigation } = this.props;
    const correctpath = navigation.getParam("correctpath", null);
    const fileName = navigation.getParam("fileName", null);
    const onlyfileName = navigation.getParam("onlyfileName", null);

    return (
      <View style={styles.container}>
        <VideoPlayer
          //source={{ uri: "https://youthevoice.com/test123.mp4" }}
          source={{ uri: this.props.navigation.getParam("correctpath", "") }}
          //title={this.props.title}
          title="Apppuuuu"
          audioOnly={true}
          // poster={"https://youthevoice.com/a1.jpg"}
          onBack={() => this._back()}
          //onEnd={() => this._onEnd()}
        />

        {this.state.uploading && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              padding: 10,
              alignItems: "center"
            }}
          >
            <TouchableOpacity onPress={this.uploadCancel}>
              <View style={styles.bottomBarItem}>
                <Fa5 name="camera-retro" size={30} />
                <Text style={{ paddingVertical: 5 }}> cancel</Text>
              </View>
            </TouchableOpacity>

            <ProgressCircle
              percent={this.state.uploadStatus}
              radius={50}
              borderWidth={8}
              color="#3399FF"
              shadowColor="#999"
              bgColor="#fff"
            >
              <Text style={{ fontSize: 18 }}>
                {this.state.uploadStatus + "%"}
              </Text>
            </ProgressCircle>
          </View>
        )}

        {!this.state.uploading && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 10
            }}
          >
            <TouchableOpacity onPress={this.pVideo}>
              <View style={styles.bottomBarItem}>
                <Fa5 name="camera-retro" size={30} />
                <Text style={{ paddingVertical: 5 }}> Record Again</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this._updateRNFB(correctpath, fileName, onlyfileName)}
            >
              <View style={styles.bottomBarItem}>
                <Fa5 name="cloud-upload-alt" size={30} />
                <Text style={{ paddingVertical: 5 }}> Upload</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bottomBarItem: {
    alignItems: "center",
    justifyContent: "center"
  }
});
