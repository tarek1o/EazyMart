const mongoose = require("mongoose");
const slugify = require("slugify"); // this package to convert A and B => a-and-b
const AutoIncrement = require('../Config/autoIncrementInitialization')

const categorySchema = mongoose.Schema(
    {
        _id: {
            type: mongoose.SchemaTypes.Number
        },
        name: {
            type: String,
            trim: true,
            required: [true, 'Category name is required'],
            minlength: [3, 'Too short category name, must be 3 characters at least'],
            maxlength: [32, 'Too long category name, must be 32 characters at most'],
        },
        slug: { // A and B => a-and-b
            type: String,
            lowercase: true,        
            unique: [true, 'This category is already found'],
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
        timestamps: true
    }
)

categorySchema.plugin(AutoIncrement.plugin, {model: 'categories', startAt: 1});

//Set value to slug property before adding new category to the database
categorySchema.pre('save', function(next) {
    this.slug = slugify(this.name);
    next();
});

//update value of slug property when the name is updated
categorySchema.pre('findOneAndUpdate', function(next) {
    if(this._update.name) {
        this._update.slug = slugify(this._update.name);
    }
    next();
});  

const categoryModel = mongoose.model("categories", categorySchema);

module.exports = categoryModel;