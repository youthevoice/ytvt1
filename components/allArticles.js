import React from "react";
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
  Button,
  ScrollView,
  AsyncStorage
} from "react-native";
import firebase from "react-native-firebase";

import Icon from "react-native-vector-icons/Ionicons";
//import FaIcon from "react-native-vector-icons/FontAwesome5";
import Modal from "react-native-modal";

import { RectButton, BorderlessButton } from "react-native-gesture-handler";
import axios from "axios";
import Loader from "./loader";
//import debounce from "lodash";
var debounce = require("lodash.debounce");
//import ShareArticle from "./ashare";
import DetailArticle from "./detailArticle";

export default class Articles extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      page: 0,
      data: [],
      error: null,
      _id: -1,
      refreshing: false,
      loadDone: false,
      isModalVisible: false,
      loadL: false
    };
  }

  async componentDidMount() {
    this.getAllArticles();
    firebase.messaging().subscribeToTopic("ytv");
    this.checkPermission();
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const action = notificationOpen.action;
      const notification = notificationOpen.notification;
      console.log(
        "notificationOpen.notification",
        notificationOpen.notification
      );
      var seen = [];
      this.props.navigation.navigate("DetailArticle", {
        articleId: notification.data.articleId
      });
      alert(
        JSON.stringify(notification.data, function(key, val) {
          if (val != null && typeof val == "object") {
            if (seen.indexOf(val) >= 0) {
              return;
            }
            seen.push(val);
          }
          return val;
        })
      );
    }

    const channel = new firebase.notifications.Android.Channel(
      "ytvchannel",
      "YTV Channel",
      firebase.notifications.Android.Importance.Max
    ).setDescription("The YTV Channel");

    // Create the channel
    firebase.notifications().android.createChannel(channel);

    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification = notificationOpen.notification;
        var seen = [];
        alert(
          JSON.stringify(notification.data, function(key, val) {
            if (val != null && typeof val == "object") {
              if (seen.indexOf(val) >= 0) {
                return;
              }
              seen.push(val);
            }
            return val;
          })
        );
        firebase
          .notifications()
          .removeDeliveredNotification(notification.notificationId);
      });

    this.notificationDisplayedListener();
    this.notificationListener();
    // this.notificationOpenedListener();
  }

  componentWillUnmount() {
    this.notificationDisplayedListener;
    this.notificationListener;
    //  this.notificationOpenedListener();
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      console.log("IsEnabled...");
      try {
        this.getToken();
      } catch (err) {
        console.log("token errorrr", err);
      }
      console.log("After IsEnabled...");
    } else {
      console.log("Geting Permissionss...");
      this.requestPermission();
    }
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem("fcmToken");
    console.log("fcmToken", fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      console.log("GettingggfcmToken", fcmToken);
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem("fcmToken", fcmToken);
      }
    }
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log("permission rejected");
    }
  }

  notificationDisplayedListener = () =>
    // app in foreground
    firebase.notifications().onNotificationDisplayed(notification => {
      console.log("onNotificationDisplayed");
      console.log(notification);
    });

  notificationListener = () =>
    // app in foreground
    firebase.notifications().onNotification(notification => {
      console.log("notificationListener");
      console.log(notification);

      const localNotification = new firebase.notifications.Notification({
        sound: "default",
        show_in_foreground: true,
        show_in_background: true
      })
        .setNotificationId(notification.notificationId)
        .setTitle(notification.title)
        .setSubtitle(notification.subtitle)
        .setBody(notification.body)
        .setData(notification.data)
        .android.setChannelId("ytvchannel")
        //.android.setSmallIcon("@mipmap/ic_notification")
        .android.setColor("#F2C94C")
        .android.setPriority(firebase.notifications.Android.Priority.High);

      firebase.notifications().displayNotification(localNotification);
      console.log("displayed");
      firebase
        .notifications()
        .removeDeliveredNotification(localNotification.notificationId);
    });

  notificationOpenedListener = () =>
    // app in background
    firebase.notifications().onNotificationOpened(notificationOpen => {
      console.log("notificationOpenedListener");
      console.log(notificationOpen);
      const { action, notification } = notificationOpen;
      firebase
        .notifications()
        .removeDeliveredNotification(notification.notificationId);
      console.log("OPEN:", notification);
    });

  notificationTokenListener = userId =>
    // listens for changes to the user's notification token and updates database upon change
    firebase.messaging().onTokenRefresh(notificationToken => {
      console.log("notificationTokenListener");
      console.log(notificationToken);

      return firebase
        .firestore()
        .collection("users")
        .doc(userId)
        .update({ pushToken: notificationToken, updatedAt: ts })
        .then(ref => {
          console.log("savePushToken success");
        })
        .catch(e => {
          console.error(e);
        });
    });

  _keyExtractor = (item, index) => item.id;

  separator = () => <View style={styles.separator} />;

  getAllArticles = () => {
    this.setState({ loading: true });
    const { page } = this.state;
    axios
      .get("https://youthevoice.com/articles", {
        params: {
          page: page
        }
      })
      .then(res => {
        this.setState({
          data: page === 0 ? res.data : [...this.state.data, ...res.data],
          //data: [...this.state.data, ...res.data],
          loading: false,
          loadDone: res.data.length <= 10 ? true : false
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      />
    );
  };

  _onPressShare = articleId => {
    this.props.navigation.navigate("ArticleShare", {
      shareData: "res.data"
    });
  };

  _onPress1 = articleId => {
    /* 1. Navigate to the Details route with params */

    this.props.navigation.navigate("DetailArticle", {
      articleId: articleId
    });
  };

  _onPress = articleId => {
    /* 1. Navigate to the Details route with params */

    this.props.navigation.navigate("DetailArticle", {
      articleId: articleId
    });
    /*
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
      */
  };

  handleRefresh = () => {
    this.setState(
      {
        refreshing: true,
        page: 0
      },
      () => {
        this.getAllArticles();
      }
    );
  };

  renderFooter = () => {
    //if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        {this.state.loadDone ? (
          <Text> Reached End..., Try Pulling down for latest updates...</Text>
        ) : (
          <ActivityIndicator animating size="large" />
        )}
      </View>
    );
  };

  findLastArticleId = () => {
    return this.state.data[this.state.data.length - 1].articlePk;
  };

  loadMore = () => {
    alert("jeevann...");
    //this.getAllArticles(this.findLastArticleId());

    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        if (!this.state.loadDone) {
          //(this.getAllArticles(this.state.page), 500);
          //debounce(this.getAllArticles(this.state.page), 1000);
          // alert("jeevann...");
          this.getAllArticles(this.state.page);
        }
        // this.getAllArticles(this.state.page);
      }
    );
  };

  renderHeader = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  _toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
    //  alert("Hellooo  Jeevannnn!!!!");
  };

  renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => this._onPress(item.articleId)}>
        <Text style={styles.cardHeader}>{item.articleHeading}</Text>
        <Image source={{ uri: item.articleImage }} style={styles.cardImage} />
        <Text style={styles.cardText}>
          One would think that years after Ajmal Kasab and his murderous coterie
          of Lashkar-e-Taiba terrorists exploited the vulnerability of India’s
          maritime security, our coasts would be almost impenetrable.
        </Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          padding: 10
        }}
      >
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate("YtvShare", {
              datailData: this.state.data
            })
          }
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="md-share-alt" size={30} color="#388e3c" />
            <Text style={{ padding: 10, color: "#388e3c" }}>Share</Text>
          </View>
          <Text style={{ paddingVertical: 5 }}> 20k Shares</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate("YtvVoice", {
              datailData: this.state.data
            })
          }
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="md-chatboxes" size={30} color="#388e3c" />
            <Text style={{ padding: 10, color: "#388e3c" }}>
              Add Your Voice
            </Text>
          </View>
          <Text style={{ paddingVertical: 5 }}> 20k Voices Heard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#bf360c" />

        <View style={styles.body}>
          <View style={styles.headerBar}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Icon name="ios-megaphone" color="#d84315" size={30} />
              <Text style={styles.logo}>YouTheVoice</Text>
            </View>
            <View>
              <BorderlessButton
                onPress={() => this.props.navigation.toggleDrawer()}
              >
                <Icon name="ios-search" color="#ffffff" size={30} />
              </BorderlessButton>
            </View>
          </View>
          <Loader loading={this.state.loadL} />
          <FlatList
            keyExtractor={(item, index) => item.articleId}
            data={this.state.data}
            renderItem={this.renderItem}
            ListFooterComponent={this.renderFooter}
            refreshing={this.state.refreshing}
            // onRefresh={this.handleRefresh}
            onEndReachedThreshold={0.1}
            onEndReached={this.loadMore}
          />
        </View>

        <View style={styles.bottomBar}>
          <View style={styles.bottomBarItem}>
            <BorderlessButton onPress={() => props.navigation.toggleDrawer()}>
              <Icon name="ios-bulb" color="#d84315" size={25} />
            </BorderlessButton>
            <Text style={styles.bottomBarTitle}> YourVoice</Text>
          </View>
          <View style={styles.bottomBarItem}>
            <BorderlessButton onPress={() => props.navigation.toggleDrawer()}>
              <Icon name="ios-appstore" color="#d84315" size={25} />
            </BorderlessButton>
            <Text style={styles.bottomBarTitle}> Fights</Text>
          </View>
          <View style={styles.bottomBarItem}>
            <BorderlessButton onPress={() => props.navigation.toggleDrawer()}>
              <Icon name="ios-contact" color="#d84315" size={25} />
            </BorderlessButton>

            <Text style={styles.bottomBarTitle}> MyNews</Text>
          </View>
        </View>
        <Modal isVisible={this.state.isModalVisible}>
          <View style={{ flex: 1 }}>
            <Text>Hello!</Text>
            <TouchableOpacity>
              <Text>Hide me!</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e3f2fd"
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
  body: {
    flex: 1,
    backgroundColor: "#e1f5fe"
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    paddingLeft: 5,
    letterSpacing: 2
  },
  bottomBar: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#e1f5fe",
    borderTopWidth: 2,
    borderTopColor: "#b3e5fc",
    alignItems: "center",
    justifyContent: "space-around",
    elevation: 3
  },
  bottomBarItem: {
    alignItems: "center",
    justifyContent: "center"
  },
  bottomBarTitle: {
    fontSize: 12
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
    color: "#0d47a1",
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
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0
  },
  button: {
    backgroundColor: "lightblue",
    padding: 12,
    margin: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)"
  }
});
