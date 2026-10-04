// Draws a die as its real silhouette (d4 triangle, d6 square, d8 diamond, d10 kite,
// d12 pentagon, d20 hexagon) with a number painted on its face.

const SHAPES = {
  4: { outline: <polygon points="50,6 95,90 5,90" />, facets: 'M50 6 L50 64 M5 90 L50 64 L95 90', textY: 74 },
  6: { outline: <rect x="10" y="10" width="80" height="80" rx="13" />, facets: 'M10 24 L24 10 M76 10 L90 24', textY: 63 },
  8: { outline: <polygon points="50,3 96,50 50,97 4,50" />, facets: 'M4 50 L96 50', textY: 64 },
  10: { outline: <polygon points="50,3 94,40 50,97 6,40" />, facets: 'M6 40 L28 50 L50 40 L72 50 L94 40 M28 50 L50 97 L72 50', textY: 78 },
  12: { outline: <polygon points="50,4 95,37 78,93 22,93 5,37" />, facets: 'M50 4 L50 24 M95 37 L76 44 M78 93 L66 75 M22 93 L34 75 M5 37 L24 44', textY: 63 },
  20: { outline: <polygon points="50,3 93,27 93,73 50,97 7,73 7,27" />, facets: 'M50 3 L27 66 L73 66 Z M7 27 L27 66 M93 27 L73 66 M7 73 L27 66 M93 73 L73 66 M50 97 L27 66 M50 97 L73 66', textY: 57 },
};

const DieShape = ({ sides, value, size = 56, kept = true, className = '', style }) => {
  const shape = SHAPES[sides] ?? SHAPES[sides === 100 ? 10 : 20];
  const label = value ?? (sides === 100 ? '%' : sides);
  const long = String(label).length;
  const fontSize = (long > 2 ? 24 : long > 1 ? 30 : 36) * (sides === 10 || sides === 100 ? 0.8 : 1);
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`${kept ? '' : 'opacity-40 grayscale'} ${className}`}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ivory" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f7f3e8" />
          <stop offset="1" stopColor="#d6ccb4" />
        </linearGradient>
      </defs>
      <g fill="url(#ivory)" stroke="#3b332a" strokeWidth="3" strokeLinejoin="round">{shape.outline}</g>
      <path d={shape.facets} fill="none" stroke="#3b332a" strokeOpacity="0.25" strokeWidth="2" />
      <text
        x="50"
        y={shape.textY}
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight="700"
        fill="#8b1e17"
      >
        {label}
      </text>
    </svg>
  );
};

export default DieShape;
