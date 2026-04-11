"use client";
import { useState } from "react";
import {
  RiShieldCheckLine,
  RiCloseLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiFullscreenLine,
} from "react-icons/ri";

export default function PropertyGallery({ photos, trust }) {
  const [lightbox, setLightbox] = useState(null);

  function open(i) {
    setLightbox(i);
  }
  function close() {
    setLightbox(null);
  }
  function prev() {
    setLightbox((i) => (i - 1 + photos.length) % photos.length);
  }
  function next() {
    setLightbox((i) => (i + 1) % photos.length);
  }

  function onKey(e) {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
    if (e.key === "Escape") close();
  }

  if (photos.length === 0) {
    return (
      <div className="h-64 bg-gradient-to-br from-gray-700 to-gray-500 rounded-2xl flex items-center justify-center relative">
        <span
          className={`absolute top-4 left-4 px-3 py-1.5 text-sm font-bold rounded-xl ${trust.badgeClass}`}
        >
          <RiShieldCheckLine className="inline mr-1" />
          {trust.label}
        </span>
        <p className="text-white/50 text-sm">No photos uploaded</p>
      </div>
    );
  }

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Cover — always full width */}
        <div
          className="col-span-2 h-72 rounded-2xl overflow-hidden relative cursor-pointer group bg-gray-200"
          onClick={() => open(0)}
        >
          <img
            src={photos[0].url}
            alt="Cover"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
            <RiFullscreenLine className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span
            className={`absolute top-4 left-4 px-3 py-1.5 text-sm font-bold rounded-xl ${trust.badgeClass}`}
          >
            <RiShieldCheckLine className="inline mr-1" />
            {trust.label}
          </span>
          {photos.length > 1 && (
            <span className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
              1 / {photos.length}
            </span>
          )}
        </div>

        {/* Thumbnails — only render if photo exists */}
        {photos.slice(1, 4).map((photo, i) => {
          const idx = i + 1;
          const isLast = idx === 3 && photos.length > 4;
          return (
            <div
              key={idx}
              className="h-36 rounded-xl overflow-hidden relative cursor-pointer group bg-gray-200"
              onClick={() => open(idx)}
            >
              <img
                src={photo.url}
                alt={`Photo ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {isLast && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    +{photos.length - 4}
                  </span>
                </div>
              )}
              {!isLast && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={close}
          onKeyDown={onKey}
          tabIndex={0}
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-10"
          >
            <RiCloseLine className="text-xl" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-4 py-1.5 rounded-full backdrop-blur-sm">
            {lightbox + 1} / {photos.length}
          </div>

          {/* Prev */}
          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-10"
            >
              <RiArrowLeftSLine className="text-2xl" />
            </button>
          )}

          {/* Image */}
          <div
            className="max-w-5xl max-h-[85vh] mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[lightbox].url}
              alt={`Photo ${lightbox + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
          </div>

          {/* Next */}
          {photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors z-10"
            >
              <RiArrowRightSLine className="text-2xl" />
            </button>
          )}

          {/* Thumbnails strip */}
          {photos.length > 1 && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] pb-1"
              onClick={(e) => e.stopPropagation()}
            >
              {photos.map((ph, i) => (
                <div
                  key={i}
                  onClick={() => setLightbox(i)}
                  className={`w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${i === lightbox ? "border-white" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <img
                    src={ph.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
