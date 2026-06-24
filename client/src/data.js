export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Royal Kundan Peacock Necklace Set',
    description: 'An exquisite piece of royalty, handcrafted by master artisans in Rajasthan. This ornate necklace features intricate peacock motifs detailed with pure hand-enameled Meenakari work, embedded with pristine Kundan stones and fringed with delicate emerald pearls. The set includes a matching pair of drop jhumka earrings.',
    category: 'Jewelry',
    price: 18500,
    discountPrice: 15999,
    rating: 4.9,
    material: '22K Gold Plated Brass, Kundan Stones, Emerald Pearls',
    style: 'Heritage Royal',
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=600'
    ],
    inventory: 8,
    reviews: [
      {
        id: 'rev-1',
        userName: 'Priya Sharma',
        rating: 5,
        comment: 'Absolutely stunning! The packaging was luxurious and the craftsmanship is jaw-dropping. Wore it for my sister’s wedding and received dozens of compliments.',
        date: '2026-05-12'
      },
      {
        id: 'rev-2',
        userName: 'Anjali Desai',
        rating: 4,
        comment: 'Very beautiful piece, feels solid and heavy. The pearls are perfectly aligned. Shipping was accurate.',
        date: '2026-06-01'
      }
    ]
  },
  {
    id: 'prod-2',
    name: 'Handcrafted Pastel Meenakari Jhumkas',
    description: 'These whimsical jhumkas marry heritage color palettes with contemporary pastel charm. Styled in classic Rajasthani hoop-drop silhouette, they boast hand-applied glass enameling (Meenakari) in dusty pink and turquoise tones, with miniature seed beads outlining the bell drop.',
    category: 'Jewelry',
    price: 3400,
    discountPrice: 2890,
    rating: 4.8,
    material: 'Sterling Silver Base, Glass Enameling, Seed Beads',
    style: 'Traditional Elegant',
    isFeatured: true,
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1630012431606-c86ef07bcabf?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=600'
    ],
    inventory: 24,
    reviews: [
      {
        id: 'rev-3',
        userName: 'Meera Nair',
        rating: 5,
        comment: 'The pastel colors are so modern yet ethnic. Lightweight and comfortable to wear all day long.',
        date: '2026-05-20'
      }
    ]
  },
  {
    id: 'prod-3',
    name: 'Kashi Crimson Banarasi Silk Saree',
    description: 'A masterpiece from Kashi (Varanasi). Crafted on handlooms over 4 weeks using pure mulberry silk, this magnificent Crimson Red saree features rich, dense brocade (zari) weaving. The border features the majestic paisley-vine (Kalga) motifs woven in genuine gold-plated silver threads.',
    category: 'Textiles',
    price: 24500,
    discountPrice: 21000,
    rating: 5.0,
    material: 'Pure Mulberry Katan Silk, Gold Zari Weaving',
    style: 'Banarasi Classic',
    isFeatured: true,
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&q=80&w=600'
    ],
    inventory: 3,
    reviews: [
      {
        id: 'rev-4',
        userName: 'Devika Krishnan',
        rating: 5,
        comment: 'This is a piece of art! The pure silk weight is perfect, and the gold zari shimmer is incredibly premium. Well worth every rupee.',
        date: '2026-04-18'
      }
    ]
  },
  {
    id: 'prod-4',
    name: 'Kashmiri Embroidered Pure Pashmina Shawl',
    description: 'Woven from premium fine pashmina fleece from Ladakh, this ivory shawl is adorned with the intricate Sozni hand embroidery around the borders. Sumptuous, highly insulating, and incredibly light, it drapes in an unmatched fluid silhouette.',
    category: 'Textiles',
    price: 15500,
    discountPrice: 13500,
    rating: 4.7,
    material: '100% Pure Ladakhi Pashmina, Sozni Needle Work',
    style: 'Kashmiri Classic',
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=600'
    ],
    inventory: 5,
    reviews: [
      {
        id: 'rev-5',
        userName: 'Savitri Iyer',
        rating: 4,
        comment: 'Warm and featherweight. The hand needlework is detailed and authentic.',
        date: '2026-03-10'
      }
    ]
  },
  {
    id: 'prod-5',
    name: 'Antique Ganesha Brass Murti',
    description: 'A heavy caste brass figure of Lord Ganesha, completed in a gorgeous dual-tone forest-green copper patina and antique golden highlight. Hand-polished to expose the delicate expressions representing knowledge and auspicious beginnings.',
    category: 'Handicrafts',
    price: 6800,
    discountPrice: 5900,
    rating: 4.9,
    material: 'Pure Cast Brass, Antique Bronze Finishing',
    style: 'Divine Traditional',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1608914611417-3bf7918a3ec3?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&q=80&w=600'
    ],
    inventory: 12,
    reviews: [
      {
        id: 'rev-6',
        userName: 'Ramesh Patel',
        rating: 5,
        comment: 'Very heavy and detailed. Placed it in our home temple, looks magnificent. The dual green-brass finish is phenomenal.',
        date: '2026-06-05'
      }
    ]
  },
  {
    id: 'prod-6',
    name: 'Royale Brass Floating Urli Bowl',
    description: 'Traditional South Indian Urli bowl, ideal for floating flowers, petals, and standard tealight candles. Crafted in heavy-gauge brass, it features beautifully hand-hammered scallops along the circumference and sturdy floral handles.',
    category: 'Handicrafts',
    price: 4200,
    discountPrice: 3499,
    rating: 4.6,
    material: 'Premium Brass',
    style: 'Traditional Decor',
    isBestSeller: true,
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600'
    ],
    inventory: 15,
    reviews: [
      {
        id: 'rev-7',
        userName: 'Sumi Das',
        rating: 4,
        comment: 'Perfect urli for our entrance. Easy to clean and doesn’t tarnish quickly.',
        date: '2026-05-30'
      }
    ]
  },
  {
    id: 'prod-7',
    name: 'Royal Heritage Temple Anklets & Bangles set',
    description: 'Add a touch of divine elegance to your bridal attire with these gold-plated temple jewelry bangles. Sculpted with traditional temple motifs of Goddess Lakshmi flanked by floral vines, embellished with synthetic ruby cabochons.',
    category: 'Jewelry',
    price: 4800,
    discountPrice: 3999,
    rating: 4.8,
    material: 'Brass alloy, 22K Golden Microplating, Ruby Stones',
    style: 'Temple Heritage',
    isTrending: true,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600'
    ],
    inventory: 2,
    reviews: []
  },
  {
    id: 'prod-8',
    name: 'Pure Sandalwood Essential Oil & Incense Set',
    description: 'A luxurious wellness kit encapsulating the sacred scent of Indian forests. Contains 10ml of therapeutic-grade Mysore Sandalwood essential oil, a small hand-carved floral soapstone diffuser, and 20 handcrafted premium sandalwood incense cones.',
    category: 'Lifestyle',
    price: 2500,
    discountPrice: 1999,
    rating: 4.9,
    material: 'Natural Mysore Sandalwood Extract, Soapstone Diffuser',
    style: 'Aromatic Vedic',
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1603006905553-29a39cae3130?auto=format&fit=crop&q=80&w=600'
    ],
    inventory: 40,
    reviews: [
      {
        id: 'rev-8',
        userName: 'Vikram Joshi',
        rating: 5,
        comment: 'An incredibly soothing therapeutic scent. The diffuser is beautiful and handmade, a work of rustic art!',
        date: '2026-06-15'
      }
    ]
  }
];

export const INITIAL_COUPONS = [
  {
    code: 'FESTIVE15',
    type: 'percentage',
    value: 15,
    minOrder: 5000,
    active: true,
    description: '15% Off on orders above ₹5000'
  },
  {
    code: 'WELCOME1000',
    type: 'fixed',
    value: 1000,
    minOrder: 10000,
    active: true,
    description: 'Flat ₹1000 Off on orders above ₹10000'
  },
  {
    code: 'GOLDENHOUR',
    type: 'percentage',
    value: 10,
    active: true,
    description: '10% Off on all authentic heritage items'
  }
];
