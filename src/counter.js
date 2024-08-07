const { School } = require("./school");

class Counter extends School{
    constructor(){
      super();
      this.allPeriodCounter = [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0]
        ];
    }

    get_class_counter(period, class_index){
      return this.allPeriodCounter[period][class_index];
    }


    //Watch out for the variables in school not updated properly because this is an instance of the class?
    remove_full(){
      for(let i = 0; i < this.allPeriodCounter.length; i++){
        for(let k = 0; k < this.allPeriodCounter[i].length; k++){
          if(this.get_class_counter(i, k) >= class_size){
            this.remove_period(i, k);
            this.allPeriodCounter[i].splice(k, 1);
          }
        }
      }
    }

    increase_counter(period, class_index){
      this.allPeriodCounter[period][class_index]++;
    }

    increase_counter_schedule(schedule){
      for(let y = 0; y < schedule.length; y++){
        this.allPeriodCounter[y][this.get_class_index(y, schedule[y])]++;
      }
    }

    increaseLowRSP(){
      this.allPeriodCounter[0][this.get_class_index(0, this.get_lowRSP_period(0))]++;
      this.allPeriodCounter[1][this.get_class_index(0, this.get_lowRSP_period(1))]++;
      this.allPeriodCounter[2][this.get_class_index(0, this.get_lowRSP_period(2))]++;
      this.allPeriodCounter[3][this.get_class_index(0, this.get_lowRSP_period(3))]++;
      this.allPeriodCounter[4][this.get_class_index(0, this.get_lowRSP_period(4))]++;
    }

    increaseHighRSP(){
      this.allPeriodCounter[0][this.get_class_index(0, this.get_highRSP_period(0))]++;
      this.allPeriodCounter[1][this.get_class_index(0, this.get_highRSP_period(1))]++;
      this.allPeriodCounter[2][this.get_class_index(0, this.get_highRSP_period(2))]++;
      this.allPeriodCounter[3][this.get_class_index(0, this.get_highRSP_period(3))]++;
      this.allPeriodCounter[4][this.get_class_index(0, this.get_highRSP_period(4))]++;
    }

    reset_counter(){
      this.allPeriodCounter = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
    }
}

module.exports = {Counter};