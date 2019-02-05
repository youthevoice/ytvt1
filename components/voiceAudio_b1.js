import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  NativeModules,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  TextInput
} from "react-native";

import Video from "react-native-video";

var ImagePicker = NativeModules.ImageCropPicker;
import Btn from "react-native-micro-animated-button";

//import Share from "react-native-share";
import Share, { ShareSheet, Button } from "react-native-share";
import Fa5 from "react-native-vector-icons/FontAwesome5";
//import images from "./imageBase64";
import Icon from "react-native-vector-icons/Ionicons";
import { RectButton, BorderlessButton } from "react-native-gesture-handler";

var RNFS = require("react-native-fs");

import SoundRecorder from "react-native-sound-recorder";
import SoundPlayer from "react-native-sound-player";

import SpinnerButton from "react-native-spinner-button";
import ProgressCircle from "react-native-progress-circle";

import RNFetchBlob from "rn-fetch-blob";

// import SpinnerButton from './components/SpinnerButton';
const colors = [
  "#893346",
  "#1aafb8",
  "#bf57c3",
  "#dead00",
  "#666666",
  "#4CA0F7",
  "#123456",
  "#F87217"
];

export default class ImagePick extends Component {
  constructor() {
    super();
    this.state = {
      image: null,
      images: null,
      pulseLoading: false,
      pacmanLoading: false,
      waveLoading: false,
      uploadStatus: 0,
      uploading: false,
      uploadCancel: false,
      stopRecording: false,
      isRecording: false
    };
  }

  record = () => {
    this.setState({ pacmanLoading: true, isRecording: true });

    SoundRecorder.start(SoundRecorder.PATH_CACHE + "/test123.mp4").then(
      function() {
        console.log("started recording");
      }
    );
  };

  stopRecord = () => {
    this.setState({ waveLoading: true });
    SoundRecorder.stop().then(result => {
      this.setState({
        pacmanLoading: false,
        isRecording: false,
        waveLoading: false
      });
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
          task = RNFetchBlob.fetch(
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
          );
          this.setState({ task: task });

          task.uploadProgress({ interval: 1000 }, (loaded, total) => {
            this.setState({
              uploadStatus: Math.floor((loaded / total) * 100)
            });
            console.log("progress " + Math.floor((loaded / total) * 100) + "%");
          });

          task
            .then(res => {
              console.log("from resppooo", res.text());
              this.setState({
                uploadStatus: 100
              });
            })
            .catch(err => {
              console.log("task erroroooooo", err);
            });
        }
      }
    } catch (e) {
      console.log("Cancellllll", e);
      this.setState({ task: "" });
    }
  };

  uploadCancel = (err, taskid) => {
    this.state.task.cancel();
    this.setState({ uploadCancel: true, uploading: false });
    console.log("from state", this.state.task);
    console.log("from fun", err + taskid);
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#bf360c" />
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name="ios-arrow-round-back" color="#fff" size={30} />
              <Text style={styles.logo}>Back...</Text>
            </View>
          </TouchableOpacity>
          <View>
            <BorderlessButton
              onPress={() => this.props.navigation.toggleDrawer()}
            >
              <Icon name="ios-search" color="#ffffff" size={30} />
            </BorderlessButton>
          </View>
        </View>
        <View style={styles.MainContainer}>
          <TextInput
            style={styles.TextInputStyleClass}
            //underlineColorAndroid="transparent"
            placeholder={"Add Your Voice..."}
            placeholderTextColor={"#9E9E9E"}
            numberOfLines={10}
            multiline={true}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 20
            }}
          >
            <BorderlessButton>
              <Text> Submit Comment </Text>
            </BorderlessButton>
            <BorderlessButton>
              <Text style={{ paddingLeft: 10 }}> Cancel </Text>
            </BorderlessButton>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            padding: 10
          }}
        >
          <TouchableOpacity style={styles.bottomBarItem}>
            <SpinnerButton
              buttonStyle={[
                styles.buttonStyle,
                { backgroundColor: "#0d47a1", borderRadius: 50, width: 125 }
              ]}
              isLoading={this.state.pacmanLoading}
              spinnerType="PacmanIndicator"
              onPress={this.record}
            >
              <Fa5 name={"microphone-alt"} size={30} color="#fff" />
            </SpinnerButton>

            {!this.state.pacmanLoading ? (
              <Text>Start Recording</Text>
            ) : (
              <Text>Recording...</Text>
            )}
          </TouchableOpacity>

          {this.state.isRecording ? (
            <TouchableOpacity
              style={styles.bottomBarItem}
              onPress={this.stopRecord}
            >
              <SpinnerButton
                buttonStyle={[
                  styles.buttonStyle,
                  { backgroundColor: "#e65100", borderRadius: 50, width: 125 }
                ]}
                isLoading={this.state.waveLoading}
                spinnerType="WaveIndicator"
                onPress={this.stopRecord}
              >
                <Fa5 name={"microphone-alt-slash"} size={30} color="#fff" />
              </SpinnerButton>

              {!this.state.pulseLoading ? (
                <Text style={{ paddingTop: 10 }}>Stop Recording</Text>
              ) : (
                <Text>Stoping...</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.bottomBarItem}
              onPress={this.stopRecord}
            >
              <SpinnerButton
                buttonStyle={[
                  styles.buttonStyle,
                  { backgroundColor: "#cccccc", borderRadius: 50, width: 125 }
                ]}
                isLoading={this.state.waveLoading}
                spinnerType="WaveIndicator"
              >
                <Fa5 name={"microphone-alt-slash"} size={30} color="#bcaaa4" />
              </SpinnerButton>

              {!this.state.pulseLoading ? (
                <Text>Stop Recording</Text>
              ) : (
                <Text>Stoping...</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    backgroundColor: "blue",
    marginBottom: 10
  },
  text: {
    color: "white",
    fontSize: 20,
    textAlign: "center"
  },
  container: { flex: 1, backgroundColor: "#e3f2fd" },
  question: {
    padding: 10,
    fontSize: 20,
    fontWeight: "bold"
  },
  qoption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15
  },
  label: {
    fontSize: 16,
    fontWeight: "normal",
    marginBottom: 48
  },
  card: {
    backgroundColor: "#ffffff",
    elevation: 3,
    marginVertical: 2
  },
  cardseparator: {
    borderBottomColor: "#d1d0d4",
    borderBottomWidth: 1
  },
  cardHeader: {
    fontSize: 18,
    padding: 5,
    color: "#bf360c",
    fontWeight: "bold"
  },
  cardImage: {
    width: null,
    height: 100
  },
  cardText: {
    fontSize: 14,
    padding: 5
  },
  headerBar: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#1b5e20",
    elevation: 3,
    paddingHorizontal: 15,

    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#9e9e9e",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 1,
    shadowOpacity: 1.0
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    paddingLeft: 5,
    letterSpacing: 2
  },
  bottomBarItem: {
    alignItems: "center",
    justifyContent: "center"
  },
  MainContainer: {
    paddingTop: Platform.OS === "ios" ? 20 : 0,
    justifyContent: "center",
    marginVertical: 20,
    marginHorizontal: 5
  },

  TextInputStyleClass: {
    textAlign: "center",
    height: 50,
    // borderWidth: 2,
    //borderColor: "#9E9E9E",
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    height: 150
  },
  safeArea: {
    backgroundColor: "#F5FCFF"
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
    paddingHorizontal: 20
  },
  buttonStyle: {
    borderRadius: 10,
    margin: 20,
    width: 200
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
