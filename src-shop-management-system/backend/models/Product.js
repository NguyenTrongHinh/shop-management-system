import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Tên sản phẩm là bắt buộc"],
    trim: true,
    maxlength: [100, "Tên sản phẩm không được vượt quá 100 ký tự"]
  },
  description: {
    type: String,
    required: [true, "Mô tả sản phẩm là bắt buộc"],
    maxlength: [1000, "Mô tả không được vượt quá 1000 ký tự"]
  },
  price: {
    type: Number,
    required: [true, "Giá sản phẩm là bắt buộc"],
    min: [0, "Giá sản phẩm không thể âm"],
    max: [100000000, "Giá sản phẩm quá lớn"]
  },
  category: {
    type: String,
    required: [true, "Danh mục sản phẩm là bắt buộc"],
    enum: {
      values: [
        "Điện thoại",
        "Laptop", 
        "Tablet",
        "Đồng hồ",
        "Phụ kiện",
        "Âm thanh",
        "Gaming",
        "Camera"
      ],
      message: "Danh mục không hợp lệ"
    }
  },
  brand: {
    type: String,
    required: [true, "Thương hiệu sản phẩm là bắt buộc"],
    trim: true
  },
  images: [{
    type: String,
    required: [true, "Ít nhất một hình ảnh là bắt buộc"]
  }],
  countInStock: {
    type: Number,
    required: [true, "Số lượng tồn kho là bắt buộc"],
    min: [0, "Số lượng tồn kho không thể âm"],
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, "Đánh giá không thể âm"],
    max: [5, "Đánh giá tối đa là 5"]
  },
  numReviews: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    min: [0, "Giảm giá không thể âm"],
    max: [100, "Giảm giá tối đa là 100%"],
    default: 0
  },
  specifications: {
    color: String,
    weight: String,
    dimensions: String,
    model: String,
    warranty: String
  },
  tags: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual để tính giá sau giảm giá
productSchema.virtual("salePrice").get(function() {
  return this.price * (1 - this.discount / 100);
});

// Index để tìm kiếm nhanh hơn
productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });

// Method để cập nhật đánh giá
productSchema.methods.updateRating = async function(newRating) {
  this.numReviews += 1;
  this.rating = ((this.rating * (this.numReviews - 1)) + newRating) / this.numReviews;
  await this.save();
};

// Middleware trước khi save
productSchema.pre("save", function(next) {
  // Đảm bảo price là number
  if (typeof this.price === "string") {
    this.price = Number(this.price);
  }
  // Làm tròn price đến 2 chữ số thập phân
  this.price = Math.round(this.price * 100) / 100;
  next();
});

export default mongoose.model("Product", productSchema);