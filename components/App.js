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
import FLogin from "./fbfLogin";
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
import ImagePick from "./imagePick";
import YtvVoice from "./addVoice";
import VoiceImage1 from "./voiceImage";
import VoiceAudio from "./voiceAudio";
import VoiceVideo from "./voiceVideo";
import ChooseLang from "./chooseLang";
import AllComments from "./comments";
import CommentReplies from "./commentReplies";
import PlaySound from "./playSound";
import CheckImages from "./checkImages";

import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import reducer from "./store/reducer";

import TSound1 from "./soundT1";

import AsyncText from "./asyncSTest";

const store = createStore(reducer, applyMiddleware(thunk));

console.log("store....", store);

const VoiceImage = createStackNavigator(
  {
    VoiceImage: {
      screen: VoiceImage1
    },
    CheckImages: {
      screen: CheckImages
    }
  },

  {
    headerMode: "none"
  },
  {
    initialRouteName: "VoiceImage1"
  }
);

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
    FLogin: {
      screen: FLogin
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
    },
    YtvVoice: {
      screen: YtvVoice
    },
    VoiceImage: {
      screen: VoiceImage
    },
    VoiceAudio: {
      screen: VoiceAudio
    },
    VoiceVideo: {
      screen: VoiceVideo
    },
    ChooseLang: {
      screen: ChooseLang
    },
    AllComments: {
      screen: AllComments
    },
    CommentReplies: {
      screen: CommentReplies
    },
    PlaySound: {
      screen: PlaySound
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
    try {
      isAuthenticated = await AsyncStorage.getItem("isAuthenticated");
      authMethod = await AsyncStorage.getItem("authMethod");
      userId = await AsyncStorage.getItem("userId");
      sname = await AsyncStorage.getItem("sName");
      console.log(isAuthenticated, authMethod, userId, sname);
    } catch (error) {
      console.log(error);
    }
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
    return (
      <Provider store={store}>
        <MainApp />
      </Provider>
    );
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
