
// Input/Output paths


  'barishal': 'barisal',
  'chattogram': 'chittagong',
  'cumilla': 'comilla',
  'bogura': 'bogra',
  'jashore': 'jessore',
  'rangpur': 'ranpur',
  'tangail': 'tangali',
  'gazipur': 'dhaka',
  'narayanganj': 'dhaka',
  'narsingdi': 'dhaka',
  'manikganj': 'dhaka',
  'munshiganj': 'dhaka',
  'brahmanbaria': 'comilla',
  'chandpur': 'comilla',
  'lakshmipur': 'noakhali',
  'feni': 'noakhali',
  'sirajgonj': 'pabna',
  'natore': 'rajshahi',
  'nawabganj': 'rajshahi',
  'naogaon': 'rajshahi',
  'joypurhat': 'bogra',
  'gaibandha': 'ranpur',
  'kurigram': 'ranpur',
  'lalmonirhat': 'ranpur',
  'nilphamari': 'dinajpur',
  'thakurgaon': 'dinajpur',
  'panchagarh': 'dinajpur',
  'netrokona': 'mymensingh',
  'sherpur': 'mymensingh',
  'sunamganj': 'sylhet',
  'habiganj': 'sylhet',
  'maulvibazar': 'sylhet',
  'bagerhat': 'khulna',
  'satkhira': 'khulna',
  'narail': 'jessore',
  'magura': 'jessore',
  'jhenaidah': 'jessore',
  'chuadanga': 'kushtia',
  'meherpur': 'kushtia',
  'rajbari': 'faridpur',
  'gopalganj': 'faridpur',
  'madaripur': 'faridpur',
  'shariatpur': 'faridpur',
  'bhola': 'barisal',
  'jhalokati': 'barisal',
  'pirojpur': 'barisal',
  'barguna': 'patuakhali',
  "cox's bazar": 'chittagong',
};

/**
 * Normalize district name for matching (with alias lookup)
 */
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/\s+/g, ' ')
    .trim();

}

/**
 * Build a map of district names to their polygon features
 */


    }
  });

}

/**
 * Merge multiple polygon features into one for a district
 */
  }


      } catch (e) {
      }
    }

  } catch (e) {
  }
}

/**
 * Generate random points within a polygon using Turf.js
 */





            });
          }
        } catch (e) {
        }
      });

    }
  } catch (e) {
  }

}

/**
 * Fallback: Generate dots using circular distribution (for unmatched districts)
 */



    });
  }

}

/**
 * Generate dots for all constituencies using polygon boundaries
 */

        ? constituency.registered_voters
        : constituency.total_population;






      }
    }

      );

      }
    }

    });

  });

  };
}

/**
 * Main function
 */
  }


  }


    'voters'
  );

    'population'
  );
}

} catch (error) {
}
