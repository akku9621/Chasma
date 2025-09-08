
import React, { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';

const ProductModal = ({ product, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('Overview');

  if (!isOpen || !product) return null;

  const tabs = ['Overview', 'Specs', 'Features'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              Experience cutting-edge eyewear technology with our premium collection. 
              Designed for the modern individual who demands both style and performance.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Brand:</span>
                <span className="text-white ml-2">VisionX</span>
              </div>
              <div>
                <span className="text-gray-400">Model:</span>
                <span className="text-white ml-2">{product.name}</span>
              </div>
              <div>
                <span className="text-gray-400">Category:</span>
                <span className="text-white ml-2">{product.category || 'Premium Eyewear'}</span>
              </div>
              <div>
                <span className="text-gray-400">Availability:</span>
                <span className="text-green-400 ml-2">In Stock</span>
              </div>
            </div>
          </div>
        );
      case 'Specs':
        return (
          <div className="space-y-4">
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400">Frame Material</span>
                <span className="text-white">Titanium Alloy</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400">Lens Type</span>
                <span className="text-white">Anti-Reflective HD</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400">UV Protection</span>
                <span className="text-white">100% UV400</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400">Weight</span>
                <span className="text-white">28g</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400">Dimensions</span>
                <span className="text-white">145mm x 52mm</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400">Water Resistance</span>
                <span className="text-white">IPX6</span>
              </div>
            </div>
          </div>
        );
      case 'Features':
        return (
          <div className="space-y-4">
            <ul className="space-y-3 text-gray-300 text-sm sm:text-base">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Advanced anti-fog coating for crystal clear vision</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Photochromic lenses adapt to lighting conditions</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Ergonomic design for all-day comfort</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Scratch-resistant and impact-proof construction</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Adjustable nose pads and temple tips</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                <span>Premium microfiber cleaning cloth included</span>
              </li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl mx-4 bg-gray-900 bg-opacity-95 backdrop-blur-md rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-gray-800 bg-opacity-80 hover:bg-opacity-100 rounded-lg transition-all group"
        >
          <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
        </button>

        <div className="flex flex-col lg:flex-row">
          {/* Product Image */}
          <div className="lg:w-1/2 p-8 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="relative">
              <img
                src={product.image || "/api/placeholder/400/300"}
                alt={product.name}
                className="w-full h-80 object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2 p-8 space-y-6">
            {/* Product Title */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {product.name || 'Stylish female'}
              </h2>
              <p className="text-gray-400 text-sm">
                {product.category || 'female'}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-cyan-400">
                ${product.price || '1200'}
              </span>
              <span className="text-xl text-gray-500 line-through">
                ${product.originalPrice || '1500'}
              </span>
              <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full font-medium">
                20% OFF
              </span>
            </div>

            {/* Tabs */}
            <div className="space-y-4">
              <div className="flex bg-gray-800 bg-opacity-50 rounded-xl p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all ${
                      activeTab === tab
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700 hover:bg-opacity-50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[200px] p-4 bg-gray-800 bg-opacity-30 rounded-xl">
                <p className="text-gray-400 text-sm mb-4">{product.category || 'female'}</p>
                {renderTabContent()}
              </div>
            </div>

            {/* Order Button */}
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-green-600/25">
              <MessageCircle className="w-5 h-5" />
              <span>Order via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;