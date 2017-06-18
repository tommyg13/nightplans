'use strict';
const mongoose = require('mongoose'),
      bcrypt   = require('bcryptjs');


let userSchema = mongoose.Schema({

    local            : {
        username     : String,
        email        : String,
        password     : String,
        checkIns     : [],
        resetPasswordToken: String,
        resetPasswordExpires: Date,
    }

});


userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};


userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);