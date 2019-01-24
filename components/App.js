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
  componentDidMount() {
    // do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash screen
    SplashScreen.hide();
    Orientation.lockToPortrait();
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
