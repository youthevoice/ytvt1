import React, { Component } from "react";

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Platform,
  PermissionsAndroid,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView
} from "react-native";

import Sound from "react-native-sound";
import axios from "axios";
import { AudioRecorder, AudioUtils } from "react-native-audio";
import { Input, Divider, Button as Button1 } from "react-native-elements";
import Fa5 from "react-native-vector-icons/FontAwesome5";
import Icon from "react-native-vector-icons/Ionicons";
import { RectButton, BorderlessButton } from "react-native-gesture-handler";
var RNFS = require("react-native-fs");
import ProgressCircle from "react-native-progress-circle";
import RNFetchBlob from "rn-fetch-blob";
import { connect } from "react-redux";
import UUIDGenerator from "react-native-uuid-generator";

class VoiceAudio extends Component {
  state = {
    currentTime: 0.0,
    recording: false,
    paused: false,
    stoppedRecording: false,
    finished: false,
    audioPath: RNFS.DocumentDirectoryPath + "/youthevoiceAudio.mp4",
    hasPermission: undefined,
    isUploading: false,
    audioPath: RNFS.DocumentDirectoryPath + "/youthevoicedotcom.mp4",
    fileName: this.props.userId + "youthevoicedotcom.mp4",
    onlyFileName: this.props.userId + "youthevoicedotcom",
    uploadStatus: 0,
    commentText: ""
  };

  prepareRecordingPath(audioPath) {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 48000,
      Channels: 1,
      AudioQuality: "High",
      AudioEncoding: "aac",
      AudioEncodingBitRate: 32000
    });
  }

  componentDidMount() {
    AudioRecorder.requestAuthorization().then(isAuthorised => {
      this.setState({ hasPermission: isAuthorised });

      if (!isAuthorised) return;

      this.prepareRecordingPath(this.state.audioPath);

      AudioRecorder.onProgress = data => {
        this.setState({ currentTime: Math.floor(data.currentTime) });
      };

      AudioRecorder.onFinished = data => {
        // Android callback comes in the form of a promise instead.
        if (Platform.OS === "ios") {
          this._finishRecording(
            data.status === "OK",
            data.audioFileURL,
            data.audioFileSize
          );
        }
      };
    });
  }

  async componentWillUnmount() {
    if (this.state.recording) {
      try {
        const filePath = await AudioRecorder.stopRecording();
      } catch (error) {
        console.error(error);
      }
    }
  }

  _stop = async () => {
    if (!this.state.recording) {
      console.warn("Can't stop, not recording!");
      return;
    }

    this.setState({ stoppedRecording: true, recording: false, paused: false });

    try {
      const filePath = await AudioRecorder.stopRecording();

      if (Platform.OS === "android") {
        this._finishRecording(true, filePath);
      }
      // this.setState({ stoppedRecording: true });
      return filePath;
    } catch (error) {
      console.error(error);
    }
  };

  _record = async () => {
    if (this.state.recording) {
      console.warn("Already recording!");
      return;
    }

    if (!this.state.hasPermission) {
      console.warn("Can't record, no permission granted!");
      return;
    }

    AudioRecorder.onProgress = data => {
      this.setState({ currentTime: Math.floor(data.currentTime) });
    };

    if (this.state.stoppedRecording) {
      this.prepareRecordingPath(this.state.audioPath);
    }

    this.setState({ recording: true, paused: false });

    try {
      const filePath = await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error);
    }
  };

  _finishRecording(didSucceed, filePath, fileSize) {
    this.setState({ finished: didSucceed });
    console.log(
      `Finished recording of duration ${
        this.state.currentTime
      } seconds at path: ${filePath} and size of ${fileSize || 0} bytes`
    );
  }

  _playSound = () => {
    this.props.navigation.navigate("PlaySound", {
      fileUrl: this.state.audioPath
    });
  };

  SecondsTohhmmss = totalSeconds => {
    var hours = Math.floor(totalSeconds / 3600);
    var minutes = Math.floor((totalSeconds - hours * 3600) / 60);
    var seconds = totalSeconds - hours * 3600 - minutes * 60;

    // round seconds
    seconds = Math.round(seconds * 100) / 100;

    var result = hours < 10 ? "0" + hours : hours;
    result += ":" + (minutes < 10 ? "0" + minutes : minutes);
    result += ":" + (seconds < 10 ? "0" + seconds : seconds);
    return result;
  };

  _updateRNFB = async fileName => {
    //alert("Uoloaddddd");

    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        ); // I used redux saga here. 'yield' keywoard. You don't have to use that. You can use async - await or Promises.

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("upload started....");
          this.setState({ isUploading: true });
          console.log(
            this.state.audioPath,
            this.state.onlyFileName,
            this.state.fileName
          );
          task = RNFetchBlob.fetch(
            "POST",
            "https://youthevoice.com/postcomment",
            {
              "Content-Type": "application/octet-stream"
            },
            [
              {
                name: fileName,
                filename: fileName + ".mp4",

                // upload a file from asset is also possible in version >= 0.6.2
                data: RNFetchBlob.wrap(this.state.audioPath)
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
                uploadStatus: 100,
                isUploading: false
              });
            })
            .catch(err => {
              console.log("task erroroooooo", err);
            });
        }
      }
    } catch (e) {
      console.log("Cancellllll", e);
      this.setState({ task: "", isUploading: false });
    }
  };

  startUploadCancel = () => {
    Alert.alert(
      "Upload Cancel",
      "Do you want to cancel Upload...",
      [
        {
          text: "Cancel",
          onPress: () => {
            console.log("Cancel Pressed");
            return;
          },
          style: "cancel"
        },
        { text: "OK", onPress: () => this.uploadCancel() }
      ],
      { cancelable: false }
    );
  };
  uploadCancel = () => {
    this.state.task.cancel();
    this.setState({ uploadCancel: true, isUploading: false });
    console.log("from state", this.state.task);
    //console.log("from fun", err + taskid);
  };

  _submitTextAudio = (articleId, screenName) => async () => {
    _uuid = await UUIDGenerator.getRandomUUID();
    console.log(_uuid);

    axios
      .post("https://youthevoice.com/postTextAudioComment", {
        textComment: this.state.commentText,
        audioId: "Flintstone",
        userId: this.props.userId,
        articleId: _uuid,
        timeBeforeUpload: new Date(),
        audioUpload: "",
        timeAfterUpoad: ""
      })
      .then(response => {
        this._updateRNFB(_uuid);
        console.log(response);
      })
      .catch(error => {
        console.log("errrorrrr", error);
      });
  };

  render() {
    const { navigation } = this.props;
    const articleId = navigation.getParam("articleId", "");
    const screenName = navigation.getParam("screenName", "");

    console.log("hghghghh", articleId);

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
        <ScrollView>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Button1
              buttonStyle={styles.LoginButton}
              icon={
                <Fa5
                  name="microphone-alt"
                  size={25}
                  color="white"
                  style={{ paddingRight: 5 }}
                />
              }
              iconLeft
              title=" Start Recording"
              onPress={this._record}
              loading={this.state.recording}
            />
            <Text style={styles.progressText}>
              Time Recorded: {this.SecondsTohhmmss(this.state.currentTime)}
            </Text>
            <Button1
              buttonStyle={styles.LoginButton}
              icon={
                <Fa5
                  name="microphone-alt-slash"
                  size={15}
                  color="white"
                  style={{ paddingRight: 5 }}
                />
              }
              iconLeft
              title="Stop Recording"
              onPress={this._stop}
              // loading={this.state.stoppedRecording}
              disabled={!this.state.recording}
            />
            <Button1
              buttonStyle={styles.LoginButtonPlay}
              icon={
                <Fa5
                  name="play"
                  size={15}
                  color="white"
                  style={{ paddingRight: 5 }}
                />
              }
              iconLeft
              title="Play Recorded Voice"
              onPress={this._playSound}
              disabled={this.state.recording}
            />
            <Input
              id="phonenumber"
              label="Enter Your Voice..."
              containerStyle={{ paddingHorizontal: 20, paddingVertical: 30 }}
              // placeholder="YOUR VOICE..."
              errorStyle={{ color: this.state.validPhone ? "green" : "red" }}
              //errorMessage="ENTER YOUR VOICE"
              multiline={true}
              onChangeText={commentText => this.setState({ commentText })}
            />
            {!this.state.isUploading ? (
              <Button1
                buttonStyle={styles.LoginButtonUpload}
                icon={
                  <Fa5
                    name="cloud-upload-alt"
                    size={15}
                    color="white"
                    style={{ paddingRight: 5 }}
                  />
                }
                iconLeft
                title="Upload Your Voice"
                onPress={this._submitTextAudio(articleId, screenName)}
                disabled={this.state.recording}
              />
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  padding: 10,
                  alignItems: "center"
                }}
              >
                <TouchableOpacity onPress={this.startUploadCancel}>
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
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.isLoggedIn,
    authMethod: state.authMethod,
    userId: state.userId,
    sName: state.sName,
    isAuthenticated: state.isAuthenticated
  };
};

export default connect(
  mapStateToProps,
  null
)(VoiceAudio);

var styles = StyleSheet.create({
  controls: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  progressText: {
    paddingTop: 5,
    paddingBottom: 10,
    fontSize: 20,
    color: "#000"
  },
  button: {
    padding: 20
  },
  disabledButtonText: {
    color: "#eee"
  },
  buttonText: {
    fontSize: 20,
    color: "#fff"
  },
  activeButtonText: {
    fontSize: 20,
    color: "#B81F00"
  },
  LoginButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 50,
    margin: 10,
    height: 50,
    width: 200
  },
  LoginButtonPlay: {
    backgroundColor: "#9E9E9E",
    borderRadius: 50,
    margin: 10,
    height: 50,
    width: 200
  },
  LoginButtonUpload: {
    backgroundColor: "#FF9800",
    borderRadius: 50,
    margin: 10,
    height: 50,
    width: 200
  },
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
  }
});
