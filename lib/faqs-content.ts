export type FAQAudience = "viajero" | "rider" | "guia" | "aliado" | "operacion"

export type FAQItem = {
  id: string
  question: string
  answer: string
}

export type FAQSectionData = {
  id: FAQAudience
  title: string
  subtitle: string
  items: FAQItem[]
}

export const faqSections: FAQSectionData[] = [
  {
    id: "viajero",
    title: "Usuario (Viajero)",
    subtitle: "Preguntas clave antes de reservar tu experiencia.",
    items: [
      {
        id: "viajero-1",
        question: "¿Qué hace diferente a UTour de otros tours?",
        answer:
          "En UTour no viajas siguiendo un cronómetro. Viajas con más libertad y sin prisas. Son experiencias privadas o semiprivadas diseñadas según tu estilo, no tours masivos.",
      },
      {
        id: "viajero-2",
        question: "¿Los tours son privados?",
        answer:
          "Sí. Puedes reservar experiencias privadas o en grupos muy pequeños. La idea es personalización, no volumen.",
      },
      {
        id: "viajero-3",
        question: "¿Cómo reservo?",
        answer:
          "Eliges la experiencia, seleccionas fecha, confirmas y pagas online. Sin mensajes interminables ni transferencias manuales.",
      },
      {
        id: "viajero-4",
        question: "¿Es seguro pagar en la plataforma?",
        answer:
          "Sí. Usamos pasarelas de pago reconocidas y seguras. No almacenamos tu información financiera.",
      },
      {
        id: "viajero-5",
        question: "¿Puedo personalizar mi experiencia?",
        answer:
          "Sí. Antes del tour podrás indicar intereses, ritmo y expectativas para adaptar la experiencia.",
      },
      {
        id: "viajero-6",
        question: "¿Qué pasa si necesito cancelar?",
        answer:
          "Cada experiencia tiene una política clara de cancelación. Siempre verás las condiciones antes de pagar.",
      },
      {
        id: "viajero-7",
        question: "¿Incluye transporte?",
        answer: "Depende de la experiencia. Algunas lo incluyen y otras no. Siempre estará especificado.",
      },
      {
        id: "viajero-8",
        question: "¿Qué tipo de experiencias ofrecen?",
        answer:
          "Culturales, gastronómicas, naturaleza, ciudad, experiencias locales auténticas y planes a la medida.",
      },
    ],
  },
  {
    id: "rider",
    title: "Rider (Conductor / Logística)",
    subtitle: "Operación y pagos para quienes ejecutan la logística.",
    items: [
      {
        id: "rider-1",
        question: "¿Cuándo y cómo recibo el pago?",
        answer:
          "Los pagos se realizan con frecuencia semanal, posteriores a la finalización del viaje. UTour consolida los servicios ejecutados y realiza la liquidación correspondiente.",
      },
      {
        id: "rider-2",
        question: "¿Qué pasa si el tour incluye costos adicionales (parques o actividades)?",
        answer:
          "Cuando la experiencia incluye reservas a parques naturales o actividades específicas (por ejemplo, experiencias tipo Salto del Buey), UTour puede asumir directamente esos costos mediante convenios previos. Esto reduce tu carga operativa y financiera.",
      },
      {
        id: "rider-3",
        question: "¿Debo adelantar dinero para reservas?",
        answer:
          "No necesariamente. En experiencias estructuradas bajo convenio, UTour gestiona esos pagos directamente.",
      },
      {
        id: "rider-4",
        question: "¿Hay calificaciones?",
        answer: "Sí. Los viajeros pueden calificar el servicio para mantener estándares altos.",
      },
    ],
  },
  {
    id: "guia",
    title: "Guía",
    subtitle: "Condiciones y dinámica para guías de experiencias.",
    items: [
      {
        id: "guia-1",
        question: "¿Cuándo me pagan?",
        answer:
          "Los pagos se realizan semanalmente, posteriores a la ejecución de la experiencia. Se liquida únicamente lo efectivamente realizado y confirmado.",
      },
      {
        id: "guia-2",
        question: "¿Debo cubrir reservas de parques o actividades especiales?",
        answer:
          "En experiencias que incluyan reservas formales (parques naturales, actividades organizadas como Salto del Buey, etc.), UTour podrá asumir estos costos mediante convenios directos. Esto busca aliviar tu flujo de caja y simplificar la operación.",
      },
      {
        id: "guia-3",
        question: "¿Qué pasa si la experiencia tiene múltiples proveedores?",
        answer:
          "UTour coordina los pagos según los acuerdos establecidos, evitando que el guía tenga que asumir costos iniciales elevados.",
      },
      {
        id: "guia-4",
        question: "¿Puedo manejar mis horarios?",
        answer: "Sí. Tú defines disponibilidad.",
      },
      {
        id: "guia-5",
        question: "¿Puedo crear mis propias experiencias?",
        answer:
          "Sí. Puedes proponer experiencias que encajen con la filosofía: menos masivo, más auténtico.",
      },
    ],
  },
  {
    id: "aliado",
    title: "Aliado Estratégico",
    subtitle: "Preguntas para hoteles, anfitriones y partners comerciales.",
    items: [
      {
        id: "aliado-1",
        question: "¿Cómo se manejan los pagos?",
        answer:
          "Los servicios ejecutados se liquidan de forma semanal posterior a la experiencia. UTour centraliza el pago del viajero y distribuye según el acuerdo comercial.",
      },
      {
        id: "aliado-2",
        question: "¿Qué pasa con reservas formales (parques, actividades reguladas)?",
        answer:
          "UTour puede asumir directamente las reservas y costos asociados mediante convenios estratégicos. Esto garantiza confirmaciones formales, reducción de fricción operativa, flujo financiero más ordenado y mejor experiencia para el viajero.",
      },
      {
        id: "aliado-3",
        question: "¿Debo adelantar dinero?",
        answer:
          "Dependerá del tipo de convenio, pero el objetivo es que UTour absorba y centralice la gestión para profesionalizar la operación.",
      },
      {
        id: "aliado-4",
        question: "¿UTour exige exclusividad?",
        answer: "No necesariamente. Buscamos alianzas inteligentes, no limitaciones.",
      },
      {
        id: "aliado-5",
        question: "¿Puedo medir resultados?",
        answer: "Sí. Tendrás trazabilidad de reservas generadas desde UTour.",
      },
    ],
  },
  {
    id: "operacion",
    title: "Modelo de Operación y Confianza",
    subtitle: "Principios operativos que sostienen la experiencia.",
    items: [
      {
        id: "operacion-1",
        question: "¿Cómo opera UTour en general?",
        answer:
          "Pagos digitales seguros, confirmaciones automáticas, liquidaciones semanales post-experiencia, convenios directos para reservas formales y enfoque en experiencias personalizadas y de alta calidad.",
      },
    ],
  },
]

export const featuredHomeFaqs: FAQItem[] = [
  faqSections[0].items[0],
  faqSections[0].items[1],
  faqSections[0].items[2],
  faqSections[0].items[3],
  faqSections[0].items[4],
]
