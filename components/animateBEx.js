import React, { PureComponent } from "react";
import { Platform, ScrollView, StatusBar, Text, View } from "react-native";

import Btn from "react-native-micro-animated-button";

StatusBar.setHidden(true, "fade");

const colors =
  Platform.OS === "ios"
    ? {
        blue: "#007aff",
        gray: "#d8d8d8",
        green: "#4cd964",
        red: "#ff3b30",
        white: "#ffffff"
      }
    : {
        blue: "#4285f4",
        gray: "#d8d8d8",
        green: "#0f9d58",
        red: "#db4437",
        white: "#ffffff"
      };

const Example1 = () => (
  <View style={styles.center}>
    <Btn
      foregroundColor={colors.green}
      label="Submit"
      onPress={() => this.b1.success()}
      ref={ref => (this.b1 = ref)}
      successIcon="check"
    />

    <Btn
      foregroundColor={colors.blue}
      label="Retweet"
      onPress={() => this.b2.success()}
      ref={ref => (this.b2 = ref)}
      successIcon="retweet"
    />

    <Btn
      foregroundColor={colors.red}
      label="Favorite"
      onPress={() => this.b3.success()}
      ref={ref => (this.b3 = ref)}
      successIcon="heart"
    />
  </View>
);

const Example2 = () => (
  <View style={styles.center}>
    <Btn
      errorBackgroundColor={colors.red}
      errorIcon="thumbs-down"
      expandOnFinish
      foregroundColor={colors.blue}
      label="Am I even?"
      onPress={() =>
        new Date().getSeconds() % 2 === 0 ? this.b4.success() : this.b4.error()
      }
      ref={ref => (this.b4 = ref)}
      successBackgroundColor={colors.green}
      successIcon="thumbs-up"
      width={240}
    />

    <Btn
      errorBackgroundColor={colors.red}
      errorIcon="thumbs-down"
      expandOnFinish
      foregroundColor={colors.blue}
      label="Am I even?"
      onPress={() =>
        new Date().getSeconds() % 2 === 0 ? this.b5.success() : this.b5.error()
      }
      ref={ref => (this.b5 = ref)}
      successBackgroundColor={colors.green}
      successIcon="thumbs-up"
      width={240}
    />
  </View>
);

const Example3 = () => (
  <View style={styles.center}>
    <Btn
      backgroundColor={colors.blue}
      errorBackgroundColor={colors.red}
      errorForegroundColor={colors.white}
      errorIcon="warning"
      foregroundColor={colors.white}
      label="Simulate an error"
      onPress={() => this.b6.error()}
      ref={ref => (this.b6 = ref)}
      shakeOnError
      width={240}
    />

    <Btn
      backgroundColor={colors.blue}
      foregroundColor={colors.white}
      label="Smile at me"
      onPress={() => this.b7.success()}
      ref={ref => (this.b7 = ref)}
      scaleOnSuccess
      successBackgroundColor={colors.green}
      successForegroundColor={colors.white}
      successIcon="smile-o"
      width={240}
    />
  </View>
);

class Example4 extends PureComponent {
  state = { disabled: true };

  onPress = () => this.setState({ disabled: !this.state.disabled });

  render() {
    return (
      <View style={styles.center}>
        <Btn
          backgroundColor={colors.blue}
          foregroundColor={colors.white}
          label="Static Button"
          noRadius
          onPress={this.onPress}
          static
        />

        <Btn
          disabled={this.state.disabled}
          label="Disabled Button"
          noRadius
          static
        />
      </View>
    );
  }
}

class Example5 extends PureComponent {
  state = { clicked: false };

  onPress = () => this.setState({ clicked: true }, () => this.b8.success());

  onSecondaryPress = () =>
    this.setState({ clicked: false }, () => this.b8.reset());

  render() {
    return (
      <View style={styles.row}>
        <Btn
          foregroundColor={colors.blue}
          icon="cloud-download"
          noFill
          onPress={this.onPress}
          onSecondaryPress={this.onSecondaryPress}
          ref={ref => (this.b8 = ref)}
          successBackgroundColor={colors.blue}
          successIcon="remove"
        />

        {this.state.clicked && (
          <Text style={styles.rightText}>I just got downloaded</Text>
        )}
      </View>
    );
  }
}

const Examples = () => (
  <ScrollView contentContainerStyle={styles.full}>
    <Example3 />
  </ScrollView>
);

const styles = {
  center: { alignItems: "center" },
  full: { flex: 1 },
  rightText: { color: colors.blue, marginLeft: 10 },
  row: { alignItems: "center", flexDirection: "row", justifyContent: "center" }
};

export default Examples;
