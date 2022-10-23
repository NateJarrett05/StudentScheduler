const express = require("express");
const { GoogleAuth } = require("google-auth-library");
const { google } = require("googleapis");

const app = express();

const class_size = 8;
const gradeSelection = 7;

var finalSchedules = []

const lowRSP_Schedule = ["math", "english", "history", "science", "PE"];
const highRSP_Schedule7 = ["english", "science", "math", "PE", "history"];
const highRSP_Schedule8 = ["PE", "science", "math", "english", "history"];

var studentSchedule;
var studentName;
var gender;
var lowRSP;
var highRSP;
var advancedMath;
var behavior;

var add = true;
var resolved = false;
var j = 0;
var highest = 0;
var counter = 1;

var complete = false;

var prepPeriods_7 = ["history", "math", "PE", "english", "science"];
var prepPeriods_8 = ["english", "math", "PE", "history", "science"];

var allPeriods_7 = [
  ["english", "science", "PE", "math"],
  ["english", "science", "PE", "history"],
  ["english", "science", "history", "math"],
  ["history", "science", "PE", "math"],
  ["history", "english", "PE", "math"]
];

var allPeriods_8 = [
  ["history", "science", "PE", "math"],
  ["english", "science", "PE", "history"],
  ["english", "science", "math", "history"],
  ["english", "science", "PE", "math"],
  ["history", "english", "PE", "math"]
];

var allPeriodCounters_7 = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

var allPeriodCounters_8 = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];

//Plan for advanced math kids: store names in an array, find schedules the schedules that have math has a last period, swap the names and schedules
var advancedMathKids = []
var advancedMathKidsIndex = []

app.get("/", async (req, res) => {

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({version: "v4", auth: client});

  const spreadsheetId = "1iruoDBT6VvqNUWacKYTax9UIg5iJGcKMkmJOvBNQLPE";

  const sheetId = "1453565053";

  googleSheets.spreadsheets.batchUpdate({
    auth: auth,
    spreadsheetId: spreadsheetId,
    resource: {
      "requests": 
      [
        {
          "deleteRange": 
          {
            "range": 
            {
              "sheetId": sheetId, // gid
              "startRowIndex": 1,
              "endRowIndex": 33
            },
            "shiftDimension": "ROWS"
          }
        }
      ]
    }
  })

  //7th graders
  if(gradeSelection == 7){
    //initialize 7th data
    const getRows7th = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "StudentData7th"
    });

    var All7thStudentData = getRows7th.data.values;

    while(complete == false){

      for(let p = 1; p < All7thStudentData.length; p++){

        var StudentData = All7thStudentData[p];
        studentSchedule = []
        failed = false
  
        assignData(StudentData);
        //checking and removing full classes
        for(let i = 0; i < allPeriodCounters_7.length; i++){
          for(let k = 0; k < allPeriodCounters_7[i].length; k++){
            if(allPeriodCounters_7[i][k] >= class_size){
              allPeriods_7[i].splice(k, 1);
              allPeriodCounters_7[i].splice(k, 1);
            }
          }
        }
  
        if(lowRSP){
          studentSchedule = lowRSP_Schedule;
          increaseLowRSP_7();
        }
  
        else if(highRSP){
          studentSchedule = highRSP_Schedule7;
          increaseHighRSP_7();
        }
        
        else if(advancedMath){
          advancedMathKids.push(studentName)
          advancedMathKidsIndex.push(p)
          failed = assignPeriods(allPeriods_7, allPeriodCounters_7)
        }
  
        else{
          failed = assignPeriods(allPeriods_7, allPeriodCounters_7)
        }
  
        //add row
        if(failed === true){
          finalSchedules = []
          counter++;

          allPeriods_7 = [
            ["english", "science", "PE", "math"],
            ["english", "science", "PE", "history"],
            ["english", "science", "history", "math"],
            ["history", "science", "PE", "math"],
            ["history", "english", "PE", "math"]
          ];
          allPeriodCounters_7 = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
          ];

          advancedMathKids = []
          advancedMathKidsIndex = []

          break;
        }
        else{
          finalSchedules.push([studentName, studentSchedule[0], studentSchedule[1], studentSchedule[2], studentSchedule[3], studentSchedule[4]])
        }

        if(p == (All7thStudentData.length - 1)){
          complete = true;
        }
      }
    }
  }
  //8th graders
  else if(gradeSelection == 8){
    //initialize 7th data
    const getRows8th = await googleSheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: "StudentData8th"
    });

    var All8thStudentData = getRows8th.data.values;

    while(complete == false){

      for(let p = 1; p < All8thStudentData.length; p++){

        var StudentData = All8thStudentData[p];
        studentSchedule = []
        failed = false
  
        assignData(StudentData);
        //checking and removing full classes
        for(let i = 0; i < allPeriodCounters_8.length; i++){
          for(let k = 0; k < allPeriodCounters_8[i].length; k++){
            if(allPeriodCounters_8[i][k] >= class_size){
              allPeriods_8[i].splice(k, 1);
              allPeriodCounters_8[i].splice(k, 1);
            }
          }
        }
  
        if(lowRSP){
          studentSchedule = lowRSP_Schedule;
          increaseLowRSP_8();
        }
  
        else if(highRSP){
          studentSchedule = highRSP_Schedule8;
          increaseHighRSP_8();
        }
  
        else if(advancedMath){
          
        }
  
        else{
          failed = assignPeriods(allPeriods_8, allPeriodCounters_8)
        }
  
        //add row
        if(failed === true){
          finalSchedules = []
          console.log("Attempt " + counter + " failed")
          counter++;

          var allPeriods_8 = [
            ["history", "science", "PE", "math"],
            ["english", "science", "PE", "history"],
            ["english", "science", "math", "history"],
            ["english", "science", "PE", "math"],
            ["history", "english", "PE"]
          ];

          allPeriodCounters_8 = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
          ];

          break;
        }
        else{
          finalSchedules.push([studentName, studentSchedule[0], studentSchedule[1], studentSchedule[2], studentSchedule[3], studentSchedule[4]])
        }

        if(p == (All8thStudentData.length - 1)){
          complete = true;
        }
      }
    }
  }

  //editting advanced math
  for(let n = 0; n < advancedMathKidsIndex.length; n++){
    if(finalSchedules[advancedMathKidsIndex[n]][5] == "math"){
      console.log(finalSchedules[advancedMathKidsIndex[n]]);
      advancedMathKidsIndex.splice(n, 1)
    }
  }

  for(let p = 0; p < finalSchedules.length; p++){
    if(finalSchedules[p][5] == "math"){
      if(advancedMathKids.indexOf(finalSchedules[p][0]) == -1 && finalSchedules[advancedMathKidsIndex[0]][5] != "math"){

        var sName = finalSchedules[p][0]
        finalSchedules[p][0] = finalSchedules[advancedMathKidsIndex[0]][0]
        finalSchedules[advancedMathKidsIndex[0]][0] = sName;

        advancedMathKidsIndex.splice(0, 1)
      }
    }
  }
  for(let p = 0; p < finalSchedules.length; p++){
    if(finalSchedules[p][5] == "math"){
      console.log(finalSchedules[p])
    }
  }
  console.log("\n")

  //adding schedules to sheet
  for(let k = 0; k < finalSchedules.length; k++){
    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "StudentPeriods!A:F",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [
          [finalSchedules[k][0], finalSchedules[k][1], finalSchedules[k][2], finalSchedules[k][3], finalSchedules[k][4], finalSchedules[k][5]]
        ]
      }
    })
  }

  //making class rosters
  /*
  for(let k = 0; k < ){
    classRoster = []
  }
  */

  res.send(counter + " attemps to finish")
});

app.listen(1337, (req, res) => console.log("running on 1337"))

function assignData(StudentData){
  studentSchedule = [];
  studentName = StudentData[0];
  gender = StudentData[1];
  lowRSP = (StudentData[2] == "TRUE");
  highRSP = (StudentData[3] == "TRUE");
  advancedMath = (StudentData[4] == "TRUE");
  behavior = StudentData[5];
}

function increaseLowRSP_7(){
  allPeriodCounters_7[0][allPeriods_7[0].indexOf("math")]++;
  allPeriodCounters_7[1][allPeriods_7[1].indexOf("english")]++;
  allPeriodCounters_7[2][allPeriods_7[2].indexOf("history")]++;
  allPeriodCounters_7[3][allPeriods_7[3].indexOf("science")]++;
  allPeriodCounters_7[4][allPeriods_7[4].indexOf("PE")]++;
}

function increaseLowRSP_8(){
  allPeriodCounters_8[0][allPeriods_8[0].indexOf("math")]++;
  allPeriodCounters_8[1][allPeriods_8[1].indexOf("english")]++;
  allPeriodCounters_8[2][allPeriods_8[2].indexOf("history")]++;
  allPeriodCounters_8[3][allPeriods_8[3].indexOf("science")]++;
  allPeriodCounters_8[4][allPeriods_8[4].indexOf("PE")]++;
}

function increaseHighRSP_7(){
  allPeriodCounters_7[0][allPeriods_7[0].indexOf("english")]++;
  allPeriodCounters_7[1][allPeriods_7[1].indexOf("science")]++;
  allPeriodCounters_7[2][allPeriods_7[2].indexOf("math")]++;
  allPeriodCounters_7[3][allPeriods_7[3].indexOf("PE")]++;
  allPeriodCounters_7[4][allPeriods_7[4].indexOf("history")]++;
}

function increaseHighRSP_8(){
  allPeriodCounters_8[0][allPeriods_8[0].indexOf("PE")]++;
  allPeriodCounters_8[1][allPeriods_8[1].indexOf("science")]++;
  allPeriodCounters_8[2][allPeriods_8[2].indexOf("math")]++;
  allPeriodCounters_8[3][allPeriods_8[3].indexOf("english")]++;
  allPeriodCounters_8[4][allPeriods_8[4].indexOf("history")]++;
}

function assignPeriods(periodList, periodCounters){
  j = 0;
  for(let i = 1; i < 6; i++){
    var period = Math.floor(Math.random() * periodList[i-1].length);
    if(studentSchedule.indexOf(periodList[i-1][period]) > -1){
      i--;
      j++;
      if(j > 10){
        var classList = ["math", "PE", "science", "english", "history"]
        var availablePeriods = [[0], [], [], [], []]
        availablePeriods[0].splice(0, 1)
        var newSchedule = []

        //finding out which periods for each class are available
        for(let k = 0; k < classList.length; k++){
          var checkingClass = classList[k]
          for(let m = 0; m < periodList.length; m++){
            for(let j = 0; j < periodList[m].length; j++){
              //if the period contains the class im checking, add the period to that class's list
              if(periodList[m][j] == checkingClass){
                availablePeriods[k].push(m)
              }
            }
          }
        }

        var loop = 0
        var availablePeriodsStorage = availablePeriods;
        var classListStorage = classList

        while(true){
          availablePeriods = availablePeriodsStorage;
          newSchedule = []
          classList = classListStorage;
          loop++;

          //need to work on the the trying again system
          if(loop > 5){
            var failed = true;
            break;
          }

          for(let b = 0; b < classList.length; b++){
            //bandaid fix
            if((b == 0) && (loop > 1) && (availablePeriods[0].indexOf(4) > -1)){
              newSchedule.push(classList[0])
              availablePeriods.splice(0, 1)
              classList.splice(0, 1)
              break;
            }
            //loop for each available class
            for(let m = 0; m < availablePeriods.length; m++){
              //loop for each available period for a class
              for(let j = 0; j < availablePeriods[m].length; j++){
                if(availablePeriods[m][j] == b){
                  newSchedule.push(classList[m])
                  availablePeriods.splice(m, 1)
                  classList.splice(m, 1)
                  break;
                }
              }
            }
          }

          //exiting the loop
          if(newSchedule.length == 5){
            for(let y = 0; y < newSchedule.length; y++){
              periodCounters[y][periodList[y].indexOf(newSchedule[y])]++
            }
            resolved = true;
            studentSchedule = newSchedule;
            break;
          }
        }
        if(resolved == true){
          break;
        }
      //resetting variables
      i++;
      j = 0;
    }
  }
    else{
      studentSchedule.push(periodList[i-1][period]);
      periodCounters[i-1][period]++;
      j = 0;
    }
  }
  return failed;
}

/*
██╗░░░░░██╗████████╗███████╗██████╗░░█████╗░██╗░░░░░██╗░░░░░██╗░░░██╗  ███╗░░░███╗███████╗
██║░░░░░██║╚══██╔══╝██╔════╝██╔══██╗██╔══██╗██║░░░░░██║░░░░░╚██╗░██╔╝  ████╗░████║██╔════╝
██║░░░░░██║░░░██║░░░█████╗░░██████╔╝███████║██║░░░░░██║░░░░░░╚████╔╝░  ██╔████╔██║█████╗░░
██║░░░░░██║░░░██║░░░██╔══╝░░██╔══██╗██╔══██║██║░░░░░██║░░░░░░░╚██╔╝░░  ██║╚██╔╝██║██╔══╝░░
███████╗██║░░░██║░░░███████╗██║░░██║██║░░██║███████╗███████╗░░░██║░░░  ██║░╚═╝░██║███████╗
╚══════╝╚═╝░░░╚═╝░░░╚══════╝╚═╝░░╚═╝╚═╝░░╚═╝╚══════╝╚══════╝░░░╚═╝░░░  ╚═╝░░░░░╚═╝╚══════╝
*/