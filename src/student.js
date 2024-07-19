const { School } = require("./school");

class Student extends School{
    constructor(data, Counter) {
        super();
        this.Counter = Counter;
        this.name = data[0];
        this.gender = data[1];
        this.low_rsp = (data[2] == "TRUE");
        this.high_rsp = (data[3] == "TRUE");
        this.adv_math = (data[4] == "TRUE");
        this.behavior = data[5]
        this.schedule = [];
    }

    set_schedule(schedule){
        this.schedule = schedule;
    }

    assign_periods(){
        var failed = false;
        var random_failed = false;
        var new_schedule = [];
        // loop for each period in the new schedule
        for(let period = 1; period < 6; period++){
            // try random selections 10 times before switching
            for(let trys_random = 1; trys_random <= 10; trys_random++){
                var randClass = this.get_random_class(period - 1);
                var randClassName = this.get_class_name(period, randClass);
                // random class picked isnt already in schedule
                if(this.checkPeriod(new_schedule, randClass)){
                    new_schedule.push(randClassName);
                    this.Counter.increase_counter(period - 1, randClass);
                    break;
                }
                else if(trys_random == 10){
                    random_failed = true;
                }
            }
            // the switch
            if(random_failed){
                var availablePeriods = this.check_available();
                var classList = this.get_class_list();
                // try the method 5 times before calling it a bust
                for(let selection_trys = 1; selection_trys <= 5; selection_trys++){
                    // resetting initial lists for a new attempt
                    var classListCopy = classList;
                    var availablePeriodsCopy = availablePeriods;
                    var temp_schedule = [];

                    // main selection logic block
                    for(let z = 0; z < classListCopy.length; z++){
                        for(let x = 0; x < availablePeriodsCopy.length; x++){
                            for(let y = 0; y < availablePeriodsCopy[x].length; y++){
                                if(availablePeriodsCopy[x][y] == z){
                                    temp_schedule.push(classListCopy[x]);
                                    availablePeriodsCopy.splice(x, 1);
                                    classListCopy.splice(x, 1);
                                }
                            }
                        }
                    }

                    // win condition
                    if(temp_schedule.length == 5){
                        this.Counter.increase_counter_schedule(temp_schedule);
                        this.schedule = temp_schedule;
                        resolved = true;
                        break;
                    }
                    // fail condition
                    if(selection_trys == 5){
                        failed = true;
                    }
                }
            }
        }
        return failed
    }

    get_name(){
        return this.name;
    }

    get_gender(){
        return this.gender;
    }

    get_lowRSP(){
        return this.low_RSP;
    }

    get_highRSP(){
        return this.high_RSP;
    }

    get_advMath(){
        return this.adv_math;
    }

    get_behavior(){
        return this.behavior;
    }

    reset_schedule(){
        this.schedule = []
    }
}

module.exports = {Student};