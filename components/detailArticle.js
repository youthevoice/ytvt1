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
import { Divider } from "react-native-elements";
import PlayVideo from "./playVideo";
//import Modal from "react-native-modal";
import Fa5 from "react-native-vector-icons/FontAwesome5";
import Icon from "react-native-vector-icons/Ionicons";
//import Loader from "./loader";
import axios from "axios";
import { RectButton, BorderlessButton } from "react-native-gesture-handler";
import Loader from "./loader";

export default class DetailArticle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      qresults1: false,
      selopt: null,
      shareModal: false,
      quiz1option1: false,
      quiz1option2: false,
      quiz1option3: false,
      quiz1option4: false,

      quiz2: {},
      quiz3: {},
      quiz4: {},
      isLoggedIn: false,
      isAuthenticated: false,
      upVote: false,
      dVote: false,
      upVoteColor: "#9e9e9e",
      dwVoteColor: "#9e9e9e",
      loadL: false,
      articleData: "",
      renderI: false
    };
  }

  async componentDidMount() {
    this._getArticle();
    try {
      const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
      console.log("isLoggedIn", isLoggedIn);

      if (isLoggedIn) {
        this.setState({
          isAuthenticated: true
        });
      }
    } catch (error) {
      console.log("Error while storing the token");
    }
  }

  _getArticle = () => {
    /* 1. Navigate to the Details route with params */

    this.setState({ loadL: true });

    axios
      .get("https://youthevoice.com/getarticles", {
        params: {
          articleId: this.props.navigation.getParam("articleId", "")
        }
      })
      .then(res => {
        console.log(res.data);
        this.setState({
          loadL: false,
          articleData: res.data,
          renderI: true
        });
      })
      .catch(error => {
        this.setState({ error, loadL: false });
      });
  };

  _keyExtractor = (item, index) => item.id;

  Separator = () => <View style={styles.separator} />;

  openUrl = url => () => {
    const FANPAGE_ID = url;
    const FANPAGE_URL_FOR_APP = `fb://page/jeevan.examwarrior/${FANPAGE_ID}`;
    const FANPAGE_URL_FOR_BROWSER = `https://fb.com/jeevan.examwarrior/${FANPAGE_ID}`;
    Linking.canOpenURL(FANPAGE_URL_FOR_APP)
      .then(supported => {
        if (!supported) {
          return Linking.openURL(FANPAGE_URL_FOR_BROWSER);
        } else {
          return Linking.openURL(FANPAGE_URL_FOR_APP);
        }
      })
      .catch(err => console.error("An error occurred", err));
  };

  openYUrl = url => () => {
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error("An error occurred", err));
  };

  pVideo = () => {
    this.props.navigation.navigate("PlayVideo", {
      playUrl: "https://youthevoice.com/v1.mp4"
    });
  };

  commentVideo = () => {
    this.props.navigation.navigate("PickFile");
  };

  recordVideo = () => {
    this.props.navigation.navigate("CameraScreen");
  };

  getArticle = async articleId => {
    this.setState({ loading: true });

    axios
      .get("https://youthevoice.com/getarticles", {
        params: {
          articleId: articleId
        }
      })
      .then(res => {
        console.log(res.data);
        this.setState({
          detailData: res.data,
          loading: false
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  setOptionsColor = (group, option) => () => {
    if (group === 1) {
      switch (option) {
        case 1:
          this.setState({
            quiz1option1: true,
            quiz1option2: false,
            quiz1option3: false,
            quiz1option4: false,
            selopt: 1
          });
          break;
        case 2:
          this.setState({
            quiz1option1: false,
            quiz1option2: true,
            quiz1option3: false,
            quiz1option4: false,
            selopt: 2
          });
          break;
        case 3:
          this.setState({
            quiz1option1: false,
            quiz1option2: false,
            quiz1option3: true,
            quiz1option4: false,
            selopt: 3
          });
          break;
        case 4:
          this.setState({
            quiz1option1: false,
            quiz1option2: false,
            quiz1option3: false,
            quiz1option4: true,
            selopt: 4
          });
          break;
      }
    }
  };

  onQuizCancel = () => {
    this.setState({
      quiz1option1: false,
      quiz1option2: false,
      quiz1option3: false,
      quiz1option4: false
    });
  };

  showQuiz = () => {
    this.setState({
      qresults1: false
    });
  };

  postQuiz = (_articleId, _quizId, opSelect) => () => {
    if (this.state.selopt === null) {
      AlertIOS.alert("Please select one option to Vote");
      return null;
    }

    axios
      .post("https://youthevoice.com/postquizanswer", {
        params: {
          userId: "anon",
          articleId: _articleId,
          quizId: _quizId,
          optionSel: opSelect
        }
      })
      .then(res => {
        console.log(res.data);
        this.setState({
          loading: false,
          qresults1: true
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  async retrieveSessionToken() {
    try {
      const token = await AsyncStorage.getItem("loginToken");
      if (isLoggedIn !== null) {
        console.log("Session token", token);
        return token;
      }
    } catch (error) {
      console.log("Error while storing the token");
    }
  }

  _upVote = articleId => () => {
    if (!this.state.isAuthenticated) {
      this.props.navigation.navigate("YtvLogin", {
        articleID: articleId
      });
    } else {
      uvS = !this.state.upVote;
      uvC = uvS ? "#42a5f5" : "#9e9e9e";

      this.setState({
        upVote: uvS,
        dwVote: false,
        upVoteColor: uvC,
        dwVoteColor: "#9e9e9e"
      });
    }
  };

  _dwVote = articleId => () => {
    if (!this.state.isAuthenticated) {
      this.props.navigation.navigate("YtvLogin", {
        articleID: articleId
      });
    } else {
      dvS = !this.state.dwVote;
      dvC = dvS ? "#424242" : "#9e9e9e";

      this.setState({
        upVote: false,
        dwVote: dvS,
        upVoteColor: "#9e9e9e",
        dwVoteColor: dvC
      });
    }
  };

  _ytvShare = articleId => () => {
    this.props.navigation.navigate("YtvShare", {
      articleID: articleId
    });
  };

  render() {
    const { navigation } = this.props;
    const detailData = this.state.articleData;
    //navigation.getParam("datailData", {});
    // this.getArticle(articleId);
    // console.log("detaill", detailData);

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
        <Loader loading={this.state.loadL} />
        {this.state.renderI && (
          <ScrollView>
            <View>
              <View style={styles.card}>
                <Text style={styles.cardHeader}>
                  {JSON.stringify(detailData.articleHeading)}
                </Text>

                <Image
                  source={{ uri: detailData.articleImage }}
                  style={styles.cardImage}
                />
                <Text style={styles.cardText}>
                  {JSON.stringify(detailData.articleShortDesc)}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 10
                  }}
                >
                  <TouchableOpacity
                    onPress={this._upVote(detailData.articleId)}
                  >
                    <Icon
                      name="md-thumbs-up"
                      size={30}
                      color={this.state.upVoteColor}
                    />
                    <Text style={{ paddingVertical: 5 }}> 20k</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this._dwVote(detailData.articleId)}
                  >
                    <Icon
                      name="md-thumbs-down"
                      size={30}
                      color={this.state.dwVoteColor}
                    />
                    <Text style={{ paddingVertical: 5 }}> 20k</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this._ytvShare(detailData.articleId)}
                  >
                    <Icon name="md-share-alt" size={30} />
                    <Text style={{ paddingVertical: 5 }}> 20k</Text>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Icon name="md-chatboxes" size={30} />
                    <Text style={{ paddingVertical: 5 }}> 20k</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardHeader}>Watch Video...</Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 10
                  }}
                >
                  <TouchableOpacity onPress={this.pVideo}>
                    <View style={styles.bottomBarItem}>
                      <Icon name="ios-videocam" size={30} />
                      <Text style={{ paddingVertical: 5 }}> 480P</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={this.commentVideo}>
                    <View style={styles.bottomBarItem}>
                      <Icon name="ios-videocam" size={30} />
                      <Text style={{ paddingVertical: 5 }}> 720P</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={this.openUrl("403845640359795")}
                    // "fb://page/jeevan.examwarrior/posts/403845640359795"
                    // "https://m.facebook.com/jeevan.examwarrior/posts/403845640359795"
                  >
                    <View style={styles.bottomBarItem}>
                      <Icon name="logo-facebook" size={30} />
                      <Text style={{ paddingVertical: 5 }}> Facebook</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={this.openYUrl(
                      "https://www.youtube.com/watch?v=AEr7NcU8cHw"
                    )}
                  >
                    <View style={styles.bottomBarItem}>
                      <Icon name="logo-youtube" size={30} />
                      <Text style={{ paddingVertical: 5 }}> YouTube</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {!this.state.qresults1 ? (
                <View style={styles.card}>
                  <Text style={styles.cardHeader}>Add Your Voice Quiz</Text>
                  <Text style={styles.question}>
                    {JSON.stringify(detailData.quiz1.question)}
                  </Text>
                  <View style={{ padding: 10 }}>
                    <TouchableOpacity
                      style={styles.qoption}
                      onPress={this.setOptionsColor(1, 1)}
                    >
                      <Icon
                        name={
                          this.state.quiz1option1
                            ? "ios-radio-button-on"
                            : "ios-radio-button-off"
                        }
                        color={this.state.quiz1option1 ? "green" : "black"}
                        size={20}
                        style={{ paddingRight: 10 }}
                      />

                      <Text
                        style={{
                          fontSize: 20,
                          color: this.state.quiz1option1 ? "green" : "black"
                        }}
                      >
                        {JSON.stringify(detailData.quiz1.option1)}
                      </Text>
                    </TouchableOpacity>
                    <Divider style={{ backgroundColor: "blue" }} />
                    <TouchableOpacity
                      style={styles.qoption}
                      onPress={this.setOptionsColor(1, 2)}
                    >
                      <Icon
                        name={
                          this.state.quiz1option2
                            ? "ios-radio-button-on"
                            : "ios-radio-button-off"
                        }
                        color={this.state.quiz1option2 ? "green" : "black"}
                        size={20}
                        style={{ paddingRight: 10 }}
                      />
                      <Text
                        style={{
                          fontSize: 20,
                          color: this.state.quiz1option2 ? "green" : "black"
                        }}
                      >
                        {JSON.stringify(detailData.quiz1.option2)}
                      </Text>
                    </TouchableOpacity>
                    <Divider style={{ backgroundColor: "blue" }} />

                    <TouchableOpacity
                      style={styles.qoption}
                      onPress={this.setOptionsColor(1, 3)}
                    >
                      <Icon
                        name={
                          this.state.quiz1option3
                            ? "ios-radio-button-on"
                            : "ios-radio-button-off"
                        }
                        color={this.state.quiz1option3 ? "green" : "black"}
                        size={20}
                        style={{ paddingRight: 10 }}
                      />
                      <Text
                        style={{
                          fontSize: 20,
                          color: this.state.quiz1option3 ? "green" : "black"
                        }}
                      >
                        {JSON.stringify(detailData.quiz1.option3)}
                      </Text>
                    </TouchableOpacity>
                    <Divider style={{ backgroundColor: "blue" }} />

                    <TouchableOpacity
                      style={styles.qoption}
                      onPress={this.setOptionsColor(1, 4)}
                    >
                      <Icon
                        name={
                          this.state.quiz1option4
                            ? "ios-radio-button-on"
                            : "ios-radio-button-off"
                        }
                        color={this.state.quiz1option4 ? "green" : "black"}
                        size={20}
                        style={{ paddingRight: 10 }}
                      />
                      <Text
                        style={{
                          fontSize: 20,
                          color: this.state.quiz1option4 ? "green" : "black"
                        }}
                      >
                        {JSON.stringify(detailData.quiz1.option4)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      padding: 10
                    }}
                  >
                    <TouchableOpacity onPress={this.onQuizCancel}>
                      <View style={styles.bottomBarItem}>
                        <Icon name="ios-alert" size={30} />
                        <Text style={{ paddingVertical: 5 }}> Cancel</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={this.postQuiz(
                        detailData.articleId,
                        detailData.quizId,
                        1
                      )}
                    >
                      <View style={styles.bottomBarItem}>
                        <Icon name="md-share-alt" size={30} />
                        <Text style={{ paddingVertical: 5 }}> Vote</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <View style={styles.bottomBarItem}>
                        <Icon name="md-chatboxes" size={30} />
                        <Text style={{ paddingVertical: 5 }}> Results</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.card}>
                  <Text style={styles.cardHeader}>Add Your Voice Quiz</Text>
                  <Text style={styles.question}>
                    {JSON.stringify(detailData.quiz1.question)}
                  </Text>
                  <View style={{ padding: 10 }}>
                    <TouchableOpacity
                      style={styles.qoption}
                      onPress={this.setOptionsColor(1, 1)}
                    >
                      <Text style={{ paddingRight: 10, fontSize: 20 }}>
                        {" "}
                        53% Voted -{" "}
                      </Text>

                      <Text
                        style={{
                          fontSize: 20,
                          color: this.state.quiz1option1 ? "green" : "black"
                        }}
                      >
                        {JSON.stringify(detailData.quiz1.option1)}
                      </Text>
                    </TouchableOpacity>
                    <Divider style={{ backgroundColor: "blue" }} />
                    <TouchableOpacity
                      style={styles.qoption}
                      onPress={this.setOptionsColor(1, 2)}
                    >
                      <Text style={{ paddingRight: 10, fontSize: 20 }}>
                        {" "}
                        53% Voted -{" "}
                      </Text>
                      <Text
                        style={{
                          fontSize: 20,
                          color: this.state.quiz1option2 ? "green" : "black"
                        }}
                      >
                        {JSON.stringify(detailData.quiz1.option2)}
                      </Text>
                    </TouchableOpacity>
                    <Divider style={{ backgroundColor: "blue" }} />

                    <TouchableOpacity
                      style={styles.qoption}
                      onPress={this.setOptionsColor(1, 3)}
                    >
                      <Text style={{ paddingRight: 10, fontSize: 20 }}>
                        {" "}
                        53% Voted -{" "}
                      </Text>
                      <Text
                        style={{
                          fontSize: 20,
                          color: this.state.quiz1option3 ? "green" : "black"
                        }}
                      >
                        {JSON.stringify(detailData.quiz1.option3)}
                      </Text>
                    </TouchableOpacity>
                    <Divider style={{ backgroundColor: "blue" }} />

                    <TouchableOpacity
                      style={styles.qoption}
                      onPress={this.setOptionsColor(1, 4)}
                    >
                      <Text style={{ paddingRight: 10, fontSize: 20 }}>
                        {" "}
                        53% Voted -{" "}
                      </Text>
                      <Text
                        style={{
                          fontSize: 20,
                          color: this.state.quiz1option4 ? "green" : "black"
                        }}
                      >
                        {JSON.stringify(detailData.quiz1.option4)}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.qoption}
                      onPress={this.setOptionsColor(1, 4)}
                    >
                      <Text style={{ paddingRight: 10, fontSize: 20 }}>
                        {" "}
                        Total Votes
                      </Text>
                      <Text
                        style={{
                          fontSize: 20,
                          color: this.state.quiz1option4 ? "green" : "black"
                        }}
                      >
                        2.3k
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      padding: 10
                    }}
                  >
                    <TouchableOpacity onPress={this.onQuizCancel}>
                      <View style={styles.bottomBarItem}>
                        <Icon name="ios-alert" size={30} color="#D3D3D3" />
                        <Text style={{ paddingVertical: 5, color: "#D3D3D3" }}>
                          Cancel
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <View style={styles.bottomBarItem}>
                        <Icon name="md-share-alt" size={30} color="#D3D3D3" />
                        <Text style={{ paddingVertical: 5, color: "#D3D3D3" }}>
                          Vote
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <View style={styles.bottomBarItem}>
                        <Icon
                          name="md-chatboxes"
                          size={30}
                          style={{ color: "#D3D3D3" }}
                        />
                        <Text style={{ paddingVertical: 5, color: "#D3D3D3" }}>
                          {" "}
                          Quiz
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View style={styles.card}>
                <Text style={styles.cardHeader}>
                  Add Your Voice as Comment on any of below Social Media ...
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    padding: 10
                  }}
                >
                  <TouchableOpacity onPress={this.recordVideo}>
                    <View style={styles.bottomBarItem}>
                      <Icon name="md-megaphone" size={30} />
                      <Text style={{ paddingVertical: 5 }}> YTV VOICE</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={this.openYUrl(
                      "https://twitter.com/jeevan72674854/status/1084291366371377152"
                    )}
                  >
                    <View style={styles.bottomBarItem}>
                      <Icon name="logo-twitter" size={30} />
                      <Text style={{ paddingVertical: 5 }}> TWITTER</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={this.openUrl(
                      "https://www.facebook.com/jeevan.examwarrior/posts/403845640359795"
                    )}
                  >
                    <View style={styles.bottomBarItem}>
                      <Icon name="logo-facebook" size={30} />
                      <Text style={{ paddingVertical: 5 }}> FACEBOOK</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={this.openYUrl(
                      "https://www.youtube.com/watch?v=AEr7NcU8cHw"
                    )}
                  >
                    <View style={styles.bottomBarItem}>
                      <Icon name="logo-youtube" size={30} />
                      <Text style={{ paddingVertical: 5 }}> YOUTUBE</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
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
    padding: 5,
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
  bottomBarItem: {
    alignItems: "center",
    justifyContent: "center"
  }
});
