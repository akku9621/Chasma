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
          <div className="space-y-2 text-xs sm:text-sm">
            <p className="text-gray-300 leading-relaxed">
              Experience cutting-edge eyewear technology with our premium collection.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-400">Brand:</span>{' '}
                <span className="text-white ml-1">Jyoti Chashma</span>
              </div>
              <div>
                <span className="text-gray-400">Model:</span>{' '}
                <span className="text-white ml-1">{product.name}</span>
              </div>
              <div>
                <span className="text-gray-400">Category:</span>{' '}
                <span className="text-white ml-1">
                  {product.category || 'Premium Eyewear'}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Availability:</span>{' '}
                <span className="text-green-400 ml-1">In Stock</span>
              </div>
            </div>
          </div>
        );
      case 'Specs':
        return (
          <div className="grid gap-1 text-xs sm:text-sm">
            {[
              ['Frame', 'Titanium Alloy'],
              ['Lens', 'Anti-Reflective'],
              ['UV', '100% UV400'],
              ['Weight', '28g'],
            ].map(([label, value], idx) => (
              <div
                key={idx}
                className="flex justify-between border-b border-gray-700 py-1"
              >
                <span className="text-gray-400">{label}</span>
                <span className="text-white">{value}</span>
              </div>
            ))}
          </div>
        );
      case 'Features':
        return (
          <ul className="space-y-1 text-gray-300 text-xs sm:text-sm">
            {[
              'Anti-fog coating',
              'Photochromic lenses',
              'Ergonomic design',
              'Scratch-resistant',
            ].map((feature, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-1"></div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm sm:max-w-lg bg-gray-900 bg-opacity-95 backdrop-blur-md 
        rounded-2xl border border-gray-700 shadow-2xl overflow-hidden mx-3 mt-[10vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>

        <div className="flex flex-col p-4 space-y-3">
          {/* Product Image */}
          <div className="flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070"
              alt={product.name}
              className="w-full max-h-48 object-contain rounded-lg bg-gray-800"
            />
          </div>

          {/* Product Info */}
          <h2 className="text-lg font-bold text-white truncate">{product.name}</h2>
          <p className="text-sm text-gray-400 truncate">
            {product.category || 'Eyewear'}
          </p>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-cyan-400">
              ${product.price || '1200'}
            </span>
            <span className="text-sm text-gray-500 line-through">
              ${product.originalPrice || '1500'}
            </span>
          </div>

          {/* Tabs */}
          <div>
            <div className="flex bg-gray-800 rounded-lg p-1 mb-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 text-xs px-2 py-1 rounded-md ${
                    activeTab === tab
                      ? 'bg-cyan-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="bg-gray-800 bg-opacity-40 rounded-lg p-2">
              {renderTabContent()}
            </div>
          </div>

          {/* Order Button */}
          <button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg flex items-center justify-center space-x-1">
            <MessageCircle className="w-4 h-4" />
            <span>Order via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;