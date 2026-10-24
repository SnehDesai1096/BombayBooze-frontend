import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  PackageX,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Clock,
  Truck,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import catalogService from '../services/catalogService';

// Hero promotional slides inspired by Linz & Cupshe
const HERO_SLIDES = [
  {
    id: 1,
    tagline: 'Save Big. Savor More.',
    title: 'UP TO 20% OFF ALL SINGLE MALTS',
    subtitle: 'From the Scottish Highlands to Japan’s finest distilleries. Aged to perfection, delivered chilled to your doorstep.',
    ctaText: 'SAVE NOW',
    badge: 'LIMITED TIME OFFER',
    categoryTarget: 'Whisky',
  },
  {
    id: 2,
    tagline: 'Artisanal Elegance',
    title: 'BOTANICAL GINS & VODKAS',
    subtitle: 'Crisp botanicals, London dry classics, and triple-distilled luxury vodkas ready for your signature cocktails tonight.',
    ctaText: 'EXPLORE SPIRITS',
    badge: 'TRENDING IN MUMBAI',
    categoryTarget: 'Gin',
  },
  {
    id: 3,
    tagline: 'Weekend Cellar Reserve',
    title: 'FINE WINES & CRAFT BEERS',
    subtitle: 'Bordeaux reds, crisp Napa Chardonnays, and ice-cold microbrews delivered in under 30 minutes.',
    ctaText: 'SHOP WINE & BEER',
    badge: 'EXPRESS CHILLED',
    categoryTarget: 'Wine',
  },
  {
    id: 4,
    tagline: 'Mumbai Nightlife Curated',
    title: 'TEQUILAS & SPICED RUMS',
    subtitle: '100% Blue Agave tequilas and aged Caribbean rums for unforgettable celebrations with friends.',
    ctaText: 'DISCOVER TEQUILA',
    badge: 'TOP SHELF',
    categoryTarget: 'Tequila',
  },
];

// Prestigious brand partners marquee (inspired by Linz brand bar)
const BRAND_PARTNERS = [
  { name: "THE MACALLAN", subtitle: "Highland Single Malt" },
  { name: "JOHNNIE WALKER", subtitle: "Blended Scotch" },
  { name: "GLENFIDDICH", subtitle: "Dufftown, Speyside" },
  { name: "GREY GOOSE", subtitle: "French Wheat Vodka" },
  { name: "BOMBAY SAPPHIRE", subtitle: "Vapour Infused Gin" },
  { name: "AMRUT", subtitle: "Indian Single Malt" },
  { name: "JAMESON", subtitle: "Triple Distilled Irish" },
  { name: "CHÂTEAU MARGAUX", subtitle: "Premier Grand Cru" },
  { name: "HENNESSY", subtitle: "Maison Fondee 1765" },
  { name: "CORONA EXTRA", subtitle: "Cerveza Especial" },
];

export default function Home() {
  // State for Categories
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null); // null means "All"

  // State for Products
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pageSize: 24, totalPages: 1 });

  // Hero carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);

  // Marquee scroll ref
  const brandTickerRef = useRef(null);
  const catalogSectionRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 1. Fetch categories on mount (using GET /api/categories)
  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      setLoadingCategories(true);
      try {
        const catList = await catalogService.getCategories();
        if (isMounted) {
          setCategories(catList);
        }
      } catch (err) {
        console.error("Error loading categories:", err);
      } finally {
        if (isMounted) setLoadingCategories(false);
      }
    }
    loadCategories();
    return () => { isMounted = false; };
  }, []);

  // 2. Fetch products whenever category, search, or stock filter changes
  // Uses GET /api/categories/{id}/products or GET /api/products
  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      setLoadingProducts(true);
      try {
        let result;
        if (selectedCategory && !debouncedSearch) {
          // Use the dedicated category API: GET /api/categories/{category_id}/products
          result = await catalogService.getCategoryProducts(selectedCategory.categoryId, {
            inStockOnly,
            page: 1,
            pageSize: 30,
          });
        } else {
          // Use GET /api/products with optional search query & category filter
          result = await catalogService.getProducts({
            categoryId: selectedCategory ? selectedCategory.categoryId : null,
            q: debouncedSearch,
            inStockOnly,
            page: 1,
            pageSize: 30,
          });
        }

        if (isMounted) {
          setProducts(result.items || []);
          setPagination({
            total: result.total || (result.items || []).length,
            page: result.page || 1,
            pageSize: result.pageSize || 30,
            totalPages: result.totalPages || 1,
          });
        }
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        if (isMounted) setLoadingProducts(false);
      }
    }

    loadProducts();
    return () => { isMounted = false; };
  }, [selectedCategory, debouncedSearch, inStockOnly]);

  // Hero carousel auto-timer
  useEffect(() => {
    if (isCarouselHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isCarouselHovered]);

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const scrollToCatalog = () => {
    if (catalogSectionRef.current) {
      catalogSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    scrollToCatalog();
  };

  const handleHeroCta = (slide) => {
    if (slide.categoryTarget && categories.length > 0) {
      const targetCat = categories.find(c =>
        c.name.toLowerCase() === slide.categoryTarget.toLowerCase()
      );
      if (targetCat) {
        setSelectedCategory(targetCat);
      }
    }
    scrollToCatalog();
  };

  const scrollBrands = (direction) => {
    if (brandTickerRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      brandTickerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const activeSlideData = HERO_SLIDES[currentSlide];

  return (
    <div className="home-page-container animate-fade-in">
      {/* 1. TOP NOTICE / PROMO BAR (Cupshe style top ribbon) */}
      <div className="promo-ribbon">
        <div className="container promo-ribbon-content">
          <span className="promo-ribbon-tag">⚡ EXPRESS 30-MIN MUMBAI DROP</span>
          <span className="promo-ribbon-text">FREE DELIVERY ON ORDERS OVER ₹1,999 • CHILLED & AUTHENTIC SPIRITS</span>
          <span className="promo-ribbon-age">21+ LEGAL AGE VERIFIED</span>
        </div>
      </div>

      <div className="container">
        {/* 2. HERO CAROUSEL BANNER (Linz & Cupshe Style) */}
        <section
          className="luxury-hero-section"
          onMouseEnter={() => setIsCarouselHovered(true)}
          onMouseLeave={() => setIsCarouselHovered(false)}
          aria-label="Promotions Carousel"
        >
          <div className="hero-bg-art">
            <div className="hero-gradient-overlay" />
          </div>

          <div className="hero-carousel-content">
            <div className="hero-badge-pill">
              <Sparkles size={14} className="hero-badge-icon" />
              <span>{activeSlideData.badge}</span>
            </div>

            <p className="hero-slide-tagline">{activeSlideData.tagline}</p>
            <h1 className="hero-slide-title">{activeSlideData.title}</h1>
            <p className="hero-slide-subtitle">{activeSlideData.subtitle}</p>

            <div className="hero-cta-wrapper">
              <button
                className="btn-primary hero-cta-btn"
                onClick={() => handleHeroCta(activeSlideData)}
              >
                <span>{activeSlideData.ctaText}</span>
                <ArrowRight size={18} />
              </button>

              <button
                className="btn-secondary hero-browse-btn"
                onClick={scrollToCatalog}
              >
                Browse All Drinks
              </button>
            </div>
          </div>

          {/* Carousel Arrows */}
          <button
            className="hero-arrow-btn prev"
            onClick={handlePrevSlide}
            aria-label="Previous Slide"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            className="hero-arrow-btn next"
            onClick={handleNextSlide}
            aria-label="Next Slide"
          >
            <ChevronRight size={22} />
          </button>

          {/* Carousel Dots Indicators (Linz style) */}
          <div className="hero-dots-container">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                className={`hero-dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>

        {/* 3. PRESTIGE BRAND PARTNERS MARQUEE BAR (Linz Brand Ribbon style) */}
        <section className="brand-ticker-section" aria-label="Featured Brands">
          <button
            className="brand-ticker-arrow left"
            onClick={() => scrollBrands('left')}
            aria-label="Scroll brands left"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="brand-ticker-track" ref={brandTickerRef}>
            {BRAND_PARTNERS.map((brand, i) => (
              <div key={i} className="brand-ticker-item">
                <span className="brand-ticker-name">{brand.name}</span>
                <span className="brand-ticker-sub">{brand.subtitle}</span>
              </div>
            ))}
          </div>

          <button
            className="brand-ticker-arrow right"
            onClick={() => scrollBrands('right')}
            aria-label="Scroll brands right"
          >
            <ChevronRight size={18} />
          </button>
        </section>

        {/* 4. SHOP BY CATEGORY SECTION (Cupshe Screenshot Style) */}
        {/* <section className="shop-by-category-section" aria-labelledby="category-heading">
          <div className="section-header-centered">
            <h2 id="category-heading" className="section-title-large">
              SHOP BY CATEGORY
            </h2>
            <div className="section-title-accent-bar" />
            <p className="section-title-desc">
              Explore our curated selection from world-renowned distilleries, breweries, and vineyards.
            </p>
          </div>

          {loadingCategories ? (
            <div className="category-cards-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="category-card-skeleton animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="category-cards-grid">
              {categories.map((cat) => {
                const isSelected = selectedCategory?.categoryId === cat.categoryId;
                return (
                  <div
                    key={cat.categoryId}
                    className={`category-showcase-card ${isSelected ? 'active-card' : ''}`}
                    onClick={() => handleSelectCategory(cat)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSelectCategory(cat); }}
                  >
                    <div className="category-card-media">
                      <img 
                        src={cat.image || '/placeholder/image-unavailable.svg'} 
                        alt={cat.name} 
                        className="category-card-img"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/placeholder/image-unavailable.svg';
                        }}
                      />
                      <div className="category-card-overlay" />
                    </div>

                    <div className="category-card-content">
                      <div className="category-card-badge-row">
                        {cat.badge && (
                          <span className="category-mini-badge">{cat.badge}</span>
                        )}
                        <span className="category-count-badge">
                          {cat.productCount} {cat.productCount === 1 ? 'Product' : 'Products'}
                        </span>
                      </div>

                      <h3 className="category-card-name">{cat.name}</h3>
                      <p className="category-card-tagline">{cat.tagline}</p>

                      <div className="category-card-cta">
                        <span>Shop {cat.name}</span>
                        <ArrowRight size={16} className="category-arrow-icon" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section> */}

        {/* 5. LIVE PRODUCTS CATALOG SECTION (Using 2 new APIs) */}
        <section
          id="product-catalog"
          ref={catalogSectionRef}
          className="products-catalog-section"
        >
          {/* Header & Category Filter Bar */}
          <div className="catalog-toolbar glass-panel">
            <div className="catalog-toolbar-left">
              <h2 className="catalog-heading">
                {selectedCategory ? `${selectedCategory.name} Collection` : 'All Curated Spirits'}
              </h2>
              <span className="catalog-count-pill">
                {pagination.total} Available
              </span>
            </div>

            {/* Quick Search inside catalog */}
            <div className="catalog-search-wrapper">
              <Search size={18} className="catalog-search-icon" />
              <input
                type="text"
                placeholder="Search spirits, malts, brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field catalog-search-input"
                aria-label="Search products"
              />
              {searchTerm && (
                <button
                  className="catalog-search-clear"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* In-Stock Only filter switch */}
            <div className="catalog-stock-filter">
              <label className="stock-switch-label">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="stock-checkbox"
                />
                <span className="stock-label-text">In-Stock Only</span>
              </label>
            </div>
          </div>

          {/* Category Horizontal Filter Pills */}
          <div className="category-filter-pills-row">
            <button
              className={`catalog-pill ${selectedCategory === null ? 'active' : ''}`}
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.categoryId}
                className={`catalog-pill ${selectedCategory?.categoryId === cat.categoryId ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.name}
                <span className="pill-badge">{cat.productCount}</span>
              </button>
            ))}
          </div>

          {/* Product Grid Area */}
          {loadingProducts ? (
            <div className="product-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="glass-panel product-card-skeleton animate-pulse">
                  <div className="skeleton-img" />
                  <div className="skeleton-content">
                    <div className="skeleton-line-sm" />
                    <div className="skeleton-line-lg" />
                    <div className="skeleton-line-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="glass-panel empty-products-card">
              <PackageX size={48} className="empty-products-icon" />
              <h3 className="empty-products-title">No spirits found</h3>
              <p className="empty-products-text">
                {searchTerm
                  ? `No results matching "${searchTerm}". Try checking your spelling or searching by category.`
                  : "No products currently available under this selection."
                }
              </p>
              <button
                className="btn-secondary empty-reset-btn"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                  setInStockOnly(false);
                }}
              >
                <RotateCcw size={16} />
                Reset All Filters
              </button>
            </div>
          )}
        </section>

        {/* 6. TRUST & CONVENIENCE VALUE PROPOSITIONS (Linz & Cupshe footer features) */}
        <section className="features-banner glass-panel">
          <div className="feature-item">
            <div className="feature-icon-wrapper">
              <Clock size={24} color="var(--accent)" />
            </div>
            <div className="feature-text">
              <h4 className="feature-title">30-Min Rapid Delivery</h4>
              <p className="feature-desc">Ice-cold drop across Mumbai straight from local licensed vaults.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-wrapper">
              <ShieldCheck size={24} color="var(--accent)" />
            </div>
            <div className="feature-text">
              <h4 className="feature-title">100% Genuine Spirits</h4>
              <p className="feature-desc">Every bottle authenticated with state excise security holograms.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-wrapper">
              <Truck size={24} color="var(--accent)" />
            </div>
            <div className="feature-text">
              <h4 className="feature-title">Climate Controlled</h4>
              <p className="feature-desc">Insulated packaging preserves aroma, vintage, and effervescence.</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon-wrapper">
              <CheckCircle2 size={24} color="var(--accent)" />
            </div>
            <div className="feature-text">
              <h4 className="feature-title">21+ Verified & Legal</h4>
              <p className="feature-desc">Strict compliance with Maharashtra state excise & delivery laws.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
