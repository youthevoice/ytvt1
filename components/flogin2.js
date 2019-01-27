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
        showLoadingModal: false,
        notificationMessage: I18n.t("welcome.FACEBOOK_CANCEL_LOGIN")
      });
    } else {
      // Create a graph request asking for user information
      this.FBGraphRequest("id", this.FBLoginCallback);
    }
  }

  async FBLoginCallback(error, result) {
    if (error) {
      this.setState({
        showLoadingModal: false
      });
    } else {
      // Retrieve and save user details in state. In our case with
      // Redux and custom action saveUser
      console.log(result);
      this.setState({
        id: result.id,
        email: result.email,
        image: result.picture.data.url
      });
    }
  }

  async FBGraphRequest(fields, callback) {
    const accessData = await AccessToken.getCurrentAccessToken();
    console.log("Accesssss Data", accessData);
    // Create a graph request asking for user information
    const infoRequest = new GraphRequest(
      "/me",
      {
        accessToken: accessData.accessToken,
        parameters: {
          fields: {
            string: fields
          }
        }
      },
      this.FBLoginCallback
    );
    // Execute the graph request created above
    new GraphRequestManager().addRequest(infoRequest).start();
  }

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
