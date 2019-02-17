import React, { Component } from "react";

import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  ScrollView,
  Linking,
  AlertIOS,
  //AsyncStorage,
  TextInput,
  Button,
  AsyncStorage
} from "react-native";
import axios from "axios";
import Fa5 from "react-native-vector-icons/FontAwesome5";

//import { SocialIcon } from "react-native-elements";

import { Input, Button as Button1 } from "react-native-elements";

import Icon from "react-native-vector-icons/Ionicons";

import { RectButton, BorderlessButton } from "react-native-gesture-handler";

import { GoogleSignin, statusCodes } from "react-native-google-signin";
import firebase from "react-native-firebase";
import Loader from "./loader";
import SpinnerButton from "react-native-spinner-button";

import Snackbar from "react-native-snackbar";
import { connect } from "react-redux";
import { loginDetails } from "./store/actions";

class GoogleLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null,
      error: false,
      errorMsg: null,
      loadL: false,
      dotLoading: false
    };
  }

  async componentDidMount() {
    // this.googleLogin();
  }

  _onPress = articleId => () => {
    /* 1. Navigate to the Details route with params */

    this.setState({ loadL: true });

    axios
      .get("https://youthevoice.com/getarticles", {
        params: {
          articleId: articleId
        }
      })
      .then(res => {
        console.log(res.data);
        this.setState({
          loadL: false,
          dotLoading: false
        });
        this.props.navigation.navigate("DetailArticle", {
          datailData: res.data
        });
      })
      .catch(error => {
        this.setState({ error, loadL: false });
      });
  };

  googleLogin = async () => {
    this.setState({ loadL: true, dotLoading: true });
    try {
      // add any configuration settings here:
      await GoogleSignin.configure();
      var data;
      try {
        data = await GoogleSignin.signIn();
        console.log("data....", data);
        var acData = {
          isAuthenticated: true,
          authMethod: "Google Login",
          userId: data.user.email,
          sName: data.user.givenName
        };
        this.props.userLoginDetails(acData);

        if (
          this.state.screenName == "DetailArticle" &&
          this.state.articleId != null &&
          this.state.articleId != ""
        ) {
          this.props.navigation.navigate("DetailArticle", {
            articleId: this.state.articleId
          });
        } else if (
          this.state.screenName != null &&
          this.state.screenName != ""
        ) {
          this.props.navigation.navigate(this.state.screenName);
        } else {
          this.props.navigation.navigate("AllArticles");
        }
      } catch (error) {
        this.setState({ loadL: false, dotLoading: false, error: true });
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

      if (!this.state.error) {
        // create a new firebase credential with the token
        const credential = firebase.auth.GoogleAuthProvider.credential(
          data.idToken,
          data.accessToken
        );
        // login with credential
        const firebaseUserCredential = await firebase
          .auth()
          .signInWithCredential(credential);

        console.log(JSON.stringify(firebaseUserCredential.user.toJSON()));
        try {
          await AsyncStorage.setItem("isLoggedIn", "yes");
          await AsyncStorage.setItem(
            "sName",
            firebaseUserCredential.user.toJSON().displayName
          );
          await AsyncStorage.setItem("authMethod", "google");
          await AsyncStorage.setItem(
            "userId",
            firebaseUserCredential.user.toJSON().email
          );
        } catch (error) {
          console.log(error);
        }
        this._onPress("a2b3a780-eaed-4cbf-b373-38a46ce20455")();
      }
    } catch (e) {
      this.setState({ loadL: false, dotLoading: false });
      console.error(e);
    }
  };
  render() {
    const { navigation } = this.props;
    const articleID = navigation.getParam("articleID", "");

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#bf360c" />
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name="ios-arrow-round-back" color="#fff" size={30} />
              <Text style={styles.logo}>Back...</Text>
            </View>
          </TouchableOpacity>
          <View>
            <BorderlessButton
              onPress={() => this.props.navigation.toggleDrawer()}
            >
              <Icon name="ios-search" color="#ffffff" size={30} />
            </BorderlessButton>
          </View>
        </View>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <View>
            {/* <Loader loading={this.state.loadL} /> */}

            <Button1
              buttonStyle={styles.LoginButton}
              icon={<Fa5 name="sign-in-alt" size={20} color="white" />}
              iconLeft
              title="Login with Google"
              titleStyle={{ paddingLeft: 10 }}
              onPress={this.googleLogin}
              //disabled={this.state.validPhone && this.state.validSname ? false : true}
              // loading={this.state.otpLoading}
            />
          </View>
        </View>
      </SafeAreaView>
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
)(GoogleLogin);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e3f2fd" },
  question: {
    padding: 10,
    fontSize: 20,
    fontWeight: "bold"
  },
  qoption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15
  },
  label: {
    fontSize: 16,
    fontWeight: "normal",
    marginBottom: 48
  },
  card: {
    backgroundColor: "#ffffff",
    elevation: 3,
    marginVertical: 2
  },
  cardseparator: {
    borderBottomColor: "#d1d0d4",
    borderBottomWidth: 1
  },
  cardHeader: {
    fontSize: 18,

    paddingHorizontal: 15,
    paddingVertical: 30,
    color: "#bf360c",
    fontWeight: "bold"
  },
  cardImage: {
    width: null,
    height: 100
  },
  cardText: {
    fontSize: 14,
    padding: 5
  },
  headerBar: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#1b5e20",
    elevation: 3,
    paddingHorizontal: 15,

    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#9e9e9e",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 1,
    shadowOpacity: 1.0
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    paddingLeft: 5,
    letterSpacing: 2
  },
  h1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#bf360c",
    paddingLeft: 5,
    letterSpacing: 2
  },
  h1w: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    paddingLeft: 5,
    letterSpacing: 2
  },
  bottomBarItem: {
    alignItems: "center",
    justifyContent: "center"
  },
  buttonStyle: {
    borderRadius: 10,
    margin: 20,
    width: 200
  },
  LoginButton: {
    // backgroundColor: "#0d47a1",
    borderRadius: 50,
    padding: 10,
    height: 50,
    width: 250
  }
});
