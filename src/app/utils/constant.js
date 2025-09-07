export const CATEGORIES = [
    {
      id: 1,
      name: "Gaming Goggles",
      description: "High-performance eyewear designed for competitive gaming with blue light protection",
      image_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070",
      color: "purple"
    },
    {
      id: 2,
      name: "Sports Vision",
      description: "Impact-resistant goggles for outdoor sports and extreme activities",
      image_url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=2070",
      color: "cyan"
    },
    {
      id: 3,
      name: "Smart Glasses",
      description: "Augmented reality glasses with built-in displays and connectivity",
      image_url: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=2070",
      color: "blue"
    },
    {
      id: 4,
      name: "Night Vision",
      description: "Advanced low-light enhancement for tactical and security applications",
      image_url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=2070",
      color: "green"
    },
    {
      id: 5,
      name: "Medical Grade",
      description: "Precision eyewear for medical professionals and laboratory work",
      image_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2070",
      color: "teal"
    },
    {
      id: 6,
      name: "VR Headsets",
      description: "Immersive virtual reality experiences with crystal clear displays",
      image_url: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=2070",
      color: "indigo"
    }
  ];

export const PRODUCTS = [
    {
      id: 1,
      name: "VisionX Pro Gaming",
      description: "Ultimate gaming goggles with advanced blue light filtering and anti-glare technology for extended gaming sessions.",
      price: 299.99,
      original_price: 349.99,
      image_urls: [
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070",
        "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=2070"
      ],
      category_id: 1,
      featured: true,
      in_stock: true,
      features: ["Blue Light Filter", "Anti-Glare", "Adjustable Fit", "HD Display"]
    },
    {
      id: 2,
      name: "SportShield Elite",
      description: "Professional-grade sports goggles with impact resistance and UV protection for outdoor athletes.",
      price: 199.99,
      original_price: 249.99,
      image_urls: [
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=2070"
      ],
      category_id: 2,
      featured: true,
      in_stock: true,
      features: ["UV Protection", "Impact Resistant", "Lightweight", "Fog-Free"]
    },
    {
      id: 3,
      name: "SmartView AR",
      description: "Next-generation augmented reality glasses with voice control and gesture recognition.",
      price: 799.99,
      original_price: 899.99,
      image_urls: [
        "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=2070"
      ],
      category_id: 3,
      featured: true,
      in_stock: false,
      features: ["AR Display", "Voice Control", "Gesture Recognition", "5G Ready"]
    },
    {
      id: 4,
      name: "NightHawk Tactical",
      description: "Military-grade night vision goggles with infrared capability and rugged construction.",
      price: 1299.99,
      image_urls: [
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=2070"
      ],
      category_id: 4,
      featured: false,
      in_stock: true,
      features: ["Night Vision", "Infrared", "Waterproof", "Military Grade"]
    },
    {
      id: 5,
      name: "MediScope Pro",
      description: "Precision medical eyewear with magnification and sterile coating for healthcare professionals.",
      price: 449.99,
      image_urls: [
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2070"
      ],
      category_id: 5,
      featured: false,
      in_stock: true,
      features: ["Magnification", "Sterile Coating", "Ergonomic", "Anti-Bacterial"]
    },
    {
      id: 6,
      name: "VR Universe Headset",
      description: "Immersive VR experience with 4K displays and spatial audio for the ultimate virtual reality.",
      price: 599.99,
      original_price: 699.99,
      image_urls: [
        "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=2070"
      ],
      category_id: 6,
      featured: true,
      in_stock: true,
      features: ["4K Display", "Spatial Audio", "Hand Tracking", "Wireless"]
    },
    {
      id: 7,
      name: "CyberGlasses X1",
      description: "Futuristic cyberpunk-style glasses with LED accents and customizable display colors.",
      price: 399.99,
      image_urls: [
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=2080"
      ],
      category_id: 1,
      featured: false,
      in_stock: true,
      features: ["LED Accents", "Customizable Colors", "Bluetooth", "RGB Lighting"]
    },
    {
      id: 8,
      name: "AquaVision Swim",
      description: "Waterproof swimming goggles with anti-fog coating and UV protection for pool and open water.",
      price: 89.99,
      original_price: 119.99,
      image_urls: [
        "https://images.unsplash.com/photo-1544966503-7cc5ac882d5c?q=80&w=2070"
      ],
      category_id: 2,
      featured: false,
      in_stock: true,
      features: ["Waterproof", "Anti-Fog", "UV Protection", "Comfortable Seal"]
    },
    {
      id: 9,
      name: "HoloLens Pro Max",
      description: "Professional holographic display glasses for architects, engineers, and designers.",
      price: 2499.99,
      image_urls: [
        "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=2070"
      ],
      category_id: 3,
      featured: true,
      in_stock: true,
      features: ["Holographic Display", "Hand Tracking", "Eye Tracking", "Spatial Mapping"]
    },
    {
      id: 10,
      name: "Stealth Ops NVG",
      description: "Compact night vision goggles with digital zoom and recording capabilities for surveillance.",
      price: 899.99,
      image_urls: [
        "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=2070"
      ],
      category_id: 4,
      featured: false,
      in_stock: false,
      features: ["Digital Zoom", "Recording", "Compact Design", "Long Battery"]
    }
  ];

export const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: "VisionX Pro Gaming",
    description: "Ultimate gaming goggles with advanced blue light filtering and anti-glare technology for extended gaming sessions.",
    price: 299.99,
    original_price: 349.99,
    image_urls: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070",
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=2070"
    ],
    category_id: 1,
    featured: true,
    in_stock: true,
    features: ["Blue Light Filter", "Anti-Glare", "Adjustable Fit", "HD Display"]
  },
  {
    id: 2,
    name: "SportShield Elite",
    description: "Professional-grade sports goggles with impact resistance and UV protection for outdoor athletes.",
    price: 199.99,
    original_price: 249.99,
    image_urls: [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=2070"
    ],
    category_id: 2,
    featured: true,
    in_stock: true,
    features: ["UV Protection", "Impact Resistant", "Lightweight", "Fog-Free"]
  },
  {
    id: 3,
    name: "SmartView AR",
    description: "Next-generation augmented reality glasses with voice control and gesture recognition.",
    price: 799.99,
    original_price: 899.99,
    image_urls: [
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=2070"
    ],
    category_id: 3,
    featured: true,
    in_stock: false,
    features: ["AR Display", "Voice Control", "Gesture Recognition", "5G Ready"]
  },
  {
    id: 4,
    name: "NightHawk Tactical",
    description: "Military-grade night vision goggles with infrared capability and rugged construction.",
    price: 1299.99,
    image_urls: [
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=2070"
    ],
    category_id: 4,
    featured: true,
    in_stock: true,
    features: ["Night Vision", "Infrared", "Waterproof", "Military Grade"]
  },
  {
    id: 5,
    name: "MediScope Pro",
    description: "Precision medical eyewear with magnification and sterile coating for healthcare professionals.",
    price: 449.99,
    image_urls: [
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2070"
    ],
    category_id: 5,
    featured: true,
    in_stock: true,
    features: ["Magnification", "Sterile Coating", "Ergonomic", "Anti-Bacterial"]
  },
]