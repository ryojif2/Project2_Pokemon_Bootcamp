import React, { Component } from "react";
import { Audio } from "expo-av";

export default class LoginSound extends React.Component {
  constructor(props) {
    super(props);
    this.backgroundSound = null;
  }

  async componentDidMount() {
    try {
      this.backgroundSound = new Audio.Sound();
      await this.backgroundSound.loadAsync(
        require("../assets/sounds/background/opening.mp3")
      );
      await this.backgroundSound.setIsLoopingAsync(true);
      await this.backgroundSound.playAsync();
    } catch (error) {
      console.log("error loading background sound: ", error);
    }
  }

  render() {
    return null;
  }

  // login = () => {
  //   let username = this.state.username;

  //   if (username) {
  //     this.props.navigation.navigate("TeamSelect", {
  //       username,
  //     });

  //     this.backgroundSound.stopAsync();
  //   }
  // };
}
