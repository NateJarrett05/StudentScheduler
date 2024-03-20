const { School } = require("./school");

class Counter extends School{
    constructor(){
      super();
      this.allPeriodCounters = [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ];
    }

    //Watch out for the variables in school not updated properly because this is an instance of the class?
    checkFull(){
      for(let i = 0; i < this.allPeriodCounters.length; i++){
        for(let k = 0; k < this.allPeriodCounters[i].length; k++){
          if(this.allPeriodCounters[i][k] >= class_size){
            this.school.allPeriods[i].splice(k, 1);
            this.allPeriodCounters[i].splice(k, 1);
          }
        }
      }
    }

    increaseCounter(schedule){
      for(let y = 0; y < schedule.length; y++){
        this.allPeriodCounters[y][this.school.allPeriods[y].indexOf(schedule[y])]++
      }
    }

    increaseLowRSP(){
      this.allPeriodCounters[0][this.school.allPeriods[0].indexof(this.school.lowRSP_Schedule[0])]++;
      this.allPeriodCounters[1][this.school.allPeriods[1].indexof(this.school.lowRSP_Schedule[1])]++;
      this.allPeriodCounters[2][this.school.allPeriods[2].indexof(this.school.lowRSP_Schedule[2])]++;
      this.allPeriodCounters[3][this.school.allPeriods[3].indexof(this.school.lowRSP_Schedule[3])]++;
      this.allPeriodCounters[4][this.school.allPeriods[4].indexof(this.school.lowRSP_Schedule[4])]++;
    }

    increaseHighRSP(){
      this.allPeriodCounters[0][this.school.allPeriods[0].indexof(this.school.highRSP_Schedule[0])]++;
      this.allPeriodCounters[1][this.school.allPeriods[1].indexof(this.school.highRSP_Schedule[1])]++;
      this.allPeriodCounters[2][this.school.allPeriods[2].indexof(this.school.highRSP_Schedule[2])]++;
      this.allPeriodCounters[3][this.school.allPeriods[3].indexof(this.school.highRSP_Schedule[3])]++;
      this.allPeriodCounters[4][this.school.allPeriods[4].indexof(this.school.highRSP_Schedule[4])]++;
    }

    reset(){
      this.allPeriodCounters = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
    }
}

module.exports = {Counter};