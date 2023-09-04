const mongoose = require("mongoose");
const slugify = require("slugify");
const AutoIncrement = require('../Config/autoIncrementInitialization')

const productSchema = mongoose.Schema(
    {
        _id: {
            type: mongoose.SchemaTypes.Number
        },
        title: {
            type: String,
            trim: true,
            required: [true, 'Product title is required'],
            minlength: [3, 'Too short product title, must be 3 characters at least'],
            maxlength: [50, 'Too long product title, must be 50 characters at most'],
        },
        slug: {
            type: String,
            unique: [true, 'This product is already found'],
            lowercase: true        
        },
        description: {
            type: String,
            required: [true, 'Any product must have a description'],
            minlength: [20, 'Too short product description, must be 20 characters at least'],
        },
        quantity: {
            type: Number,
            required: [true, 'Any product must have a quantity']
        },
        sold: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, 'Any product must have a price'],
            min: [0, 'Price must be greater than 10'],
            max: [200000, 'Price must be greater than 10'],
        },
        discount: {
            type: Number,
            default: 0,
            min: [0, 'Discount must be above or equal to 0'],
        },
        colors: {
            type: [String]        
        },
        imageCover: {
            type: String,
            required: [true, 'Any product must have an image']
        },
        images: {
            type: [String],
            required: [true, 'Any product must have one image at least']
        },
        ratingsAverage: {
            type: Number,
            min: [1, 'Rating must be above or equal to 1.0'],
            max: [5, 'Rating must be below or equal to 5.0'],
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        category: {
            type: Number,
            required: [true, 'Any product must belong to a category'],
            ref: 'categories'
        },
        subCategories: {
            type: [Number],
            required: [true, 'Any product must belong to one subcategory at least'],
            ref: 'subCategories'
        },
        brand: {
            type: Number,
            ref: 'brands'
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
        toJSON: {virtuals: true},
        id: false
    }
)

productSchema.virtual("reviews", {
    ref: 'reviews',
    foreignField: "product",
    localField: "_id",
    justOne: true // To retrun only one review to make the response more light
})

productSchema.plugin(AutoIncrement.plugin, {model: 'products', startAt: 1});

productSchema.pre('save', function(next) {
    this.slug = slugify(this.title);
    next();
});

productSchema.pre('findOneAndUpdate', function(next) {
    if(this._update.title) {
        this._update.slug = slugify(this._update.title);
    }
    next();
});  

productSchema.pre('findById', function (next) {
    const populateFields = [
        {
            path: 'category',
            select: 'name'
        },
        {
            path: 'subCategories',
            select: 'name'
        }
    ]
    if(this.op === "findOne") {
        populateFields.push({
            path: 'reviews',
            select: 'comment -product'
        })
    }
    this.populate(populateFields)
    next();
})

const productModel = mongoose.model("products", productSchema);

module.exports = productModel;