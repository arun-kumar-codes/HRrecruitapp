import { COLOR } from "../styles/color";

export const pageDeatils = [
    {
        image: require('../images/job.png'),
        name:'JOB OPENINGS',
        icon:'ios-arrow-forward-outline',
        route:'JobList'
    },
    {
        image: require('../images/company.png'),
        name: 'EXCELLENCE TECHNOLOGIES',
        icon: 'ios-arrow-forward-outline',
        route: 'Profile'
    },
    {
        image: require('../images/interview.png'),
        name: 'START INTERVIEW',
        icon: 'ios-arrow-forward-outline',
        route: 'InterviewLogin'
    }
]
export const AppDetails = [
  {
    image: require("../images/new_hello.png"),
    boldText: "CAREER APP",
    headerText: "Hey there",
    rawText: "WELCOME TO\nEXCELLENCE TECHNOLOGIES",
    bkGrndClr: COLOR.DARKBLUE
  },
  {
    image: require("../images/new_job.png"),
    boldText: " JOBS",
    headerText: "",
    rawText: "APPLY",
    bkGrndClr: COLOR.DARKBLUE
  },
  {
    image: require("../images/new_test.png"),
    boldText: "ONLINE TEST",
    headerText: "",
    rawText: "TAKE",
    bkGrndClr: COLOR.DARKBLUE
  },
  {
    image: require("../images/new_status.png"),
    boldText: "APPLICATION STATUS",
    headerText: "",
    rawText: "CHECK",
    bkGrndClr: COLOR.DARKBLUE
  }
];
