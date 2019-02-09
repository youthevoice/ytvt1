import React from "react";
import { View, Text, StyleSheet } from "react-native";

import { Input, Button as Button1 } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome5";
//import LinearGradient from "react-native-linear-gradient";
import LinearGradient from "react-native-linear-gradient";

export default class PlayTB extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      validPhone: false,
      validSname: false,
      sname: ""
    };
  }

  validatePhone = phone => {
    console.log(phone);

    const phoneNum = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
    if (phoneNum.test(phone)) {
      this.setState({ validPhone: true });
      console.log("matched");
    } else {
      this.setState({ validPhone: false });
      console.log("not  matched");
    }

    console.log(phone);
  };

  validateSName = sname => {
    if (/\S/.test(sname)) {
      this.setState({ validSname: true });
      console.log("matched");
    } else {
      this.setState({ validSname: false });
      console.log("not  matched");
    }

    console.log(sname);
  };

  render() {
    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Input
          autoFocus
          containerStyle={{ paddingHorizontal: 20, paddingVertical: 30 }}
          placeholder="PHONE NUMBER"
          leftIcon={
            <Icon
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
            <Icon
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
          icon={<Icon name="sign-in-alt" size={15} color="white" />}
          iconLeft
          title=" SEND OTP"
          disabled={
            this.state.validPhone && this.state.validSname ? false : true
          }
          loading={
            this.state.validPhone && this.state.validSname ? true : false
          }
        />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  linearGradient: {
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    width: 300,
    height: 50
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Gill Sans",
    textAlign: "center",
    margin: 10,
    color: "#ffffff",
    backgroundColor: "transparent"
  },
  LoginButton: {
    backgroundColor: "#0d47a1",
    borderRadius: 50,

    width: 200
  }
});
