
// Load all reference data

// Load BNP candidate data

// Create lookup maps
});

});

  // Also add bn_name key
});

// Create postcode lookup by upazila
  }
  }
});

// District name mapping (constituency name to district)
  'পঞ্চগড়': 'Panchagarh',
  'ঠাকুরগাঁও': 'Thakurgaon',
  'দিনাজপুর': 'Dinajpur',
  'নীলফামারী': 'Nilphamari',
  'লালমনিরহাট': 'Lalmonirhat',
  'রংপুর': 'Rangpur',
  'কুড়িগ্রাম': 'Kurigram',
  'গাইবান্ধা': 'Gaibandha',
  'বগুড়া': 'Bogura',
  'জয়পুরহাট': 'Joypurhat',
  'নওগাঁ': 'Naogaon',
  'নাটোর': 'Natore',
  'রাজশাহী': 'Rajshahi',
  'নবাবগঞ্জ': 'Nawabganj',
  'চাঁপাইনবাবগঞ্জ': 'Nawabganj',
  'পাবনা': 'Pabna',
  'সিরাজগঞ্জ': 'Sirajgonj',
  'কুষ্টিয়া': 'Kushtia',
  'মেহেরপুর': 'Meherpur',
  'চুয়াডাঙ্গা': 'Chuadanga',
  'ঝিনাইদহ': 'Jhenaidah',
  'মাগুরা': 'Magura',
  'নড়াইল': 'Narail',
  'যশোর': 'Jashore',
  'সাতক্ষীরা': 'Satkhira',
  'খুলনা': 'Khulna',
  'বাগেরহাট': 'Bagerhat',
  'পিরোজপুর': 'Pirojpur',
  'ঝালকাঠি': 'Jhalokati',
  'বরিশাল': 'Barishal',
  'বরগুনা': 'Barguna',
  'পটুয়াখালী': 'Patuakhali',
  'ভোলা': 'Bhola',
  'গোপালগঞ্জ': 'Gopalganj',
  'মাদারীপুর': 'Madaripur',
  'শরীয়তপুর': 'Shariatpur',
  'ফরিদপুর': 'Faridpur',
  'রাজবাড়ি': 'Rajbari',
  'রাজবাড়ী': 'Rajbari',
  'টাঙ্গাইল': 'Tangail',
  'ময়মনসিংহ': 'Mymensingh',
  'জামালপুর': 'Jamalpur',
  'শেরপুর': 'Sherpur',
  'নেত্রকোণা': 'Netrokona',
  'নেত্রকোনা': 'Netrokona',
  'কিশোরগঞ্জ': 'Kishoreganj',
  'মানিকগঞ্জ': 'Manikganj',
  'মুন্সিগঞ্জ': 'Munshiganj',
  'মুন্সীগঞ্জ': 'Munshiganj',
  'ঢাকা': 'Dhaka',
  'নারায়াণগঞ্জ': 'Narayanganj',
  'নারায়ণগঞ্জ': 'Narayanganj',
  'নরসিংদী': 'Narsingdi',
  'গাজীপুর': 'Gazipur',
  'সুনামগঞ্জ': 'Sunamganj',
  'সিলেট': 'Sylhet',
  'মৌলভীবাজার': 'Maulvibazar',
  'হবিগঞ্জ': 'Habiganj',
  'ব্রাহ্মণবাড়িয়া': 'Brahmanbaria',
  'কুমিল্লা': 'Cumilla',
  'চাঁদপুর': 'Chandpur',
  'ফেনী': 'Feni',
  'নোয়াখালী': 'Noakhali',
  'লক্ষীপুর': 'Lakshmipur',
  'চট্টগ্রাম': 'Chattogram',
  'কক্সবাজার': 'Cox\'s Bazar',
  'খাগড়াছড়ি': 'Khagrachari',
  'রাঙ্গামাটি': 'Rangamati',
  'বান্দরবান': 'Bandarban'
};

// Function to extract district name from constituency
  // Remove numbers and hyphens, e.g., "পঞ্চগড় -১" -> "পঞ্চগড়"
}

// Function to find district by Bengali name
  }
  // Try direct bn_name match
  }
}

// Function to determine area type
  }
  }
  }
  }
  }
  }
}

}

// Function to extract upazila name from area text
  // Remove "উপজেলা" suffix and clean up
}

// Function to find upazila
    }
  }

  // Try Bengali name
  }

}

// Function to get postcodes for an upazila
}

// Process each candidate




    // Process areas

        // Data is already enriched, just update district/division info

        // Keep existing enriched area but try to add missing upazila_id/postcodes

            }
          }
        }
      } else {

        };

            }
          }
        }
      }
    }
  } else {
    // Keep original areas if district not found
    } else {
      }));
    }
  }

  };
});

// Create enriched data object
};

// Write enriched data
  JSON.stringify(enrichedData, null, 2),
  'utf8'
);


// Count statistics

  });
});

