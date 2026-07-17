import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../contexts/AppContext.jsx';
import { ProductCard } from '../components/ProductCard.jsx';
import { ArrowRight, Star, Compass, Sparkles, ShieldCheck, Gem } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORY_IMAGE_PRESETS = {
  'Kitchen & Dining': {
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600',
    desc: 'Fine Ceramics, Sleek Servers & Cookware'
  },
  'Textiles & Rugs': {
    image: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=600',
    desc: 'Woven Cushions, Luxury Blankets & Carpets'
  },
  'Artisanal Decor': {
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600',
    desc: 'Vases, Brass Accents & Wall Scapes'
  },
  'Fine Lighting': {
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600',
    desc: 'Sconces, Warm Lamps & Ambient Pendants'
  },
  'Premium Bedding': {
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=600',
    desc: 'Silk Sheets & Breathable Quilts'
  },
  'Luxe Accessories': {
    image: 'https://images.unsplash.com/photo-1603006905553-29a39cae3130?auto=format&fit=crop&q=80&w=600',
    desc: 'Therapeutic Diffusers & Scented Oils'
  }
};

const DEFAULT_CATEGORY_PRESET = {
  image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600',
  desc: 'Curated home designs for modern spaces'
};

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200',
    tagline: 'Luxe Living & Modern Spaces',
    title: 'ELEVATE YOUR HOUSEHOLD SANCTUM',
    subtitle: 'Curated furniture, modern ceramics, and masterwork lighting crafted for contemporary environments.',
    buttonText: 'Explore Collection',
    link: '/shop'
  },
  {
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=1200',
    tagline: 'Premium Kitchen & Dining',
    title: 'DESIGNED FOR HANDSOME HOSTING',
    subtitle: 'Sleek stoneware bowls, solid copper servers, and bespoke kitchen collectibles built for beautiful meals.',
    buttonText: 'Shop Dining',
    link: '/shop'
  },
  {
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1200',
    tagline: 'Sensory Bedding & Linens',
    title: 'PURE COMFORT & COTTON RETREATS',
    subtitle: 'Indulge in breathable woven sheets, weighted pure wool blankets, and absolute bedroom calm.',
    buttonText: 'Browse Bedding',
    link: '/shop'
  }
];

const TESTIMONIALS = [
  {
    name: 'Princess Gayatri Sen',
    role: 'Traditional Art Patron',
    rating: 5,
    comment: 'The Kundan jewelry set literally looks like a royal museum heirloom. The enameled Meenakari detailing at the back is so dense and authentic. Absolutely outstanding service.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'
  },
  {
    name: 'Karan Malhotra',
    role: 'Collector, Singapore',
    rating: 5,
    comment: 'Buying handcrafted Indian handicrafts online can be hit-or-miss, but Heritage Treasures is premium. The dual copper patina on the Ganesha Idol is spectacular. Very well packaged.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150'
  },
  {
    name: 'Vasundhara Sharma',
    role: 'Bride-To-Be, Delhi',
    rating: 5,
    comment: 'Ordered my bridal Banarasi pure Saree here. The gold zari work is extremely fine and soft. It drapes like a dream! Standard authentic luxury!',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a131fed10495?auto=format&fit=crop&q=80&w=150'
  }
];

export const Home = () => {
  const { products, categories, disabledCategories } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeCategories = (categories || []).filter(c => !(disabledCategories || []).includes(c));

  // Auto slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const trendingProducts = products.filter((p) => p.isTrending).slice(0, 4);

  return (
    <div className="flex flex-col gap-16 md:gap-24 overflow-hidden">
      
      {/* 1. Hero Image Slider */}
      <section className="relative h-[70vh] sm:h-[80vh] md:h-[85vh] bg-stone-900 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {/* Slide Image overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/60 to-stone-950/20 z-10" />
            <img
              src={HERO_SLIDES[currentSlide].image}
              alt=""
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center opacity-85"
            />

            {/* Slide Content */}
            <div className="absolute inset-0 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-start mt-8">
              <motion.span
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xs sm:text-sm font-semibold tracking-widest text-gold-400 uppercase mb-3.5 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {HERO_SLIDES[currentSlide].tagline}
              </motion.span>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-wide max-w-3xl leading-tight mb-5"
              >
                {HERO_SLIDES[currentSlide].title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-stone-300 text-sm sm:text-base md:text-lg max-w-xl mb-9 leading-relaxed"
              >
                {HERO_SLIDES[currentSlide].subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  to={HERO_SLIDES[currentSlide].link}
                  className="px-8 py-3.5 bg-gold-500 hover:bg-gold-600 active:scale-95 text-stone-950 font-bold tracking-wider rounded-xl hover:shadow-lg transition-all flex items-center gap-2.5 cursor-pointer"
                >
                  {HERO_SLIDES[currentSlide].buttonText}
                  <ArrowRight className="w-4.5 h-4.5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 right-6 z-20 flex gap-2.5">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-3.5 h-3.5 rounded-full border-2 border-gold-400 bg-transparent cursor-pointer transition-all ${
                i === currentSlide ? 'bg-gold-500 w-8' : 'opacity-55'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2. Core Value Accents / Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 px-6 bg-white dark:bg-stone-900 border border-stone-150/50 dark:border-stone-850 rounded-2xl shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gold-100 dark:bg-stone-800 text-gold-700 rounded-xl">
              <Gem className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-semibold text-stone-955 dark:text-stone-100 mb-1">Authentic Craftsmanship</h3>
              <p className="text-xs text-stone-500">Every design traces directly to native GI-certified Indian weavers and craft-masters.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gold-100 dark:bg-stone-800 text-gold-700 rounded-xl">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-semibold text-stone-955 dark:text-stone-100 mb-1">Preserving Legacy</h3>
              <p className="text-xs text-stone-500">10% of every sale aids development foundations across Jaipur, Kashi, and Mysore villages.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gold-100 dark:bg-stone-800 text-gold-700 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-semibold text-stone-955 dark:text-stone-100 mb-1">Secure Heritage Travel</h3>
              <p className="text-xs text-stone-500">Insured luxury travel boxes, ensuring antiquities arrive in absolute perfect condition.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category Roundels Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3.5 mb-11">
          <span className="text-[11px] font-bold tracking-widest text-gold-600 dark:text-gold-400 uppercase">
            Browse Our Sanctum
          </span>
          <h2 className="font-serif text-3.5xl md:text-4.5xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
            Treasures by Category
          </h2>
          <div className="w-16 h-1 bg-gold-450 mx-auto rounded-full mt-2" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          {activeCategories.slice(0, 8).map((cat, index) => {
            const preset = CATEGORY_IMAGE_PRESETS[cat] || DEFAULT_CATEGORY_PRESET;
            return (
              <Link
                to={`/shop?category=${encodeURIComponent(cat.id)}`}
                key={index}
                className="group relative h-80 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow bg-stone-100 flex flex-col justify-end p-5"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/20 to-transparent z-10" />
                <img
                  src={preset.image}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="relative z-20 space-y-1">
                  <h3 className="font-sans text-base font-bold text-white tracking-wide capitalize">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-amber-200 font-semibold leading-tight">
                    {preset.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Featured Collections */}
      <section className="bg-stone-950 text-white py-20 border-y border-gold-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
            <div className="space-y-3">
              <span className="text-[11px] font-bold tracking-widest text-gold-400 uppercase">
                Curated Heirloom Collectibles
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-wide">
                The Heritage Spotlight
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs font-bold text-gold-400 hover:text-gold-200 transition-colors uppercase tracking-wider flex items-center gap-1"
            >
              Examine Complete Bazaar
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Legacy Banner Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[21/9] bg-stone-905 bg-stone-950 flex items-center p-8 sm:p-14 md:p-20 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/70 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1200"
            alt=""
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-60 object-left-bottom"
          />
          <div className="relative z-20 max-w-lg space-y-4">
            <span className="text-[11px] font-semibold text-gold-400 uppercase tracking-widest block">
              The Sovereign Heritage Series
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold leading-tight text-white">
              The Weavers Guild of Holy Kashi
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Every gold thread used in our signature sarees is hand-rolled by seventh-generation artisans. Discover classical patterns preserved inside ancient Jaipur royal scrolls, remade for modern drapes.
            </p>
            <div className="pt-2">
              <Link
                to="/shop?category=Textiles"
                className="px-6 py-2.5 bg-maroon-600 hover:bg-maroon-705 bg-maroon-700 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition-colors inline-block"
              >
                Learn Sovereign Weave
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Trending Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3.5 mb-11">
          <span className="text-[11px] font-bold tracking-widest text-gold-600 uppercase">
            Modern Demands
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100">
            Trending Masterpieces
          </h2>
          <div className="w-16 h-0.5 bg-maroon-500 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="bg-stone-100 dark:bg-stone-900/40 py-20 border-y border-stone-150 dark:border-stone-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3.5 mb-11">
            <span className="text-[11px] font-bold tracking-widest text-gold-600 uppercase">
              Collector Vocals
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-stone-900 dark:text-stone-100">
              Patron Testimonials
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
              Real responses and appreciation notes from fine art collectors and design standard enthusiasts around the world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="p-8 bg-white dark:bg-stone-900 border border-stone-150/45 dark:border-stone-850 rounded-2xl flex flex-col justify-between shadow-sm relative"
              >
                {/* quote mark */}
                <span className="absolute top-4 right-6 text-6xl text-gold-500/20 font-serif font-bold pointer-events-none select-none">
                  “
                </span>
                
                <p className="text-stone-605 text-stone-600 dark:text-stone-300 text-sm leading-relaxed mb-6 italic">
                  "{t.comment}"
                </p>

                <div className="flex items-center gap-4 border-t border-stone-105 dark:border-stone-800 pt-4 mt-auto">
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-stone-100 border border-stone-200">
                    <img src={t.avatar} alt={t.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
                      {t.name}
                    </h4>
                    <p className="text-[10px] text-gold-600 font-semibold uppercase tracking-wider mt-0.5">
                      {t.role}
                    </p>
                    <div className="flex text-amber-400 mt-1">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
