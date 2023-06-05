const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// the '/api/products' endpoint

// find all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      // be sure to include its associated Category and Tag data
      include: [{ model: Category }, { model: Tag, through: ProductTag }],
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// find a single product by its `id`
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      // be sure to include its associated Category and Tag data
      include: [{ model: Category }, { model: Tag, through: ProductTag }],
  });
  
  // if product not found, return 404 status
  if (!product) {
    res.status(404).json({ message: 'Product not found' });
    return;
  }
  
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {
  try {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  const product = await Product.create(req.body);
    // if there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: product.id,
          tag_id,
        };
      });
      await ProductTag.bulkCreate(productTagIdArr);
    }
    // if no product tags, just respond
    res.status(200).json(product);
  } catch(err) {
      console.log(err);
      res.status(400).json(err);
  }
});

// update product data
router.put('/:id', async (req, res) => {
  try {
    await Product.update(req.body, {
      where: {
        id: req.params.id,
    },
  });

  if (req.body.tagIds && req.body.tagIds.length) {
    const productTags = await ProductTag.findAll({
      where: { product_id: req.params.id }
    });
    
    // create filtered list of new tag_ids
    const productTagIds = productTags.map(({ tag_id }) => tag_id);
    const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
    });

    // figure out which ones to remove
    const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);

    // run both actions
    await Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags),
    ]);
  }

    // once product has been updated, display confirmation message
    res.status(400).json({ message: 'Product updated.' });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// delete one product by its 'id' value
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    // if product not found, return 404 status
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // once product has been deleted, display confirmation message
    res.status(200).json({ message: 'Product deleted.' });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;