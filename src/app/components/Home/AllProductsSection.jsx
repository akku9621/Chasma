import React, { useEffect, useRef } from "react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { Star, ShoppingBag, Eye } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AllProductsSection({ 
  products, 
  onProductClick, 
  title, 
  subtitle,
  showAutoScroll = true 
}) {
  const scrollRef = useRef(null);
  const { t } = useTranslation(); 

  useEffect(() => {
    if (!showAutoScroll || !scrollRef.current) return;

    const scrollContainer = scrollRef.current;
    let scrollSpeed = 1;
    let scrollDirection = 1;
    let animationId;
    let isPaused = false;

    const autoScroll = () => {
      if (!isPaused && scrollContainer) {
        scrollContainer.scrollLeft += scrollSpeed * scrollDirection;
        
        // Reverse direction when reaching edges
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
          scrollDirection = -1;
        } else if (scrollContainer.scrollLeft <= 0) {
          scrollDirection = 1;
        }
      }
      animationId = requestAnimationFrame(autoScroll);
    };

    const handleMouseEnter = () => {
      isPaused = true;
    };

    const handleMouseLeave = () => {
      isPaused = false;
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    autoScroll();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
        scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [showAutoScroll, products]);

  if (!products.length) return null;

  return (
    <section>
      {title && (
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 text-glow">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-gray-300">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div 
        ref={scrollRef}
        className={`flex gap-6 ${showAutoScroll ? 'overflow-hidden' : 'overflow-x-auto'} pb-4`}
        style={{ scrollBehavior: 'smooth' }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-80 glass-effect rounded-2xl overflow-hidden glow-effect group cursor-pointer hover:scale-105 transition-all duration-500"
            onClick={() => onProductClick(product)}
          >
            <div className="relative h-64">
              <img
                src={product.image_urls?.[0] || "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=2070"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent"></div>
              
              {/* Featured Badge */}
              {product.featured && (
                <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-none glow-effect">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  {t("featured")}
                </Badge>
              )}

              {/* Stock Status */}
              {!product.in_stock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    {t("out_of_stock")}
                  </Badge>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors text-glow">
                  {product.name}
                </h3>
              </div>

              <p className="text-gray-300 mb-4 leading-relaxed line-clamp-2">
                {product.description}
              </p>

              {/* Features */}
              {product.features && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.features.slice(0, 2).map((feature, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="glass-effect text-cyan-400 border-cyan-400/30 text-xs"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Price */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-cyan-400">
                    ${product.price}
                  </span>
                  {product.original_price && (
                    <span className="text-lg text-gray-400 line-through">
                      ${product.original_price}
                    </span>
                  )}
                </div>
                {product.original_price && (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                    {t("save")} ${(product.original_price - product.price).toFixed(0)}
                  </Badge>
                )}
              </div>

              {/* Action Button */}
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-xl glow-effect group-hover:animate-pulse"
                disabled={!product.in_stock}
                onClick={(e) => {
                  e.stopPropagation();
                  onProductClick(product);
                }}
              >
                <Eye className="w-5 h-5 mr-2" />
                  {t("view_details")}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {showAutoScroll && (
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            {t("hover_message")}
          </p>
        </div>
      )}
    </section>
  );
}