require("dotenv").config({path: "config.env"});
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const salt = bcrypt.genSaltSync(+process.env.salt_round);
const AutoIncrement = require('../Config/autoIncrementInitialization');
const addressSchema = require("./addressModel");

const resetPasswordCode = mongoose.Schema(
    {
        code: {
            type: String
        },
        expirationTime: {
            type: Date
        },
        isVerified: {
            type: Boolean,
            default: false
        }
    }, 
    {_id: false}
)

const userSchema = mongoose.Schema(
    {
        _id: {
            type: mongoose.SchemaTypes.Number
        },
        firstName: {
            type: String,
            trim: true,
            required: [true, 'Firtname is required'],
            minlength: [3, 'Too short firstname, must be 3 characters at least'],
            maxlength: [32, 'Too long firstname, must be 32 characters at most'],
            match: [/^[a-zA-Z]+$/g, 'Firstname must contain only characters']
        },
        lastName: {
            type: String,
            trim: true,
            required: [true, 'Lastname is required'],
            minlength: [3, 'Too short lastname, must be 3 characters at least'],
            maxlength: [32, 'Too long lastname, must be 32 characters at most'],
            match: [/^[a-zA-Z]+$/g, 'Lastname must contain only characters']
        },
        email: {
            type: String,
            trim: true,
            required: [true, 'Email is required'],            
            match: [/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, "Invalid email"],
            lowercase: true,
            unique: [true, 'This email address is already used']
        },
        password: {
            type: String,
            trim: true,
            required: [true, 'Password is required']    
        },
        resetPasswordCode: {
            type: resetPasswordCode
        },
        passwordUpdatedTime: {
            type: Date
        },
        profileImage: {
            type: String,
            default: "https://placehold.co/600x400.png"
        },
        mobilePhone: {
            type: String,
            trim: true,
            required: [true, 'Mobile phone is required']
        },
        addresses: {
            type: [addressSchema],
            default: []
        },
        role: {
            type: Number,
            ref: 'roles',
            required: [true, 'Any user must have a role']
        },
        available: {
            type: Boolean,
            default: true
        },
        blocked:{
            type: Boolean,
            default: false
        },
        deleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
)

userSchema.plugin(AutoIncrement.plugin, {model: 'users', startAt: 1});

userSchema.pre('save', function(next) {
    if(this.password) {
        this.password = bcrypt.hashSync(this.password, salt);
    }
    if(this.resetPasswordCode && this.resetPasswordCode.code && +this.resetPasswordCode.code) {
        this.resetPasswordCode.code = bcrypt.hashSync(this.resetPasswordCode.code.toString(), salt);
    }
    next();
});

userSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'role',
        select: 'name allowedModels -_id'
    })
    next();
})

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;