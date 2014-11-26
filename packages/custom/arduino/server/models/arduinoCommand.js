'use strict';

var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

var ArduinoCommandSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },

    type: {
        type: String,
        required: true,
        trim: true,
        default: 'basic'
    },

    command: {
        type: String,
        required: true,
        trim: true,
        default: ' '
    },

    attempts: {
        type: Number,
        default: 0
    },

    completed: {
        type: Boolean,
        default: false
    }


});

/**
 * Remove all tasks that are complete and that are over 5 minutes old.
 * @param cb call back function.
 */
ArduinoCommandSchema.statics.clearOldCompletedTasks = function(cb) {
    this
        .remove()
        //.where('completed').equals('true')
        .where('created').lte(moment().subtract(5, 'minutes'))
        .exec(cb);
};


mongoose.model('ArduinoCommand', ArduinoCommandSchema);