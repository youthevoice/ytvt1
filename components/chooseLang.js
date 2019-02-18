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

import { connect } from "react-redux";
import { userLogout, loginDetails } from "./store/actions";
import {
  ListItem,
  Card,
  Button as Button1,
  Divider
} from "react-native-elements";

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

  _userLogin = () => {
    this.props.navigation.navigate("YtvLogin", {
      screenName: "AllArticles"
    });
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
            <Text style={styles.h1w}>User Info</Text>
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
                  fontSize: 15,
                  color: this.state.english ? "green" : "black"
                }}
              >
                English
              </Text>
            </TouchableOpacity>
            <Divider
              style={{ backgroundColor: "#CFD8DC", paddingHorizontal: 10 }}
            />
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
                  fontSize: 15,
                  color: this.state.telugu ? "green" : "black"
                }}
              >
                Telugu -- This will be avaliable soon
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {this.props.isAuthenticated && (
          <Card title="User Details">
            <View style={{ padding: 10 }}>
              <Text>Name </Text>
              <Text>{this.props.sName}</Text>
            </View>

            <View style={{ padding: 10 }}>
              <Text>Login Method </Text>
              <Text>{this.props.authMethod}</Text>
            </View>

            <View style={{ padding: 10 }}>
              <Text>UserId </Text>
              <Text>{this.props.userId}</Text>
            </View>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Button1
                buttonStyle={styles.LoginButtonUpload}
                type="outline"
                icon={
                  <Fa5
                    name="sign-out-alt"
                    size={15}
                    //color="white"
                    style={{ paddingRight: 5 }}
                  />
                }
                iconLeft
                title="Logout"
                onPress={this.props.userLogout}
                //disabled={!this.state.uploadButton}
              />
            </View>
          </Card>
        )}
        {!this.props.isAuthenticated && (
          <Card title="User Details">
            <View
              style={{
                padding: 10,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Button1
                buttonStyle={styles.LoginButtonUpload}
                type="outline"
                icon={
                  <Fa5
                    name="sign-out-alt"
                    size={15}
                    //color="white"
                    style={{ paddingRight: 5 }}
                  />
                }
                iconLeft
                title="Login"
                onPress={this._userLogin}
                //disabled={!this.state.uploadButton}
              />
            </View>
          </Card>
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => {
  return {
    authMethod: state.authMethod,
    userId: state.userId,
    sName: state.sName,
    isAuthenticated: state.isAuthenticated,
    language: state.language
  };
};

const mapDispathToProps = dispatch => {
  return {
    userLogout: () => dispatch(userLogout()),
    userLoginDetails: data => dispatch(loginDetails(data))
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
  LoginButtonUpload: {
    //backgroundColor: "#FF9800",
    borderRadius: 50,
    margin: 10,
    height: 40,
    width: 150
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
    marginVertical: 2,
    borderTopLeftRadius: 7.5,
    borderTopRightRadius: 7.5
  },
  cardseparator: {
    borderBottomColor: "#d1d0d4",
    borderBottomWidth: 1
  },
  cardHeader: {
    fontSize: 18,

    paddingHorizontal: 15,
    paddingVertical: 10,
    color: "#bf360c"
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
    fontSize: 18,

    color: "#fff",
    paddingLeft: 5
  },
  bottomBarItem: {
    alignItems: "center",
    justifyContent: "center"
  }
});
