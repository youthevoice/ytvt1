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

import { Input, Button as Button1 } from "react-native-elements";
import axios from "axios";
import Fa5 from "react-native-vector-icons/FontAwesome5";

import { RectButton, BorderlessButton } from "react-native-gesture-handler";
import { TextField } from "react-native-material-textfield";

import Icon from "react-native-vector-icons/Ionicons";
import firebase from "react-native-firebase";
//import { AsyncStorage } from "react-native";
import Loader from "./loader";
import SpinnerButton from "react-native-spinner-button";
import Snackbar from "react-native-snackbar";
import { connect } from "react-redux";
import { loginDetails } from "./store/actions";

const successImageUri =
  "https://cdn.pixabay.com/photo/2015/06/09/16/12/icon-803718_1280.png";

class PhoneLogin extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
      message: "",
      codeInput: "",
      phoneNumber: "",
      sname: "",
      confirmResult: null,
      loadL: false,
      verificationId: null,
      verifyTimeOut: false,
      confirmResult: null,
      userVerified: false,
      codeValidation: false,
      dotLoading: false,
      skypeLoading: false,
      verifyCode: "",
      codeSent: false,
      otpLoading: false,
      msgColor: "black",
      validCode: false
    };
  }

  componentDidMount() {
    this.setState({
      screenName: this.props.navigation.getParam("screenName", ""),
      articleId: this.props.navigation.getParam("articleId", "")
    });
  }

  componentWillUnmount() {}

  verifyCode = () => {
    this.setState({
      skypeLoading: true,
      message: "Verifying entered Code...",
      msgColor: "black"
    });
    console.log(this.state.verificationId, this.state.verifyCode);
    try {
      const cred = firebase.auth.PhoneAuthProvider.credential(
        this.state.verificationId,
        this.state.verifyCode
      );

      console.log("creddd..", cred);

      firebase
        .auth()
        .signInWithCredential(cred)
        .then(user => {
          console.log("userrrrrr", user);
          Snackbar.show({
            title: "LOGIN SUCCESS",
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: "#1b5e20",
            color: "#fff"
          });
          this.setState({
            skypeLoading: false,
            message: "Verification Successs ...",
            userVerified: true,
            msgColor: "#1b5e20"
          });
          var acData = {
            isAuthenticated: true,
            authMethod: "phone",
            userId: this.state.phoneNumber,
            sName: this.state.sname
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
        })
        .catch(error => {
          console.log(error);
          this.setState({
            message: "Code Verification error, Please input Correct Code!",
            msgColor: "#b71c1c"
          });
        });

      // console.log(firebaseUserCredential);
    } catch (err) {
      console.log(err);
      this.setState({
        skypeLoading: false,
        message: "Error !!! Verifying  Code...",
        msgColor: "#b71c1c"
      });
    }
  };

  processUser = async () => {
    if (this.state.userVerified) {
      this.props.userLoginDetails();
    }
  };

  signIn = () => {
    const { phoneNumber } = this.state;
    console.log(this.state.phoneNumber, this.state.sname);
    if (this.state.phoneNumber == "" || this.state.sname == "") {
      () => {
        setTimeout(() => {
          Snackbar.show({
            title: "Invalid Credintials",
            backgroundColor: red
          });
        }, 1000);
      };

      return;
    }
    this.setState({ message: "Sending code ...", dotLoading: true });

    firebase
      .auth()
      .verifyPhoneNumber(phoneNumber)
      .on(
        "state_changed",
        phoneAuthSnapshot => {
          // How you handle these state events is entirely up to your ui flow and whether
          // you need to support both ios and android. In short: not all of them need to
          // be handled - it's entirely up to you, your ui and supported platforms.

          // E.g you could handle android specific events only here, and let the rest fall back
          // to the optionalErrorCb or optionalCompleteCb functions
          switch (phoneAuthSnapshot.state) {
            // ------------------------
            //  IOS AND ANDROID EVENTS
            // ------------------------
            case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
              console.log("code sent");
              console.log("phoneAuthSnapshot", phoneAuthSnapshot);
              this.setState({
                verificationId: phoneAuthSnapshot.verificationId,
                message: "Code is Sent , trying Auto Verify else Input Code...",
                codeSent: true,
                otpLoading: true,
                msgColor: "black"
              });
              // on ios this is the final phone auth state event you'd receive
              // so you'd then ask for user input of the code and build a credential from it
              // as demonstrated in the `signInWithPhoneNumber` example above
              break;
            case firebase.auth.PhoneAuthState.ERROR: // or 'error'
              console.log("verification error");
              console.log("verificationnn errorrr", phoneAuthSnapshot.error);
              this.setState({
                message: "Code Verification error, Please input Correct Code!",
                msgColor: "#b71c1c"
              });
              break;

            // ---------------------
            // ANDROID ONLY EVENTS
            // ---------------------
            case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
              console.log("auto verify on android timed out");
              // proceed with your manual code input flow, same as you would do in
              // CODE_SENT if you were on IOS
              this.setState({
                codeValidation: true,
                dotLoading: false,
                otpLoading: false,
                message: "Could not auto verify , please input verify code...",
                msgColor: "black"
              });

              break;
            case firebase.auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
              // auto verified means the code has also been automatically confirmed as correct/received
              // phoneAuthSnapshot.code will contain the auto verified sms code - no need to ask the user for input.
              console.log("auto verified on android");
              console.log(phoneAuthSnapshot);

              this.setState({
                skypeLoading: false,
                message: "Verification Successs ...",
                userVerified: true,
                msgColor: "#1b5e20"
              });
              var acData = {
                isAuthenticated: true,
                authMethod: "phone",
                userId: this.state.phoneNumber,
                sName: this.state.sname
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

              // Example usage if handling here and not in optionalCompleteCb:
              // const { verificationId, code } = phoneAuthSnapshot;
              // const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);

              // Do something with your new credential, e.g.:
              // firebase.auth().signInWithCredential(credential);
              // firebase.auth().currentUser.linkWithCredential(credential);
              // etc ...
              break;
          }
        },
        error => {
          // optionalErrorCb would be same logic as the ERROR case above,  if you've already handed
          // the ERROR case in the above observer then there's no need to handle it here
          console.log("errorrrr", error);
          this.setState({ message: "UnExpected Error ", msgColor: "#b71c1c" });
          // verificationId is attached to error if required
          console.log("errorrr iddd", error.verificationId);
        },
        phoneAuthSnapshot => {
          // optionalCompleteCb would be same logic as the AUTO_VERIFIED/CODE_SENT switch cases above
          // depending on the platform. If you've already handled those cases in the observer then
          // there's absolutely no need to handle it here.

          // Platform specific logic:
          // - if this is on IOS then phoneAuthSnapshot.code will always be null
          // - if ANDROID auto verified the sms code then phoneAuthSnapshot.code will contain the verified sms code
          //   and there'd be no need to ask for user input of the code - proceed to credential creating logic
          // - if ANDROID auto verify timed out then phoneAuthSnapshot.code would be null, just like ios, you'd
          //   continue with user input logic.
          console.log(phoneAuthSnapshot);
        }
      );
    // optionally also supports .then & .catch instead of optionalErrorCb &
    // optionalCompleteCb (with the same resulting args)
  };

  signOut = () => {
    firebase.auth().signOut();
  };

  renderMessage() {
    const { message } = this.state;

    if (!message.length) return null;

    return (
      <Text
        style={{
          padding: 5,
          backgroundColor: "#fff",
          color: this.state.msgColor,
          height: 70,
          fontSize: 14
        }}
      >
        {message}
      </Text>
    );
  }

  validatePhone = phone => {
    console.log(phone);

    const phoneNum = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
    if (phoneNum.test(phone)) {
      this.setState({ validPhone: true, phoneNumber: "+91" + phone });
      console.log("matched");
    } else {
      this.setState({ validPhone: false });
      console.log("not  matched");
    }

    console.log(phone);
  };

  validateSName = sname => {
    if (/\S/.test(sname)) {
      this.setState({ validSname: true, sname: sname });
      console.log("matched");
    } else {
      this.setState({ validSname: false });
      console.log("not  matched");
    }

    console.log(sname);
  };

  validateCode = vcode => {
    if (/\S/.test(vcode)) {
      this.setState({ validCode: true, verifyCode: vcode });
      console.log("matched");
    } else {
      this.setState({ validCode: false });
      console.log("not  matched");
    }

    console.log(sname);
  };

  render() {
    const { userVerified, codeValidation, codeSent } = this.state;
    const { navigation } = this.props;
    const articleID = navigation.getParam("articleID", "");

    this.props.navigation.getParam("articleID", "");

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
            <BorderlessButton>
              <Icon name="ios-search" color="#ffffff" size={30} />
            </BorderlessButton>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          {this.renderMessage()}
          {!userVerified && !codeSent && (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Input
                autoFocus
                id="phonenumber"
                containerStyle={{ paddingHorizontal: 20, paddingVertical: 30 }}
                placeholder="PHONE NUMBER"
                leftIcon={
                  <Fa5
                    name="blender-phone"
                    size={24}
                    color={this.state.validPhone ? "green" : "red"}
                  />
                }
                errorStyle={{ color: this.state.validPhone ? "green" : "red" }}
                errorMessage="ENTER A VALID PHONE NUMBER"
                onChangeText={phone => this.validatePhone(phone)}
              />

              <Input
                containerStyle={{ paddingHorizontal: 20, paddingVertical: 30 }}
                placeholder="SHORT NAME"
                leftIcon={
                  <Fa5
                    name="signature"
                    size={24}
                    color={this.state.validSname ? "green" : "red"}
                  />
                }
                errorStyle={{ color: this.state.validSname ? "green" : "red" }}
                errorMessage="ENTER A VALID PHONE NUMBER"
                onChangeText={sname => this.validateSName(sname)}
              />

              <Button1
                buttonStyle={styles.LoginButton}
                type="outline"
                icon={<Fa5 name="sign-in-alt" size={25} color="white" />}
                iconLeft
                title=" SEND OTP"
                onPress={this.signIn}
                disabled={
                  this.state.validPhone && this.state.validSname ? false : true
                }
                loading={this.state.otpLoading}
              />
            </View>
          )}
          {!userVerified && codeSent && (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Input
                autoFocus
                id="veriftcode"
                containerStyle={{ paddingHorizontal: 20, paddingVertical: 30 }}
                placeholder="Enter verification code"
                leftIcon={
                  <Fa5
                    name="blender-phone"
                    size={24}
                    color={this.state.validCode ? "green" : "red"}
                  />
                }
                onChangeText={vcode => this.validateCode(vcode)}
                //value={this.state.verifyCode}
              />

              <Button1
                buttonStyle={styles.LoginButton}
                icon={
                  <Fa5
                    name="sign-in-alt"
                    size={15}
                    color={this.state.validCode ? "green" : "red"}
                  />
                }
                iconLeft
                title=" ENTER OTP"
                onPress={this.verifyCode}
                loading={this.state.otpLoading}
                disabled={this.state.otpLoading || !this.state.validCode}
              />
            </View>
          )}
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
)(PhoneLogin);

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
    backgroundColor: "#0d47a1",
    borderRadius: 50,
    padding: 10,
    height: 50,
    width: 200
  }
});
