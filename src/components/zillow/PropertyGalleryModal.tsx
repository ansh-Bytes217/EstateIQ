import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, Map, Layers } from "lucide-react";
import { Property } from "../../types";

interface PropertyGalleryModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
  initialTab?: "photos" | "floorplan";
}

export const PropertyGalleryModal: React.FC<PropertyGalleryModalProps> = ({
  property,
  isOpen,
  onClose,
  initialIndex = 0,
  initialTab = "photos",
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [activeTab, setActiveTab] = useState<"photos" | "floorplan">(initialTab);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setActiveTab(initialTab);
  }, [initialIndex, initialTab, isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev + 1) % property.images.length);
      }
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, property.images.length]);

  if (!isOpen) return null;

  const images = property.images;

  return (
    <div className="fixed inset-0 z-[700] bg-black/95 flex flex-col justify-between text-white animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 sm:px-8 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("photos")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === "photos" ? "bg-white text-slate-900" : "text-white/70 hover:text-white"
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5" /> Photos ({images.length})
            </button>
            <button
              onClick={() => setActiveTab("floorplan")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === "floorplan" ? "bg-white text-slate-900" : "text-white/70 hover:text-white"
              }`}
            >
              <Layers className="h-3.5 w-3.5" /> Floor Plan
            </button>
          </div>
          <span className="text-xs text-white/50 hidden sm:inline">• {property.title}</span>
        </div>

        <button
          onClick={onClose}
          className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 relative flex items-center justify-center p-4 sm:p-8 overflow-hidden">
        {activeTab === "photos" ? (
          <>
            <img
              src={images[currentIndex]}
              alt={`Property photo ${currentIndex + 1}`}
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl transition-all duration-300"
            />

            {/* Left / Right Nav Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition border border-white/20"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
                  className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition border border-white/20"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 rounded-full text-xs font-mono text-white/80 border border-white/10">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center max-w-3xl w-full p-4">
            {property.floorPlanImage ? (
              <img
                src={property.floorPlanImage}
                alt="Architectural Floor Plan"
                className="max-h-[70vh] object-contain rounded-2xl border border-white/20 shadow-2xl"
              />
            ) : (
              <div className="text-center p-12 bg-white/5 rounded-2xl border border-white/10">
                <Layers className="h-12 w-12 mx-auto text-white/40 mb-3" />
                <h4 className="text-lg font-bold">Floor Plan Being Digitized</h4>
                <p className="text-xs text-white/60 mt-1 max-w-sm">
                  The listing agent is currently updating architectural schematics. Inquire directly for CAD layouts.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Thumbnail Strip (Photos mode only) */}
      {activeTab === "photos" && (
        <div className="p-4 border-t border-white/10 flex justify-center gap-3 overflow-x-auto shrink-0 bg-black/60">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-16 w-24 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                currentIndex === i ? "border-emerald-400 scale-105" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt={`Thumb ${i}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
