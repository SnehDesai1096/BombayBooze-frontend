import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { useApp } from '../context/AppProvider';

export default function ProductCard({ product }) {
  const { addToCart } = useApp();
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  React.useEffect(() => {
    setImgError(false);
  }, [product.image]);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!product.inStock && product.quantityInStock === 0) return;
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 900);
  };

  const displayPrice = typeof product.price === 'number' 
    ? product.price.toFixed(2) 
    : parseFloat(product.price || 0).toFixed(2);

  const isPlaceholder = imgError || !product.image || product.image.includes('image-unavailable.svg') || !product.hasImage;
  const imageSrc = isPlaceholder ? '/placeholder/image-unavailable.svg' : product.image;

  return (
    <div className={`glass-panel product-card ${!product.inStock ? 'is-out-of-stock' : ''}`}>
      <div className={`product-card-image-container ${isPlaceholder ? 'has-placeholder' : ''}`}>
        <img 
          src={imageSrc} 
          alt={product.name} 
          className={`product-card-image ${isPlaceholder ? 'placeholder-img' : ''}`}
          onError={() => {
            setImgError(true);
          }}
          loading="lazy"
        />
        
        <div className="product-card-badges">
          <div className="product-card-category-badge">
            {product.category || product.categoryName || 'Spirit'}
          </div>
          {product.abv != null && (
            <div className="product-card-abv-badge">
              {product.abv}% ABV
            </div>
          )}
        </div>

        {!product.inStock && product.quantityInStock === 0 && (
          <div className="product-card-soldout-overlay">
            <span>Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="product-card-body">
        {product.brand && (
          <span className="product-card-brand">{product.brand}</span>
        )}
        
        <div className="product-card-header">
          <h3 className="product-card-title" title={product.name}>{product.name}</h3>
        </div>
        
        <p className="product-card-desc">
          <span className="product-volume-tag">{product.volume || '750ml'}</span>
          {product.description ? ` • ${product.description.substring(0, 50)}${product.description.length > 50 ? '...' : ''}` : ''}
        </p>
        
        <div className="product-card-footer">
          <div className="product-card-price-block">
            <span className="product-price-label">Price</span>
            <div className="product-card-price">
              ₹{displayPrice}
            </div>
          </div>

          <button 
            className={`btn-primary product-card-add-btn ${justAdded ? 'added' : ''}`}
            onClick={handleAddToCart}
            disabled={!product.inStock && product.quantityInStock === 0}
            title={product.inStock ? "Add to Cart" : "Out of stock"}
            aria-label={`Add ${product.name} to cart`}
          >
            {justAdded ? <Check size={18} /> : <Plus size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
