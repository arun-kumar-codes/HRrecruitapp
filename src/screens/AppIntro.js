import React, { Component } from "react";
import {
  View,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  AppState,
  NetInfo,
  ActivityIndicator,
} from "react-native";
import { Container, Text, Button, Icon, Card } from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";
import Logo from "../components/Logo";
import CustomButton from "../components/CustomButton";
import styles from "../styles/screens/AppIntro";
import ProgressBar from "../components/ProgressBar";
import HomePage from "./HomePage";
var { height, width } = Dimensions.get("window");
import LinearGradient from "react-native-linear-gradient";
import { AppDetails } from "../helper/json";
import { getItem, setItem } from "../helper/storage";
import SplashScreen from "react-native-splash-screen";
import branch, { RegisterViewEvent } from "react-native-branch";
import { connect } from "react-redux";
import {
  getCandidateJobDetails,
  getCandidateDetails,
  getJobLists,
  getCandidateRoundDetails
} from "../actions";
import { SUCCESS_STATUS } from "../helper/constant";
import { COLOR } from "../styles/color";
import CardTrail from "../components/CardTrail";
// import FCM, { FCMEvent } from "react-native-fcm";
class AppIntro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deepLink: false,
      sharing: false,
      fb_id: null,
      didPreviouslyLaunch: false,
      linkOpening: false,
      candidateJob: null,
      profile_pic: null,
      userName: null,
      mobile_no: null,
      textColor: false,
      notification: "",
      index: 0,
      deepLinkParams:{},
      isError:false,
    };
  }
  static navigationOptions = {
    header: null
  };
   componentDidUpdate(nextProps) {
     const {isError}=this.state;
     const {interviewSignUp} =this.props;
     if(interviewSignUp.jobNotAssign !== nextProps.interviewSignUp.jobNotAssign){
    const { error, success, msg, message } = interviewSignUp;
    if (error !== undefined && error === 1 && message !== undefined && !isError) {
      alert(message);
      this.setState({isError:true})
    }
    // if (success !== undefined && !success && !isError) {
    //   notify("Something went wrong");
    //   this.setState({isError:true})
    // }
  }
    if(interviewSignUp.isError !== nextProps.interviewSignUp.isError){
      const { error, success, msg, message } = interviewSignUp;
    if (msg !== undefined && !isError) {
      // alert(msg);
      this.props.navigation.navigate("HomePage",{errorFromAppinto:true})
      this.setState({isError:true})
    }
  }
  }

  _handleAppStateChange = async nextAppState => {
    this.setState({ didPreviouslyLaunch: nextAppState });
    // console.log(nextAppState,'appstate');
    const appIntro = await getItem("appintro");
    const candidateJob = await getItem("mongo_id");
    if (
      this.state.didPreviouslyLaunch === "background" &&
      ((appIntro !== undefined && appIntro.shown) || candidateJob)
    ) {
      this.props.navigation.replace("HomePage",{errorFromAppinto:false});
    }
    SplashScreen.hide();
  };
  componentDidMount = async () => {
    const {deepLinkParams} =this.state;
    NetInfo.isConnected.fetch().then(async isConnected => {
      if (isConnected) {
        await this.props.getJobLists();
        await this._checkDeepLink();
        SplashScreen.hide();
      } else {
        const appIntro = await getItem("appintro");
        const candidateJob = await getItem("mongo_id");
        if (candidateJob || (appIntro !== undefined && appIntro.shown)) {
          this.props.navigation.replace("HomePage",{errorFromAppinto:false});
        }
        SplashScreen.hide();
        alert("Please! Connect to the internet first");
      }
    });
    AppState.addEventListener("change", this._handleAppStateChange);
  };
  componentWillUnmount(){
    clearTimeout(this.timer);
  }

  _checkDeepLink = async () => {
    const appIntro = await getItem("appintro");
    branch.subscribe(async ({ params }) => {
      if(params.$share_data ==undefined && params.$deeplink_path ==undefined && appIntro ==undefined){
        this.timer =setTimeout(() => {
            this._onSkip();
          }, 60000);
      }
      if (
        this.props.joblist.data !== "" &&
        this.props.joblist.data !== undefined &&
        params.$share_data !== undefined &&
        this.props.joblist !== null
      ) {
        const candidateJob = await getItem("mongo_id");
        if (candidateJob || (appIntro !== undefined && appIntro.shown)) {
          this.props.navigation.replace("HomePage",{errorFromAppinto:false});
        }
        this.props.joblist.data.forEach((item, i) => {
          if (item.id == params.$share_data) {
            this.props.navigation.navigate("FullDescription", {
              subject: item.subject,
              job_description: item.job_description,
              keyword: item.keyword,
              candidate_profile: item.candidate_profile,
              jobDetail: item,
              currentJob: this.props.joblist
            });
            SplashScreen.hide();
          }
        });
      }
      if (params.errors && params.errors !== undefined) {
        alert("Error from Branch: " + errors);
        return;
      }
      if (params.$deeplink_path !== undefined) {
        let fb_id = params.$deeplink_path;
        await this.props.getCandidateDetails(fb_id);
        const { status } = this.props.interviewSignUp;
        if (status == 1) {
          this.setState({ deepLink: true, fb_id: fb_id });
          this._linkCheck()
        } else if (params.error == 1 && params.error !== undefined) {
          this.setState({ deepLink: false });
        }
      } else if (
        params.$deeplink_path == undefined &&
        params.$share_data == undefined
      ) {
        const appIntro = await getItem("appintro");
        const candidateJob = await getItem("mongo_id");
        if (candidateJob || (appIntro !== undefined && appIntro.shown)) {
          this.props.navigation.replace("HomePage",{errorFromAppinto:false});
          SplashScreen.hide();
        }
      } else if (params.$share_data !== undefined) {
        this.setState({ sharing: true });
      }
      //   });

      // }
      // else{
      // const appIntro = await getItem("appintro");
      //     const candidateJob = await getItem("mongo_id");
      //     if (candidateJob || (appIntro !== undefined && appIntro.shown)) {
      //       this.props.navigation.replace("HomePage");
      //     }
      // }
    });
    // SplashScreen.hide();
  };
  _onNext = index => {
    let items = AppDetails;
    let moveToIndex = items.length - 1 <= index;
    if (!moveToIndex) {
      let moveIndex = index + 1;
      this.flatListRef.scrollToIndex({ animated: true, index: moveIndex });
    } else {
      this._linkCheck();
    }
  };
  _onSkip = () => {
    this._linkCheck();
  };
  _linkCheck = async () => {
    const { deepLink, sharing, fb_id } = this.state;
    if (deepLink) {
      const { data, message, error, status } = this.props.interviewSignUp;
      setItem("mongo_id", JSON.stringify({ candidate: { data: data } }));
      this.props.navigation.navigate("Instructions", {
        fb_id: fb_id,
        profile_pic: `https://pikmail.herokuapp.com/${
          data.sender_mail
        }?size=60`,
        name: data.from,
        email: data.sender_mail
      });
      SplashScreen.hide();
    } else if (sharing) {
      this.props.navigation.navigate("JobList", { title: "Apply for Jobs" });
      SplashScreen.hide();
    } else {
      setItem("appintro", JSON.stringify({ shown: true }));
      this.props.navigation.navigate("HomePage",{errorFromAppinto:false});
      SplashScreen.hide();
    }
  };
  _renderItem = ({ item, index }) => {
    let imgMargin;
    switch (index) {
      case 0:
        imgMargin = -13;
        break;
      case 2:
        imgMargin = -32;
        break;
      default:
        imgMargin = -10;
        break;
    }
    let font_size = index === 0 || index === 3 ? 15 : 24;

    return (
      <Grid>
        <Col size={9} style={[styles.container]}>
          <LinearGradient
            colors={[COLOR.LGONE, COLOR.LGTWO]}
            style={[styles.container, styles.containerView]}
          >
            <CardTrail />
            <Card style={[styles.appIntroCardStyle]}>
              {/* <View style={{borderWidth:1}}> */}
              <Image
                resizeMode="contain"
                style={[
                  index === 0 ? styles.helloImage : styles.images,
                  {
                    marginLeft: imgMargin
                  }
                ]}
                source={item.image}
              />
              <View
                style={[
                  // { marginLeft: index === 0 ? "17%" : null,marginTop:index === 0 ? 0 :null },
                  index === 0
                    ? { position: "relative", left: "14%", top: 0 }
                    : {},
                  index === 1 ? styles.secondImageTextView : {},
                  index === 3 ? styles.fourthImageTextView : {}
                  // {borderWidth:1}
                ]}
              >
                <Text
                  style={[
                    {
                      fontSize: font_size
                    },
                    styles.rawText
                  ]}
                >
                  {item.rawText}
                </Text>
                <Text
                  style={[
                    {
                      fontSize: font_size
                    },
                    styles.boldText
                  ]}
                >
                  {item.boldText}
                </Text>
              </View>
              {/* </View> */}
            </Card>
          </LinearGradient>
        </Col>
        {/* <Row style={styles.bottomContainer}>
          <Text
            style={styles.skipText}
            onPress={() => {
              this._onSkip();
            }}
          >
            {index == 3 ? "" : "Skip"}
          </Text>
          <ProgressBar items={AppDetails} index={index} />
          <View
            onPress={() => {
              this._onNext(item, index);
            }}
            style={styles.nextView}
          >
            <TouchableOpacity
              onPress={() => {
                this._onNext(item, index);
              }}
              style={styles.btnBack}
            />
            <Icon
              onPress={() => {
                this._onNext(item, index);
              }}
              style={styles.nextIcon}
              name={iconName}
            />
          </View>
        </Row> */}
      </Grid>
    );
  };
  handleScroll(event) {
    let index = Math.ceil(event.nativeEvent.contentOffset.x / 300);
    if (index == 0 || index == 1) {
      this.setState({ index: 0 });
    } else if (index == 2) {
      this.setState({ index: 1 });
    } else if (index == 3) {
      this.setState({ index: 2 });
    } else if (index == 4) {
      this.setState({ index: 3 });
    }
  }
  render() {
    let iconName = this.state.index == 3 ? "checkmark" : "arrow-forward";
    console.log(this.props.joblist,'deepLinkParams');
    const {interviewSignUp}=this.props;
    
    return (
      <Container>
         {interviewSignUp.isLoading && <View
          style={{ zIndex: 1, position: "absolute", top: "50%", left: "45%" }}
        >
          <ActivityIndicator
            animating={true}
            // style={{ opacity: this.state.opacity }}
            size="large"
            color={COLOR.MUSTARD}
          />
        </View>}
        <View
          style={{ zIndex: 1, width: "100%", position: "absolute", bottom: 20,paddingLeft:width*.4 }}
        >
          <Row style={styles.bottomContainer}>
            {/* <Text
              style={styles.skipText}
              onPress={() => {
                this._onSkip();
              }}
            >
              {this.state.index == 3 ? "" : "Skip"}
            </Text> */}
            <ProgressBar items={AppDetails} index={this.state.index} />
            <View
              onPress={() => {
                this._onNext(this.state.index);
              }}
              style={styles.nextView}
            >
              <TouchableOpacity
                onPress={() => {
                  this._onNext(this.state.index);
                }}
                style={styles.btnBack}
              />
              <Icon
                onPress={() => {
                  this._onNext(this.state.index);
                }}
                style={styles.nextIcon}
                name={iconName}
              />
            </View>
          </Row>
        </View>
        <FlatList
          pagingEnabled
          horizontal
          onScroll={e => this.handleScroll(e)}
          showsHorizontalScrollIndicator={false}
          ref={ref => {
            this.flatListRef = ref;
          }}
          data={AppDetails}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => item.rawText}
        />
      </Container>
    );
  }
}
const mapStateToProps = state => {
  return {
    appliedJob: state.appliedJob,
    interviewSignUp: state.interviewSignUp,
    joblist: state.joblist
  };
};
export default connect(
  mapStateToProps,
  {
    getCandidateJobDetails,
    getCandidateDetails,
    getJobLists,
    getCandidateRoundDetails
  }
)(AppIntro);
