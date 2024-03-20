const { Counter } = require("./counter");

class Student extends Counter{
    constructor(data) {
        super();
        this.name = data[0];
        this.gender = data[1];
        this.low_rsp = (data[2] == "TRUE");
        this.high_rsp = (data[3] == "TRUE");
        this.adv_math = (data[4] == "TRUE");
        this.behavior = data[5]
        this.schedule = [];
    }

    assignPeriods(){
            var trys = 0;
            var failed = false;
            var tempSchedule = [];
            for(let period = 1; period < 6; period++){
                var randClass = this.getClass(period-1);
                var randClassName = this.allPeriods[period-1][randClass];
                
                if(this.checkPeriod(tempSchedule, randClass)){
                    tempSchedule.push(randClassName);
                    this.allPeriodCounters[period-1][randClass];
                    trys = 0;
                }
            
                else{
                    trys++;
                    period--;
                    if(trys > 10){
                        var availablePeriods = this.checkAvailable()
                        console.log(availablePeriods)
                        console.log(this.classList)
                        
                        var loop = 0
                        var availablePeriodsCopy = availablePeriods;
                        var classListCopy = this.classList;
                        
                        //make sure to assign the copies to the originals at the end
                        while(true){
                            availablePeriodsCopy = availablePeriods;
                            classListCopy = this.classList;
                            var newSchedule = [];
                            loop++;
                            
                            if(loop > 5){
                                failed = true;
                                break;
                            }
                            
                            for(let z = 0; z < classListCopy.length; z++){
                                for(let x = 0; x < availablePeriodsCopy.length; x++){
                                    for(let y = 0; y < availablePeriodsCopy[x].length; y++){
                                        if(availablePeriodsCopy[x][y] == z){
                                            newSchedule.push(classListCopy[x]);
                                            availablePeriodsCopy.splice(x, 1);
                                            classListCopy.splice(x, 1);
                                        }
                                    }
                                }
                            }
                            
                            if(newSchedule.length == 5){
                                this.increaseCounter(newSchedule);
                                resolved = true;
                                this.schedule = newSchedule;
                                break;
                            }
                        }
                        
                        if(resolved == true){
                            break;
                        }
                        
                        //resetting variables
                        period++;
                        trys = 0;
                    } 
                }
            }
            return failed
    }

    reset(){
        this.schedule = []
    }
}

module.exports = {Student};