const Category = require('../models/categories');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { stringify } = require('flatted');
class CategoryController {
    async display(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const categoryPerPage = parseInt(req.query.limit) || 3;
    
            const [categories, totalCategory] = await Promise.all([
                Category.find({})
                    .skip((page - 1) * categoryPerPage)
                    .limit(categoryPerPage)
                    .lean(),
                Category.countDocuments({})
            ]);
    
            const totalPages = Math.ceil(totalCategory / categoryPerPage);
    
            res.json({
                categories: categories, 
                currentPage: page,
                totalPages: totalPages,
                limit: categoryPerPage
            });
        } catch (error) {
            console.error('Error in display function:', error);
            next(error);
        }
    }
    

    add(req, res, next) {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Name is required.' });
        }

        Category.findOne({ name })
            .then(existingCategory => {
                if (existingCategory) {
                    return res.status(400).json({ message: 'Category with this name already exists.' });
                }

                const newCategory = new Category({ name, description });
                return newCategory.save();
            })
            .then(savedCategory => {
                res.status(201).json({ category: savedCategory, message: 'Successfully added category.' });
            })
            .catch(next);
    }

    delete(req, res, next) {
        const categoryId = req.params.id;

        Category.findByIdAndDelete(categoryId)
            .then(deletedCategory => {
                if (!deletedCategory) {
                    return res.status(404).json({ message: 'Category not found.' });
                }
                res.status(200).json({ message: 'Category deleted successfully.' });
            })
            .catch(next);
    }

    update(req, res, next) {
        const categoryId = req.params.id;
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        Category.findByIdAndUpdate(
            categoryId,
            { name, description },
            { new: true, runValidators: true }
        )
            .then(updatedCategory => {
                if (!updatedCategory) {
                    return res.status(404).json({ message: 'Category not found.' });
                }
                res.status(200).json({ category: updatedCategory, message: 'Category updated successfully.' });
            })
            .catch(error => {
                console.error('Error updating category:', error);
                next(error);
            });
    }
}

module.exports = new CategoryController();
