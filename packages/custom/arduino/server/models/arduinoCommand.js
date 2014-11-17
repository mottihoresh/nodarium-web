'use strict';

var mongoose = require('mongoose'),
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

ArduinoCommandSchema.statics.clearOldCompletedTasks = function(){

};

mongoose.model('ArduinoCommand', ArduinoCommandSchema);