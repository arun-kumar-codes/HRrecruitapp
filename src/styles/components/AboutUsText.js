import { StyleSheet } from "react-native";
import { COLOR } from "../color";

export default StyleSheet.create({
  descriptionView: {
    // backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10
  },
  textStyle: {
    fontFamily: "Montserrat-SemiBold",
    color: COLOR.TURQUOISE
  },
  aboutUsView: {
    marginVertical: 10
  },
  aboutUs: {
    fontFamily: "Montserrat-SemiBold",
    textAlign: "center",
    fontSize: 12.3,
    textAlignVertical: "center"
  },
  btnStyle: {
    marginBottom: 15,
    height: 35,
    backgroundColor: COLOR.MUSTARD,
    marginBottom: 10
  }
});