import { AccessToken, LoginManager } from "react-native-fbsdk";
import firebase from "react-native-firebase";
import React, { Component } from "react";
import { View, Button } from "react-native";
//import { LoginButton, AccessToken, LoginManager } from "react-native-fbsdk";

import Snackbar from "react-native-snackbar";
import { connect } from "react-redux";
import { loginDetails } from "./store/actions";

import { Input, Button as Button1 } from "react-native-elements";

class FBLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null,
      error: null
    };
  }

  ffacebookLogin = async () => {
    let result;
    try {
      try {
        this.setState({ showLoadingModal: true });
        LoginManager.setLoginBehavior("NATIVE_ONLY");
        result = await LoginManager.logInWithReadPermissions([
          "public_profile",
          "email"
        ]);
      } catch (nativeError) {
        try {
          LoginManager.setLoginBehavior("WEB_ONLY");
          result = await LoginManager.logInWithReadPermissions([
            "public_profile",
            "email"
          ]);
        } catch (webError) {
          // show error message to the user if none of the FB screens
          // did not open
        }
      }

      if (result.isCancelled) {
        // handle this however suites the flow of your app
        throw new Error("User cancelled request");
      }

      console.log(
        `Login success with permissions: ${result.grantedPermissions.toString()}`
      );

      // get the access token
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        // handle this however suites the flow of your app
        throw new Error(
          "Something went wrong obtaining the users access token"
        );
      }

      // create a new firebase credential with the token
      const credential = firebase.auth.FacebookAuthProvider.credential(
        data.accessToken
      );

      // login with credential
      const firebaseUserCredential = await firebase
        .auth()
        .signInWithCredential(credential);

      console.log(JSON.stringify(firebaseUserCredential.user.toJSON()));
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    return (
      <View>
        <Button
          onPress={this.ffacebookLogin}
          title="Learn More"
          color="#841584"
        />
      </View>
    );
  }
}

const mapDispathToProps = dispatch => {
  return {
    userLoginDetails: data => dispatch(loginDetails(data))
  };
};

export default connect(
  null,
  mapDispathToProps
)(FBLogin);

// Calling the following function will open the FB login dialogue:
