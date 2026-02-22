import type { TourTagId } from "@/lib/tour-tags"

export type TourContent = {
  id: string
  title: string
  city: string
  heroImage: string
  heroVideo?: string
  posterImage?: string
  gallery: string[]
  summary: string
  image: string
  duration: string
  groupSize: string
  price: string
  rating: number
  reviews: number
  idealFor: string[]
  includes: string[]
  experience: string[]
  logistics: string
  tags: TourTagId[]
  demandScore: number
  demandClass: "top_seller" | "high" | "standard"
}

export const toursContent: TourContent[] = [
  {
    id: "guatape-private",
    title: "Tour Privado Guatapé & El Peñol",
    city: "Medellín",
    heroImage: "https://njjciisigpuvzekgnwzj.supabase.co/storage/v1/object/public/tour-media/tours/guatape-private/hero.webp",
    posterImage: "https://njjciisigpuvzekgnwzj.supabase.co/storage/v1/object/public/tour-media/tours/guatape-private/poster.webp",
    gallery: [
      "https://njjciisigpuvzekgnwzj.supabase.co/storage/v1/object/public/tour-media/tours/guatape-private/gallery1.webp",
      "https://njjciisigpuvzekgnwzj.supabase.co/storage/v1/object/public/tour-media/tours/guatape-private/gallery2.webp",
    ],
    summary:
      "Una salida de día completo para conocer Guatapé con flexibilidad total. Ritmo personalizado, paradas estratégicas y acompañamiento local.",
    image: "https://njjciisigpuvzekgnwzj.supabase.co/storage/v1/object/public/tour-media/tours/guatape-private/hero.webp",
    duration: "8-10 horas",
    groupSize: "Hasta 4 personas",
    price: "$600.000 COP",
    rating: 5.0,
    reviews: 87,
    idealFor: ["Parejas", "Familias", "Viajeros que quieren tour privado", "Primer viaje a Antioquia"],
    includes: [
      "Transporte privado ida y regreso",
      "Visita a El Peñol y Guatapé",
      "Paseo en barco por el embalse",
      "Acompañamiento local en español e inglés",
    ],
    experience: [
      "Recorrido por calles de zócalos y spots fotográficos",
      "Tiempo libre para almorzar y explorar",
      "Contexto cultural sin formato de tour masivo",
    ],
    logistics: "Salida desde Medellín. Recomendado iniciar temprano para optimizar el día.",
    tags: ["magic-towns"],
    demandScore: 95,
    demandClass: "top_seller",
  },
  {
    id: "medellin-walking",
    title: "Free Walking Tour Medellín",
    city: "Medellín",
    heroImage: "https://njjciisigpuvzekgnwzj.supabase.co/storage/v1/object/public/tour-media/tours/medellin-walking/hero.webp",
    posterImage: "https://njjciisigpuvzekgnwzj.supabase.co/storage/v1/object/public/tour-media/tours/medellin-walking/poster.webp",
    gallery: [
      "https://njjciisigpuvzekgnwzj.supabase.co/storage/v1/object/public/tour-media/tours/medellin-walking/gallery1.webp",
      "/tours/medellin-walking/gallery-2.jpg",
    ],
    summary:
      "Una inmersión urbana para entender la ciudad desde su historia, su transformación social y su energía actual.",
    image: "https://njjciisigpuvzekgnwzj.supabase.co/storage/v1/object/public/tour-media/tours/medellin-walking/hero.webp",
    duration: "3 horas",
    groupSize: "Grupos pequeños",
    price: "Basado en propinas",
    rating: 5.0,
    reviews: 143,
    idealFor: ["Viajeros con tiempo corto", "Nómadas digitales", "Backpackers", "Primera visita a Medellín"],
    includes: [
      "Ruta guiada por centro de Medellín",
      "Paradas clave de historia y cultura paisa",
      "Recomendaciones reales de comida y barrios",
      "Formato flexible y dinámico",
    ],
    experience: [
      "Plaza Botero y contexto artístico",
      "Historias locales de transformación",
      "Tips prácticos para moverte seguro en la ciudad",
    ],
    logistics: "Punto de encuentro en zona céntrica. Ideal llevar hidratación y ropa cómoda.",
    tags: ["culture", "city-tour"],
    demandScore: 72,
    demandClass: "high",
  },
  {
    id: "comuna-13",
    title: "Tour Comuna 13",
    city: "Medellín",
    heroImage: "https://njjciisigpuvzekgnwzj.supabase.co/storage/v1/object/public/tour-media/tours/comuna-13/hero.webp",
    posterImage: "https://njjciisigpuvzekgnwzj.supabase.co/storage/v1/object/public/tour-media/tours/comuna-13/poster.webp",
    gallery: [
      "https://njjciisigpuvzekgnwzj.supabase.co/storage/v1/object/public/tour-media/tours/comuna-13/gallery1.webp",
      "/tours/comuna-13/gallery-2.jpg",
    ],
    summary:
      "Recorrido cultural enfocado en la evolución de la Comuna 13: arte urbano, memoria y emprendimiento local.",
    image: "https://njjciisigpuvzekgnwzj.supabase.co/storage/v1/object/public/tour-media/tours/comuna-13/hero.webp",
    duration: "4 horas",
    groupSize: "Privado o grupal",
    price: "Desde $80.000 COP",
    rating: 4.9,
    reviews: 52,
    idealFor: ["Amantes de cultura urbana", "Creadores de contenido", "Viajeros curiosos", "Grupos de amigos"],
    includes: [
      "Ruta guiada por puntos emblemáticos",
      "Contexto local y narrativas del territorio",
      "Tiempo para fotos y compras locales",
      "Acompañamiento durante todo el recorrido",
    ],
    experience: [
      "Escaleras eléctricas y murales icónicos",
      "Música, danza y expresión comunitaria",
      "Historias contadas desde perspectiva local",
    ],
    logistics: "Se recomienda calzado cómodo y bloqueador. Hay tramos con escaleras y caminata continua.",
    tags: ["culture"],
    demandScore: 68,
    demandClass: "high",
  },
  {
    id: "tour-cafetero",
    title: "Tour del Café en Finca Típica Antioqueña",
    city: "Medellín",
    heroImage: "https://njjciisigpuvzekgnwzj.supabase.co/storage/v1/object/public/tour-media/tours/tour-cafetero/hero.webp",
    posterImage: "https://njjciisigpuvzekgnwzj.supabase.co/storage/v1/object/public/tour-media/tours/tour-cafetero/poster.webp",
    gallery: ["/tours/tour-cafetero/gallery-1.jpg", "/tours/tour-cafetero/gallery-2.jpg"],
    summary:
      "Experiencia sensorial completa en torno al café: territorio, cultivo, proceso y degustación guiada.",
    image: "https://njjciisigpuvzekgnwzj.supabase.co/storage/v1/object/public/tour-media/tours/tour-cafetero/hero.webp",
    duration: "4 horas",
    groupSize: "Grupos pequeños",
    price: "$230.000 COP",
    rating: 5.0,
    reviews: 78,
    idealFor: ["Foodies", "Viajeros culturales", "Parejas", "Amantes del café de especialidad"],
    includes: [
      "Ingreso a finca cafetera",
      "Explicación de proceso de semilla a taza",
      "Cata de café con diferentes métodos",
      "Almuerzo típico antioqueño",
    ],
    experience: [
      "Cabalgata de acceso (según operación)",
      "Interacción directa con tradición cafetera",
      "Aprendizaje práctico sobre molienda y filtrado",
    ],
    logistics: "Actividad de media jornada con enfoque experiencial. Confirmación de operación según clima.",
    tags: ["culture", "nature"],
    demandScore: 74,
    demandClass: "high",
  },
  {
    id: "tour-nocturno",
    title: "Tour Nocturno a 2 Miradores con Fogata",
    city: "Medellín",
    heroImage: "https://njjciisigpuvzekgnwzj.supabase.co/storage/v1/object/public/tour-media/tours/tour-nocturno/hero.webp",
    posterImage: "https://njjciisigpuvzekgnwzj.supabase.co/storage/v1/object/public/tour-media/tours/tour-nocturno/poster.webp",
    gallery: [
      "https://njjciisigpuvzekgnwzj.supabase.co/storage/v1/object/public/tour-media/tours/tour-nocturno/gallery1.webp",
      "/tours/tour-nocturno/gallery-2.jpg",
    ],
    summary:
      "Salida nocturna para vivir Medellín iluminada desde altura, con ambiente social y experiencia al aire libre.",
    image: "https://njjciisigpuvzekgnwzj.supabase.co/storage/v1/object/public/tour-media/tours/tour-nocturno/hero.webp",
    duration: "4 horas",
    groupSize: "Grupos pequeños",
    price: "Desde $150.000 COP",
    rating: 4.9,
    reviews: 64,
    idealFor: ["Parejas", "Planes con amigos", "Viajeros que prefieren experiencias nocturnas", "Fotografía urbana"],
    includes: [
      "Visita a dos miradores",
      "Espacio de fogata",
      "Acompañamiento local",
      "Snacks y bebidas (según operación)",
    ],
    experience: [
      "Vistas panorámicas de la ciudad de noche",
      "Momento social con música local",
      "Cierre ideal de viaje o de fin de semana",
    ],
    logistics: "Llevar abrigo ligero. Experiencia sujeta a condiciones climáticas.",
    tags: ["nightlife"],
    demandScore: 66,
    demandClass: "high",
  },
  {
    id: "salto-del-buey",
    title: "Día de Aventura en Salto del Buey desde Medellín",
    city: "Medellín",
    heroImage: "/tours/salto-del-buey/hero.jpg",
    heroVideo: "https://njjciisigpuvzekgnwzj.supabase.co/storage/v1/object/public/tour-media/tours/salto-del-buey/hero.mp4",
    posterImage: "https://njjciisigpuvzekgnwzj.supabase.co/storage/v1/object/public/tour-media/tours/salto-del-buey/poster.webp",
    gallery: ["https://njjciisigpuvzekgnwzj.supabase.co/storage/v1/object/public/tour-media/tours/salto-del-buey/gallery1.webp"],
    summary:
      "Escapada de aventura para conectar con naturaleza en un entorno de cascadas, montaña y senderos fuera del circuito urbano.",
    image: "/tours/salto-del-buey/hero.jpg",
    duration: "10-12 horas",
    groupSize: "Privado o semiprivado",
    price: "Desde $280.000 COP",
    rating: 4.9,
    reviews: 18,
    idealFor: ["Viajeros de aventura", "Parejas activas", "Grupos de amigos", "Amantes de naturaleza"],
    includes: [
      "Transporte ida y regreso desde Medellín",
      "Acompañamiento durante la jornada",
      "Paradas en puntos naturales del recorrido",
      "Almuerzo incluido",
      "Tiempo para disfrutar del entorno",
    ],
    experience: [
      "Senderismo y conexión con paisaje de montaña",
      "Visita al entorno de Salto del Buey",
      "Día completo fuera de la ciudad con ritmo flexible",
    ],
    logistics: "Actividad de día completo. Recomendado llevar calzado de buen agarre, ropa ligera y cambio extra.",
    tags: ["adventure", "nature"],
    demandScore: 100,
    demandClass: "top_seller",
  },
]

export function getTourById(id: string) {
  const normalized = id.trim().toLowerCase()

  const aliases: Record<string, string> = {
    "tour-comuna-13": "comuna-13",
    "salto-del-buey-adventure": "salto-del-buey",
  }

  const resolvedId = aliases[normalized] ?? normalized

  return toursContent.find((tour) => tour.id === resolvedId)
}

export function getToursOrderedByDemand() {
  return [...toursContent].sort((a, b) => b.demandScore - a.demandScore)
}
