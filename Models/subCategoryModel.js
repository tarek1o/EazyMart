const mongoose = require("mongoose");
const slugify = require("slugify");
const AutoIncrement = require('../Config/autoIncrementInitialization')

const subCategorySchema = mongoose.Schema(
    {
        _id: {
            type: mongoose.SchemaTypes.Number
        },
        name: {
            type: String,
            trim: true,
            required: [true, 'SubCatgory name is required'],
            minlength: [2, 'Too short subcategory name, must be at least 2 characters'],
            maxlength: [32, 'Too long subcategory name, must be at least 32 characters'],
        },
        slug: { // A and B => a-and-b
            type: String,
            unique: [true, 'This subcatgory is already found'],
            lowercase: true        
        },
        image: {
            type: String,
            default: "https://placehold.co/600x400.png"
        },
        category: {
            type: Number,
            ref: "categories",
            required: [true, 'SubCatgory must belong to parent category']
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

subCategorySchema.plugin(AutoIncrement.plugin, {model: 'subCategories', startAt: 1,});

//Set value to slug property before adding new category to the database
subCategorySchema.pre('save', function(next) {
    this.slug = slugify(this.name);
    next();
});

//update value of slug property when the name is updated
subCategorySchema.pre('findOneAndUpdate', function (next) {
    if(this._update.name) {
        this._update.slug = slugify(this._update.name);
    }
    next();
}); 

//To populate with each find query
subCategorySchema.pre(/^find/, function (next) {
    this.populate({
        path: 'category',
        select: 'name'
    })
    next();
})

const subCategoryModel = mongoose.model("subCategories", subCategorySchema);

module.exports = subCategoryModel;