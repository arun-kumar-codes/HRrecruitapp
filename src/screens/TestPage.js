import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Container,
  Content,
  Text,
  Card,
  CardItem,
  Thumbnail,
  Button,
  Spinner,
  Radio
} from "native-base";
import * as _ from 'lodash';
import { AsyncStorage, NetInfo, FlatList, View } from "react-native";
import { Row, Col, Grid } from "react-native-easy-grid";
import styles from "../styles";
import CustomButton from "../components/CustomButton";
import HorizontalLine from "../components/HorizontalLine";
import { callingHelp } from "../actions";
import { notify } from "../helper/notify";
import { COLOR } from "../styles/color";

class TestPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: null,
      count: 0,
      counter: 60 * 60 * 1000,
      question: [],
      solution:[],
      isSubmit:false,
      isLoading:false,
      isOffline: true
    };
    this.handleNetwork = this.handleNetwork.bind(this);
  }
  componentDidMount() {
    let timer = setInterval(this.tick, 1000);
    this.setState({ timer });
    AsyncStorage.getItem("question", (err, result) => {
      if (result !== null) {
        const question = JSON.parse(result);
        this.setState({ question: question.data, count: question.data.count });
      }
    });
    NetInfo.isConnected.addEventListener(
      "connectionChange",
      this.handleNetwork
    );
  }
  handleNetwork(isconnect) {
    console.log(isconnect);
    //functinality for net connection at time of answering paper
    this.setState({ isOffline: isconnect });
  }
  componentWillUnmount() {
    clearInterval(this.state.timer);
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleNetwork
    );
  }
  tick = () => {
    this.setState({ counter: this.state.counter - 1000 });
    // let now = new Date().getTime();

    // // Find the distance between now an the count down date
    // let distance = countDownDate - now;

    // // Time calculations for days, hours, minutes and seconds
    // let hours = Math.floor(
    //   (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    // );
    // let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    // let seconds = Math.floor((distance % (1000 * 60)) / 1000);
  };

  static navigationOptions = ({ navigation }) => {
    const name = navigation.getParam("name");
    const profile_pic = navigation.getParam("profile_pic");
    return {
      title: name,
      headerLeft: (
        <Content padder>
          <Thumbnail small source={{ uri: profile_pic }} />
        </Content>
      )
    };
  };

  handleCallHelp = async () => {
    const fb_id = this.props.navigation.getParam("fb_id");
    const accessToken = fb_id ? true : null;
    await this.props.callingHelp(accessToken, fb_id);
    const { data } = this.props.callHelp;
    if (data.status === 1) {
      notify("Please Wait. The message has been sent to HR");
    }
  };

  handleSubmit (question,option) {
      const solution = this.state.solution;
      let answer;
      if(solution[0] != undefined){
        let found = false;  
       let solutions =  _.map(solution,(value,index)=>{
        if(value.Q_id == question){
            value.ans_id = option;
            found =true;
          } else if( !found ) {
             answer = {Q_id : question ,ans_id : option };
          }
        });
      } else {
        answer = {Q_id : question ,ans_id : option };
      }

      if(answer != undefined){
        solution.push(answer)
      }
      this.setState({
        solution,
      });
      AsyncStorage.setItem('solution',JSON.stringify({solution:solution}));
  }

  render() {
    const {
      callHelp: { calling, success }
    } = this.props;

    const { count, question, isOffline } = { ...this.state };
    let solution = this.state.solution;
    console.log(solution.length);
    if (success !== undefined) {
      if (success === false) {
        notify("Something went wrong");
      }
    }
    return (
      <Container style={styles.container}>
        {isOffline ? (
          <Content padder>
            <Card style={styles.blockView}>
              <CardItem>
                <Text style={styles.headerText}> Test Questions </Text>
              </CardItem>
              <Row>
                <Col style={{ width: "75%", alignItems: "flex-start" }}>
                  <Text style={styles.text}>
                    Remaining Time :{" "}
                    <Text style={{ color: COLOR.Red }}>
                      {this.state.counter}
                    </Text>
                  </Text>
                  <Text style={styles.text}>
                    Questions Attempted : {`${solution.length}/`}
                    {count}{" "}
                  </Text>
                </Col>
                <Col style={{ width: "25%", alignItems: "flex-end" }}>
                  {calling ? (
                    <Spinner color="#2196f3" />
                  ) : (
                    <Button onPress={this.handleCallHelp} info>
                      <Text style={{ fontSize: 10, textAlign: "center" }}>
                        Call for Help
                      </Text>
                    </Button>
                  )}
                </Col>
              </Row>
            </Card>
            <Card>
              <Content style={{ backgroundColor: "white" }}>
                <CardItem>
                  <FlatList
                    data={question.data}
                    renderItem={({ item ,index }) => (
                      <Content key={index} >
                        <FlatList
                          data={item.questions}
                          ListHeaderComponent={() => (
                            <Card style={styles.blockView}>
                              <CardItem>
                                <Text style={styles.headerText}>
                                  {item.group_name}
                                </Text>
                              </CardItem>
                            </Card>
                          )}
                          renderItem={({ item, index }) => (
                            <Content key={index} padder>
                              <Text style={{ fontSize: 16 }}>
                                {index + 1}. {item.question}
                              </Text>
                              {item.description ? (
                                <View
                                  style={{
                                    borderRadius: 5,
                                    flex: 1,
                                    padding: 10,
                                    backgroundColor: COLOR.LightGrey,
                                    elevation: 1,
                                    marginVertical: 5
                                  }}
                                >
                                  <Text style={{ opacity: 0.8 }}>
                                    {item.description}
                                  </Text>
                                </View>
                              ) : null}
                              {_.map(item.options,(value, index)=>{
                                console.log(solution);
                                let isSolution = solution[0]!=undefined ? _.findIndex(solution,(value)=>{ return value.questionId == index.question }) :null;
                                console.log(isSolution);
                               return (
                                  <Content key={index} padder>
                                    <Row>
                                      <Col style = {{width:"10%"}}>
                                        <Radio onPress={()=> this.handleSubmit(item._id,value.opt_id) }  />
                                      </Col>
                                      <Col>
                                        <Text>{value.option}</Text>
                                      </Col>
                                    </Row>
                                  </Content>
                                );
                              })}
                              <View style={{ paddingTop: 15 }}>
                                <HorizontalLine />
                              </View>
                            </Content>
                          )}
                        />
                      </Content>
                    )}
                  />
                </CardItem>
              </Content>
            </Card>
          </Content>
        ) : (
          <Content padder>
            <Card style={styles.blockView}>
              <CardItem>
                <Text style={styles.headerText}>Start Test</Text>
              </CardItem>
              <Row>
                <Text>
                  To Start Test Please turn off you Internet connection
                </Text>
              </Row>
            </Card>
          </Content>
        )}
      </Container>
    );
  }
}
const mapStateToProps = state => ({
  callHelp: state.callHelp,
  questions: state.questions
});
export default connect(mapStateToProps, { callingHelp })(TestPage);
