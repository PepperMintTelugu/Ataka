interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface AddressDetails {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
  country?: string;
  formatted_address?: string;
}

interface DeliveryEstimate {
  days: number;
  serviceAvailable: boolean;
  charges: number;
  courier: string;
}

// Get user's current location using GPS
export const getCurrentLocation = (): Promise<LocationCoords> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage = "Unable to get location";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }

        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    );
  });
};

// Reverse geocode coordinates to get address
export const reverseGeocode = async (
  coords: LocationCoords,
): Promise<AddressDetails> => {
  try {
    // Using OpenStreetMap Nominatim API (free alternative to Google Maps)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&addressdetails=1`,
      {
        headers: {
          "User-Agent": "TeluguBooks-App/1.0",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Geocoding service unavailable");
    }

    const data = await response.json();

    if (!data || !data.address) {
      throw new Error("Address not found");
    }

    const address = data.address;

    return {
      street:
        `${address.house_number || ""} ${address.road || address.residential || ""}`.trim(),
      city:
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        "",
      state: address.state || address.state_district || "",
      pincode: address.postcode || "",
      country: address.country || "",
      formatted_address: data.display_name || "",
    };
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    throw error;
  }
};

// Get address details from pincode
export const getAddressFromPincode = async (
  pincode: string,
): Promise<AddressDetails> => {
  try {
    // First try with India Post API
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`,
    );

    if (response.ok) {
      const data = await response.json();

      if (
        data &&
        data[0] &&
        data[0].Status === "Success" &&
        data[0].PostOffice
      ) {
        const postOffice = data[0].PostOffice[0];
        return {
          city: postOffice.District,
          state: postOffice.State,
          pincode: postOffice.Pincode,
          country: "India",
        };
      }
    }

    // Fallback to Nominatim search
    const nominatimResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&postalcode=${pincode}&limit=1`,
      {
        headers: {
          "User-Agent": "TeluguBooks-App/1.0",
        },
      },
    );

    if (nominatimResponse.ok) {
      const nominatimData = await nominatimResponse.json();

      if (nominatimData && nominatimData.length > 0) {
        const place = nominatimData[0];
        const addressParts = place.display_name.split(", ");

        return {
          city: extractCityFromAddress(addressParts),
          state: extractStateFromAddress(addressParts),
          pincode: pincode,
          country: "India",
        };
      }
    }

    throw new Error("Pincode not found");
  } catch (error) {
    console.error("Pincode lookup failed:", error);
    throw error;
  }
};

// Estimate delivery based on pincode
export const getDeliveryEstimate = async (
  pincode: string,
): Promise<DeliveryEstimate> => {
  // For demo mode, use static estimates directly
  // In production, this would call your backend API that integrates with ShipRocket
  console.log(
    "Telugu Books Demo: Using static delivery estimates for pincode:",
    pincode,
  );

  // Simulate API delay for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 500));

  return getStaticDeliveryEstimate(pincode);
};

// Static delivery estimates as fallback
const getStaticDeliveryEstimate = (pincode: string): DeliveryEstimate => {
  const firstDigit = pincode.charAt(0);

  // Delivery estimates based on first digit of pincode (Indian postal zones)
  const deliveryMatrix: Record<string, DeliveryEstimate> = {
    "1": { days: 2, serviceAvailable: true, charges: 0, courier: "Express" }, // Delhi, Haryana
    "2": { days: 3, serviceAvailable: true, charges: 0, courier: "Standard" }, // Punjab, Himachal
    "3": { days: 3, serviceAvailable: true, charges: 0, courier: "Standard" }, // Rajasthan, Gujarat
    "4": { days: 2, serviceAvailable: true, charges: 0, courier: "Express" }, // Maharashtra, Goa
    "5": { days: 1, serviceAvailable: true, charges: 0, courier: "Same Day" }, // Telangana, Andhra Pradesh
    "6": { days: 3, serviceAvailable: true, charges: 0, courier: "Standard" }, // Karnataka, Kerala
    "7": { days: 3, serviceAvailable: true, charges: 0, courier: "Standard" }, // Tamil Nadu
    "8": { days: 4, serviceAvailable: true, charges: 0, courier: "Standard" }, // Eastern India
    "9": { days: 5, serviceAvailable: true, charges: 50, courier: "Standard" }, // Northeast
    "0": { days: 3, serviceAvailable: true, charges: 0, courier: "Standard" }, // Others
  };

  return deliveryMatrix[firstDigit] || deliveryMatrix["0"];
};

// Validate Indian pincode
export const isValidPincode = (pincode: string): boolean => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

// Get coordinates from pincode (for distance calculation)
export const getCoordsFromPincode = async (
  pincode: string,
): Promise<LocationCoords | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&countrycodes=in&postalcode=${pincode}&limit=1`,
      {
        headers: {
          "User-Agent": "TeluguBooks-App/1.0",
        },
      },
    );

    if (response.ok) {
      const data = await response.json();

      if (data && data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Coordinate lookup failed:", error);
    return null;
  }
};

// Calculate distance between two points (Haversine formula)
export const calculateDistance = (
  coord1: LocationCoords,
  coord2: LocationCoords,
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.latitude)) *
      Math.cos(toRadians(coord2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

// Helper functions for address parsing
const extractCityFromAddress = (addressParts: string[]): string => {
  const cityKeywords = ["district", "city", "municipality", "town"];
  for (const part of addressParts) {
    const lowerPart = part.toLowerCase();
    if (cityKeywords.some((keyword) => lowerPart.includes(keyword))) {
      return part
        .replace(/\s*(district|city|municipality|town)\s*/i, "")
        .trim();
    }
  }
  // Fallback to second last part (usually city/district)
  return addressParts[addressParts.length - 3] || "";
};

const extractStateFromAddress = (addressParts: string[]): string => {
  const states = [
    "Andhra Pradesh",
    "Telangana",
    "Karnataka",
    "Tamil Nadu",
    "Kerala",
    "Maharashtra",
    "Gujarat",
    "Rajasthan",
    "Delhi",
    "West Bengal",
    "Punjab",
    "Haryana",
    "Himachal Pradesh",
    "Uttarakhand",
    "Uttar Pradesh",
    "Bihar",
    "Jharkhand",
    "Odisha",
    "Chhattisgarh",
    "Madhya Pradesh",
    "Assam",
    "Meghalaya",
    "Manipur",
    "Mizoram",
    "Nagaland",
    "Tripura",
    "Arunachal Pradesh",
    "Sikkim",
    "Goa",
    "Jammu and Kashmir",
    "Ladakh",
  ];

  for (const part of addressParts) {
    for (const state of states) {
      if (part.toLowerCase().includes(state.toLowerCase())) {
        return state;
      }
    }
  }
  // Fallback to last state-like part
  return addressParts[addressParts.length - 2] || "";
};

// Request location permission
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    if (!navigator.permissions) {
      // Try to get location directly if permissions API not available
      await getCurrentLocation();
      return true;
    }

    const permission = await navigator.permissions.query({
      name: "geolocation",
    });

    if (permission.state === "granted") {
      return true;
    } else if (permission.state === "denied") {
      return false;
    } else {
      // Permission is 'prompt', try to get location
      try {
        await getCurrentLocation();
        return true;
      } catch {
        return false;
      }
    }
  } catch (error) {
    console.error("Permission check failed:", error);
    return false;
  }
};
