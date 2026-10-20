import React from 'react';

/**
 * SmileNote Scribble — Hand-drawn SVG Doodle Icons Collection
 * Estilo orgánico de libreta y boceto a mano alzada con trazos imperfectos,
 * terminaciones redondeadas y personalidad cálida.
 */

// Helper para props estándar
const defaultProps = {
  size: 24,
  strokeWidth: 2,
  color: 'currentColor',
};

/**
 * 1. Muelita Feliz (HappyToothDoodle)
 * Molar sonriente con mejillas rosadas y corona redondeada estilo libreta
 */
export const HappyToothDoodle = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  fill = 'none',
  accentColor = '#FFB5A7',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill={fill}
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block select-none ${className}`}
    {...props}
  >
    {/* Contorno orgánico del diente */}
    <path
      d="M14 10 C18 6, 22 9, 24 11 C26 9, 30 6, 34 10 C39 15, 40 22, 38 29 C36.5 35, 34 42, 30 42 C27 42, 26 35, 24 35 C22 35, 21 42, 18 42 C14 42, 11.5 35, 10 29 C8 22, 9 15, 14 10 Z"
      fill={fill !== 'none' ? fill : 'rgba(255, 255, 255, 0.85)'}
    />
    {/* Doble trazo de boceto imperfecto */}
    <path
      d="M15 12 C18 8, 22 10.5, 24 12"
      strokeOpacity="0.4"
      strokeWidth={Math.max(1, strokeWidth - 0.5)}
    />
    <path
      d="M33 12 C37 16, 37.5 24, 36 30"
      strokeOpacity="0.35"
      strokeWidth={Math.max(1, strokeWidth - 0.5)}
    />

    {/* Ojos sonrientes curvados */}
    <path d="M17 21 C18.5 19, 20.5 19, 21.5 21" />
    <path d="M26.5 21 C27.5 19, 29.5 19, 31 21" />

    {/* Sonrisa traviesa con lengua/arco */}
    <path d="M20 26 C22 29, 26 29, 28 26" />

    {/* Mejillas sonrosadas (doodle círculos o rayitas) */}
    <ellipse
      cx="16"
      cy="24"
      rx="2"
      ry="1.2"
      fill={accentColor}
      stroke="none"
      opacity="0.75"
    />
    <ellipse
      cx="32"
      cy="24"
      rx="2"
      ry="1.2"
      fill={accentColor}
      stroke="none"
      opacity="0.75"
    />
  </svg>
);

/**
 * 2. Cepillo de Dientes (ToothbrushDoodle)
 * Cepillo ligeramente curvado con cerdas esponjosas y burbujitas de espuma
 */
export const ToothbrushDoodle = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  fill = 'none',
  accentColor = '#A8DADC',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill={fill}
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block select-none ${className}`}
    {...props}
  >
    {/* Mango ergonómico dibujado a mano */}
    <path
      d="M38 42 C36 43, 33 42, 30 38 L18 20 C16 17, 17 14, 19 13 C21 12, 23 13, 25 16 L37 34 C41 38, 40 41, 38 42 Z"
      fill={fill !== 'none' ? fill : 'rgba(255, 255, 255, 0.5)'}
    />
    {/* Cabezal de cerdas suaves */}
    <path
      d="M19 13 L11 8 C9 6.5, 6 8.5, 7 11 L10 16 L17 18"
      fill={accentColor}
      fillOpacity="0.4"
    />
    {/* Líneas de cerdas del cepillo */}
    <path d="M8 9 L11 14" strokeWidth={Math.max(1, strokeWidth - 0.5)} />
    <path d="M11 7 L14 12" strokeWidth={Math.max(1, strokeWidth - 0.5)} />
    <path d="M14 6 L17 10" strokeWidth={Math.max(1, strokeWidth - 0.5)} />

    {/* Burbujitas doodle de pasta / espuma */}
    <circle cx="9" cy="5" r="2" strokeWidth={Math.max(1, strokeWidth - 0.5)} />
    <circle cx="16" cy="4" r="1.5" strokeWidth={Math.max(1, strokeWidth - 0.5)} />
    <circle cx="6" cy="14" r="1.5" strokeWidth={Math.max(1, strokeWidth - 0.5)} />
  </svg>
);

/**
 * 3. Espejo Dental (DentalMirrorDoodle)
 * Espejo de exploración con mango estilizado y reflejo doodle
 */
export const DentalMirrorDoodle = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  fill = 'none',
  accentColor = '#BDE0FE',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill={fill}
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block select-none ${className}`}
    {...props}
  >
    {/* Mango de inspección */}
    <path d="M14 34 L7 41 C5.5 42.5, 4 41, 5.5 39.5 L13 32" />
    <path d="M13.5 33 L24 22.5" strokeWidth={strokeWidth + 0.5} />

    {/* Cuello angular de conexión */}
    <path d="M24 22.5 L28 20" />

    {/* Aro circular del espejo */}
    <circle
      cx="33"
      cy="15"
      r="10"
      fill={accentColor}
      fillOpacity="0.3"
    />
    <circle
      cx="33"
      cy="15"
      r="10"
    />

    {/* Destello/brillo curvado dentro del cristal */}
    <path
      d="M29 11 C32 9, 36 10, 38 12"
      strokeOpacity="0.8"
      strokeWidth={Math.max(1, strokeWidth - 0.5)}
    />
    <path
      d="M32 18 C34 19, 36 19, 37 18"
      strokeOpacity="0.5"
      strokeWidth={Math.max(1, strokeWidth - 0.5)}
    />
  </svg>
);

/**
 * 4. Chincheta de Post-it (PinDoodle)
 * Chincheta inclinada estilo cuaderno scrapbook para sujetar notas
 */
export const PinDoodle = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  fill = 'none',
  accentColor = '#E63946',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill={fill}
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block select-none ${className}`}
    {...props}
  >
    {/* Sombra de la chincheta sobre el papel */}
    <ellipse cx="28" cy="38" rx="5" ry="2" fill="#222" opacity="0.15" stroke="none" />

    {/* Aguja que penetra el post-it */}
    <path d="M22 26 L27 38" strokeWidth={strokeWidth + 0.5} />

    {/* Cabeza de la chincheta (diseño retro / biselado) */}
    <path
      d="M17 12 C18 9, 29 17, 30 20 L27 23 C22 20, 19 18, 17 12 Z"
      fill={accentColor}
      fillOpacity="0.85"
    />
    <path
      d="M14 9 C15 7, 23 13, 24 16 L22 18 C17 14, 15 11, 14 9 Z"
      fill={accentColor}
    />
    {/* Brillo de plástico superior */}
    <path
      d="M17 9 C20 11, 23 14, 25 17"
      stroke="white"
      strokeOpacity="0.7"
      strokeWidth={Math.max(1, strokeWidth - 0.7)}
    />
  </svg>
);

/**
 * 5. Corona Dental Brillante (CrownDoodle)
 * Corona dorada de 3 puntas con pequeños orbes y destellos
 */
export const CrownDoodle = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  fill = 'none',
  accentColor = '#FFD166',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill={fill}
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block select-none ${className}`}
    {...props}
  >
    {/* Base de la corona con arcos */}
    <path
      d="M10 34 C18 36, 30 36, 38 34 L40 18 L31 24 L24 12 L17 24 L8 18 Z"
      fill={accentColor}
      fillOpacity="0.4"
    />
    <path
      d="M10 34 C18 36, 30 36, 38 34 L40 18 L31 24 L24 12 L17 24 L8 18 Z"
    />

    {/* Bolitas en las puntas de la corona */}
    <circle cx="8" cy="17" r="1.8" fill={accentColor} />
    <circle cx="24" cy="11" r="2" fill={accentColor} />
    <circle cx="40" cy="17" r="1.8" fill={accentColor} />

    {/* Joyas o rayitas centrales de brillo */}
    <path d="M18 30 C24 32, 24 32, 30 30" strokeWidth={Math.max(1, strokeWidth - 0.5)} />
    <path d="M24 23 L24 26" strokeWidth={Math.max(1, strokeWidth - 0.5)} />
  </svg>
);

/**
 * 6. Destello Mágico / Limpieza (SparkleDoodle)
 * Estrella de 4 puntas estilo garabato con estrellas satélite
 */
export const SparkleDoodle = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  fill = 'none',
  accentColor = '#FFD166',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill={fill}
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block select-none ${className}`}
    {...props}
  >
    {/* Estrella central de 4 puntas orgánica */}
    <path
      d="M24 6 C24 16, 26 22, 36 24 C26 26, 24 32, 24 42 C24 32, 22 26, 12 24 C22 22, 24 16, 24 6 Z"
      fill={accentColor}
      fillOpacity="0.35"
    />
    <path
      d="M24 6 C24 16, 26 22, 36 24 C26 26, 24 32, 24 42 C24 32, 22 26, 12 24 C22 22, 24 16, 24 6 Z"
    />

    {/* Mini destello satélite 1 */}
    <path d="M37 10 L39 14 L43 14 L40 17 L41 21 L37 18 L34 21 L35 17 L32 14 L36 14 Z" strokeWidth={Math.max(1, strokeWidth - 0.8)} />

    {/* Mini destello satélite 2 (cruz simple) */}
    <path d="M9 35 L13 35" strokeWidth={Math.max(1, strokeWidth - 0.5)} />
    <path d="M11 33 L11 37" strokeWidth={Math.max(1, strokeWidth - 0.5)} />

    {/* Gotita de luz */}
    <circle cx="37" cy="36" r="1.5" fill={accentColor} stroke="none" />
  </svg>
);

/**
 * 7. Cinta Washi Tape (WashiTapeDoodle)
 * Tira de cinta adhesiva con extremos rasgados para pegar notas y fotos
 */
export const WashiTapeDoodle = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  fill = '#FFE5D9',
  patternColor = '#D8E2DC',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 32"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block select-none ${className}`}
    {...props}
  >
    {/* Cinta con bordes rasgados en zigzag a mano alzada */}
    <path
      d="M6 7 
         L58 5 
         L61 10 L59 15 L62 20 L58 25 L61 28 
         L8 29 
         L5 25 L8 20 L4 16 L7 11 L5 7 Z"
      fill={fill}
      fillOpacity="0.85"
    />
    <path
      d="M6 7 
         L58 5 
         L61 10 L59 15 L62 20 L58 25 L61 28 
         L8 29 
         L5 25 L8 20 L4 16 L7 11 L5 7 Z"
    />

    {/* Líneas de patrón decorativo a rayas en diagonal */}
    <path d="M16 6 L22 28" stroke={patternColor} strokeDasharray="2 3" strokeWidth={1.5} />
    <path d="M28 6 L34 28" stroke={patternColor} strokeDasharray="2 3" strokeWidth={1.5} />
    <path d="M40 5 L46 28" stroke={patternColor} strokeDasharray="2 3" strokeWidth={1.5} />
    <path d="M52 5 L57 26" stroke={patternColor} strokeDasharray="2 3" strokeWidth={1.5} />
  </svg>
);

/**
 * 8. Cara Relajada / Cero Dolor (RelaxedFaceDoodle)
 * Rostro pacífico con ojos cerrados sonrientes y expresión de alivio
 */
export const RelaxedFaceDoodle = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  fill = 'none',
  accentColor = '#B8F2E6',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill={fill}
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block select-none ${className}`}
    {...props}
  >
    {/* Contorno de cara circular imperfecto */}
    <circle
      cx="24"
      cy="24"
      r="18"
      fill={accentColor}
      fillOpacity="0.25"
    />
    <circle
      cx="24"
      cy="24"
      r="18"
    />

    {/* Trazo de sombra de boceto */}
    <path
      d="M8 20 C10 12, 16 7, 24 7"
      strokeOpacity="0.3"
      strokeWidth={Math.max(1, strokeWidth - 0.7)}
    />

    {/* Ojos cerrados sonrientes (estilo kawaii zen ^ ^) */}
    <path d="M15 22 C17 19, 20 19, 21 22" />
    <path d="M27 22 C28 19, 31 19, 33 22" />

    {/* Sonrisa serena */}
    <path d="M19 28 C22 31, 26 31, 29 28" />

    {/* Mejillas sonrosadas */}
    <ellipse cx="14" cy="25" rx="2.5" ry="1.5" fill="#FFB5A7" stroke="none" opacity="0.7" />
    <ellipse cx="34" cy="25" rx="2.5" ry="1.5" fill="#FFB5A7" stroke="none" opacity="0.7" />

    {/* Suspiro de paz: burbujita de relajación */}
    <path d="M37 14 C39 12, 41 13, 42 15" strokeWidth={Math.max(1, strokeWidth - 0.8)} />
  </svg>
);

/**
 * 9. Corazón Scribble (HeartScribbleDoodle)
 * Corazón garabateado a mano con trazos superpuestos y calidez
 */
export const HeartScribbleDoodle = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  fill = 'none',
  accentColor = '#FFCAD4',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill={fill}
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block select-none ${className}`}
    {...props}
  >
    {/* Relleno pastel de acuarela */}
    <path
      d="M24 14 C20 7, 10 9, 10 18 C10 27, 20 34, 24 38 C28 34, 38 27, 38 18 C38 9, 28 7, 24 14 Z"
      fill={accentColor}
      fillOpacity="0.45"
      stroke="none"
    />

    {/* Primer contorno de garabato */}
    <path
      d="M24 15 C21 8, 11 9, 11 18 C11 26, 21 34, 24 37 C27 34, 37 26, 37 18 C37 9, 27 8, 24 15 Z"
    />

    {/* Segundo contorno entrelazado imperfecto (scribble effect) */}
    <path
      d="M23 16 C19 10, 12 11, 13 20 C14 27, 22 33, 24 36 C26 33, 34 27, 35 20 C36 12, 29 11, 23 16"
      strokeOpacity="0.45"
      strokeWidth={Math.max(1, strokeWidth - 0.6)}
    />

    {/* Rayitas de brillo interior */}
    <path
      d="M15 17 C16 15, 18 15, 19 16"
      strokeOpacity="0.7"
      strokeWidth={Math.max(1, strokeWidth - 0.5)}
    />
  </svg>
);

/**
 * 10. Reloj de Arena / Tiempo Cita (ClockDoodle)
 * Reloj de arena estilo boceto con granos cayendo para medir tiempo de sillón
 */
export const ClockDoodle = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  className = '',
  fill = 'none',
  accentColor = '#FFE5B4',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill={fill}
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`inline-block select-none ${className}`}
    {...props}
  >
    {/* Base superior de madera con tornillo */}
    <path d="M12 9 L36 9" strokeWidth={strokeWidth + 0.5} />
    <path d="M15 7 L33 7" strokeWidth={Math.max(1, strokeWidth - 0.5)} strokeOpacity="0.5" />

    {/* Cristal del reloj de arena */}
    <path
      d="M15 10 C15 19, 22 22, 24 24 C26 22, 33 19, 33 10 Z"
      fill={accentColor}
      fillOpacity="0.3"
    />
    <path
      d="M15 38 C15 29, 22 26, 24 24 C26 26, 33 29, 33 38 Z"
      fill={accentColor}
      fillOpacity="0.3"
    />

    {/* Contorno del cristal */}
    <path d="M15 10 C15 19, 22 22, 24 24 C26 26, 33 29, 33 38 L15 38 C15 29, 22 26, 24 24 C26 22, 33 19, 33 10 Z" />

    {/* Base inferior de madera */}
    <path d="M12 39 L36 39" strokeWidth={strokeWidth + 0.5} />
    <path d="M15 41 L33 41" strokeWidth={Math.max(1, strokeWidth - 0.5)} strokeOpacity="0.5" />

    {/* Montículo de arena arriba */}
    <path d="M18 14 C21 16, 27 16, 30 14" strokeWidth={Math.max(1, strokeWidth - 0.6)} />

    {/* Grano / hilo de arena cayendo */}
    <path d="M24 24 L24 29" strokeDasharray="1.5 2" strokeWidth={1.5} />

    {/* Montículo de arena acumulada abajo */}
    <path
      d="M18 36 C20 32, 28 32, 30 36 Z"
      fill={color}
      fillOpacity="0.65"
      stroke="none"
    />
  </svg>
);

/**
 * Diccionario de todos los íconos doodle por clave para acceso dinámico
 */
export const DoodleIconMap = {
  HappyToothDoodle,
  ToothbrushDoodle,
  DentalMirrorDoodle,
  PinDoodle,
  CrownDoodle,
  SparkleDoodle,
  WashiTapeDoodle,
  RelaxedFaceDoodle,
  HeartScribbleDoodle,
  ClockDoodle,
};

/**
 * Componente genérico para renderizado dinámico por nombre
 */
export const DoodleIcon = ({ name, ...props }) => {
  const Component = DoodleIconMap[name];
  if (!Component) {
    return <HappyToothDoodle {...props} />;
  }
  return <Component {...props} />;
};

export default DoodleIconMap;
