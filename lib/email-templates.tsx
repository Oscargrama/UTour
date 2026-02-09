export const emailTemplates = {
  bookingConfirmation: (data: {
    name: string
    tour_type: string
    date: string
    number_of_people: number
  }) => ({
    subject: `✅ Confirmación de Reserva - YouTour`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px 20px; border: 1px solid #e5e7eb; }
            .footer { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .details { background: #fef3c7; padding: 20px; border-left: 4px solid #f59e0b; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Reserva Confirmada!</h1>
              <p>YouTour - Tu Aventura en Colombia</p>
            </div>
            <div class="content">
              <h2>Hola ${data.name}!</h2>
              <p>¡Gracias por reservar con YouTour! Hemos recibido tu solicitud de reserva.</p>
              
              <div class="details">
                <h3>Detalles de tu Reserva:</h3>
                <p><strong>Tour:</strong> ${data.tour_type}</p>
                <p><strong>Fecha:</strong> ${data.date}</p>
                <p><strong>Número de personas:</strong> ${data.number_of_people}</p>
              </div>

              <p>Te contactaremos pronto vía WhatsApp o email para confirmar todos los detalles y coordinar el punto de encuentro.</p>
              
              <p>Si tienes alguna pregunta, no dudes en contactarnos:</p>
              <ul>
                <li><strong>WhatsApp:</strong> +57 317 849 4031</li>
                <li><strong>Email:</strong> oscar@delabmarketing.com</li>
                <li><strong>Instagram:</strong> @oscargrama</li>
              </ul>

              <a href="https://api.whatsapp.com/send/?phone=573178494031&text=Hola%20Oscar,%20tengo%20una%20pregunta%20sobre%20mi%20reserva" class="button" style="color: white;">
                Contactar por WhatsApp
              </a>

              <p>¡Nos vemos pronto en tu aventura!</p>
              
              <p>Saludos,<br><strong>Oscar - Guía Turístico</strong><br>YouTour</p>
            </div>
            <div class="footer">
              <p><strong>YouTour</strong> - Medellín, Colombia</p>
              <p>Experiencias Auténticas con un Local</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Hola ${data.name}!
      
      ¡Gracias por reservar con YouTour! Hemos recibido tu solicitud.
      
      Detalles de tu Reserva:
      - Tour: ${data.tour_type}
      - Fecha: ${data.date}
      - Número de personas: ${data.number_of_people}
      
      Te contactaremos pronto para confirmar todos los detalles.
      
      WhatsApp: +57 317 849 4031
      Email: oscar@delabmarketing.com
      
      Saludos,
      Oscar - YouTour
    `,
  }),

  newsletterWelcome: (email: string) => ({
    subject: "Bienvenido a YouTour Newsletter!",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f59e0b; color: white; padding: 30px 20px; text-align: center; }
            .content { background: #ffffff; padding: 30px 20px; }
            .footer { background: #fefce8; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Bienvenido a YouTour!</h1>
            </div>
            <div class="content">
              <h2>Gracias por suscribirte!</h2>
              <p>Estás a punto de recibir los mejores tips de viaje, guías locales y ofertas exclusivas para explorar Colombia.</p>
              
              <p>En nuestros emails encontrarás:</p>
              <ul>
                <li>Guías detalladas de destinos</li>
                <li>Tips de un local para aprovechar tu visita</li>
                <li>Ofertas especiales en tours privados</li>
                <li>Historias y experiencias de viajeros</li>
              </ul>

              <p>Mantente atento a tu inbox!</p>
              
              <p>Saludos,<br><strong>Oscar - YouTour</strong></p>
            </div>
            <div class="footer">
              <p>YouTour - Experiencias Auténticas en Colombia</p>
              <p>WhatsApp: +57 317 849 4031 | Email: oscar@delabmarketing.com</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Bienvenido a YouTour Newsletter!
      
      Gracias por suscribirte. Recibirás los mejores tips de viaje, guías locales y ofertas exclusivas.
      
      Saludos,
      Oscar - YouTour
    `,
  }),
}
