const mongoose = require("mongoose");
const slugify = require("slugify"); // this package to convert A and B => a-and-b
const AutoIncrement = require('../Config/autoIncrementInitialization')

const brandSchema = mongoose.Schema(
    {
        _id: {
            type: mongoose.SchemaTypes.Number
        },
        name: {
            type: String,
            trim: true,
            required: [true, 'Brand name is required'],
            minlength: [3, 'Too short brand name, must be 3 characters at least'],
            maxlength: [32, 'Too long brand name, must be 32 characters at most'],
        },
        slug: {
            type: String,
            unique: [true, 'This brand is already found'],
            lowercase: true        
        },
        image: {
            type: String,
            default: "https://placehold.co/600x400.png"
        },
        available: {
            type: Boolean,
            default: true
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

brandSchema.plugin(AutoIncrement.plugin, {model: 'brands', startAt: 1,});

//Set value to slug property before adding new category to the database
brandSchema.pre('save', function(next) {
    this.slug = slugify(this.name);
    next();
});

//update value of slug property when the name is updated
brandSchema.pre('findOneAndUpdate', function(next) {
    if(this._update.name) {
        this._update.slug = slugify(this._update.name);
    }
    next();
});  

const brandModel = mongoose.model("brands", brandSchema);

module.exports = brandModel;