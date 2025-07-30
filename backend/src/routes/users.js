import express from "express";
import User from "../models/User.js";
import Book from "../models/Book.js";
import { protect } from "../middleware/auth.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// @desc    Add/remove book from wishlist
// @route   PUT /api/users/wishlist/:bookId
// @access  Private
router.put("/wishlist/:bookId", protect, async (req, res) => {
  try {
    const { bookId } = req.params;
    const user = await User.findById(req.user.id);

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book || !book.isActive) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    // Check if book is already in wishlist
    const bookIndex = user.wishlist.indexOf(bookId);

    if (bookIndex > -1) {
      // Remove from wishlist
      user.wishlist.splice(bookIndex, 1);
      await user.save();

      res.json({
        success: true,
        message: "Book removed from wishlist",
        data: { inWishlist: false },
      });
    } else {
      // Add to wishlist
      user.wishlist.push(bookId);
      await user.save();

      res.json({
        success: true,
        message: "Book added to wishlist",
        data: { inWishlist: true },
      });
    }
  } catch (error) {
    console.error("Wishlist toggle error:", error);
    if (error.name === "CastError") {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update wishlist",
    });
  }
});

// @desc    Get user's wishlist
// @route   GET /api/users/wishlist
// @access  Private
router.get("/wishlist", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "wishlist",
      match: { isActive: true },
      select:
        "title author price originalPrice image rating reviewCount inStock",
    });

    res.json({
      success: true,
      data: { wishlist: user.wishlist },
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
    });
  }
});

// @desc    Add/update address
// @route   POST /api/users/addresses
// @access  Private
router.post(
  "/addresses",
  protect,
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("street").trim().notEmpty().withMessage("Street is required"),
    body("city").trim().notEmpty().withMessage("City is required"),
    body("state").trim().notEmpty().withMessage("State is required"),
    body("pincode")
      .matches(/^[1-9][0-9]{5}$/)
      .withMessage("Invalid pincode"),
    body("phone")
      .matches(/^[6-9]\d{9}$/)
      .withMessage("Invalid phone number"),
    body("type")
      .optional()
      .isIn(["home", "work", "other"])
      .withMessage("Invalid address type"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation errors",
          errors: errors.array(),
        });
      }

      const user = await User.findById(req.user.id);
      const addressData = req.body;

      // If this is the first address or marked as default, make it default
      if (user.addresses.length === 0 || addressData.isDefault) {
        // Remove default from other addresses
        user.addresses.forEach((addr) => (addr.isDefault = false));
        addressData.isDefault = true;
      }

      user.addresses.push(addressData);
      await user.save();

      res.status(201).json({
        success: true,
        message: "Address added successfully",
        data: { addresses: user.addresses },
      });
    } catch (error) {
      console.error("Add address error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to add address",
      });
    }
  },
);

// @desc    Update address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
router.put("/addresses/:addressId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // If setting this address as default, remove default from others
    if (req.body.isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    Object.assign(address, req.body);
    await user.save();

    res.json({
      success: true,
      message: "Address updated successfully",
      data: { addresses: user.addresses },
    });
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update address",
    });
  }
});

// @desc    Delete address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
router.delete("/addresses/:addressId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const address = user.addresses.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // If deleting default address, make another one default
    if (address.isDefault && user.addresses.length > 1) {
      const nextAddress = user.addresses.find(
        (addr) => addr._id.toString() !== req.params.addressId,
      );
      if (nextAddress) {
        nextAddress.isDefault = true;
      }
    }

    user.addresses.pull(req.params.addressId);
    await user.save();

    res.json({
      success: true,
      message: "Address deleted successfully",
      data: { addresses: user.addresses },
    });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete address",
    });
  }
});

// @desc    Get user's addresses
// @route   GET /api/users/addresses
// @access  Private
router.get("/addresses", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("addresses");

    res.json({
      success: true,
      data: { addresses: user.addresses },
    });
  } catch (error) {
    console.error("Get addresses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
    });
  }
});

export default router;
