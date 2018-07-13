import { StyleSheet, Platform, Dimensions } from "react-native";
var { height, width } = Dimensions.get('window');
import {COLOR} from './color'

export default StyleSheet.create({
  picker: {
    width: "98%",
    borderBottomColor: COLOR.Grey,
    borderBottomWidth: 1,
    marginBottom: 7
  },
  inputTextView: {
    borderBottomWidth: 0,
    width: "100%"
  },
  errorTextView: {
    width: "95%"
  },
  errorText: {
    color: COLOR.Red,
    fontSize: 12
  },
  text: {
    marginLeft:10,
    marginRight:10,
    letterSpacing: 1,
    alignSelf: "center",
    fontSize: Platform.OS === "ios" ? 16 : 15,
    color: COLOR.Black,
    fontWeight: Platform.OS === "ios" ? "700" : "500",
  },
  fileName: {
    width:width*0.70,
    marginLeft: 10,
    marginRight: 10,
    letterSpacing: 1,
    alignSelf: "center",
    fontSize: Platform.OS === "ios" ? 16 : 14,
    color: COLOR.DarkGrey,
    fontWeight: Platform.OS === "ios" ? "400" : "400",
  },
  uploadSection: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: width * 0.92, 
    marginTop: 10 
  },
  uploadIcon: { 
    fontSize: 35, 
    color: COLOR.Spinner 
  },
  closeIcon: { 
    color: 'red', 
    fontSize: 30,
    paddingRight:8 
  }
});
