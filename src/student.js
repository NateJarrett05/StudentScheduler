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

    assignPeriods(){
            var trys = 0;
            var failed = false;
            var tempSchedule = [];
            for(let period = 1; period < 6; period++){
                var randClass = this.get_random_class(period - 1);
                var randClassName = this.get_class_name(period, randClass);

                if(this.checkPeriod(tempSchedule, randClass)){
                    tempSchedule.push(randClassName);
                    this.Counter.increase_counter(period - 1, randClass);
                    trys = 0;
                }
            
                else{
                    trys++;
                    period--;
                    if(trys > 10){
                        var loop = 0;
                        
                        //make sure to assign the copies to the originals at the end
                        while(true){
                            var classListCopy = this.get_class_list();
                            var availablePeriodsCopy = this.checkAvailable();
                            var newSchedule = [];
                            loop++;
                            
                            // Too many L's so exit
                            if(loop > 5){
                                failed = true;
                                break;
                            }
                            
                            for(let z = 0; z < classListCopy.length; z++){
                                for(let x = 0; x < availablePeriodsCopy.length; x++){
                                    for(let y = 0; y < availablePeriodsCopy[x].length; y++){
                                        //
                                        if(availablePeriodsCopy[x][y] == z){
                                            newSchedule.push(classListCopy[x]);
                                            availablePeriodsCopy.splice(x, 1);
                                            classListCopy.splice(x, 1);
                                        }
                                    }
                                }
                            }
                            
                            // Win condition
                            if(newSchedule.length == 5){
                                this.Counter.increase_counter_schedule(newSchedule);
                                this.schedule = newSchedule;
                                resolved = true;
                                break;
                            }
                        }
                        
                        // Break if win condition is true
                        if(resolved == true){
                            break;
                        }
                        
                        // Resetting variables
                        period++;
                        trys = 0;
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