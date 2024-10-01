const productController = require("../controllers/productController");
const router = require("express").Router();

router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.get('/search', productController.searchProducts);

module.exports = router;