#!/usr/bin/env node
/**
 * Generate constituency boundary polygons by merging upazila polygons
 *
 * This script:
 * 1. Reads upazila polygons from bangladesh.geojson
 * 2. Reads constituency → upazila mapping from bd-constituencies.json
 * 3. Merges upazila polygons for each constituency
 * 4. Outputs constituencies.geojson
 */

// Load turf from app/node_modules since that's where npm installs it

// Paths

// Load data


// Create upazila ID to name mapping
});

// Normalize name for matching
    .toLowerCase()
    .replace(/\s+upazila$/i, '')
    .replace(/\s+upazilla$/i, '')
    .replace(/\s+sadar$/i, ' sadar')
    .replace(/\bsadar\b/i, 'sadar')
    .replace(/\bs\.$/i, 'sadar')
    .replace(/-s$/i, ' sadar')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Build GeoJSON feature lookup by normalized name


  // Store by normalized name
  }

  // Also store by district for fallback matching
});

// Find polygon for an upazila

  }

  }


  // Try exact match first
  }

  // Try with district context
    }
  }

  // Try fuzzy matching
      }
      // If multiple, try to match by district
        }
      }
    }
  }

}

// Merge polygons

    // Convert all to features
    });

    // Union all polygons
      } catch (e) {
        // Try with tiny buffer to fix topology issues
      }
    }

  } catch (e) {
: return convex hull
    });
  }
}

// Process constituencies



  // Get type breakdown for logging
  }, {});

  // Only process upazilas (skip city_corporation_ward, municipality, etc.)

    }
  }

  // Log progress

  }

  } else {
  }

  // Merge polygons
    };
  }
}

// Create output GeoJSON
};

// Write output

