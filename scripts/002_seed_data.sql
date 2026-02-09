-- Seed data for YouTour

-- Insert sample testimonials
INSERT INTO testimonials (name, rating, comment, tour_type, date, approved) VALUES
('Sarah Johnson', 5, 'An absolutely incredible experience! Oscar was knowledgeable, friendly, and made our trip to Guatapé unforgettable. The views from El Peñol were breathtaking!', 'Guatapé & El Peñol', '2024-01-15', true),
('Marco Rossi', 5, 'Best tour I''ve ever taken in Colombia. Oscar''s passion for his country really shows. The private tour was worth every peso!', 'Guatapé & El Peñol', '2024-02-20', true),
('Emily Chen', 5, 'Oscar is an amazing guide! He took us to hidden spots that most tourists never see. Highly recommend his free walking tour in Medellín.', 'Medellín Walking Tour', '2024-03-10', true),
('David Martinez', 4, 'Great experience overall. The boat ride in Guatapé was so relaxing. Oscar knows all the best photo spots!', 'Guatapé & El Peñol', '2024-03-25', true);

-- Insert sample FAQs
INSERT INTO faqs (question, answer, order_index) VALUES
('¿Cuánto dura el tour a Guatapé?', 'El tour privado a Guatapé tiene una duración de aproximadamente 8-10 horas, incluyendo transporte desde Medellín, tiempo en El Peñol, paseo en barco y almuerzo.', 1),
('¿Está incluido el transporte?', 'Sí, el transporte privado desde y hacia tu hotel en Medellín está incluido en todos nuestros tours privados.', 2),
('¿Cuántas personas pueden ir en el tour privado?', 'Nuestros tours privados pueden acomodar de 1 a 6 personas. Para grupos más grandes, contáctanos para hacer arreglos especiales.', 3),
('¿Qué está incluido en el precio?', 'El precio incluye: transporte privado, guía profesional, paseo en barco en Guatapé, y asistencia durante todo el recorrido. No incluye: entrada a El Peñol (25.000 COP), comidas, ni propinas.', 4),
('¿Cuál es la política de cancelación?', 'Ofrecemos cancelación gratuita hasta 24 horas antes del tour. Para cancelaciones con menos de 24 horas, se aplica un cargo del 50%.', 5),
('¿Hablas inglés?', 'Yes! I offer tours in both Spanish and English. Just let me know your preference when booking.', 6);

-- Insert sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, author, published) VALUES
('La Historia Detrás de El Peñol de Guatapé', 
 'historia-el-penol-guatape',
 'Descubre la fascinante historia de esta roca monolítica de 220 metros de altura y por qué es uno de los lugares más fotografiados de Colombia.',
 '<p>El Peñol de Guatapé es mucho más que una roca gigante. Esta formación granítica de 220 metros de altura ha sido testigo de siglos de historia...</p><p>La disputa entre El Peñol y Guatapé sobre la propiedad de la piedra es legendaria. Aún hoy puedes ver las letras "G" y parte de la "U" pintadas en la roca...</p><p>Subir los 740 escalones es un desafío, pero las vistas panorámicas de los lagos y las islas te dejarán sin aliento. ¡Vale completamente la pena!</p>',
 'Oscar',
 true),
('10 Consejos para Visitar Guatapé como un Local',
 '10-consejos-visitar-guatape',
 'Consejos de un guía local para aprovechar al máximo tu visita a Guatapé, desde los mejores restaurantes hasta los miradores secretos.',
 '<p>Como guía local con años de experiencia llevando turistas a Guatapé, he aprendido todos los secretos de este pueblo mágico...</p><p>1. Llega temprano: El Peñol abre a las 8 AM y las primeras horas son las menos concurridas...</p><p>2. No te pierdas los zócalos: Los coloridos relieves en las fachadas cuentan la historia del pueblo...</p>',
 'Oscar',
 true);
