import React, { Component } from "react";
import { AsyncStorage, View, Text, Alert } from "react-native";
import firebase from "react-native-firebase";

export default class Noti extends Component {
  async componentDidMount() {
    firebase.messaging().subscribeToTopic("ytv");
    this.checkPermission();
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const action = notificationOpen.action;
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

  //1
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

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text>Welcome to React Native!</Text>
      </View>
    );
  }
}
