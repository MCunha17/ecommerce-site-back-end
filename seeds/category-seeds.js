// import Category model
const { Category } = require('../models');

// category data
const categoryData = [
  {
    category_name: 'Shirts',
  },
  {
    category_name: 'Shorts',
  },
  {
    category_name: 'Music',
  },
  {
    category_name: 'Hats',
  },
  {
    category_name: 'Shoes',
  },
];

// function to insert category data into the database
const seedCategories = () => Category.bulkCreate(categoryData);

module.exports = seedCategories;