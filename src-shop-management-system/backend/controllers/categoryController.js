// controllers/categoryController.js
import Category from "../models/Category.js";

// Lấy tất cả categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('createdBy', 'username');
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error: error.message });
  }
};

// Tạo category mới
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const existingCategory = await Category.findOne({ 
      $or: [{ name }, { slug: name.toLowerCase().replace(/\s+/g, '-') }] 
    });
    
    if (existingCategory) {
      return res.status(400).json({ success: false, message: "Danh mục đã tồn tại" });
    }

    const category = new Category({
      name,
      description,
      createdBy: req.user._id
    });

    await category.save();
    await category.populate('createdBy', 'username');
    
    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Cập nhật category
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'username');

    if (!category) {
      return res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });
    }

    res.json({ success: true, category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Xóa category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });
    }

    res.json({ success: true, message: "Xóa danh mục thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};