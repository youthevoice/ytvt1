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
import { Input, Button as Button1 } from "react-native-elements";

export default class Comments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      dotLoading: false
    };
  }

  async componentDidMount() {
    this.setState({});
    console.log(this.state);
  }
  repliesToComment = () => {
    this.props.navigation.navigate("CommentReplies", {
      datailData: ""
    });
  };

  render() {
    // const { navigation } = this.props;
    // const articleID = navigation.getParam("articleID", "");

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#bf360c" />
        <View style={styles.headerBar}>
          <TouchableOpacity>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name="ios-arrow-round-back" color="#fff" size={30} />
              <Text style={styles.logo}>Back...</Text>
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.h1w}>Voices</Text>
          </View>
        </View>
        <ScrollView>
          <View style={styles.card}>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  paddingBottom: 2,
                  paddingTop: 2,
                  paddingLeft: 5,
                  color: "#424242"
                }}
              >
                Jeevan Kumar Deva
              </Text>
              <Text
                style={{
                  fontSize: 16,

                  paddingBottom: 2,
                  paddingTop: 2,
                  paddingLeft: 5
                }}
              >
                There is nothing forcing you to use Firebase Analytics. You can
                also use Firebase Analytics along with Google Analytics at the
                same time. You get to choose.
              </Text>
            </View>
            <View style={{ padding: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 10
                }}
              >
                <TouchableOpacity style={styles.bottomBarItem}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Button1
                      buttonStyle={styles.LoginButton}
                      icon={
                        <Fa5 name="microphone-alt" size={15} color="white" />
                      }
                      iconLeft
                      type={"clear"}
                    />
                  </View>
                  <Text style={{ padding: 10 }}>Audio Voice</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomBarItem}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Button1
                      buttonStyle={styles.LoginButton}
                      icon={<Fa5 name="video" size={15} color="white" />}
                      iconLeft

                      //  onPress={this.verifyCode}
                      //loading={this.state.otpLoading}
                    />
                  </View>
                  <Text style={{ padding: 10 }}>Video Voice</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomBarItem}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Button1
                      buttonStyle={styles.LoginButton}
                      icon={<Fa5 name="image" size={15} color="white" />}
                      iconLeft
                      disabled

                      //  onPress={this.verifyCode}
                      //loading={this.state.otpLoading}
                    />
                  </View>
                  <Text style={{ padding: 10 }}>Image Voice</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  paddingBottom: 15
                }}
              >
                <TouchableOpacity>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon name="md-thumbs-up" size={30} />
                    <Text style={{ padding: 10 }}> 787</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon name="md-thumbs-down" size={30} />
                    <Text style={{ padding: 10 }}> 187</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon name="md-share-alt" size={30} />
                    <Text style={{ padding: 10 }}> 987</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <Divider style={{ backgroundColor: "#BDBDBD" }} />
            <TouchableOpacity onPress={this.repliesToComment}>
              <Text
                style={{
                  fontSize: 14,
                  color: "#1565C0",
                  padding: 15
                }}
              >
                View All 20K Replies...
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  paddingBottom: 2,
                  paddingTop: 2,
                  paddingLeft: 5,
                  color: "#424242"
                }}
              >
                Jeevan Kumar Deva
              </Text>
              <Text
                style={{
                  fontSize: 16,

                  paddingBottom: 2,
                  paddingTop: 2,
                  paddingLeft: 5
                }}
              >
                There is nothing forcing you to use Firebase Analytics. You can
                also use Firebase Analytics along with Google Analytics at the
                same time. You get to choose.
              </Text>
            </View>
            <View style={{ padding: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 10
                }}
              >
                <TouchableOpacity style={styles.bottomBarItem}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Button1
                      buttonStyle={styles.LoginButton}
                      icon={
                        <Fa5 name="microphone-alt" size={15} color="white" />
                      }
                      iconLeft
                      type={"clear"}
                    />
                  </View>
                  <Text style={{ padding: 10 }}>Audio Voice</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomBarItem}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Button1
                      buttonStyle={styles.LoginButton}
                      icon={<Fa5 name="video" size={15} color="white" />}
                      iconLeft

                      //  onPress={this.verifyCode}
                      //loading={this.state.otpLoading}
                    />
                  </View>
                  <Text style={{ padding: 10 }}>Video Voice</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomBarItem}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Button1
                      buttonStyle={styles.LoginButton}
                      icon={<Fa5 name="image" size={15} color="white" />}
                      iconLeft
                      disabled

                      //  onPress={this.verifyCode}
                      //loading={this.state.otpLoading}
                    />
                  </View>
                  <Text style={{ padding: 10 }}>Image Voice</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  paddingBottom: 15
                }}
              >
                <TouchableOpacity>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon name="md-thumbs-up" size={30} />
                    <Text style={{ padding: 10 }}> 787</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon name="md-thumbs-down" size={30} />
                    <Text style={{ padding: 10 }}> 187</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Icon name="md-share-alt" size={30} />
                    <Text style={{ padding: 10 }}> 987</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <Divider style={{ backgroundColor: "#BDBDBD" }} />
            <TouchableOpacity onPress={this.repliesToComment}>
              <Text
                style={{
                  fontSize: 14,
                  color: "#1565C0",
                  padding: 15
                }}
              >
                View All 20K Replies...
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
/*
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
)(AllComments);
*/
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#e3f2fd" },
  question: {
    padding: 10,
    fontSize: 20,
    fontWeight: "bold"
  },

  LoginButton: {
    backgroundColor: "#E64A19",
    borderRadius: 50,
    padding: 10,
    height: 40,
    width: 50
  },
  commentText: {
    fontSize: 16
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
    fontSize: 16,
    paddingHorizontal: 10,
    paddingTop: 10,
    color: "#bf360c",
    fontWeight: "bold"
  },
  commentUser: {
    fontSize: 16,
    padding: 10,
    //paddingTop: 10,
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
