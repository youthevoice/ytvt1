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
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes
} from "react-native-google-signin";

import Button1 from "react-native-button";
import Loader from "./loader";

export default class GS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null,
      error: null,
      loadL: false
    };
  }

  async componentDidMount() {
    this._configureGoogleSignIn();
    //  await this._getCurrentUser();
  }

  _configureGoogleSignIn() {
    GoogleSignin.configure({
      webClientId:
        "659829620159-opbr2gvgsfocddcdg57qflodugemi4i3.apps.googleusercontent.com",
      offlineAccess: false
    });
  }

  renderIsSignedIn() {
    return (
      <Button
        onPress={async () => {
          const isSignedIn = await GoogleSignin.isSignedIn();
          Alert.alert(String(isSignedIn));
        }}
        title="is user signed in?"
      />
    );
  }

  _signIn = async () => {
    try {
      // this._signOut();
      //await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({ userInfo, error: null });
      console.log(userInfo);

      await AsyncStorage.setItem("isLoggedIn", "true");
      await AsyncStorage.setItem("loggedinMethod", "google");
      await AsyncStorage.setItem("loggedinTime", new Date());
      Alert.alert("Hello about to call navigation");
      this.props.navigation.navigate("AllArticles");
      console.log("google llloohinnn");
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // sign in was cancelled
        Alert.alert("cancelled");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation in progress already
        Alert.alert("in progress");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("play services not available or outdated");
      } else {
        Alert.alert("Something went wrong", error.toString());
        this.setState({
          error
        });
      }
    }
  };

  _signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      Alert.alert("signed out successfullyyyy");
      this.setState({ userInfo: null, error: null });
    } catch (error) {
      this.setState({
        error
      });
    }
  };

  render() {
    const { navigation } = this.props;
    const articleID = navigation.getParam("articleID", "");

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
          onPress={this._signIn}
        >
          Login
        </Button1>
        <Button1
          style={{ fontSize: 20, color: "green" }}
          styleDisabled={{ color: "red" }}
          onPress={this._signOut}
        >
          Logout
        </Button1>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
