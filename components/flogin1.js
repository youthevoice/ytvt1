import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager
} from "react-native-fbsdk";
import React, { Component } from "react";
import { View, Button } from "react-native";
//import { LoginButton, AccessToken, LoginManager } from "react-native-fbsdk";

export default class FbLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null,
      error: null
    };
  }

  async facebookLogin() {
    // native_only config will fail in the case that the user has
    // not installed in his device the Facebook app. In this case we
    // need to go for webview.
    let result;
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
    // handle the case that users clicks cancel button in Login view
    if (result.isCancelled) {
      this.setState({
        showLoadingModal: false
        //, notificationMessage: I18n.t("welcome.FACEBOOK_CANCEL_LOGIN")
      });
    } else {
      AccessToken.getCurrentAccessToken().then(data => {
        const infoRequest = new GraphRequest(
          "/me?fields=name,picture",
          null,
          this._responseInfoCallback
        );
        // Start the graph request.
        new GraphRequestManager().addRequest(infoRequest).start();
      });
    }
  }

  _responseInfoCallback = (error, result) => {
    if (error) {
      alert("Error fetching data: " + error.toString());
    } else {
      // alert("Result Name: " + result.name);
      console.log("11111111112222", result);
    }
  };

  render() {
    return (
      <View>
        <Button
          onPress={this.facebookLogin}
          title="Learn More"
          color="#841584"
        />
      </View>
    );
  }
}
