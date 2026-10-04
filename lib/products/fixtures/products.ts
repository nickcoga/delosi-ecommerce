import type { FakeStoreProductDTO } from "@/lib/products/fake-store/dto";

export const FIXTURE_PRODUCTS: FakeStoreProductDTO[] = [
  {
    id: 1,
    title: "Auriculares inalámbricos con cancelación de ruido",
    price: 129.99,
    description:
      "Auriculares de diadema con cancelación activa de ruido, hasta 30 horas de batería y carga rápida por USB-C.",
    category: "electronics",
    image: "/fixtures/products/auriculares-inalambricos.jpg",
    rating: { rate: 4.6, count: 210 },
  },
  {
    id: 2,
    title:
      "Monitor curvo de 27 pulgadas con panel IPS, resolución QHD y 144 Hz para trabajo y juego",
    price: 349.5,
    description:
      "Monitor de 27 pulgadas con panel IPS, resolución 2560 x 1440, 144 Hz de frecuencia y soporte ajustable en altura.",
    category: "electronics",
    image: "/fixtures/products/monitor-curvo-27-pulgadas.webp",
    rating: { rate: 4.2, count: 88 },
  },
  {
    id: 3,
    title: "Cargador portátil de 20.000 mAh con dos puertos USB-C",
    price: 24.5,
    description: "Batería externa compacta con dos salidas USB-C y carga simultánea de dos dispositivos.",
    category: "electronics",
    image: "/fixtures/products/cargador-portatil.jpg",
    rating: { rate: 3.8, count: 35 },
  },
  {
    id: 4,
    title: "Pulsera gold plated de acero inoxidable",
    price: 15,
    description: "Pulsera de eslabones con baño dorado sobre acero inoxidable, cierre de broche reforzado.",
    category: "jewelery",
    image: "/fixtures/products/pulsera-gold-plated.avif",
    rating: { rate: 4, count: 12 },
  },
  {
    id: 5,
    title: "Colgante de plata de ley con piedra azul",
    price: 42.5,
    description: "Colgante de plata de ley 925 con piedra azul talla ovalada y cadena de 50 cm incluida.",
    category: "jewelery",
    image: "/fixtures/products/colgante-piedra-azul.png",
    rating: { rate: 4.8, count: 300 },
  },
  {
    id: 6,
    title: "Chaqueta impermeable ligera con capucha",
    price: 79.9,
    description:
      "Chaqueta cortavientos impermeable con capucha ajustable, bolsillos con cremallera y peso reducido para viaje.",
    category: "men's clothing",
    image: "/fixtures/products/chaqueta-impermeable.webp",
    rating: { rate: 4.1, count: 64 },
  },
  {
    id: 7,
    title: "Vestido de verano de algodón con estampado floral",
    price: 35,
    description:
      "Vestido de algodón suave con estampado floral, escote en V y falda ligera. Pensado para días cálidos.",
    category: "women's clothing",
    image: "/fixtures/products/vestido-floral.webp",
    rating: { rate: 4.4, count: 120 },
  },
  {
    id: 8,
    title: "Anillo gold tono oro rosa con acabado pulido",
    price: 64,
    description: "Anillo de banda con acabado pulido y baño de oro rosa, disponible en tallas estándar.",
    category: "jewelery",
    image: "/fixtures/products/anillo-gold-rosa.jpg",
    rating: { rate: 4.5, count: 77 },
  },
];
