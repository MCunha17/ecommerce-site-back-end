const router = require('express').Router();
const { Category, Product } = require('../../models');

// the '/api/categories' endpoint

// find all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
    // includes its associated Products
    include: [Product],
    });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
});

// find one category by its 'id' value
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      // include its associated Products
      include: [Product],
  });

  // if category not found, return 404 status
    if (!category) {
      res.status(404).json({ message: 'Category not found.' });
      return;
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create a new category
router.post('/', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json(err);
  }
});

// update category by its 'id' value
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    // if category not found, return 404 status
    if (!category[0]) {
      res.status(404).json({ message: 'Category not found.' });
      return;
    }

    // once category has been updated, display confirmation message
    res.status(200).json({ message: 'Category updated.' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete category by its 'id' value
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    // if category not found, return 404 status
    if (!category) {
      res.status(404).json({ message: 'Category not found.' });
      return;
    }

    // once category has been deleted, display confirmation message
    res.status(200).json({ message: 'Category deleted.' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;