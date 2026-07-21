const seedCategories = async (prisma) => {
  const categories = [
    {
      name: "Men",
      slug: "men",
      description: "Fashion and accessories for men",
    },
    {
      name: "Women",
      slug: "women",
      description: "Fashion and accessories for women",
    },
    {
      name: "Kids",
      slug: "kids",
      description: "Clothing and accessories for kids",
    },
    {
      name: "Footwear",
      slug: "footwear",
      description: "Shoes, sandals and sneakers",
    },
    {
      name: "Accessories",
      slug: "accessories",
      description: "Bags, belts, watches and more",
    },
    {
      name: "Sports",
      slug: "sports",
      description: "Sportswear and fitness products",
    },
    {
      name: "Electronics",
      slug: "electronics",
      description: "Gadgets and electronic accessories",
    },
    {
      name: "Beauty",
      slug: "beauty",
      description: "Beauty and personal care products",
    },
    {
      name: "Home & Living",
      slug: "home-living",
      description: "Furniture, decor and home essentials",
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {},
      create: category,
    });
  }

  console.log("✅ Categories seeded");
};

module.exports = seedCategories;
