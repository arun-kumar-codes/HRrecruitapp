import React, { Component } from "react";
import { View, Text } from "react-native";
import { Button } from "native-base";
import { COLOR } from "../styles/color";

class ReviewButton extends Component {
  constructor() {
    super();
    this.state = {
      isPressed: false,
      index: null
    };
  }
  _onPressIn = index => this.setState({ isPressed: true, index: index });
  _onPressOut = () => this.setState({ isPressed: false });

  render() {
    const reviews = ["GOOGLE", "GLASSDOOR", "FACEBOOK"];
    const { isPressed, index } = this.state;
    return (
      <View style={{ flexDirection: "row" }}>
        {reviews.map((btnText, id) => (
          <Button
            rounded
            onPressIn={() => this._onPressIn(id)}
            onPressOut={this._onPressOut}
            style={{
              backgroundColor: isPressed && index === id ? COLOR.MUSTARD : "transparent",
              borderColor: "#201F40",
              paddingHorizontal: 10,
              marginHorizontal: id === 1 ? 7 : 0
            }}
            key={id}
          >
            <Text
              style={{
                color: isPressed && index === id ? COLOR.LGTWO : "white",
                fontSize: 10,
                fontFamily: "Montserrat"
              }}
            >
              {btnText} REVIEWS
            </Text>
          </Button>
        ))}
      </View>
    );
  }
}

export default ReviewButton;
