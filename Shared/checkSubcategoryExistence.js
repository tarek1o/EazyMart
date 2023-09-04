const subCategoryModel = require("../Models/subCategoryModel");

const checkSubCategoryExistence = async (request, ...subCategoriesId) => {
    if(subCategoriesId.length > 1) {
        const subCategories = await subCategoryModel.find({_id: {$in: subCategoriesId}}, {_id: 1, category: 1});
        if(subCategories.length === subCategoriesId.length) {
            request.categoryId = Array.from(new Set(subCategories.map(subCategory => subCategory.category)));
            return {success: true, notFoundSubCategories: []};
        }
        const foundSubCategories = subCategories.map(subCategory => subCategory._id);
        const notFoundSubCategories = subCategoriesId.filter((element) => !foundSubCategories.includes(element));
        return {success: false, notFoundSubCategories};
    }
    const subCategory = await subCategoryModel.findById(subCategoriesId[0], {_id: 1, category: 1});
    if(subCategory) {
        request.categoryId = [subCategory.category];
        return {success: true, notFoundSubCategories: []};
    }
    return {success: false, notFoundSubCategories: [subCategoriesId[0]]};
}

module.exports = checkSubCategoryExistence