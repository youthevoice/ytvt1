import React, { Component } from "react";
import { View, Button } from "react-native";
import { LoginButton, AccessToken, LoginManager } from "react-native-fbsdk";

import Snackbar from "react-native-snackbar";
import { connect } from "react-redux";
import { loginDetails } from "./store/actions";

import { Input, Button as Button1 } from "react-native-elements";

class FbLogin extends Component {
  loginFacebook = () => {
    LoginManager.logInWithReadPermissions(["public_profile"]).then(
      function(result) {
        if (result.isCancelled) {
          alert("Login Error");
          console.log("Login cancelled");
        } else {
          alert("Login success");
          AccessToken.getCurrentAccessToken().then(data => {
            console.log(data.accessToken.toString());
          });
          console.log(
            "Login success with permissions: " +
              result.grantedPermissions.toString()
          );
        }
      },
      function(error) {
        alert(error);
        console.log("Login fail with error: " + error);
      }
    );
  };

  render() {
    return (
      <View>
        <Button
          onPress={this.loginFacebook}
          title="Learn More"
          color="#841584"
        />
      </View>
    );
  }
}
