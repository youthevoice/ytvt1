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
  AsyncStorage,
  TextInput,
  Button
} from "react-native";
import axios from "axios";
import Fa5 from "react-native-vector-icons/FontAwesome5";

import { RectButton, BorderlessButton } from "react-native-gesture-handler";
import { TextField } from "react-native-material-textfield";

import Icon from "react-native-vector-icons/Ionicons";
import firebase from "react-native-firebase";
//import { AsyncStorage } from "react-native";
import Loader from "./loader";
import SpinnerButton from "react-native-spinner-button";

const successImageUri =
  "https://cdn.pixabay.com/photo/2015/06/09/16/12/icon-803718_1280.png";

export default class PhoneAuthTest extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
      message: "",
      codeInput: "",
      phoneNumber: "+91",
      confirmResult: null,
      loadL: false
    };
  }

  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user: user.toJSON() });
      } else {
        // User has been signed out, reset the state
        this.setState({
          user: null,
          message: "",
          codeInput: "",
          phoneNumber: "+91",
          confirmResult: null,
          userVerified: false,
          codeValidation: false
        });
      }
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }

  signIn = () => {
    const { phoneNumber } = this.state;
    this.setState({ message: "Sending code ..." });

    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber)
      .then(confirmResult => {
        this.setState({ confirmResult, message: "Code has been sent!" });
        // alert("Hellloooooo");
      })
      .catch(error =>
        this.setState({
          message: `Sign In With Phone Number Error: ${error.message}`
        })
      );
  };

  confirmCode = () => {
    const { codeInput, confirmResult } = this.state;

    if (confirmResult && codeInput.length) {
      confirmResult
        .confirm(codeInput)
        .then(user => {
          this.setState({ message: "Code Confirmed!" });
          console.log("Hellloooo  I am in conform result");
        })
        .catch(error =>
          this.setState({ message: `Code Confirm Error: ${error.message}` })
        );
    }
  };

  signOut = () => {
    firebase.auth().signOut();
  };

  renderPhoneNumberInput() {
    const { phoneNumber } = this.state;

    return (
      <View style={{ padding: 25 }}>
        <TextField
          autoFocus
          label="Phone number"
          onChangeText={value => this.setState({ phoneNumber: value })}
          placeholder={"Phone number ... "}
          value={phoneNumber}
        />

        <TextField
          label="Short Name"
          onChangeText={phone => this.setState({ phone })}
        />

        <SpinnerButton
          buttonStyle={[
            styles.buttonStyle,
            {
              backgroundColor: "#0d47a1",
              borderRadius: 50,
              width: 200
            }
          ]}
          //  isLoading={this.state.pacmanLoading}
          //spinnerType="PacmanIndicator"
          onPress={this.signIn}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Fa5 name={"sign-in-alt"} size={30} color="#fff" />
            <Text style={{ color: "white", paddingHorizontal: 10 }}>
              {" "}
              Phone SignIn
            </Text>
          </View>
        </SpinnerButton>
      </View>
    );
  }

  renderMessage() {
    const { message } = this.state;

    if (!message.length) return null;

    return (
      <Text style={{ padding: 5, backgroundColor: "#000", color: "#fff" }}>
        {message}
      </Text>
    );
  }

  renderVerificationCodeInput() {
    const { codeInput } = this.state;

    return (
      <View style={{ marginTop: 25, padding: 25 }}>
        <Text>Enter verification code below:</Text>
        <TextInput
          autoFocus
          style={{ height: 40, marginTop: 15, marginBottom: 15 }}
          onChangeText={value => this.setState({ codeInput: value })}
          placeholder={"Code ... "}
          value={codeInput}
        />
        <Button
          title="Confirm Code"
          color="#841584"
          onPress={this.confirmCode}
        />
      </View>
    );
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
          loadL: false
        });
        this.props.navigation.navigate("DetailArticle", {
          datailData: res.data
        });
      })
      .catch(error => {
        this.setState({ error, loadL: false });
      });
  };

  render() {
    const { user, confirmResult } = this.state;
    const { navigation } = this.props;
    const articleID = navigation.getParam("articleID", "");

    // alert(articleID);

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
        <View style={{ flex: 1 }}>
          {!user && !confirmResult && this.renderPhoneNumberInput}

          {this.renderMessage()}

          {!user && confirmResult && this.renderVerificationCodeInput()}

          {user && (
            <View
              style={{
                padding: 15,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#77dd77",
                flex: 1
              }}
            >
              <Image
                source={{ uri: successImageUri }}
                style={{ width: 100, height: 100, marginBottom: 25 }}
              />
              <Text style={{ fontSize: 25 }}>Signed In!</Text>
              <Text>{JSON.stringify(user)}</Text>
              <Button title="Sign Out" color="red" onPress={this.signOut} />
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  }
}

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
  }
});
