var schoolFile = require("./school")
var studentFile = require("./student")
var counterFile = require("./counter")



const express = require("express");
const { GoogleAuth } = require("google-auth-library");
const { google } = require("googleapis");

const app = express();

const gradeSelection = 7;

var school = new schoolFile.School(gradeSelection);
var counter = new counterFile.Counter();

var finalSchedules = []

var complete = false;

//batch system was lost so i need to redo that
//advanced math kids need to get working
//behavior should be implemented
//gender is least priority but there should be around a 50 / 50 split in the classes
//class rosters should also be implemented, this can make behavior and gender easier to implement
//new UI, throw it in a website maybe

app.get("/", async (req, res) => {

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
  });

  //google sheet parameters
  const client = await auth.getClient();
  const googleSheets = google.sheets({version: "v4", auth: client});
  const spreadsheetId = "1iruoDBT6VvqNUWacKYTax9UIg5iJGcKMkmJOvBNQLPE";
  const sheetId = "1453565053";

  //getting data from google sheet
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

  //getting student data from the sheet, need to make this change depending on grade selection
  const getRows7th = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "StudentData7th"
  });
  var All7thStudentData = getRows7th.data.values

  //assigning student data
  var students = [];
  for(let student = 1; student < All7thStudentData.length; student++){
    students.push(new studentFile.Student(All7thStudentData[student]));
  }

  //assigning student schedules
  for(let student = 0; student < students.length; student++){
    if(students[student].low_rsp){
      student.schedule = school.lowRSP_Schedule;
    }
    else if(students[student].high_rsp){
      student.schedule = school.highRSP_Schedule;
    }
    else if(students[student].advancedMath){
      //blah blah blah code goes here
    }
    else{
      var failed = students[student].assignPeriods()
    }

    if(failed){
      finalSchedules = [];
      school.reset();
      counter.reset();
      students[student].reset();
    }
    else{
      finalSchedules.push(students[student].name, students[student].schedule[0], students[student].schedule[1], students[student].schedule[2], students[student].schedule[3], students[student].schedule[4]);
    }

    if(student == (students.length - 1)){
      complete = true;
    }
  }

  //this shit does NOT work
  //editting advanced math after creating the schedules
  /*
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
  */

  //this shit also does NOT work
  //debugging math I think
  /*
  for(let p = 0; p < finalSchedules.length; p++){
    if(finalSchedules[p][5] == "math"){
      console.log(finalSchedules[p])
    }
  }
  */
  console.log("\n")

  //adding schedules to sheet
  for(let student = 0; student < finalSchedules.length; student++){
    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: "StudentPeriods!A:F",
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [
          [finalSchedules[student][0], finalSchedules[student][1], finalSchedules[student][2], finalSchedules[student][3], finalSchedules[student][4], finalSchedules[student][5]]
        ]
      }
    })
  }

  //make class rosters
  //blah blah blah code goes here

  //send message to site
  res.send(counter + " attemps to finish")
});

app.listen(1337, (req, res) => console.log("running on 1337"))