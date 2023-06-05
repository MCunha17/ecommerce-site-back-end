const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    // find all tags
    // be sure to include its associated Product data
    const tags = await Tag.findAll({
      include: [{ model: Product, through: ProductTag }],
    });
    res.status(200).json(tags);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
  // find a single tag by its `id`
  // be sure to include its associated Product data
    const tag = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag }],
  });

  // If tag not found, return 404 status
  if (!tag) {
    res.status(404).json({ message: 'Tag not found.' });
    return;
  }

    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    // create a new tag
    const tag = await Tag.create(req.body);
    res.status(201).json(tag);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
  // update a tag's name by its `id` value
    const tag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
    },
  });

  // If tag not found, return 404 status
    if (!tag[0]) {
      res.status(404).json({ message: 'Tag not found.' });
      return;
    }

    res.status(200).json({ message: 'Tag updated.' });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
  // delete on tag by its `id` value
    const tag = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

  // If tag not found, return 404 status
    if (!tag) {
      res.status(404).json({ message: 'Tag not found.' });
      return;
    }

    res.status(200).json({ message: 'Tag deleted.' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
