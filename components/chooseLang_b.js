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
  AsyncStorage
} from "react-native";
//import Share from "react-native-share";
import Share, { ShareSheet, Button } from "react-native-share";
import Fa5 from "react-native-vector-icons/FontAwesome5";
import SpinnerButton from "react-native-spinner-button";
//import images from "./imageBase64";
import Icon from "react-native-vector-icons/Ionicons";
import { RectButton, BorderlessButton } from "react-native-gesture-handler";
import GS from "./gLogin";
import FbLogin from "./fbLogin";
import Tshare1 from "./aShare";
import Ph from "./phLogin";
import { Divider } from "react-native-elements";
import { connect } from "react-redux";
import { logout } from "./store/actions";
import { ListItem, Card } from "react-native-elements";

class UserDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      dotLoading: false,
      english: true,
      telugu: false
    };
  }

  async componentDidMount() {
    this.setState({});
    console.log(this.state);
  }

  chooseLang = lang => () => {
    console.log("langgg", lang);

    if (lang == "english") {
      this.setState({
        english: true,
        telugu: false
      });
    } else if (lang == "telugu") {
      this.setState({
        english: false,
        telugu: true
      });
    } else {
      this.setState({
        english: false,
        telugu: false
      });
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
            <Text style={styles.h1w}>Choose Language</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Choose Language of your Choice</Text>

          <View style={{ padding: 10 }}>
            <TouchableOpacity
              style={styles.qoption}
              onPress={this.chooseLang("english")}
            >
              <Icon
                name={
                  this.state.english
                    ? "ios-radio-button-on"
                    : "ios-radio-button-off"
                }
                color={this.state.english ? "green" : "black"}
                size={20}
                style={{ paddingRight: 10 }}
              />

              <Text
                style={{
                  fontSize: 20,
                  color: this.state.english ? "green" : "black"
                }}
              >
                English
              </Text>
            </TouchableOpacity>
            <Divider style={{ backgroundColor: "blue" }} />
            <TouchableOpacity
              style={styles.qoption}
              onPress={this.chooseLang("telugu")}
            >
              <Icon
                name={
                  this.state.telugu
                    ? "ios-radio-button-on"
                    : "ios-radio-button-off"
                }
                color={this.state.telugu ? "green" : "black"}
                size={20}
                style={{ paddingRight: 10 }}
              />

              <Text
                style={{
                  fontSize: 20,
                  color: this.state.telugu ? "green" : "black"
                }}
              >
                Telugu
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>User Details</Text>

          <View style={{ padding: 10 }}>
            <View style={styles.userDetails}>
              <Text
                style={{
                  fontSize: 18,
                  color: "black"
                }}
              >
                LoggedIn:
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  color: "black"
                }}
              >
                {this.props.isLoggedIn}
              </Text>
            </View>
            <Divider style={{ backgroundColor: "blue" }} />
            <TouchableOpacity
              style={styles.qoption}
              // onPress={this.setOptionsColor(1, 1)}
            >
              <Text> Login Method </Text>

              <Text
                style={{
                  fontSize: 20,
                  color: this.state.quiz1option1 ? "green" : "black"
                }}
              >
                Google
              </Text>
            </TouchableOpacity>
            <View>
              <Text
                style={{
                  fontSize: 20,
                  color: "black"
                }}
              >
                UsetId
              </Text>

              <Text
                style={{
                  fontSize: 20,
                  color: "black"
                }}
              >
                ew1dotcom@gmal.com
              </Text>
            </View>
            <TouchableOpacity
              style={styles.qoption}
              // onPress={this.setOptionsColor(1, 1)}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: "black"
                }}
              >
                LoggedIN Time
              </Text>

              <Text
                style={{
                  fontSize: 20,
                  color: "black"
                }}
              >
                12-FEB-2019 12:23
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.qoption}
              // onPress={this.setOptionsColor(1, 1)}
            >
              <SpinnerButton
                buttonStyle={[
                  styles.buttonStyle,
                  {
                    backgroundColor: "#0d47a1",
                    borderRadius: 50,
                    width: 200
                  }
                ]}
                isLoading={this.state.dotLoading}
                spinnerType="DotIndicator"
                onPress={this.props.userLogout}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Fa5 name={"sign-out-alt"} size={30} color="#fff" />
                  <Text style={{ color: "white", paddingHorizontal: 10 }}>
                    Logout
                  </Text>
                </View>
              </SpinnerButton>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoggedIn: state.isLoggedIn,
    authMethod: state.authMethod,
    userId: state.userId,
    sName: state.sName,
    isAuthenticated: state.isAuthenticated
  };
};

const mapDispathToProps = dispatch => {
  return {
    userLogout: () => dispatch(logout())
  };
};

export default connect(
  mapStateToProps,
  mapDispathToProps
)(UserDetails);

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
  userDetails: {
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
  }
});
