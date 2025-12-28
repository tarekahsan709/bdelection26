
/**
 * Fix missing constituency coordinates by calculating from siblings
 * Run from project root: node scripts/fix-missing-constituencies.js
 */

// Load source and population data

// Known district center coordinates (approximate)
  'Gaibandha': { lat: 25.3297, long: 89.5283 },
  'Naogaon': { lat: 24.7936, long: 88.9318 },
  'Rajshahi': { lat: 24.3745, long: 88.6042 },
  'Sirajgonj': { lat: 24.4534, long: 89.7006 },
  'Netrokona': { lat: 24.8705, long: 90.7286 },
  'Kishoreganj': { lat: 24.4449, long: 90.7766 },
  'Munshiganj': { lat: 23.5422, long: 90.5305 },
  'Dhaka': { lat: 23.8103, long: 90.4125 },
  'Gazipur': { lat: 24.0023, long: 90.4264 },
  'Narayanganj': { lat: 23.6238, long: 90.5000 },
  'Narsingdi': { lat: 23.9322, long: 90.7151 },
  'Lakshmipur': { lat: 22.9425, long: 90.8411 }
};


  // Find siblings in same district with valid coordinates
  );

  // Extract constituency number (e.g., "Dhaka-13" -> 13)

    // Calculate average of siblings

    // Add offset based on constituency number to spread them

    };
  }

  // Fall back to district center

    };
  }

}

// Find and fix missing coordinates

    } else {
    }
  }
});


// Also update the source file
    }
  }
});

// Save files

