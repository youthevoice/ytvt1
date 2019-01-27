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
  PermissionsAndroid
} from "react-native";

import Sound from "react-native-sound";
import { AudioRecorder, AudioUtils } from "react-native-audio";
var RNFS = require("react-native-fs");
import Fa5 from "react-native-vector-icons/FontAwesome5";
import Icon from "react-native-vector-icons/Ionicons";
import { RectButton, BorderlessButton } from "react-native-gesture-handler";

export default class AudioExample extends Component {
  state = {
    currentTime: 0.0,
    recording: false,
    paused: false,
    stoppedRecording: false,
    finished: false,
    audioPath: RNFS.DocumentDirectoryPath + "/test.aac",
    hasPermission: undefined
  };

  prepareRecordingPath(audioPath) {
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
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

  _renderButton(title, onPress, active) {
    var style = active ? styles.activeButtonText : styles.buttonText;

    return (
      <TouchableHighlight style={styles.button} onPress={onPress}>
        <Text style={style}>{title}</Text>
      </TouchableHighlight>
    );
  }

  _renderPauseButton(onPress, active) {
    var style = active ? styles.activeButtonText : styles.buttonText;
    var title = this.state.paused ? "RESUME" : "PAUSE";
    return (
      <TouchableHighlight style={styles.button} onPress={onPress}>
        <Text style={style}>{title}</Text>
      </TouchableHighlight>
    );
  }

  async _pause() {
    if (!this.state.recording) {
      console.warn("Can't pause, not recording!");
      return;
    }

    try {
      const filePath = await AudioRecorder.pauseRecording();
      this.setState({ paused: true });
    } catch (error) {
      console.error(error);
    }
  }

  async _resume() {
    if (!this.state.paused) {
      console.warn("Can't resume, not paused!");
      return;
    }

    try {
      await AudioRecorder.resumeRecording();
      this.setState({ paused: false });
    } catch (error) {
      console.error(error);
    }
  }

  async _stop() {
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

      this.uploadFile();

      return filePath;
    } catch (error) {
      console.error(error);
    }
  }

  async _play() {
    if (this.state.recording) {
      await this._stop();
    }

    // These timeouts are a hacky workaround for some issues with react-native-sound.
    // See https://github.com/zmxv/react-native-sound/issues/89.
    setTimeout(() => {
      var sound = new Sound(this.state.audioPath, "", error => {
        if (error) {
          console.log("failed to load the sound", error);
        }
      });

      setTimeout(() => {
        sound.play(success => {
          if (success) {
            console.log("successfully finished playing");
            console.log(this.state.audioPath);
            alert(this.state.audioPath);
          } else {
            console.log("playback failed due to audio decoding errors");
          }
        });
      }, 100);
    }, 100);
  }

  async _record() {
    if (this.state.recording) {
      console.warn("Already recording!");
      return;
    }

    if (!this.state.hasPermission) {
      console.warn("Can't record, no permission granted!");
      return;
    }

    if (this.state.stoppedRecording) {
      this.prepareRecordingPath(this.state.audioPath);
    }

    this.setState({ recording: true, paused: false });

    try {
      const filePath = await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error);
    }
  }

  _finishRecording(didSucceed, filePath, fileSize) {
    this.setState({ finished: didSucceed });
    console.log(
      `Finished recording of duration ${
        this.state.currentTime
      } seconds at path: ${filePath} and size of ${fileSize || 0} bytes`
    );
  }

  uploadFile = () => {
    var uploadUrl = "https://youthevoice.com/postcomment"; // For testing purposes, go to http://requestb.in/ and create your own link
    // create an array of objects of the files you want to upload
    var files = [
      {
        name: "test",
        filename: "test.aac",
        filepath: RNFS.DocumentDirectoryPath + "/test.aac"
      }
    ];

    var uploadBegin = response => {
      var jobId = response.jobId;
      console.log("UPLOAD HAS BEGUN! JobId: " + jobId);
    };

    var uploadProgress = response => {
      var percentage = Math.floor(
        (response.totalBytesSent / response.totalBytesExpectedToSend) * 100
      );
      console.log("UPLOAD IS " + percentage + "% DONE!");
    };

    // upload files
    RNFS.uploadFiles({
      toUrl: uploadUrl,
      files: files,
      method: "POST",
      headers: {
        Accept: "application/json"
      },
      fields: {
        hello: "world"
      },
      begin: uploadBegin,
      progress: uploadProgress
    })
      .promise.then(response => {
        if (response.statusCode == 200) {
          console.log("FILES UPLOADED!"); // response.statusCode, response.headers, response.body
        } else {
          console.log("SERVER ERROR");
        }
      })
      .catch(err => {
        if (err.description === "cancelled") {
          // cancelled by user
        }
        console.log(err);
      });
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

        <View style={styles.controls}>
          {this._renderButton(
            "RECORD",
            () => {
              this._record();
            },
            this.state.recording
          )}
          {this._renderButton("PLAY", () => {
            this._play();
          })}
          {this._renderButton("STOP", () => {
            this._stop();
          })}
          {/* {this._renderButton("PAUSE", () => {this._pause()} )} */}
          {this._renderPauseButton(() => {
            this.state.paused ? this._resume() : this._pause();
          })}
          <Text style={styles.progressText}>{this.state.currentTime}s</Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
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
  controls: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  progressText: {
    paddingTop: 50,
    fontSize: 50,
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
    color: "#000"
  },
  activeButtonText: {
    fontSize: 20,
    color: "#B81F00"
  }
});
