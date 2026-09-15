import React from "react";
import { Hero } from "../features/home/components/Hero";
import { FeaturedProperties } from "../features/home/components/FeaturedProperties";
import { PopularLocations } from "../features/home/components/PopularLocations";
import { PropertyTypes } from "../features/home/components/PropertyTypes";
import { NewConstruction } from "../features/home/components/NewConstruction";
import { MarketIntelligencePreview } from "../features/home/components/MarketIntelligencePreview";
import { WhyEstateIQ } from "../features/home/components/WhyEstateIQ";
import { HomeCTA } from "../features/home/components/HomeCTA";

export const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Hero />
      <FeaturedProperties />
      <PopularLocations />
      <PropertyTypes />
      <NewConstruction />
      <MarketIntelligencePreview />
      <WhyEstateIQ />
      <HomeCTA />
    </div>
  );
};

