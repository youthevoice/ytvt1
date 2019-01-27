import { NativeModules } from "react-native";
import firebase from "react-native-firebase";
import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Alert,
  Button,
  AsyncStorage
} from "react-native";

import Button1 from "react-native-button";

const { RNTwitterSignIn } = NativeModules;
const { TwitterAuthProvider } = firebase.auth;

const TwitterKeys = {
  TWITTER_CONSUMER_KEY: "oIERDMEsxVY9xcIexlPbQVBJc",
  TWITTER_CONSUMER_SECRET: "ZOF2gm7Wt5ixbPX2B10sfYfkCSaHigaCtZqKOcKjmdOEjawQox"
};

export default class GS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null,
      error: null
    };
  }
  twitterLogin = async () => {
    try {
      await RNTwitterSignIn.init(
        TwitterKeys.TWITTER_CONSUMER_KEY,
        TwitterKeys.TWITTER_CONSUMER_SECRET
      );

      // also includes: name, userID & userName
      const { authToken, authTokenSecret } = await RNTwitterSignIn.logIn();

      const credential = TwitterAuthProvider.credential(
        authToken,
        authTokenSecret
      );

      const firebaseUserCredential = await firebase
        .auth()
        .signInWithCredential(credential);

      console.log(JSON.stringify(firebaseUserCredential.user.toJSON()));
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    // const { navigation } = this.props;
    //  const articleID = navigation.getParam("articleID", "");

    return (
      <View>
        <Button1
          containerStyle={{
            padding: 10,
            height: 45,
            width: 200,

            overflow: "hidden",
            borderRadius: 4,
            backgroundColor: "#eceff1"
          }}
          style={{ fontSize: 20, color: "green" }}
          styleDisabled={{ color: "red" }}
          onPress={this.twitterLogin}
        >
          Login
        </Button1>
      </View>
    );
  }
}
