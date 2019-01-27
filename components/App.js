/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
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

import Orientation from "react-native-orientation";

const Articles = createStackNavigator(
  {
    AllArticles: {
      screen: AllArticles
    },
    DetailArticle: {
      screen: DetailArticle
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
    }
  },
  {
    headerMode: "none"
  },
  {
    initialRouteName: "AllArticles"
  }
);

const AppContainer = createAppContainer(Articles);

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      isAnonAuthenticated: false
    };
  }

  componentDidMount() {
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
    return <AppContainer />;
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
