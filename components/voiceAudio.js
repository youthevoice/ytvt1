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
      pulseLoading: false
    };
  }

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

        <View>
          <View style={styles.bottomBarItem}>
            <SpinnerButton
              buttonStyle={[styles.buttonStyle, { backgroundColor: "white" }]}
              isLoading={this.state.pulseLoading}
              spinnerType="PulseIndicator"
              onPress={() => {
                this.setState({ pulseLoading: true });
                setTimeout(() => {
                  this.setState({ pulseLoading: false });
                }, 3000);
              }}
            >
              <Fa5 name={"microphone-alt"} size={30} color="#DD4B39" />
            </SpinnerButton>

            <Text> Record Audio</Text>
          </View>

          <View style={styles.bottomBarItem}>
            <SpinnerButton
              buttonStyle={[styles.buttonStyle, { backgroundColor: "white" }]}
              isLoading={this.state.pulseLoading}
              spinnerType="PulseIndicator"
              onPress={() => {
                this.setState({ pulseLoading: true });
                setTimeout(() => {
                  this.setState({ pulseLoading: false });
                }, 3000);
              }}
            >
              <Fa5 name={"play"} size={30} color="#DD4B39" />
            </SpinnerButton>

            <Text> Play Audio</Text>
          </View>

          <View style={styles.bottomBarItem}>
            <SpinnerButton
              buttonStyle={[styles.buttonStyle, { backgroundColor: "white" }]}
              isLoading={this.state.pulseLoading}
              spinnerType="PulseIndicator"
              onPress={() => {
                this.setState({ pulseLoading: true });
                setTimeout(() => {
                  this.setState({ pulseLoading: false });
                }, 3000);
              }}
            >
              <Fa5 name={"upload"} size={30} color="#DD4B39" />
            </SpinnerButton>

            <Text> Submit & Upload...</Text>
          </View>
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
