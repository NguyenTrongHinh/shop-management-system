import Product from "../models/Product.js";

// Lấy tất cả sản phẩm với phân trang, lọc, sắp xếp
export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Xây dựng filter object
    const filter = {};
    
    // Lọc theo category
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }
    
    // Lọc theo brand
    if (req.query.brand && req.query.brand !== 'all') {
      filter.brand = req.query.brand;
    }
    
    // Lọc theo price range
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }
    
    // Lọc theo rating
    if (req.query.minRating) {
      filter.rating = { $gte: Number(req.query.minRating) };
    }
    
    // Lọc featured products
    if (req.query.featured === 'true') {
      filter.featured = true;
    }
    
    // Lọc theo tag
    if (req.query.tag) {
      filter.tags = { $in: [req.query.tag] };
    }
    
    // Search by name
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    // Sắp xếp
    const sort = {};
    if (req.query.sort) {
      const [field, order] = req.query.sort.split(':');
      sort[field] = order === 'desc' ? -1 : 1;
    } else {
      sort.createdAt = -1; // Mặc định mới nhất
    }

    // Lấy sản phẩm
    const products = await Product.find(filter)
      .populate('createdBy', 'username email') // Populate user info
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server khi lấy danh sách sản phẩm" 
    });
  }
};

// Lấy sản phẩm theo ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'username email');
    
    if (product) {
      res.json({
        success: true,
        product
      });
    } else {
      res.status(404).json({ 
        success: false,
        message: "Không tìm thấy sản phẩm" 
      });
    }
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server khi lấy thông tin sản phẩm" 
    });
  }
};

// Tạo sản phẩm mới (Chỉ admin)
export const createProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      price: Number(req.body.price),
      countInStock: Number(req.body.countInStock),
      discount: Number(req.body.discount) || 0,
      createdBy: req.user._id // Thêm user tạo sản phẩm
    };

    const product = new Product(productData);
    const createdProduct = await product.save();
    
    // Populate createdBy info
    await createdProduct.populate('createdBy', 'username email');
    
    res.status(201).json({
      success: true,
      message: "Tạo sản phẩm thành công",
      product: createdProduct
    });
  } catch (error) {
    console.error("Create product error:", error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: errors.join(', ') 
      });
    }
    
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Cập nhật sản phẩm (Chỉ admin)
export const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Convert number fields
    if (req.body.price) updateData.price = Number(req.body.price);
    if (req.body.countInStock) updateData.countInStock = Number(req.body.countInStock);
    if (req.body.discount) updateData.discount = Number(req.body.discount);
    if (req.body.rating) updateData.rating = Number(req.body.rating);

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username email');

    if (product) {
      res.json({
        success: true,
        message: "Cập nhật sản phẩm thành công",
        product
      });
    } else {
      res.status(404).json({ 
        success: false,
        message: "Không tìm thấy sản phẩm" 
      });
    }
  } catch (error) {
    console.error("Update product error:", error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: errors.join(', ') 
      });
    }
    
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Xóa sản phẩm (Chỉ admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (product) {
      res.json({
        success: true,
        message: "Xóa sản phẩm thành công"
      });
    } else {
      res.status(404).json({ 
        success: false,
        message: "Không tìm thấy sản phẩm" 
      });
    }
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server khi xóa sản phẩm" 
    });
  }
};

// Lấy danh sách categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json({
      success: true,
      categories: categories.sort()
    });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server khi lấy danh mục" 
    });
  }
};

// Lấy danh sách brands
export const getBrands = async (req, res) => {
  try {
    const brands = await Product.distinct("brand");
    res.json({
      success: true,
      brands: brands.sort()
    });
  } catch (error) {
    console.error("Get brands error:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server khi lấy thương hiệu" 
    });
  }
};

// Lấy sản phẩm nổi bật
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true })
      .limit(8)
      .populate('createdBy', 'username email');
    
    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error("Get featured products error:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server khi lấy sản phẩm nổi bật" 
    });
  }
};

// Cập nhật đánh giá sản phẩm
export const updateProductRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: "Không tìm thấy sản phẩm" 
      });
    }
    
    // Cập nhật rating
    product.numReviews += 1;
    product.rating = ((product.rating * (product.numReviews - 1)) + rating) / product.numReviews;
    
    await product.save();
    
    res.json({
      success: true,
      message: "Cập nhật đánh giá thành công",
      product
    });
  } catch (error) {
    console.error("Update rating error:", error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server khi cập nhật đánh giá" 
    });
  }
};