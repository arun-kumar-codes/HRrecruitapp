import React, { Component } from "react";
import { StatusBar, Platform } from "react-native";
import { Root, Footer, Text } from "native-base";
import Rootstack from "./config/router";
import "../src/firebase/index";
import * as firebase from "firebase";
import { FIREBASE_CONFIG } from "../src/config/firebase";
import pubsub from "pubsub-js";
import { COLOR } from "./styles/color";
import AppFooter from "./components/AppFooter";
import firebaseNot from "react-native-firebase";
import { pushnotification } from "./helper/pushnotification";

firebase.initializeApp(FIREBASE_CONFIG);
export default class App extends Component {
  async componentDidMount() {
    Platform.OS === "android"
      ? StatusBar.setBackgroundColor(COLOR.BGCOLOR)
      : StatusBar.setBarStyle("dark-content");
    pushnotification();
  }
  render() {
    return (
      <Root>
        <Rootstack />
        <AppFooter />
      </Root>
    );
  }
}
