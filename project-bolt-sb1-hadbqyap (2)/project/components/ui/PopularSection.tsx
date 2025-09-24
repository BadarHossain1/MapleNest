'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

const popularSearchesData = {
  sale: {
    Toronto: {
      apartments: [
        'Apartments for sale in Toronto',
        'Apartments for sale in Downtown Toronto',
        'Apartments for sale in Yorkville',
        'Apartments for sale in Toronto Marina',
        'Apartments for sale in Business Bay Toronto'
      ],
      villas: [
        'Villas for sale in Toronto',
        'Villas for sale in The Beaches',
        'Villas for sale in Toronto Hills Estate',
        'Villas for sale in High Park (Roncesvalles by TRIDEL)',
        'Villas for sale in Distillery District'
      ],
      other: [
        'Properties for sale in Toronto',
        'Townhouses for sale in Toronto',
        'Penthouses for sale in Toronto',
        'Hotel Apartments for sale in Toronto',
        'Residential Plots for sale in Toronto'
      ]
    },
    Vancouver: {
      apartments: [
        'Apartments for sale in Vancouver',
        'Apartments for sale in Downtown Vancouver',
        'Apartments for sale in Coal Harbour',
        'Apartments for sale in Vancouver Marina',
        'Apartments for sale in Yaletown'
      ],
      villas: [
        'Villas for sale in Vancouver',
        'Villas for sale in West Vancouver',
        'Villas for sale in Vancouver Hills Estate',
        'Villas for sale in Kitsilano (Aqua by Concord Pacific)',
        'Villas for sale in Richmond'
      ],
      other: [
        'Properties for sale in Vancouver',
        'Townhouses for sale in Vancouver',
        'Penthouses for sale in Vancouver',
        'Hotel Apartments for sale in Vancouver',
        'Residential Plots for sale in Vancouver'
      ]
    },
    Montreal: {
      apartments: [
        'Apartments for sale in Montreal',
        'Apartments for sale in Downtown Montreal',
        'Apartments for sale in Old Montreal',
        'Apartments for sale in Plateau',
        'Apartments for sale in Griffintown'
      ],
      villas: [
        'Villas for sale in Montreal',
        'Villas for sale in Westmount',
        'Villas for sale in Montreal Hills Estate',
        'Villas for sale in NDG (Notre-Dame-de-Grâce)',
        'Villas for sale in Mount Royal'
      ],
      other: [
        'Properties for sale in Montreal',
        'Townhouses for sale in Montreal',
        'Penthouses for sale in Montreal',
        'Hotel Apartments for sale in Montreal',
        'Residential Plots for sale in Montreal'
      ]
    }
  },
  offPlan: {
    Toronto: {
      apartments: [
        'Off Plan Apartments in Toronto',
        'Off Plan Apartments in Yorkville',
        'Off Plan Apartments in Business Bay Toronto',
        'Off Plan Apartments in Distillery District',
        'Off Plan Apartments in Toronto Land Residence Complex'
      ],
      villas: [
        'Off Plan Villas in Toronto',
        'Off Plan Villas in High Park (Roncesvalles by TRIDEL)',
        'Off Plan Villas in The Beaches',
        'Off Plan Villas in The Annex',
        'Off Plan Villas in Liberty Village'
      ],
      other: [
        'Off Plan Properties in Toronto',
        'Off Plan Townhouses in Toronto',
        'Off Plan Penthouses in Toronto',
        'Off Plan Commercial Properties in Toronto',
        'Off Plan Townhouses in The Junction by Daniels'
      ]
    },
    Vancouver: {
      apartments: [
        'Off Plan Apartments in Vancouver',
        'Off Plan Apartments in Coal Harbour',
        'Off Plan Apartments in Yaletown',
        'Off Plan Apartments in Richmond',
        'Off Plan Apartments in Vancouver Land Residence Complex'
      ],
      villas: [
        'Off Plan Villas in Vancouver',
        'Off Plan Villas in Kitsilano (Aqua by Concord Pacific)',
        'Off Plan Villas in West Vancouver',
        'Off Plan Villas in North Shore',
        'Off Plan Villas in Burnaby Heights'
      ],
      other: [
        'Off Plan Properties in Vancouver',
        'Off Plan Townhouses in Vancouver',
        'Off Plan Penthouses in Vancouver',
        'Off Plan Commercial Properties in Vancouver',
        'Off Plan Townhouses in Surrey by Polygon'
      ]
    },
    Montreal: {
      apartments: [
        'Off Plan Apartments in Montreal',
        'Off Plan Apartments in Griffintown',
        'Off Plan Apartments in Old Montreal',
        'Off Plan Apartments in Plateau',
        'Off Plan Apartments in Montreal Land Residence Complex'
      ],
      villas: [
        'Off Plan Villas in Montreal',
        'Off Plan Villas in NDG (Notre-Dame-de-Grâce)',
        'Off Plan Villas in Westmount',
        'Off Plan Villas in Mount Royal',
        'Off Plan Villas in Laval'
      ],
      other: [
        'Off Plan Properties in Montreal',
        'Off Plan Townhouses in Montreal',
        'Off Plan Penthouses in Montreal',
        'Off Plan Commercial Properties in Montreal',
        'Off Plan Townhouses in Brossard by DevMcGill'
      ]
    }
  }
};

export function PopularSection() {
  const [activeTab, setActiveTab] = useState<'sale' | 'rent'>('sale');
  const [activeCity, setActiveCity] = useState('Toronto');
  const [showMoreSale, setShowMoreSale] = useState(false);
  const [showMoreOffPlan, setShowMoreOffPlan] = useState(false);

  const cities = ['Toronto', 'Vancouver', 'Montreal'];

  // For rent, we'll use the same structure but change the wording
  const getRentData = (cityData: any) => {
    return {
      apartments: cityData.apartments.map((item: string) => item.replace('for sale', 'for rent')),
      villas: cityData.villas.map((item: string) => item.replace('for sale', 'for rent')),
      other: cityData.other.map((item: string) => item.replace('for sale', 'for rent'))
    };
  };

  const currentSaleData = popularSearchesData.sale[activeCity];
  const currentRentData = getRentData(currentSaleData);
  const currentOffPlanData = popularSearchesData.offPlan[activeCity];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Popular Real Estate Searches
          </h2>

          {/* Sale/Rent Tabs */}
          <div className="flex justify-center mb-6">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('sale')}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${
                  activeTab === 'sale'
                    ? 'bg-green-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sale
              </button>
              <button
                onClick={() => setActiveTab('rent')}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${
                  activeTab === 'rent'
                    ? 'bg-green-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Rent
              </button>
            </div>
          </div>

          {/* City Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setActiveCity(city)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCity === city
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          {/* All Sale/Rent Section */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              All {activeTab === 'sale' ? 'Sale' : 'Rent'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                  APARTMENTS
                </h4>
                <div className="space-y-2">
                  {(activeTab === 'sale' ? currentSaleData.apartments : currentRentData.apartments)
                    .slice(0, showMoreSale ? undefined : 5)
                    .map((item, index) => (
                    <Link
                      key={index}
                      href={`/${activeTab}`}
                      className="block text-blue-600 hover:text-blue-800 text-sm py-1 transition-colors"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                  VILLAS
                </h4>
                <div className="space-y-2">
                  {(activeTab === 'sale' ? currentSaleData.villas : currentRentData.villas)
                    .slice(0, showMoreSale ? undefined : 5)
                    .map((item, index) => (
                    <Link
                      key={index}
                      href={`/${activeTab}`}
                      className="block text-blue-600 hover:text-blue-800 text-sm py-1 transition-colors"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                  OTHER PROPERTIES
                </h4>
                <div className="space-y-2">
                  {(activeTab === 'sale' ? currentSaleData.other : currentRentData.other)
                    .slice(0, showMoreSale ? undefined : 5)
                    .map((item, index) => (
                    <Link
                      key={index}
                      href={`/${activeTab}`}
                      className="block text-blue-600 hover:text-blue-800 text-sm py-1 transition-colors"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() => setShowMoreSale(!showMoreSale)}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 mx-auto transition-colors"
              >
                View More
                <ChevronDown className={`h-4 w-4 transition-transform ${showMoreSale ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* Off Plan Section (only show for sale) */}
          {activeTab === 'sale' && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Off Plan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                    APARTMENTS
                  </h4>
                  <div className="space-y-2">
                    {currentOffPlanData.apartments
                      .slice(0, showMoreOffPlan ? undefined : 5)
                      .map((item, index) => (
                      <Link
                        key={index}
                        href="/new-projects"
                        className="block text-blue-600 hover:text-blue-800 text-sm py-1 transition-colors"
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                    VILLAS
                  </h4>
                  <div className="space-y-2">
                    {currentOffPlanData.villas
                      .slice(0, showMoreOffPlan ? undefined : 5)
                      .map((item, index) => (
                      <Link
                        key={index}
                        href="/new-projects"
                        className="block text-blue-600 hover:text-blue-800 text-sm py-1 transition-colors"
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                    OTHER PROPERTIES
                  </h4>
                  <div className="space-y-2">
                    {currentOffPlanData.other
                      .slice(0, showMoreOffPlan ? undefined : 5)
                      .map((item, index) => (
                      <Link
                        key={index}
                        href="/new-projects"
                        className="block text-blue-600 hover:text-blue-800 text-sm py-1 transition-colors"
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-center mt-6">
                <button
                  onClick={() => setShowMoreOffPlan(!showMoreOffPlan)}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 mx-auto transition-colors"
                >
                  View More
                  <ChevronDown className={`h-4 w-4 transition-transform ${showMoreOffPlan ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}