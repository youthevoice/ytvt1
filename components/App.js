/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Alert
} from "react-native";

import SplashScreen from "react-native-splash-screen";
import AllArticles from "./allArticles";
import { createStackNavigator, createAppContainer } from "react-navigation";
import DetailArticle from "./detailArticle";
import PlayVideo from "./playVideo";
import GLogin from "./gfLogin";
import FbLogin from "./fbfLogin";
import YtvShare from "./aShare";
import PLogin from "./phLogin";
import YtvLogin from "./ytvLogin";
import Tlogin from "./tfLogin";
import firebase from "react-native-firebase";
import CVideo from "./commentVideo";
import Orientation from "react-native-orientation";
import CameraScreen from "./camera";
import Audio from "./audio";
import PickFile from "./pickFile";
import PExample from "./progress";
import RAudio from "./recordAudio";
import Noti from "./noti";

const Articles = createStackNavigator(
  {
    AllArticles: {
      screen: AllArticles
    },
    DetailArticle: {
      screen: DetailArticle,
      path: "youthevoice.com/:articleId"
    },
    PlayVideo: {
      screen: PlayVideo
    },
    PLogin: {
      screen: PLogin
    },
    GLogin: {
      screen: GLogin
    },
    FbLogin: {
      screen: FbLogin
    },
    YtvLogin: {
      screen: YtvLogin
    },
    YtvShare: {
      screen: YtvShare
    },
    CameraScreen: {
      screen: CameraScreen
    },
    CVideo: {
      screen: CVideo
    },
    PickFile: {
      screen: PickFile
    }
  },
  {
    headerMode: "none"
  },
  {
    initialRouteName: "AllArticles"
  }
);
const prefix = "https://";

const AppContainer = createAppContainer(Articles);

const MainApp = () => <AppContainer uriPrefix={prefix} />;

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      isAnonAuthenticated: false
    };
  }

  async componentDidMount() {
    // do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash screen
    SplashScreen.hide();
    Orientation.lockToPortrait();
    firebase
      .auth()
      .signInAnonymously()
      .then(() => {
        this.setState({
          isAnonAuthenticated: true
        });
      });
  }
  render() {
    return <MainApp />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
