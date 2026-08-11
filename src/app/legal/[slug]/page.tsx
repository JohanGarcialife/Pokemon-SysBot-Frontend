'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

interface LegalDoc {
  title: string;
  content: React.ReactNode;
}

const LEGAL_DOCS: Record<string, LegalDoc> = {
  'aviso-legal': {
    title: 'Aviso Legal',
    content: (
      <div className="legal-content-body">
        <p>En cumplimiento de la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE), se informa a los usuarios que el propietario de este sitio web es <strong>PKDEX Trade</strong>.</p>
        
        <h3>1. Propiedad Intelectual</h3>
        <p>Todos los contenidos de esta web, incluyendo textos, gráficos, interfaces y código, son propiedad de PKDEX Trade o de sus respectivos licenciantes. Queda prohibida la reproducción total o parcial sin autorización previa.</p>
        
        <h3>2. Responsabilidad</h3>
        <p>PKDEX Trade no se hace responsable de las interrupciones del servicio, caídas del servidor o fallos técnicos ajenos a su plataforma. Los servicios de intercambio dependen de sistemas externos (servicios online de Nintendo, servidores de Discord y software de terceros).</p>
        
        <h3>3. Contacto</h3>
        <p>Para cualquier consulta legal, puedes ponerte en contacto con nosotros a través de nuestro servidor de soporte o escribiendo a: <a href="mailto:pkdexbot2@gmail.com">pkdexbot2@gmail.com</a>.</p>
      </div>
    )
  },
  'privacidad': {
    title: 'Política de Privacidad',
    content: (
      <div className="legal-content-body">
        <p>De conformidad con lo dispuesto en el Reglamento General de Protección de Datos (RGPD) y la normativa local vigente, te informamos sobre el tratamiento de tus datos personales en PKDEX.</p>
        
        <h3>1. Datos Recopilados</h3>
        <p>Recopilamos únicamente la información estrictamente necesaria para prestar nuestros servicios de intercambio:</p>
        <ul>
          <li>Dirección de correo electrónico (facilitada a través de Supabase Auth / Google OAuth).</li>
          <li>Datos de órdenes de intercambio (Pokémon solicitados, códigos generados y estado de entrega).</li>
        </ul>
        
        <h3>2. Finalidad del Tratamiento</h3>
        <p>Tus datos se utilizan con el único fin de procesar tus solicitudes, gestionar tus suscripciones Premium mediante Stripe y garantizar el correcto funcionamiento técnico de las colas de intercambio.</p>
        
        <h3>3. Seguridad y Conservación</h3>
        <p>Tus datos personales se almacenan de forma segura utilizando los servicios de base de datos cifrada de Supabase. No compartimos tus datos con terceros ajenos al proceso de facturación (Stripe) y autenticación.</p>
      </div>
    )
  },
  'cookies': {
    title: 'Política de Cookies',
    content: (
      <div className="legal-content-body">
        <p>Este sitio web utiliza cookies técnicas y funcionales indispensables para el funcionamiento y la seguridad del sistema.</p>
        
        <h3>1. Cookies Técnicas</h3>
        <p>Utilizamos cookies esenciales para mantener tu sesión activa, recordar tus preferencias de tema y juego (Legends: Z-A / Scarlet / Violet) y asegurar que las solicitudes se procesen correctamente en el servidor.</p>
        
        <h3>2. Almacenamiento Local (localStorage)</h3>
        <p>Utilizamos el almacenamiento local del navegador para guardar información básica de configuración (como el juego preferido y los tokens de sesión de manera temporal) con el fin de optimizar los tiempos de carga y mejorar tu experiencia de usuario.</p>
        
        <h3>3. Cookies de Terceros</h3>
        <p>Nuestros proveedores de pasarela de pago (Stripe) y bases de datos (Supabase) pueden establecer cookies estrictamente necesarias para procesar pagos de forma segura y mitigar intentos de fraude o accesos indebidos.</p>
      </div>
    )
  },
  'terminos': {
    title: 'Términos de Uso',
    content: (
      <div className="legal-content-body">
        <p>Al acceder o utilizar los servicios de intercambio de PKDEX, aceptas estar sujeto a los siguientes términos y condiciones de servicio.</p>
        
        <h3>1. Uso de la Plataforma</h3>
        <p>PKDEX es una herramienta de asistencia legal para la preparación de equipos Pokémon. El usuario es responsable de cumplir con las normas de conducta del juego y el servicio online correspondiente.</p>
        
        <h3>2. Planes y Límites</h3>
        <p>Los límites diarios para usuarios gratuitos (3 intercambios por día y juego) y las ventajas premium para los rangos de pago se aplican de manera autoritativa en nuestros servidores. Cualquier intento de eludir estos límites mediante automatizaciones o fallos del sistema será motivo de suspensión inmediata de la cuenta.</p>
        
        <h3>3. Modificación del Servicio</h3>
        <p>Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto del servicio de intercambio en cualquier momento con el fin de adaptarnos a actualizaciones del juego o corregir fallos críticos del sistema.</p>
      </div>
    )
  },
  'reembolsos': {
    title: 'Política de Reembolsos',
    content: (
      <div className="legal-content-body">
        <p>Información detallada sobre las condiciones de compra y reembolsos para las suscripciones Premium de PKDEX.</p>
        
        <h3>1. Suministro de Contenido Digital</h3>
        <p>De acuerdo con la legislación vigente sobre consumidores, al contratar una membresía Premium de PKDEX y acceder de inmediato a las colas prioritarias e intercambios ilimitados, consientes expresamente en perder tu derecho de desistimiento una vez el servicio digital comience a ejecutarse.</p>
        
        <h3>2. Excepciones y Cancelaciones</h3>
        <p>Puedes cancelar la renovación automática de tu membresía en cualquier momento desde tu panel de control de Stripe. No se realizarán reembolsos parciales por meses ya transcurridos o por días de suscripción no consumidos.</p>
        
        <h3>3. Errores del Sistema</h3>
        <p>Si ocurre un fallo técnico atribuible a PKDEX que impida la entrega de tus Pokémon solicitados de forma prolongada, te compensaremos extendiendo la vigencia de tu plan o realizando un ajuste correspondiente en tu cuota.</p>
      </div>
    )
  },
  'contacto': {
    title: 'Soporte y Contacto',
    content: (
      <div className="legal-content-body">
        <p>¿Tienes dudas, problemas con tus pedidos o sugerencias? Estamos aquí para ayudarte.</p>
        
        <h3>1. Servidor de Soporte (Discord)</h3>
        <p>La forma más rápida de obtener asistencia en vivo con tus intercambios es unirte a nuestro servidor de Discord oficial: <a href="https://discord.gg/RMmq4DNdX" target="_blank" rel="noopener noreferrer" style={{ color: '#818cf8', fontWeight: 'bold', textDecoration: 'underline' }}>Unirse al Discord de Soporte</a>.</p>
        
        <h3>2. Correo Electrónico</h3>
        <p>Para consultas administrativas, incidencias con pagos o problemas de acceso a tu cuenta, puedes enviarnos un correo electrónico a:</p>
        <p className="email-highlight"><a href="mailto:pkdexbot2@gmail.com">pkdexbot2@gmail.com</a></p>
        
        <h3>3. Tiempos de Respuesta</h3>
        <p>Hacemos todo lo posible por responder a todos los correos en un plazo máximo de 24 a 48 horas hábiles.</p>
      </div>
    )
  },
  'uso-aceptable': {
    title: 'Política de Uso Aceptable',
    content: (
      <div className="legal-content-body">
        <p>Reglas fundamentales de conducta y restricciones de uso en PKDEX Trade para garantizar un servicio justo y seguro para todos.</p>
        
        <h3>1. Comportamientos Prohibidos</h3>
        <p>Queda totalmente prohibido:</p>
        <ul>
          <li>Intentar eludir las cuotas de intercambio diarias del plan gratis mediante la creación de cuentas múltiples.</li>
          <li>Manipular la interfaz de usuario o hacer llamadas API manuales para saltarse los bloqueos de pedidos activos.</li>
          <li>Enviar Pokémon ilegales editados de manera maliciosa que puedan comprometer el funcionamiento de los SysBots.</li>
          <li>Realizar spam masivo de solicitudes simultáneas en las colas utilizando scripts o clientes modificados.</li>
        </ul>
        
        <h3>2. Sanciones</h3>
        <p>El incumplimiento de estas normas conllevará la cancelación inmediata de tu membresía (sin derecho a reembolso) y el bloqueo permanente de tu dirección de correo electrónico en nuestros servidores.</p>
      </div>
    )
  }
};

export default function LegalPage() {
  const params = useParams();
  const slug = String(params.slug || '');
  const doc = LEGAL_DOCS[slug];

  if (!doc) {
    return (
      <main className="legal-page-shell">
        <header className="legal-header">
          <Link href="/" className="legal-back-btn">← Volver al inicio</Link>
        </header>
        <section className="legal-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h1>Documento no encontrado</h1>
          <p>La página legal que buscas no existe o ha sido movida.</p>
          <Link href="/" className="legal-home-link" style={{ marginTop: '20px', display: 'inline-block' }}>Ir al inicio</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="legal-page-shell">
      <header className="legal-header">
        <Link href="/" className="legal-logo" aria-label="PKDEX inicio">
          <img src="/assets/pkdex-logo.png" alt="PKDEX Logo" />
        </Link>
        <Link href="/" className="legal-back-btn">← Volver al inicio</Link>
      </header>
      
      <section className="legal-card">
        <h1>{doc.title}</h1>
        <div className="legal-content-wrapper">
          {doc.content}
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-footer-links">
          <Link href="/legal/aviso-legal" className="site-footer-link">Aviso Legal</Link>
          <Link href="/legal/privacidad" className="site-footer-link">Privacidad</Link>
          <Link href="/legal/cookies" className="site-footer-link">Cookies</Link>
          <Link href="/legal/terminos" className="site-footer-link">Términos de Uso</Link>
          <Link href="/legal/reembolsos" className="site-footer-link">Reembolsos</Link>
          <Link href="/legal/contacto" className="site-footer-link">Contacto</Link>
          <Link href="/legal/uso-aceptable" className="site-footer-link">Uso Aceptable</Link>
        </div>
        <p className="site-footer-copy">
          © {new Date().getFullYear()} PKDEX Trade. Todos los derechos reservados. Pokémon es una marca registrada de Nintendo, Creatures Inc. y GAME FREAK inc. PKDEX es una herramienta independiente no afiliada ni respaldada por Nintendo.
        </p>
      </footer>
    </main>
  );
}
