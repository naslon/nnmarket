"use client";

import { useState, useRef } from "react";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [aberto, setAberto] = useState(false);
  const [indice, setIndice] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [arrastandoAtivo, setArrastandoAtivo] = useState(false);

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const arrastando = useRef(false);
  const posInicial = useRef({ x: 0, y: 0 });
  const ultimoToque = useRef(0);

  function abrirGaleria(i: number) {
    setIndice(i);
    setZoom(false);
    setPos({ x: 0, y: 0 });
    setAberto(true);
  }

  function fechar() {
    setAberto(false);
    setZoom(false);
    setPos({ x: 0, y: 0 });
  }

  function proxima() {
    setZoom(false);
    setPos({ x: 0, y: 0 });
    setIndice((prev) => (prev + 1) % images.length);
  }

  function anterior() {
    setZoom(false);
    setPos({ x: 0, y: 0 });
    setIndice((prev) => (prev - 1 + images.length) % images.length);
  }

  function alternarZoom() {
    setZoom((prev) => !prev);
    setPos({ x: 0, y: 0 });
  }

  // --- Eventos de toque (celular) ---
  function handleTouchStart(e: React.TouchEvent) {
    const agora = Date.now();
    if (agora - ultimoToque.current < 300) {
      alternarZoom();
    }
    ultimoToque.current = agora;

    if (zoom) {
      arrastando.current = true;
      setArrastandoAtivo(true);
      posInicial.current = {
        x: e.touches[0].clientX - pos.x,
        y: e.touches[0].clientY - pos.y,
      };
    } else {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (zoom && arrastando.current) {
      setPos({
        x: e.touches[0].clientX - posInicial.current.x,
        y: e.touches[0].clientY - posInicial.current.y,
      });
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    arrastando.current = false;
    setArrastandoAtivo(false);

    if (zoom) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        anterior();
      } else {
        proxima();
      }
    }
  }

  // --- Eventos de mouse (computador) ---
  function handleMouseDown(e: React.MouseEvent) {
    if (!zoom) return;
    arrastando.current = true;
    setArrastandoAtivo(true);
    posInicial.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (zoom && arrastando.current) {
      setPos({
        x: e.clientX - posInicial.current.x,
        y: e.clientY - posInicial.current.y,
      });
    }
  }

  function handleMouseUp() {
    arrastando.current = false;
    setArrastandoAtivo(false);
  }

  return (
    <>
      {/* Miniaturas / imagem principal na página */}
      <div>
        <div
          className="aspect-square bg-zinc-100 rounded-lg overflow-hidden mb-3 cursor-zoom-in"
          onClick={() => abrirGaleria(0)}
        >
          <img
            src={images[0]}
            alt={alt}
            className="w-full h-full object-cover"
          />
        </div>
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.slice(1).map((img, i) => (
              <div
                key={i}
                className="aspect-square bg-zinc-100 rounded overflow-hidden cursor-zoom-in"
                onClick={() => abrirGaleria(i + 1)}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox em tela cheia */}
      {aberto && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center select-none">
          <button
            onClick={fechar}
            className="absolute top-4 right-4 z-10 text-white bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full flex items-center justify-center text-xl"
            aria-label="Fechar"
          >
            ✕
          </button>

          <div className="absolute top-4 left-4 z-10 text-white bg-white/10 px-3 py-1.5 rounded-full text-sm">
            {indice + 1} / {images.length}
          </div>

          {images.length > 1 && (
            <button
              onClick={anterior}
              className="hidden md:flex absolute left-4 z-10 text-white bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full items-center justify-center text-xl"
              aria-label="Anterior"
            >
              ‹
            </button>
          )}

          <div
            className="w-full h-full flex items-center justify-center overflow-hidden touch-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={alternarZoom}
          >
            <img
              src={images[indice]}
              alt={alt}
              className={`max-w-full max-h-full object-contain ${
                arrastandoAtivo ? "" : "transition-transform duration-200"
              } ${zoom ? "cursor-grab active:cursor-grabbing scale-[2]" : "cursor-zoom-in"}`}
              style={{
                transform: zoom
                  ? `scale(2) translate(${pos.x / 2}px, ${pos.y / 2}px)`
                  : undefined,
              }}
              draggable={false}
              onClick={(e) => {
                e.stopPropagation();
                if (!zoom) alternarZoom();
              }}
            />
          </div>

          {images.length > 1 && (
            <button
              onClick={proxima}
              className="hidden md:flex absolute right-4 z-10 text-white bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full items-center justify-center text-xl"
              aria-label="Próxima"
            >
              ›
            </button>
          )}

          <p className="md:hidden absolute bottom-4 text-white/60 text-xs text-center w-full px-4">
            Arraste para o lado para trocar • Toque duas vezes para zoom
          </p>
          <p className="hidden md:block absolute bottom-4 text-white/60 text-xs text-center w-full px-4">
            Duplo clique para zoom • Arraste para navegar na imagem ampliada
          </p>
        </div>
      )}
    </>
  );
}