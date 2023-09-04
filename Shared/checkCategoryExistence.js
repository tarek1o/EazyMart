const categoryModel = require("../Models/categoryModel");

const checkCategoryExistence = async (...categoriesId) => {
    if(categoriesId.length > 1) {
        const categories = await categoryModel.find({_id: {$in: categoriesId}}, {_id: 1});
        if(categories.length === categoriesId.length) {
            return {success: true, notFoundCategories: []};
        }
        const foundCategories = categories.map(category => category._id);
        const notFoundCategories = categoriesId.filter((element) => foundCategories.includes(element));
        return {success: false, notFoundCategories};
    }
    const category = await categoryModel.findById(categoriesId[0], {_id: 1});
    if(category) {
        return {success: true, notFoundCategories: []};
    }
    return {success: false, notFoundCategories: [categoriesId[0]]};
}

module.exports = checkCategoryExistence