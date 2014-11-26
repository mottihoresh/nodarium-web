'use strict';

var eventEmitter = require('meanio').events;

var mongoose = require('mongoose'),
    ArduinoCommand = mongoose.model('ArduinoCommand');


var taskController = function () {

    var self = this;

    // Generic Methods
    this.create_task = function (options) {
        var command = new ArduinoCommand(options);
        command.save();
        return (command);
    };
    this.get_next = function (cb) {
        ArduinoCommand
            .findOne()
            .where('completed').equals(false)
            .sort('created')
            .exec(cb);
    };
    this.mark_complete = function (id, cb) {
        ArduinoCommand
            .findOneAndUpdate({'completed': true})
            .where('_id').equals(id)
            .exec(cb);
    };

    this.total_tasks = function (cb) {
        ArduinoCommand.count({completed: false}, function (err,count) {
            cb(err,count);
        });
    };

    this.attempt = function (id, cb) {
        var current_attempts = 0;

        ArduinoCommand
            .findOne()
            .where('_id').equals(id)
            .exec(function (err, data) {
                if (data) {
                    current_attempts = data.attempts;
                    ArduinoCommand
                        .findOneAndUpdate({attempts: current_attempts + 1})
                        .where('_id').equals(id)
                        .exec(cb);
                }
            });
    };


    this.create = function (req, res) {
        res.json(self.create_task(req.body));
    };

    // Gets the next item to be processed
    this.getNext = function (req, res) {

        ArduinoCommand
            .findOne()
            .where('completed').equals(false)
            .sort('created')
            .exec(function (err, data) {
                res.json(data);
            });
    };

    this.pendingTasks = function(req, res) {
        ArduinoCommand
            .find()
            .where('completed').equals(false)
            .sort('created')
            .exec(function (err, data) {
                res.json(data);
            });
    };

    this.clear_expired = function (req, res, cb) {
        ArduinoCommand.clearOldCompletedTasks(function (err, data) {
            if (res) {
                res.json(data);
            } else {
                cb(data);
            }

        });

    };

    /***
     * This function serves two purposes:
     *   1. Validate Requests sent to the Arduino
     *   2. Receive status bits form the Arduino. those do not need to be
     *      validated, and the processing code for those, will be somewhere
     *      else.
     *
     *      I am thinking about firing an event, such as arduino.recieved-data
     *      and pass the data along with the event, that way the appropriate
     *      module will be able to handle any request as needed.
     *
     * @param data transmission from the Arduino device.
     */
    this.process_command = function (data, cb) {

        try {
            data = (JSON.parse(data));

            // try to find the id in the database, if found, it means that the
            // request was sent successfuly to the device.
            if (data && data.id) {
                self.mark_complete(data.id);
                eventEmitter.emit('arduino.tasks.completed');
                console.log(data.id + ' has been processed succssfully');
            }


        } catch (e) {
            console.log('failed', e);
        }

        cb();

    };

};


// Exports the object.
module.exports = new taskController();
