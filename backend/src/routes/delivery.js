import express from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

// @desc    Get delivery estimate for pincode
// @route   POST /api/delivery/estimate
// @access  Public
router.post("/estimate", async (req, res) => {
  try {
    const { pincode } = req.body;

    if (!pincode || !/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        message: "Valid 6-digit pincode is required",
      });
    }

    // Get delivery estimate based on pincode
    const estimate = getDeliveryEstimate(pincode);

    res.json({
      success: true,
      data: {
        estimate,
      },
    });
  } catch (error) {
    console.error("Delivery estimate error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting delivery estimate",
    });
  }
});

// @desc    Check delivery serviceability
// @route   POST /api/delivery/check
// @access  Public
router.post("/check", async (req, res) => {
  try {
    const { pincode, weight = 500 } = req.body; // Default weight 500g

    if (!pincode || !/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        success: false,
        message: "Valid 6-digit pincode is required",
      });
    }

    const deliveryInfo = getDetailedDeliveryInfo(pincode, weight);

    res.json({
      success: true,
      data: deliveryInfo,
    });
  } catch (error) {
    console.error("Delivery check error:", error);
    res.status(500).json({
      success: false,
      message: "Server error checking delivery",
    });
  }
});

// Helper function to get delivery estimate
function getDeliveryEstimate(pincode) {
  const firstDigit = pincode.charAt(0);

  // Delivery estimates based on first digit of pincode (Indian postal zones)
  const deliveryMatrix = {
    1: { days: 2, serviceAvailable: true, charges: 0, courier: "Express" }, // Delhi, Haryana
    2: { days: 3, serviceAvailable: true, charges: 0, courier: "Standard" }, // Punjab, Himachal
    3: { days: 3, serviceAvailable: true, charges: 0, courier: "Standard" }, // Rajasthan, Gujarat
    4: { days: 2, serviceAvailable: true, charges: 0, courier: "Express" }, // Maharashtra, Goa
    5: { days: 1, serviceAvailable: true, charges: 0, courier: "Same Day" }, // Telangana, Andhra Pradesh
    6: { days: 3, serviceAvailable: true, charges: 0, courier: "Standard" }, // Karnataka, Kerala
    7: { days: 3, serviceAvailable: true, charges: 0, courier: "Standard" }, // Tamil Nadu
    8: { days: 4, serviceAvailable: true, charges: 0, courier: "Standard" }, // Eastern India
    9: { days: 5, serviceAvailable: true, charges: 50, courier: "Standard" }, // Northeast
    0: { days: 3, serviceAvailable: true, charges: 0, courier: "Standard" }, // Others
  };

  return deliveryMatrix[firstDigit] || deliveryMatrix["0"];
}

// Helper function to get detailed delivery information
function getDetailedDeliveryInfo(pincode, weight) {
  const estimate = getDeliveryEstimate(pincode);
  const firstDigit = pincode.charAt(0);

  // Zone mapping for better information
  const zoneInfo = {
    1: { zone: "North Zone", city: "Delhi NCR" },
    2: { zone: "North Zone", city: "Punjab/HP" },
    3: { zone: "West Zone", city: "Rajasthan/Gujarat" },
    4: { zone: "West Zone", city: "Maharashtra/Goa" },
    5: { zone: "South Zone", city: "Telangana/AP" },
    6: { zone: "South Zone", city: "Karnataka/Kerala" },
    7: { zone: "South Zone", city: "Tamil Nadu" },
    8: { zone: "East Zone", city: "Eastern India" },
    9: { zone: "Northeast Zone", city: "Northeast" },
    0: { zone: "Central Zone", city: "Central India" },
  };

  const zone = zoneInfo[firstDigit] || zoneInfo["0"];

  // Calculate estimated delivery date
  const currentDate = new Date();
  const deliveryDate = new Date(currentDate);
  deliveryDate.setDate(currentDate.getDate() + estimate.days);

  // Skip weekends for delivery (optional enhancement)
  while (deliveryDate.getDay() === 0 || deliveryDate.getDay() === 6) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
  }

  return {
    pincode,
    serviceAvailable: estimate.serviceAvailable,
    deliveryDays: estimate.days,
    estimatedDeliveryDate: deliveryDate.toISOString().split("T")[0],
    charges: estimate.charges,
    courier: estimate.courier,
    zone: zone.zone,
    regionInfo: zone.city,
    features: {
      codAvailable: estimate.days <= 3, // COD available for faster delivery zones
      trackingAvailable: true,
      insuranceAvailable: true,
      expressDeliveryAvailable: estimate.days <= 2,
    },
  };
}

export default router;
