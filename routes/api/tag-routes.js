const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// the '/api/tags' endpoint

// find all tags
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.findAll({
      // include its associated Product data
      include: [{ model: Product, through: ProductTag }],
    });
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json(err);
  }
});

// find a single tag by its 'id'
router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      // include its associated Product data
      include: [{ model: Product, through: ProductTag }],
  });

  // if tag not found, return 404 status
  if (!tag) {
    res.status(404).json({ message: 'Tag not found.' });
    return;
  }

    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create a new tag
router.post('/', async (req, res) => {
  try {
    const tag = await Tag.create(req.body);
    res.status(201).json(tag);
  } catch (err) {
    res.status(400).json(err);
  }
});

// update a tag's name by its 'id' value
router.put('/:id', async (req, res) => {
  try {
    const tag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
    },
  });

    // if tag not found, return 404 status
    if (!tag[0]) {
      res.status(404).json({ message: 'Tag not found.' });
      return;
    }

    // once tag has been updated, display confirmation message
    res.status(200).json({ message: 'Tag updated.' });
  } catch (err) {
    res.status(400).json(err);
  }
});

// delete any tag by its 'id' value
router.delete('/:id', async (req, res) => {
  try {
    const tag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    // if tag not found, return 404 status
    if (!tag) {
      res.status(404).json({ message: 'Tag not found.' });
      return;
    }

    // once tag has been deleted, display conformation message
    res.status(200).json({ message: 'Tag deleted.' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;