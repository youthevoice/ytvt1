import React, { Component } from "react";
import { View, Button } from "react-native";
import { LoginButton, AccessToken, LoginManager } from "react-native-fbsdk";

export default class Login extends Component {
  loginFacebook = () => {
    LoginManager.logInWithReadPermissions(["public_profile"]).then(
      function(result) {
        if (result.isCancelled) {
          alert("Login Error");
          console.log("Login cancelled");
        } else {
          alert("Login success");
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
