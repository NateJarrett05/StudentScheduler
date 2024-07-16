class School {
    constructor(gradeSelection){

        this.classSize = 32;
        this.schoolSize = 128;
        this.batchCount = 4;
        this.batchSize = this.classSize / this.batchCount;

        this.classList = ["math", "PE", "science", "english", "history"]

        this.predPeriods = (gradeSelection == 7) ? ["history", "math", "PE", "english", "science"] :
                                                   ["english", "math", "PE", "history", "science"];

        this.highRSP_Schedule = (gradeSelection == 7) ? ["english", "science", "math", "PE", "history"] :
                                                        ["PE", "science", "math", "english", "history"];
        
        this.lowRSP_Schedule = ["math", "english", "history", "science", "PE"];
        
        this.allPeriods = (gradeSelection == 7) ? [
            ["english", "science", "PE", "math"],
            ["english", "science", "PE", "history"],
            ["english", "science", "history", "math"],
            ["history", "science", "PE", "math"],
            ["history", "english", "PE", "math"]
            ] 
            :
            [
            ["history", "science", "PE", "math"],
            ["english", "science", "PE", "history"],
            ["english", "science", "math", "history"],
            ["english", "science", "PE", "math"],
            ["history", "english", "PE", "math"]
            ];
    }

    checkAvailable(){
        var periodList = this.allPeriods;
        var availablePeriods = [[0], 
                            [], 
                            [], 
                            [], 
                            []]
        availablePeriods[0].splice(0, 1)
        //finding out which periods for each class are available
        for(let k = 0; k < this.classList.length; k++){
            var checkingClass = this.classList[k]
            for(let m = 0; m < periodList.length; m++){
                for(let j = 0; j < periodList[m].length; j++){
                    //if the period contains the class im checking, add the period to that class's list
                    if(periodList[m][j] == checkingClass){
                    availablePeriods[k].push(m)
                    }
                }
            }
        }
        return availablePeriods;
    }

    get_random_class(period){
        return Math.floor(Math.random() * this.allPeriods[period].length);
    }

    get_class_index(period, class_name){
        return this.allPeriods[period].indexOf(class_name);
    }

    return_class(period, classIndex){
        return this.allPeriods[period][classIndex];
    }

    return_lowRSP_period(period){
        return this.lowRSP_Schedule[period];
    }

    return_highRSP_period(period){
        return this.highRSP_Schedule[period];
    }

    checkPeriod(schedule, period){
        return (schedule.indexOf(this.allPeriods[period][period]) == -1)
    }

    remove_period(period, class_index){
        this.allPeriods[period].splice(class_index, 1);
    }

    reset_periods(){
        this.allPeriods = (gradeSelection == 7) ? [
            ["english", "science", "PE", "math"],
            ["english", "science", "PE", "history"],
            ["english", "science", "history", "math"],
            ["history", "science", "PE", "math"],
            ["history", "english", "PE", "math"]
            ] 
            :
            [
            ["history", "science", "PE", "math"],
            ["english", "science", "PE", "history"],
            ["english", "science", "math", "history"],
            ["english", "science", "PE", "math"],
            ["history", "english", "PE", "math"]
            ];
    }
}

module.exports = {School};