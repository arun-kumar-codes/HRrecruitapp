import React, { Component, Fragment } from "react";
import { View, Alert, Platform, PermissionsAndroid } from "react-native";
import {
  Container,
  Content,
  Body,
  Text,
  Card,
  CardItem,
  Item,
  Input,
  Picker,
  Spinner,
  Button,
  Icon
} from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";
import { reduxForm, Field } from "redux-form";
import { isEmail, isMobilePhone, isLowercase } from "validator";
import Logo from "../components/Logo";
import CustomButton from "../components/CustomButton";
import HorizontalLine from "../components/HorizontalLine";
import styles from "../styles";
import _styles from "../styles/AddCandidate";
import { COLOR } from "../styles/color";
import { notify } from "../helper/notify";
import { connect } from "react-redux";
import { addCandidate } from "../actions";
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';

class AddCandidate extends Component {
    constructor(){
      super()
      this.state = {
        converting:false,
        resumeData:[],
        currentType:'',
        resumeError:null,
      }      
    }
      
  static navigationOptions = {
    header: null
  };
  static getDerivedStateFromProps(nextProps) {
    const { msg } = nextProps.candidate;
    if (msg !== undefined) {
      alert(msg);
    }
    return null;
  }


  componentDidUpdate() {
    const { candidate } = this.props;
    if (candidate.data !== undefined) {
      if (candidate.data.candidate_status === false) {
        Alert.alert(
          "Thank You",
          "Wait for the confirmation of your registration from HR.",
          [
            {
              text: "OK",
              onPress: () => this.props.navigation.popToTop()
            }
          ],
          { cancelable: false }
        );
      }
    }
    const { success } = this.props.candidate;
    if (success !== undefined) {
      if (success === false) {
        notify("Something went wrong");
      }
    }
  }
  renderField(props) {
    const { input, ...inputProps } = props;
    const {
      meta: { touched, error }
    } = props;
    return (
      <Fragment>
        <Item style={_styles.inputTextView}>
          <Input
            style={styles.inputText}
            {...inputProps}
            onChangeText={input.onChange}
            onBlur={input.onBlur}
            onFocus={input.onFocus}
            value={input.value}
            placeholderTextColor={COLOR.Grey}
            selectionColor={COLOR.Grey}
            underlineColorAndroid={COLOR.Grey}
          />
        </Item>
        <View style={_styles.errorTextView}>
          {touched && error && <Text style={_styles.errorText}>{error}</Text>}
        </View>
      </Fragment>
    );
  }
  renderPicker({
    input: { onChange, value, ...inputProps },
    children,
    ...pickerProps
  }) {
    const {
      meta: { touched, error }
    } = pickerProps;
    return (
      <Fragment>
        <View style={_styles.picker}>
          <Picker
            selectedValue={value}
            onValueChange={value => {
              requestAnimationFrame(() => {
                onChange(value);
              });
            }}
            {...inputProps}
            {...pickerProps}
          >
            {children}
          </Picker>
        </View>
        <View style={_styles.errorTextView}>
          {touched && error && <Text style={_styles.errorText}>{  error}</Text>}
        </View>
      </Fragment>
    );
  }
  renderButtonField(props) {
    const { onPress, resumeError, input, onClosePress }=props;
    const resumeContainer = input.map((data,i)=>{
      return (
        <View key={i} style={_styles.uploadSection} >
          <Text numberOfLines={1} style={_styles.fileName}>{data.fileName}</Text>
          <Button transparent onPress={() => { onClosePress(i)}} style={{ marginTop: 5 }}>
            <Icon style={_styles.closeIcon} name='close' />
          </Button>
        </View>
      )
    })
    return (
      <View >
        <View style={_styles.uploadSection}>
          <Text numberOfLines={1} style={_styles.text}>Upload Resume</Text>
          <Button transparent onPress={onPress} style={{marginTop:5}}>
            <Icon style={_styles.uploadIcon} name='cloud-upload' />
          </Button>
        </View>
        {resumeContainer}
        <View style={_styles.errorTextView}>
          {resumeError && <Text style={[_styles.errorText,{marginLeft:8}]}>{  resumeError}</Text>}
        </View>
      </View>
    );
  }
  onSubmit = values => {
    values["fileNames"] = [];
    if (this.state.resumeData.length >=1) {
      this.state.resumeData.map((data,i)=>{
        values[`file${i + 1}`] = data.dataBase64;
        values["extention"] = data.filetype;
        values["fileNames"].push(`file${i+1}`)
      })
      this.props.addCandidate(values);
    }else{
      this.setState({ resumeError:'Upload your resume'})
    }
  };

  onResumeAdd = () => {
    this.props.change({ resume_file: [] })
    let resumeData = this.state.resumeData;
    this.setState({converting:true})
    if (Platform.OS !== "ios"){ //Android Only
      DocumentPicker.show({
        filetype: [DocumentPickerUtil.allFiles()],
      }, (error, res) => {
        if (res) {
          let check = this.state.resumeData.length >= 1 ? this.state.currentType == res.type : true
          if (check){
            let type = res.type.split("/")
            RNFetchBlob.fs.readFile(res.uri, 'base64')
              .then((data) => {
                resumeData.push({
                  fileName: res.fileName,
                  dataBase64: data,
                  filetype: type[1]
                })
                this.setState({ converting: false, resumeData, currentType: res.type})
              }, error => {
                this.setState({ converting: false })
              })
          }else{
            this.setState({ converting: false, resumeError:null })
            alert('Please select same format for files');
          }          
        } else {
          this.setState({ converting: false, resumeError: null })
        }
      });
    }else {
      alert ('Not implemented in IOS');
      this.setState({ converting: false, resumeError: null })
    }
  }
  onClosePress = (i) => {
    if (!this.state.converting){
    let resumeData = this.state.resumeData;
    resumeData.splice(i, 1);
    this.setState({resumeData});
    }
  }
  render() {
    const { handleSubmit } = this.props;
    const { adding } = this.props.candidate;
    const { converting, resumeData, resumeError } = this.state;
    return (
      <Container style={styles.container}>
        <Content padder>
          <Grid>
            <Row style={styles.logoView}>
              <Logo />
            </Row>
            <Row>
              <Card style={styles.blockView}>
                <CardItem>
                  <Text style={styles.headerText}>Register Candidate</Text>
                </CardItem>
                <HorizontalLine />
                <Field
                  name="sender_mail"
                  placeholder="Email"
                  keyboardType="email-address"
                  component={this.renderField}
                  autoCapitalize="none"
                />
                <Field
                  name="from"
                  placeholder="Full Name"
                  component={this.renderField}
                />
                <Field
                  name="gender"
                  component={this.renderPicker}
                  mode="dropdown"
                >
                  <Item label="Select gender" value="" />
                  <Item label="Female" value="female" />
                  <Item label="Male" value="male" />
                </Field>

                <Field
                  name="source"
                  placeholder="Source"
                  component={this.renderField}
                />
                <Field
                  name="mobile_no"
                  placeholder="Mobile number"
                  component={this.renderField}
                  keyboardType="numeric"
                />
                <Field
                  name="resume_file"
                  placeholder="Mobile number"
                  onPress={() => { this.onResumeAdd()}}
                  onClosePress={(i)=>{this.onClosePress(i)}}
                  component={this.renderButtonField}
                  input={resumeData}
                  resumeError={resumeError}
                />
                <CardItem />
                {adding || converting ? (
                  <Spinner color={COLOR.Spinner} />
                ) : (
                  <CustomButton
                    text="Add"
                    onPress={handleSubmit(this.onSubmit)}
                  />
                )}
              </Card>
            </Row>
          </Grid>
        </Content>
      </Container>
    );
  }
}
validate = values => {
  const errors = {};
  if (!values.from) {
    errors.from = "Cannot be Empty";
  }

  if (!values.sender_mail) {
    errors.sender_mail = "Cannot be Empty";
  } else if (!isEmail(values.sender_mail) || !isLowercase(values.sender_mail)) {
    errors.sender_mail = "Enter a valid email and must be in lowercase";
  }
  if (!values.gender) errors.gender = "Select a gender";
  if (!values.source) errors.source = "Cannot be Empty";
  if (!values.mobile_no) {
    errors.mobile_no = "Cannot be Empty";
  } else if (!isMobilePhone(values.mobile_no, "en-IN")) {
    errors.mobile_no = "Enter valid phone number";
  }
  return errors;
};

const mapStateToProps = ({ candidate }) => ({ candidate });
export default reduxForm({
  form: "AddCandidate",
  validate
})(
  connect(
    mapStateToProps,
    { addCandidate }
  )(AddCandidate)
);
