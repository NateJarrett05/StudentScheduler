const { School } = require("./school");
const { Student } = require("./student");
const { Counter } = require("./counter")

const express = require("express");
const { GoogleAuth } = require("google-auth-library");
const { google } = require("googleapis");

const app = express();

const gradeSelection = 7;

var school = new School(gradeSelection);
var counter = new Counter();

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

  // google sheet parameters
  const client = await auth.getClient();
  const googleSheets = google.sheets({version: "v4", auth: client});
  const spreadsheetId = "1iruoDBT6VvqNUWacKYTax9UIg5iJGcKMkmJOvBNQLPE";
  const sheetId = "1453565053";

  // getting data from google sheet
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

  // getting student data from the sheet, need to make this change depending on grade selection
  const getRows7th = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "StudentData7th"
  });
 
  var All7thStudentData = getRows7th.data.values

  // assigning student data
  var students = [];
  for(let student_index = 1; student_index < All7thStudentData.length; student_index++){
    students.push(new Student(All7thStudentData[student_index], counter));
  }

  var attempts = 0;
  // assigning student schedules
  for(let student_index = 0; student_index < students.length; student_index++){
    // check for low RSP student
    if(students[student_index].get_lowRSP() == true){
      students[student_index].set_schedule(school.get_highRSP_schedule());
    }
    // check for high RSP student
    else if(students[student_index].get_highRSP() == true){
      students[student_index].set_schedule(school.get_highRSP_schedule());
    }
    // check for adv math student
    else if(students[student_index].get_advMath() == true){
      // blah blah blah code goes here
    }
    // default for basic student setup
    else{
      var failed = students[student_index].assign_periods()
    }
    // iterations failed, reset classes counters and schedules then run it back
    if(failed){
      finalSchedules = [];
      school.reset_periods();
      counter.reset_counter();
      students[student_index].reset_schedule();
      student_index = 0;
      attempts++;
    }
    // iterations succeeded so push that schedule to the final array of schedules
    else{
      finalSchedules.push(students[student_index].name, students[student_index].schedule[0], students[student_index].schedule[1], students[student_index].schedule[2], students[student_index].schedule[3], students[student_index].schedule[4]);
    }
    // last student alert succeded, mark complete as true
    if(student_index == (students.length - 1)){
      complete = true;
    }
    
    counter.remove_full();
  }

  // advanced math schedules
  // blah blah blah code goes here

  // make class rosters
  // blah blah blah code goes here

  // adding schedules to sheet
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

  //send message to site
  res.send(attempts + " attemps to finish")
});

app.listen(1337, (req, res) => console.log("running on 1337"))