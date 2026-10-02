// Published run prices and variation prices. Totals in tier groups are line totals.
export type PriceTier = { qty: number; total: number };
export type PriceGroup = { label: string; tiers: PriceTier[] };
export type FinishingPer = "piece" | "job";
export type PriceChoice = { label: string; add: number; per: FinishingPer };
export type PriceOption = { name: string; choices: PriceChoice[] };
export type SizePrice = { unit: string; rate: number; minW: number; maxW: number; minH: number; maxH: number };
export type BookRate = { name: string; bw: number; color: number };
export type NamedPrice = { name: string; price: number };
export type BookPrice = { perPage: boolean; base: number; sizes: BookRate[]; papers: BookRate[]; covers: NamedPrice[]; bindings: NamedPrice[]; discounts: { min: number; max: number; percent: number }[] };
export type VariationPrice = { price: number; attrs: Record<string, string> };
export type PriceEntry = { minQty: number; maxQty: number; step: number; unitKes: number; quote?: boolean; groups?: PriceGroup[]; options?: PriceOption[]; size?: SizePrice; book?: BookPrice; variations?: VariationPrice[] };

export const priceBooks: Record<string, PriceEntry> = {
  "business-cards-printing": {
    "minQty": 100,
    "maxQty": 2000,
    "step": 1,
    "unitKes": 12,
    "groups": [
      {
        "label": "Printed Sides : Single-Sided",
        "tiers": [
          {
            "qty": 100,
            "total": 1200
          },
          {
            "qty": 200,
            "total": 2300
          },
          {
            "qty": 400,
            "total": 4000
          },
          {
            "qty": 800,
            "total": 6400
          },
          {
            "qty": 1000,
            "total": 7000
          },
          {
            "qty": 2000,
            "total": 13000
          }
        ]
      },
      {
        "label": "Printed Sides : Double-Sided",
        "tiers": [
          {
            "qty": 100,
            "total": 1400
          },
          {
            "qty": 200,
            "total": 2700
          },
          {
            "qty": 400,
            "total": 5200
          },
          {
            "qty": 800,
            "total": 10000
          },
          {
            "qty": 1000,
            "total": 11000
          },
          {
            "qty": 2000,
            "total": 16000
          }
        ]
      }
    ],
    "options": [
      {
        "name": "Lamination",
        "choices": [
          {
            "label": "Gloss",
            "add": 2,
            "per": "piece"
          },
          {
            "label": "Matt",
            "add": 2,
            "per": "piece"
          },
          {
            "label": "Velvet",
            "add": 15,
            "per": "piece"
          },
          {
            "label": "Frost",
            "add": 15,
            "per": "piece"
          },
          {
            "label": "No Lamination",
            "add": 0,
            "per": "piece"
          }
        ]
      }
    ]
  },
  "x-banner-printing": {
    "minQty": 1,
    "maxQty": 20,
    "step": 1,
    "unitKes": 4500
  },
  "roll-up-banner-printing": {
    "minQty": 1,
    "maxQty": 10,
    "step": 1,
    "unitKes": 8500,
    "groups": [
      {
        "label": "NarrowBase",
        "tiers": [
          {
            "qty": 1,
            "total": 8500
          },
          {
            "qty": 2,
            "total": 16500
          },
          {
            "qty": 3,
            "total": 17900
          },
          {
            "qty": 4,
            "total": 23200
          },
          {
            "qty": 5,
            "total": 28000
          },
          {
            "qty": 10,
            "total": 54000
          }
        ]
      },
      {
        "label": "Broad Base",
        "tiers": [
          {
            "qty": 1,
            "total": 10500
          },
          {
            "qty": 2,
            "total": 20000
          },
          {
            "qty": 3,
            "total": 28500
          },
          {
            "qty": 4,
            "total": 36000
          },
          {
            "qty": 5,
            "total": 43500
          },
          {
            "qty": 10,
            "total": 85000
          }
        ]
      }
    ]
  },
  "envelopes-printing": {
    "minQty": 50,
    "maxQty": 2000,
    "step": 1,
    "unitKes": 25,
    "groups": [
      {
        "label": "Size: DL Size",
        "tiers": [
          {
            "qty": 50,
            "total": 1250
          },
          {
            "qty": 100,
            "total": 2400
          },
          {
            "qty": 200,
            "total": 4400
          },
          {
            "qty": 400,
            "total": 8000
          },
          {
            "qty": 500,
            "total": 9500
          },
          {
            "qty": 1000,
            "total": 18000
          },
          {
            "qty": 2000,
            "total": 30000
          }
        ]
      },
      {
        "label": "Size: A5 Size",
        "tiers": [
          {
            "qty": 50,
            "total": 1500
          },
          {
            "qty": 100,
            "total": 2700
          },
          {
            "qty": 200,
            "total": 5000
          },
          {
            "qty": 400,
            "total": 8000
          },
          {
            "qty": 500,
            "total": 12000
          },
          {
            "qty": 1000,
            "total": 20000
          },
          {
            "qty": 2000,
            "total": 34000
          }
        ]
      },
      {
        "label": "Size: C4 Size(A4)",
        "tiers": [
          {
            "qty": 50,
            "total": 2250
          },
          {
            "qty": 100,
            "total": 4000
          },
          {
            "qty": 200,
            "total": 7400
          },
          {
            "qty": 400,
            "total": 14000
          },
          {
            "qty": 500,
            "total": 16500
          },
          {
            "qty": 1000,
            "total": 30000
          },
          {
            "qty": 2000,
            "total": 50000
          }
        ]
      }
    ]
  },
  "mounted-photos-printing": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 796,
    "variations": [
      {
        "price": 6466,
        "attrs": {
          "Size": "A1 Size"
        }
      },
      {
        "price": 4177,
        "attrs": {
          "Size": "A2 Size"
        }
      },
      {
        "price": 2189,
        "attrs": {
          "Size": "A3 Size"
        }
      },
      {
        "price": 1193,
        "attrs": {
          "Size": "A4 Size"
        }
      },
      {
        "price": 796,
        "attrs": {
          "Size": "A5 Size"
        }
      }
    ]
  },
  "new-baby-cards": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 35,
    "variations": [
      {
        "price": 50,
        "attrs": {
          "Size": "A5 Size"
        }
      },
      {
        "price": 35,
        "attrs": {
          "Size": "A6 Size"
        }
      }
    ]
  },
  "bookmarks-printing": {
    "minQty": 1,
    "maxQty": 500,
    "step": 1,
    "unitKes": 19
  },
  "branded-t-shirt": {
    "minQty": 1,
    "maxQty": 300,
    "step": 1,
    "unitKes": 1000,
    "groups": [
      {
        "label": "Round Neck",
        "tiers": [
          {
            "qty": 1,
            "total": 1150
          },
          {
            "qty": 2,
            "total": 2200
          },
          {
            "qty": 3,
            "total": 3150
          },
          {
            "qty": 4,
            "total": 4100
          },
          {
            "qty": 5,
            "total": 5000
          },
          {
            "qty": 10,
            "total": 9500
          },
          {
            "qty": 20,
            "total": 18000
          },
          {
            "qty": 50,
            "total": 43500
          },
          {
            "qty": 100,
            "total": 85000
          },
          {
            "qty": 200,
            "total": 164000
          },
          {
            "qty": 300,
            "total": 240000
          }
        ]
      },
      {
        "label": "V-Neck",
        "tiers": [
          {
            "qty": 1,
            "total": 1250
          },
          {
            "qty": 2,
            "total": 2400
          },
          {
            "qty": 3,
            "total": 3450
          },
          {
            "qty": 4,
            "total": 4400
          },
          {
            "qty": 5,
            "total": 5250
          },
          {
            "qty": 10,
            "total": 10000
          },
          {
            "qty": 20,
            "total": 19000
          },
          {
            "qty": 50,
            "total": 43500
          }
        ]
      },
      {
        "label": "Polo",
        "tiers": [
          {
            "qty": 1,
            "total": 1400
          },
          {
            "qty": 2,
            "total": 2700
          },
          {
            "qty": 3,
            "total": 3900
          },
          {
            "qty": 4,
            "total": 5000
          },
          {
            "qty": 5,
            "total": 6000
          },
          {
            "qty": 10,
            "total": 11500
          },
          {
            "qty": 20,
            "total": 23000
          },
          {
            "qty": 50,
            "total": 55000
          },
          {
            "qty": 100,
            "total": 105000
          }
        ]
      }
    ]
  },
  "branded-enamel-mugs": {
    "minQty": 2,
    "maxQty": 200,
    "step": 1,
    "unitKes": 850,
    "variations": [
      {
        "price": 850,
        "attrs": {
          "Color": "Red"
        }
      },
      {
        "price": 850,
        "attrs": {
          "Color": "Yellow"
        }
      },
      {
        "price": 850,
        "attrs": {
          "Color": "Cyan"
        }
      },
      {
        "price": 850,
        "attrs": {
          "Color": "Black"
        }
      },
      {
        "price": 850,
        "attrs": {
          "Color": "Silver"
        }
      }
    ]
  },
  "branded-drawstring-bags": {
    "minQty": 1,
    "maxQty": 500,
    "step": 1,
    "unitKes": 250
  },
  "certificates-printing": {
    "minQty": 1,
    "maxQty": 500,
    "step": 1,
    "unitKes": 80,
    "variations": [
      {
        "price": 80,
        "attrs": {
          "Paper": "Artcard"
        }
      },
      {
        "price": 150,
        "attrs": {
          "Paper": "Ivory paper"
        }
      },
      {
        "price": 150,
        "attrs": {
          "Paper": "Silk"
        }
      }
    ]
  },
  "menu-printing": {
    "minQty": 5,
    "maxQty": 100,
    "step": 1,
    "unitKes": 600,
    "variations": [
      {
        "price": 600,
        "attrs": {
          "Size": "A5 size"
        }
      },
      {
        "price": 900,
        "attrs": {
          "Size": "A4 Size"
        }
      }
    ]
  },
  "wheel-cover-printing": {
    "minQty": 1,
    "maxQty": 100,
    "step": 1,
    "unitKes": 5500,
    "variations": [
      {
        "price": 5500,
        "attrs": {
          "Material": "Banner"
        }
      }
    ]
  },
  "photo-framing": {
    "minQty": 1,
    "maxQty": 50,
    "step": 1,
    "unitKes": 1600,
    "variations": [
      {
        "price": 1600,
        "attrs": {
          "Size": "A4 Size",
          "Frame Colour": "Black"
        }
      },
      {
        "price": 1600,
        "attrs": {
          "Size": "A4 Size",
          "Frame Colour": "White"
        }
      },
      {
        "price": 1600,
        "attrs": {
          "Size": "A4 Size",
          "Frame Colour": "Gold"
        }
      },
      {
        "price": 2500,
        "attrs": {
          "Size": "A3 Size",
          "Frame Colour": "Black"
        }
      },
      {
        "price": 2500,
        "attrs": {
          "Size": "A3 Size",
          "Frame Colour": "White"
        }
      },
      {
        "price": 2500,
        "attrs": {
          "Size": "A3 Size",
          "Frame Colour": "Gold"
        }
      },
      {
        "price": 4200,
        "attrs": {
          "Size": "A2 Size",
          "Frame Colour": "Black"
        }
      },
      {
        "price": 4200,
        "attrs": {
          "Size": "A2 Size",
          "Frame Colour": "White"
        }
      },
      {
        "price": 4200,
        "attrs": {
          "Size": "A2 Size",
          "Frame Colour": "Gold"
        }
      },
      {
        "price": 5500,
        "attrs": {
          "Size": "A1 Size",
          "Frame Colour": "Black"
        }
      },
      {
        "price": 5500,
        "attrs": {
          "Size": "A1 Size",
          "Frame Colour": "White"
        }
      },
      {
        "price": 5500,
        "attrs": {
          "Size": "A1 Size",
          "Frame Colour": "Gold"
        }
      }
    ]
  },
  "banner-printing": {
    "minQty": 1,
    "maxQty": 20,
    "step": 1,
    "unitKes": 1200,
    "size": {
      "unit": "m",
      "rate": 1200,
      "minW": 1,
      "maxW": 30,
      "minH": 1,
      "maxH": 3
    },
    "options": [
      {
        "name": "Finishing",
        "choices": [
          {
            "label": "Add Eyelets/Grommets",
            "add": 100,
            "per": "job"
          },
          {
            "label": "Pole Pockets",
            "add": 600,
            "per": "job"
          },
          {
            "label": "Welded Hem",
            "add": 300,
            "per": "job"
          }
        ]
      }
    ]
  },
  "flyers-printing": {
    "minQty": 50,
    "maxQty": 3000,
    "step": 1,
    "unitKes": 20,
    "groups": [
      {
        "label": "Size: A4 Size, Printing Side: Single-Sided",
        "tiers": [
          {
            "qty": 50,
            "total": 1750
          },
          {
            "qty": 100,
            "total": 3200
          },
          {
            "qty": 200,
            "total": 6000
          },
          {
            "qty": 400,
            "total": 11200
          },
          {
            "qty": 500,
            "total": 13500
          },
          {
            "qty": 1000,
            "total": 26000
          },
          {
            "qty": 2000,
            "total": 44000
          },
          {
            "qty": 3000,
            "total": 54000
          }
        ]
      },
      {
        "label": "Size: A4 Size, Printing Side: Double-Sided",
        "tiers": [
          {
            "qty": 50,
            "total": 2250
          },
          {
            "qty": 100,
            "total": 4200
          },
          {
            "qty": 200,
            "total": 8000
          },
          {
            "qty": 400,
            "total": 15200
          },
          {
            "qty": 500,
            "total": 17500
          },
          {
            "qty": 1000,
            "total": 30000
          },
          {
            "qty": 2000,
            "total": 50000
          },
          {
            "qty": 3000,
            "total": 60000
          }
        ]
      },
      {
        "label": "Size: A5 Size, Printing Side: Single-Sided",
        "tiers": [
          {
            "qty": 50,
            "total": 1250
          },
          {
            "qty": 100,
            "total": 2200
          },
          {
            "qty": 200,
            "total": 4000
          },
          {
            "qty": 400,
            "total": 7200
          },
          {
            "qty": 500,
            "total": 8500
          },
          {
            "qty": 1000,
            "total": 15000
          },
          {
            "qty": 2000,
            "total": 28000
          },
          {
            "qty": 3000,
            "total": 39000
          }
        ]
      },
      {
        "label": "Size: A5 Size, Printing Side: Double-Sided",
        "tiers": [
          {
            "qty": 50,
            "total": 1500
          },
          {
            "qty": 100,
            "total": 2800
          },
          {
            "qty": 200,
            "total": 5000
          },
          {
            "qty": 400,
            "total": 9200
          },
          {
            "qty": 500,
            "total": 11000
          },
          {
            "qty": 1000,
            "total": 20000
          },
          {
            "qty": 2000,
            "total": 36000
          },
          {
            "qty": 3000,
            "total": 48000
          }
        ]
      },
      {
        "label": "Size: A6 Size, Printing Side: Single-Sided",
        "tiers": [
          {
            "qty": 50,
            "total": 1000
          },
          {
            "qty": 100,
            "total": 1800
          },
          {
            "qty": 200,
            "total": 3400
          },
          {
            "qty": 400,
            "total": 6000
          },
          {
            "qty": 500,
            "total": 7000
          },
          {
            "qty": 1000,
            "total": 12000
          },
          {
            "qty": 2000,
            "total": 20000
          },
          {
            "qty": 3000,
            "total": 24000
          }
        ]
      },
      {
        "label": "Size: A6 Size, Printing Side: Double-Sided",
        "tiers": [
          {
            "qty": 50,
            "total": 1300
          },
          {
            "qty": 100,
            "total": 2400
          },
          {
            "qty": 200,
            "total": 4400
          },
          {
            "qty": 400,
            "total": 8000
          },
          {
            "qty": 500,
            "total": 9000
          },
          {
            "qty": 1000,
            "total": 14000
          },
          {
            "qty": 2000,
            "total": 24000
          },
          {
            "qty": 3000,
            "total": 27000
          }
        ]
      }
    ],
    "options": [
      {
        "name": "Paper Type",
        "choices": [
          {
            "label": "Artpaper 130gsm",
            "add": 0,
            "per": "piece"
          },
          {
            "label": "Artpaper 150gsm",
            "add": 2,
            "per": "piece"
          },
          {
            "label": "Artpaper 170 Gsm",
            "add": 4,
            "per": "piece"
          },
          {
            "label": "Artpaper 200gsm",
            "add": 6,
            "per": "piece"
          }
        ]
      }
    ]
  },
  "posters-printing": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 300,
    "groups": [
      {
        "label": "Material: Art-Paper, Poster size: A3 Size",
        "tiers": [
          {
            "qty": 50,
            "total": 4000
          },
          {
            "qty": 100,
            "total": 6000
          },
          {
            "qty": 200,
            "total": 10500
          },
          {
            "qty": 300,
            "total": 15000
          },
          {
            "qty": 500,
            "total": 22500
          },
          {
            "qty": 1000,
            "total": 30000
          },
          {
            "qty": 2000,
            "total": 35000
          },
          {
            "qty": 5000,
            "total": 75000
          }
        ]
      },
      {
        "label": "Material: Satin PVC, Poster size: A2 Size",
        "tiers": [
          {
            "qty": 1,
            "total": 1200
          },
          {
            "qty": 2,
            "total": 2300
          },
          {
            "qty": 3,
            "total": 3400
          },
          {
            "qty": 4,
            "total": 4500
          },
          {
            "qty": 5,
            "total": 5600
          },
          {
            "qty": 10,
            "total": 10500
          },
          {
            "qty": 20,
            "total": 19000
          }
        ]
      },
      {
        "label": "Material: Satin PVC, Poster size: A1 Size",
        "tiers": [
          {
            "qty": 1,
            "total": 1600
          },
          {
            "qty": 2,
            "total": 3500
          },
          {
            "qty": 3,
            "total": 4600
          },
          {
            "qty": 4,
            "total": 6100
          },
          {
            "qty": 5,
            "total": 7600
          },
          {
            "qty": 10,
            "total": 13000
          },
          {
            "qty": 20,
            "total": 24000
          }
        ]
      },
      {
        "label": "Material: Satin PVC, Poster size: A0 Size",
        "tiers": [
          {
            "qty": 1,
            "total": 2000
          },
          {
            "qty": 2,
            "total": 3900
          },
          {
            "qty": 3,
            "total": 5800
          },
          {
            "qty": 4,
            "total": 7700
          },
          {
            "qty": 5,
            "total": 9600
          },
          {
            "qty": 10,
            "total": 16000
          },
          {
            "qty": 20,
            "total": 29000
          }
        ]
      }
    ]
  },
  "vinyl-sticker-printing": {
    "minQty": 1,
    "maxQty": 20,
    "step": 1,
    "unitKes": 1200,
    "size": {
      "unit": "m",
      "rate": 1200,
      "minW": 1,
      "maxW": 20,
      "minH": 1,
      "maxH": 1.5
    },
    "options": [
      {
        "name": "Cutting",
        "choices": [
          {
            "label": "Die Cutting",
            "add": 450,
            "per": "job"
          }
        ]
      }
    ]
  },
  "reflective-sticker-printing": {
    "minQty": 1,
    "maxQty": 500,
    "step": 1,
    "unitKes": 2500
  },
  "adhesive-label-stickers-printing": {
    "minQty": 300,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 4,
    "size": {
      "unit": "cm",
      "rate": 0.15,
      "minW": 5,
      "maxW": 42,
      "minH": 5,
      "maxH": 30
    },
    "options": [
      {
        "name": "Material",
        "choices": [
          {
            "label": "Tic-tac Paper(Normal)",
            "add": 0,
            "per": "piece"
          },
          {
            "label": "Clear Sticker",
            "add": 10,
            "per": "piece"
          }
        ]
      },
      {
        "name": "Shape",
        "choices": [
          {
            "label": "Rectangular/Square",
            "add": 0,
            "per": "piece"
          },
          {
            "label": "Die-Cutting (Circular, any other shape)",
            "add": 2,
            "per": "piece"
          }
        ]
      }
    ]
  },
  "booklet-magazines-printing": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 200,
    "book": {
      "perPage": false,
      "base": 0,
      "sizes": [
        {
          "name": "A5 Size Artpaper130gsm",
          "bw": 20,
          "color": 20
        },
        {
          "name": "A5 Size Artpaper150gsm",
          "bw": 25,
          "color": 25
        },
        {
          "name": "A4 Size Artpaper130gsm",
          "bw": 25,
          "color": 35
        },
        {
          "name": "A4 Size Artpaper150gsm",
          "bw": 45,
          "color": 45
        }
      ],
      "papers": [],
      "covers": [
        {
          "name": "Artcard 300gsm",
          "price": 70
        },
        {
          "name": "Artcard 250gsm",
          "price": 50
        },
        {
          "name": "Artpaper 200gsm",
          "price": 50
        },
        {
          "name": "Artpaper 170gsm",
          "price": 40
        }
      ],
      "bindings": [
        {
          "name": "Perfect Binding",
          "price": 100
        },
        {
          "name": "Saddle Stitch(Staples)",
          "price": 50
        }
      ],
      "discounts": [
        {
          "min": 1,
          "max": 10,
          "percent": 0
        },
        {
          "min": 11,
          "max": 50,
          "percent": 5
        },
        {
          "min": 51,
          "max": 100,
          "percent": 10
        },
        {
          "min": 101,
          "max": 200,
          "percent": 12
        }
      ]
    }
  },
  "letterheads-printing": {
    "minQty": 50,
    "maxQty": 2000,
    "step": 1,
    "unitKes": 45,
    "groups": [
      {
        "label": "New Group",
        "tiers": [
          {
            "qty": 50,
            "total": 2250
          },
          {
            "qty": 100,
            "total": 4000
          },
          {
            "qty": 200,
            "total": 7000
          },
          {
            "qty": 400,
            "total": 12000
          },
          {
            "qty": 500,
            "total": 14000
          },
          {
            "qty": 1000,
            "total": 25000
          },
          {
            "qty": 2000,
            "total": 40000
          }
        ]
      }
    ]
  },
  "brochure-printing": {
    "minQty": 1,
    "maxQty": 500,
    "step": 1,
    "unitKes": 60
  },
  "receipt-books-printing": {
    "minQty": 4,
    "maxQty": 200,
    "step": 6,
    "unitKes": 650,
    "variations": [
      {
        "price": 1050,
        "attrs": {
          "Booklet Size": "A4 Size",
          "Select Book type": "Duplicate"
        }
      },
      {
        "price": 1250,
        "attrs": {
          "Booklet Size": "A5 Size",
          "Select Book type": "Triplicate"
        }
      },
      {
        "price": 900,
        "attrs": {
          "Booklet Size": "A5 Size",
          "Select Book type": "Duplicate"
        }
      },
      {
        "price": 850,
        "attrs": {
          "Booklet Size": "A6 Size",
          "Select Book type": "Triplicate"
        }
      },
      {
        "price": 650,
        "attrs": {
          "Booklet Size": "A6 Size",
          "Select Book type": "Duplicate"
        }
      }
    ]
  },
  "wedding-cards-printing": {
    "minQty": 20,
    "maxQty": 500,
    "step": 1,
    "unitKes": 140,
    "groups": [
      {
        "label": "Type: Laser Cut, Paper: Silk+Glitters, Finishing: With Ribbon",
        "tiers": [
          {
            "qty": 20,
            "total": 4000
          },
          {
            "qty": 50,
            "total": 9000
          },
          {
            "qty": 100,
            "total": 16000
          },
          {
            "qty": 200,
            "total": 28000
          },
          {
            "qty": 500,
            "total": 65000
          }
        ]
      },
      {
        "label": "Type: Laser Cut, Paper: Silk, Finishing: Without Ribbon",
        "tiers": [
          {
            "qty": 20,
            "total": 3900
          },
          {
            "qty": 50,
            "total": 8800
          },
          {
            "qty": 100,
            "total": 15700
          },
          {
            "qty": 200,
            "total": 27600
          },
          {
            "qty": 500,
            "total": 64000
          }
        ]
      },
      {
        "label": "Type: Di-cut, Paper: Silk, Finishing: With Ribbon",
        "tiers": [
          {
            "qty": 20,
            "total": 2400
          },
          {
            "qty": 50,
            "total": 5500
          },
          {
            "qty": 100,
            "total": 10000
          },
          {
            "qty": 200,
            "total": 18000
          },
          {
            "qty": 500,
            "total": 35000
          }
        ]
      }
    ]
  },
  "spiral-binding-services": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 200,
    "variations": [
      {
        "price": 200,
        "attrs": {
          "Select Size": "A5 Size",
          "Select Cover type": "Coverboard 300gsm"
        }
      },
      {
        "price": 350,
        "attrs": {
          "Select Size": "A5 Size",
          "Select Cover type": "Hard cover"
        }
      },
      {
        "price": 280,
        "attrs": {
          "Select Size": "A4 Size",
          "Select Cover type": "Coverboard 300gsm"
        }
      },
      {
        "price": 450,
        "attrs": {
          "Select Size": "A4 Size",
          "Select Cover type": "Hard cover"
        }
      }
    ]
  },
  "door-frame-banner-printing": {
    "minQty": 1,
    "maxQty": 20,
    "step": 1,
    "unitKes": 8500
  },
  "brochure-stand": {
    "minQty": 1,
    "maxQty": 500,
    "step": 1,
    "unitKes": 15500
  },
  "2026-calendar-printing": {
    "minQty": 1,
    "maxQty": 500,
    "step": 1,
    "unitKes": 60
  },
  "tear-drop-banner-printing": {
    "minQty": 1,
    "maxQty": 500,
    "step": 1,
    "unitKes": 12500
  },
  "adjustable-backdrop-banner-printing": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 27000
  },
  "funeral-programs-printing": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 150,
    "book": {
      "perPage": false,
      "base": 0,
      "sizes": [
        {
          "name": "A4 Size",
          "bw": 45,
          "color": 45
        },
        {
          "name": "A5 Size",
          "bw": 35,
          "color": 35
        }
      ],
      "papers": [
        {
          "name": "Artpaper 150gsm",
          "bw": 0,
          "color": 0
        },
        {
          "name": "Artpaper 170gsm",
          "bw": 5,
          "color": 10
        },
        {
          "name": "Artpaper 200gsm",
          "bw": 10,
          "color": 15
        }
      ],
      "covers": [
        {
          "name": "Artpaper 200gsm",
          "price": 60
        },
        {
          "name": "Artpaper 250gsm",
          "price": 80
        }
      ],
      "bindings": [
        {
          "name": "Saddle Stitch(Staples)",
          "price": 50
        }
      ],
      "discounts": [
        {
          "min": 1,
          "max": 10,
          "percent": 0
        },
        {
          "min": 11,
          "max": 50,
          "percent": 5
        },
        {
          "min": 51,
          "max": 100,
          "percent": 10
        }
      ]
    }
  },
  "custom-flag-printing": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 3600,
    "size": {
      "unit": "m",
      "rate": 3600,
      "minW": 1,
      "maxW": 3,
      "minH": 1,
      "maxH": 2
    }
  },
  "presentation-folders-printing": {
    "minQty": 30,
    "maxQty": 2000,
    "step": 1,
    "unitKes": 180,
    "variations": [
      {
        "price": 180,
        "attrs": {
          "Flaps": "One Side"
        }
      },
      {
        "price": 220,
        "attrs": {
          "Flaps": "Both Sides"
        }
      }
    ]
  },
  "postcards-printing": {
    "minQty": 1,
    "maxQty": 500,
    "step": 1,
    "unitKes": 30,
    "variations": [
      {
        "price": 70,
        "attrs": {
          "Select Size": "A5 Size",
          "Paper": "Ivory Board 300gsm",
          "Lamination": "No Lamination"
        }
      },
      {
        "price": 50,
        "attrs": {
          "Select Size": "A5 Size",
          "Paper": "Artcard 300gsm",
          "Lamination": "Velvet Lamination"
        }
      },
      {
        "price": 40,
        "attrs": {
          "Select Size": "A5 Size",
          "Paper": "Artcard 300gsm",
          "Lamination": "No Lamination"
        }
      },
      {
        "price": 45,
        "attrs": {
          "Select Size": "A5 Size",
          "Paper": "Artcard 300gsm",
          "Lamination": "Matt Lamination"
        }
      },
      {
        "price": 35,
        "attrs": {
          "Select Size": "A6 Size",
          "Paper": "Artcard 300gsm",
          "Lamination": "Velvet Lamination"
        }
      },
      {
        "price": 30,
        "attrs": {
          "Select Size": "A6 Size",
          "Paper": "Artcard 300gsm",
          "Lamination": "Matt Lamination"
        }
      }
    ]
  },
  "telescopic-banners-printing": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 15418,
    "variations": [
      {
        "price": 16711,
        "attrs": {
          "Size": "4.5 Metres"
        }
      },
      {
        "price": 15418,
        "attrs": {
          "Size": "3.5 Metres"
        }
      }
    ]
  },
  "floor-stickers-printing": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 450,
    "variations": [
      {
        "price": 1750,
        "attrs": {
          "Sticker Diameter": "3 Feet (90cm by 90cm)"
        }
      },
      {
        "price": 1250,
        "attrs": {
          "Sticker Diameter": "2 Feet (60cm by 60cm)"
        }
      },
      {
        "price": 450,
        "attrs": {
          "Sticker Diameter": "1 Feet (30cm by 30cm)"
        }
      }
    ]
  },
  "car-stickers-printing-in-kenya": {
    "minQty": 1,
    "maxQty": 1000,
    "step": 1,
    "unitKes": 1260,
    "size": {
      "unit": "in",
      "rate": 35,
      "minW": 6,
      "maxW": 24,
      "minH": 6,
      "maxH": 24
    }
  },
  "branded-mugs": {
    "minQty": 1,
    "maxQty": 250,
    "step": 1,
    "unitKes": 420,
    "groups": [
      {
        "label": "Type: Normal Mug",
        "tiers": [
          {
            "qty": 1,
            "total": 490
          },
          {
            "qty": 2,
            "total": 970
          },
          {
            "qty": 3,
            "total": 1440
          },
          {
            "qty": 4,
            "total": 1900
          },
          {
            "qty": 5,
            "total": 2350
          },
          {
            "qty": 10,
            "total": 4500
          },
          {
            "qty": 20,
            "total": 8800
          },
          {
            "qty": 50,
            "total": 21000
          },
          {
            "qty": 100,
            "total": 40000
          },
          {
            "qty": 250,
            "total": 95000
          }
        ]
      },
      {
        "label": "Type: Magic Mug",
        "tiers": [
          {
            "qty": 1,
            "total": 750
          },
          {
            "qty": 2,
            "total": 1460
          },
          {
            "qty": 3,
            "total": 2010
          },
          {
            "qty": 4,
            "total": 2600
          },
          {
            "qty": 5,
            "total": 3200
          },
          {
            "qty": 10,
            "total": 6300
          },
          {
            "qty": 20,
            "total": 12400
          }
        ]
      },
      {
        "label": "Type: Latte Mug(Cone)",
        "tiers": [
          {
            "qty": 1,
            "total": 850
          },
          {
            "qty": 2,
            "total": 1880
          },
          {
            "qty": 3,
            "total": 2490
          },
          {
            "qty": 4,
            "total": 3280
          },
          {
            "qty": 5,
            "total": 4050
          },
          {
            "qty": 10,
            "total": 8000
          },
          {
            "qty": 20,
            "total": 15800
          }
        ]
      },
      {
        "label": "Type: Two-Tone Mug",
        "tiers": [
          {
            "qty": 1,
            "total": 520
          },
          {
            "qty": 2,
            "total": 1020
          },
          {
            "qty": 3,
            "total": 1500
          },
          {
            "qty": 4,
            "total": 1960
          },
          {
            "qty": 5,
            "total": 2400
          },
          {
            "qty": 10,
            "total": 4700
          },
          {
            "qty": 20,
            "total": 9200
          },
          {
            "qty": 50,
            "total": 22500
          },
          {
            "qty": 100,
            "total": 44000
          },
          {
            "qty": 250,
            "total": 107500
          }
        ]
      },
      {
        "label": "Type: Gold/Silver Ceramic",
        "tiers": [
          {
            "qty": 1,
            "total": 750
          },
          {
            "qty": 2,
            "total": 1460
          },
          {
            "qty": 3,
            "total": 2010
          },
          {
            "qty": 4,
            "total": 2600
          },
          {
            "qty": 5,
            "total": 3200
          },
          {
            "qty": 10,
            "total": 6300
          },
          {
            "qty": 20,
            "total": 12400
          }
        ]
      },
      {
        "label": "Type: Enamel Mug",
        "tiers": [
          {
            "qty": 1,
            "total": 900
          },
          {
            "qty": 2,
            "total": 1780
          },
          {
            "qty": 3,
            "total": 2610
          },
          {
            "qty": 4,
            "total": 3440
          },
          {
            "qty": 5,
            "total": 3200
          },
          {
            "qty": 10,
            "total": 8500
          },
          {
            "qty": 20,
            "total": 16600
          },
          {
            "qty": 50,
            "total": 40000
          }
        ]
      }
    ]
  },
  "reflector-jackets-printing": {
    "minQty": 5,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 380,
    "variations": [
      {
        "price": 380,
        "attrs": {
          "Type": "Without Pockets"
        }
      },
      {
        "price": 750,
        "attrs": {
          "Type": "With Pockets"
        }
      }
    ]
  },
  "nametags": {
    "minQty": 1,
    "maxQty": 500,
    "step": 1,
    "unitKes": 90
  },
  "rigid-sign-boards-printing": {
    "minQty": 1,
    "maxQty": 50,
    "step": 1,
    "unitKes": 1500,
    "size": {
      "unit": "ft",
      "rate": 1500,
      "minW": 1,
      "maxW": 8,
      "minH": 1,
      "maxH": 4
    }
  },
  "umbrella-printing": {
    "minQty": 1,
    "maxQty": 500,
    "step": 1,
    "unitKes": 1800
  },
  "book-printing": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 0,
    "book": {
      "perPage": true,
      "base": 50,
      "sizes": [
        {
          "name": "B5 Size",
          "bw": 3,
          "color": 7
        },
        {
          "name": "A5 Size",
          "bw": 2,
          "color": 4
        },
        {
          "name": "A4 size",
          "bw": 4,
          "color": 8
        },
        {
          "name": "A6 Size",
          "bw": 1,
          "color": 2
        }
      ],
      "papers": [
        {
          "name": "Bond Paper 80gsm",
          "bw": 0,
          "color": 0
        },
        {
          "name": "Artpaper",
          "bw": 8,
          "color": 15
        }
      ],
      "covers": [
        {
          "name": "No Lamination",
          "price": 0
        },
        {
          "name": "Matt Lamination",
          "price": 15
        },
        {
          "name": "Gloss Lamination",
          "price": 15
        }
      ],
      "bindings": [
        {
          "name": "Saddle-Stitch(Staples)",
          "price": 20
        },
        {
          "name": "Perfect Binding",
          "price": 100
        },
        {
          "name": "Case Binding",
          "price": 400
        },
        {
          "name": "Wire Binding",
          "price": 100
        }
      ],
      "discounts": [
        {
          "min": 1,
          "max": 10,
          "percent": 0
        },
        {
          "min": 11,
          "max": 50,
          "percent": 5
        },
        {
          "min": 51,
          "max": 100,
          "percent": 10
        },
        {
          "min": 101,
          "max": 500,
          "percent": 12
        },
        {
          "min": 501,
          "max": 1000,
          "percent": 15
        }
      ]
    }
  },
  "popup-banner-printing": {
    "minQty": 1,
    "maxQty": 500,
    "step": 1,
    "unitKes": 25862
  },
  "notebook-printing": {
    "minQty": 10,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 370,
    "variations": [
      {
        "price": 420,
        "attrs": {
          "Select cover type": "Coverboard 250gsm",
          "Select No. of Pages": "100 Sheets"
        }
      },
      {
        "price": 370,
        "attrs": {
          "Select cover type": "Coverboard 250gsm",
          "Select No. of Pages": "70 Sheets"
        }
      },
      {
        "price": 520,
        "attrs": {
          "Select cover type": "Hard Covers",
          "Select No. of Pages": "100 Sheets"
        }
      },
      {
        "price": 420,
        "attrs": {
          "Select cover type": "Hard Covers",
          "Select No. of Pages": "70 Sheets"
        }
      }
    ]
  },
  "mouse-pads-printing": {
    "minQty": 1,
    "maxQty": 500,
    "step": 1,
    "unitKes": 370
  },
  "branded-jute-bags": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 1250,
    "variations": [
      {
        "price": 1650,
        "attrs": {
          "Printing Sides": "Printed on both sides",
          "Size": "A3 Size"
        }
      },
      {
        "price": 1500,
        "attrs": {
          "Printing Sides": "Printed on 1 side",
          "Size": "A3 Size"
        }
      },
      {
        "price": 1450,
        "attrs": {
          "Printing Sides": "Printed on both sides",
          "Size": "A4 Size"
        }
      },
      {
        "price": 1250,
        "attrs": {
          "Printing Sides": "Printed on 1 side",
          "Size": "A4 Size"
        }
      }
    ]
  },
  "branded-jerseys-for-clubs": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 1492
  },
  "branded-2027-diary": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 1450,
    "variations": [
      {
        "price": 1450,
        "attrs": {
          "Size": "A5 Size"
        }
      },
      {
        "price": 1800,
        "attrs": {
          "Size": "B5 Size"
        }
      },
      {
        "price": 2100,
        "attrs": {
          "Size": "A4 Size"
        }
      }
    ]
  },
  "graphic-design-service": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 500,
    "variations": [
      {
        "price": 800,
        "attrs": {
          "Choose Item": "Flag design"
        }
      },
      {
        "price": 800,
        "attrs": {
          "Choose Item": "Wheel Cover Design"
        }
      },
      {
        "price": 8000,
        "attrs": {
          "Choose Item": "3D Visualization"
        }
      },
      {
        "price": 1000,
        "attrs": {
          "Choose Item": "Wedding Card Design"
        }
      },
      {
        "price": 800,
        "attrs": {
          "Choose Item": "Signage Design"
        }
      },
      {
        "price": 1500,
        "attrs": {
          "Choose Item": "Notebook/Diary Design"
        }
      },
      {
        "price": 800,
        "attrs": {
          "Choose Item": "Postcard Design"
        }
      },
      {
        "price": 500,
        "attrs": {
          "Choose Item": "Mug Design"
        }
      },
      {
        "price": 500,
        "attrs": {
          "Choose Item": "Receipt Book Design"
        }
      },
      {
        "price": 800,
        "attrs": {
          "Choose Item": "T-shirt/Hoodie Design"
        }
      },
      {
        "price": 15000,
        "attrs": {
          "Choose Item": "Book Layout"
        }
      },
      {
        "price": 25000,
        "attrs": {
          "Choose Item": "Magazine Layout"
        }
      },
      {
        "price": 1500,
        "attrs": {
          "Choose Item": "Label Design"
        }
      },
      {
        "price": 1200,
        "attrs": {
          "Choose Item": "Banner Design"
        }
      },
      {
        "price": 800,
        "attrs": {
          "Choose Item": "Business Card Design"
        }
      },
      {
        "price": 3000,
        "attrs": {
          "Choose Item": "Logo Design"
        }
      }
    ]
  },
  "branded-hoodies": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 2700,
    "variations": [
      {
        "price": 3000,
        "attrs": {
          "Size": "XXL"
        }
      },
      {
        "price": 2800,
        "attrs": {
          "Size": "XL"
        }
      },
      {
        "price": 2800,
        "attrs": {
          "Size": "Large"
        }
      },
      {
        "price": 2700,
        "attrs": {
          "Size": "Medium"
        }
      },
      {
        "price": 2700,
        "attrs": {
          "Size": "Small"
        }
      }
    ]
  },
  "3d-signs": {
    "minQty": 1,
    "maxQty": 12,
    "step": 1,
    "unitKes": 16500,
    "size": {
      "unit": "m",
      "rate": 16500,
      "minW": 1,
      "maxW": 8,
      "minH": 0.5,
      "maxH": 1
    }
  },
  "canvas-printing": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 5500,
    "variations": [
      {
        "price": 12500,
        "attrs": {
          "Size": "A0 Size",
          "Material": "Canvas"
        }
      },
      {
        "price": 9500,
        "attrs": {
          "Size": "A1 Size",
          "Material": "Canvas"
        }
      },
      {
        "price": 6500,
        "attrs": {
          "Size": "A2 Size",
          "Material": "Canvas"
        }
      },
      {
        "price": 5500,
        "attrs": {
          "Size": "A3 Size",
          "Material": "Canvas"
        }
      }
    ]
  },
  "architectural-blueprints": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 150,
    "variations": [
      {
        "price": 700,
        "attrs": {
          "Size": "A0 Size"
        }
      },
      {
        "price": 550,
        "attrs": {
          "Size": "A1 Size"
        }
      },
      {
        "price": 350,
        "attrs": {
          "Size": "A2 Size"
        }
      },
      {
        "price": 150,
        "attrs": {
          "Size": "A3 Size"
        }
      }
    ]
  },
  "packaging-boxes": {
    "minQty": 300,
    "maxQty": 1000,
    "step": 1,
    "unitKes": 45
  },
  "branded-aprons": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 900,
    "variations": [
      {
        "price": 1200,
        "attrs": {
          "Artwork": "Full Colour"
        }
      },
      {
        "price": 900,
        "attrs": {
          "Artwork": "1 Colour"
        }
      }
    ]
  },
  "selfie-frames": {
    "minQty": 1,
    "maxQty": 500,
    "step": 1,
    "unitKes": 3500
  },
  "document-printing": {
    "minQty": 1,
    "maxQty": 500,
    "step": 1,
    "unitKes": 50
  },
  "media-wall-banner": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 35000,
    "variations": [
      {
        "price": 58000,
        "attrs": {
          "Size": "3.78m x 2.25m",
          "Material": "Fabric Material"
        }
      },
      {
        "price": 49000,
        "attrs": {
          "Size": "3.78m x 2.25m",
          "Material": "Banner Material"
        }
      },
      {
        "price": 48000,
        "attrs": {
          "Size": "3m x 2.25m",
          "Material": "Fabric Material"
        }
      },
      {
        "price": 45000,
        "attrs": {
          "Size": "3m x 2.25m",
          "Material": "Banner Material"
        }
      },
      {
        "price": 40000,
        "attrs": {
          "Size": "2m x 2m",
          "Material": "Fabric Material"
        }
      },
      {
        "price": 35000,
        "attrs": {
          "Size": "2m x 2m",
          "Material": "Banner Material"
        }
      }
    ]
  },
  "round-neck-plain-t-shirt": {
    "minQty": 1,
    "maxQty": 500,
    "step": 1,
    "unitKes": 480
  },
  "branded-pens": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 80,
    "variations": [
      {
        "price": 450,
        "attrs": {
          "Pen type": "Executive",
          "Artwork type": "Full-Colour"
        }
      },
      {
        "price": 420,
        "attrs": {
          "Pen type": "Executive",
          "Artwork type": "One-colour"
        }
      },
      {
        "price": 450,
        "attrs": {
          "Pen type": "Wooden",
          "Artwork type": "Full-Colour"
        }
      },
      {
        "price": 420,
        "attrs": {
          "Pen type": "Wooden",
          "Artwork type": "One-colour"
        }
      },
      {
        "price": 100,
        "attrs": {
          "Pen type": "Plastic",
          "Artwork type": "Full-Colour"
        }
      },
      {
        "price": 80,
        "attrs": {
          "Pen type": "Plastic",
          "Artwork type": "One-colour"
        }
      }
    ]
  },
  "s-banner-printing": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 34500,
    "variations": [
      {
        "price": 34500,
        "attrs": {
          "Select Size": "85cm x 200cm",
          "Material": "Polyester fabric"
        }
      }
    ]
  },
  "branded-keyholders": {
    "minQty": 5,
    "maxQty": 200,
    "step": 1,
    "unitKes": 450,
    "variations": [
      {
        "price": 480,
        "attrs": {
          "Shape": "Oval",
          "Material": "Metallic"
        }
      },
      {
        "price": 520,
        "attrs": {
          "Shape": "Rectangular",
          "Material": "Wood"
        }
      },
      {
        "price": 450,
        "attrs": {
          "Shape": "Rectangular",
          "Material": "Plastic"
        }
      },
      {
        "price": 450,
        "attrs": {
          "Shape": "Rectangular",
          "Material": "Metallic"
        }
      },
      {
        "price": 450,
        "attrs": {
          "Shape": "Round",
          "Material": "Metallic"
        }
      }
    ]
  },
  "branded-tote-bags": {
    "minQty": 1,
    "maxQty": 500,
    "step": 1,
    "unitKes": 950
  },
  "kitenge-notebooks": {
    "minQty": 1,
    "maxQty": 500,
    "step": 1,
    "unitKes": 650
  },
  "branded-kraft-bags": {
    "minQty": 50,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 150,
    "variations": [
      {
        "price": 250,
        "attrs": {
          "Size": "A3 Size"
        }
      },
      {
        "price": 150,
        "attrs": {
          "Size": "A4 size"
        }
      }
    ]
  },
  "tent-cards-printing": {
    "minQty": 1,
    "maxQty": 500,
    "step": 1,
    "unitKes": 85
  },
  "photo-printing-services": {
    "minQty": 1,
    "maxQty": 500,
    "step": 1,
    "unitKes": 25
  },
  "door-plates": {
    "minQty": 1,
    "maxQty": 500,
    "step": 1,
    "unitKes": 1250
  },
  "branded-long-mousepad": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 650,
    "variations": [
      {
        "price": 850,
        "attrs": {
          "Size": "57cm x 28cm"
        }
      },
      {
        "price": 650,
        "attrs": {
          "Size": "45cm x 20cm"
        }
      }
    ]
  },
  "branded-caps": {
    "minQty": 1,
    "maxQty": 500,
    "step": 1,
    "unitKes": 350
  },
  "l-banner-stand": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 9500
  },
  "spot-uv-business-cards": {
    "minQty": 200,
    "maxQty": 1000,
    "step": 1,
    "unitKes": 55,
    "variations": [
      {
        "price": 55,
        "attrs": {
          "Cornering": "Sharp"
        }
      },
      {
        "price": 65,
        "attrs": {
          "Cornering": "Round"
        }
      }
    ]
  },
  "car-magnets-printing": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 1150,
    "variations": [
      {
        "price": 2000,
        "attrs": {
          "Size": "A3 Size"
        }
      },
      {
        "price": 1150,
        "attrs": {
          "Size": "A4 Size"
        }
      }
    ]
  },
  "table-rollup-printing": {
    "minQty": 1,
    "maxQty": 500,
    "step": 1,
    "unitKes": 3500
  },
  "table-cloth-printing": {
    "minQty": 1,
    "maxQty": 500,
    "step": 1,
    "unitKes": 3600
  },
  "branded-wristbands": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 55,
    "variations": [
      {
        "price": 55,
        "attrs": {
          "Material": "Vinyl"
        }
      },
      {
        "price": 60,
        "attrs": {
          "Material": "Silicone"
        }
      }
    ]
  },
  "gift-voucher-printing": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 60,
    "variations": [
      {
        "price": 60,
        "attrs": {
          "Paper Type": "Artcard 300gsm"
        }
      }
    ]
  },
  "button-badges-printing": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 130,
    "variations": [
      {
        "price": 160,
        "attrs": {
          "Diameter": "58mm"
        }
      },
      {
        "price": 130,
        "attrs": {
          "Diameter": "44mm"
        }
      }
    ]
  },
  "skin-feel-thermal-flask-printing": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 2050
  },
  "thermal-travel-mugs": {
    "minQty": 1,
    "maxQty": 500,
    "step": 1,
    "unitKes": 1300
  },
  "branded-water-bottles": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 850,
    "variations": [
      {
        "price": 950,
        "attrs": {
          "Capacity": "750ml"
        }
      },
      {
        "price": 850,
        "attrs": {
          "Capacity": "600ml"
        }
      }
    ]
  },
  "branded-journals-and-planners": {
    "minQty": 1,
    "maxQty": 5000,
    "step": 1,
    "unitKes": 950
  }
};
