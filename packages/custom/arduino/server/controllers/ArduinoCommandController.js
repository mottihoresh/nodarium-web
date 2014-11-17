'use strict';

var mongoose = require('mongoose'),
    moment = require('moment'),
    ArduinoCommand = mongoose.model('ArduinoCommand');


var taskController = function(){

    var self = this;

    // Generic Methods
    this.create_task = function(options) {
        var command = new ArduinoCommand(options);
        command.save();
        return(command);
    };


    this.create = function(req,res) {
        res.json(self.create_task(req.body));
    };

// Gets the next item to be processed
    this.getNext = function(req,res) {

        ArduinoCommand
            .findOne()
            //.where('completed').equals(false)
            //.sort('created')

            .where('created').gte(moment().subtract(10, 'seconds'))

            .exec(function(err, data){
                res.json(data);
            });
    };




};
// RESTFULL METHODS


module.exports = new taskController();
