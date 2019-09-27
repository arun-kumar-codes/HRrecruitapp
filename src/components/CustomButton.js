import React from "react";
import { StyleSheet, Platform } from "react-native";
import { Button, Text ,Icon} from "native-base";
import PropTypes from "prop-types";

const CustomButton = props => {
  const { text, type = 'block', btnStyle = {}, btnTextStyle={} ,style ={},textColor={},IconStyle={},key} = props;
  if(type == 'rounded'){
    return (
    <Button onPress={props.onPress} style={[styles.removeShadow,btnStyle]} rounded info>
      <Text uppercase={false} style={[styles.btnText,btnTextStyle]}>
        {text}
      </Text>
    </Button>
  );
  }else if(type =='login_to_apply') {
   return( 
    <Button onPress={props.onPress} style={[btnStyle,styles.removeShadow]} rounded info>
    <Text uppercase={false} style={[btnTextStyle,{fontSize:Platform.OS==='ios' ? 11.5 :12}]}>
      {text}
    </Text>
  </Button>
   )
  }
  else if(type =='to_share') {
    return( 
     <Button onPress={props.onPress} style={[btnStyle,styles.removeShadow]} /* iconLeft */ rounded info>
     <Icon name="share" type="Entypo" style={[IconStyle/* ,{marginLeft:0} */]} />
     <Text uppercase={false} style={[btnTextStyle,{marginLeft:-28,paddingRight:42,fontSize:Platform.OS==='ios' ? 11.5 :12}]}>
       {text}
     </Text>
   </Button>
    )
   }
   else if(type =='keySkillButton') {
    return( 
     <Button onPress={props.onPress} style={[btnStyle,styles.removeShadow]} key={key} rounded >
     <Text uppercase={false} style={btnTextStyle}>
       {text}
     </Text>
   </Button>
    )
   }
  else {   
    return (
      <Button onPress={props.onPress} style={[style,styles.removeShadow]}  block info>
        <Text uppercase={false} style={[styles.btnText, btnTextStyle,textColor]}>
        {text}
      </Text>
    </Button>
  );
}
};

const styles = StyleSheet.create({
  btnText: {
    fontSize: Platform.OS === "ios" ? 17 : 15,
    fontWeight: Platform.OS === "ios" ? "500" : "300",
    letterSpacing: 1
  },
  removeShadow : {
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0,
    elevation:0
  }
});

CustomButton.propTypes = {
  text: PropTypes.string,
  onPress: PropTypes.func.isRequired
};

export default CustomButton;
