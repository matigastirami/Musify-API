"use strict"

var moment = require('moment')

class ServiceHelper {

    static getFileExtension(file_name){

        var ext_split = file_name.split('\.');

        return ext_split[ext_split.length -1];

    }

    static getFileName(id){
        return (id + '_' + moment().format("DD-MM-YYYY_HH-mm-ss"))
    }

    static isValidDate(date){
        return moment(date, "DD/MM/YYYY").isValid()
    }

    static valueToSQLTime(seconds){
        if(typeof seconds != 'number') return null;

        return Math.round(seconds/3600) + ':' + (Math.round(seconds/60) - 1) + ':' + Math.round(seconds%60);
    }
}

module.exports = ServiceHelper;