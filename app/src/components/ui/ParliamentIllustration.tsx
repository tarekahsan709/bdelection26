interface ParliamentIllustrationProps {
  className?: string;
}

export function ParliamentIllustration({
  className = '',
}: ParliamentIllustrationProps) {
  return (
    <svg
      viewBox='0 0 1000 500'
      fill='none'
      preserveAspectRatio='xMidYMax slice'
      className={className}
    >
      <defs>
        <mask id='centerMask'>
          <rect x='0' y='0' width='1000' height='500' fill='white' />
          <circle cx='500' cy='195' r='75' fill='black' />
          <circle cx='420' cy='95' r='22' fill='black' />
          <circle cx='500' cy='85' r='28' fill='black' />
          <circle cx='580' cy='95' r='22' fill='black' />
          <ellipse cx='500' cy='320' rx='55' ry='35' fill='black' />
        </mask>
        <mask id='leftBlockMask'>
          <rect x='0' y='0' width='1000' height='500' fill='white' />
          <polygon points='280,70 340,180 220,180' fill='black' />
          <circle cx='280' cy='235' r='50' fill='black' />
        </mask>
        <mask id='rightBlockMask'>
          <rect x='0' y='0' width='1000' height='500' fill='white' />
          <polygon points='720,70 780,180 660,180' fill='black' />
          <circle cx='720' cy='235' r='50' fill='black' />
        </mask>
        <pattern
          id='striations'
          patternUnits='userSpaceOnUse'
          width='1000'
          height='8'
        >
          <line
            x1='0'
            y1='4'
            x2='1000'
            y2='4'
            stroke='currentColor'
            strokeWidth='0.5'
            opacity='0.15'
          />
        </pattern>
        <linearGradient id='reflectionGrad' x1='0%' y1='0%' x2='0%' y2='100%'>
          <stop offset='0%' stopColor='currentColor' stopOpacity='0.15' />
          <stop offset='100%' stopColor='currentColor' stopOpacity='0' />
        </linearGradient>
      </defs>
      <g mask='url(#centerMask)'>
        <rect
          x='390'
          y='55'
          width='220'
          height='280'
          fill='currentColor'
          opacity='0.35'
        />
        <rect x='390' y='55' width='220' height='280' fill='url(#striations)' />
        <rect
          x='390'
          y='55'
          width='220'
          height='280'
          stroke='currentColor'
          strokeWidth='1.5'
          fill='none'
          opacity='0.6'
        />
      </g>
      <g mask='url(#leftBlockMask)'>
        <rect
          x='180'
          y='120'
          width='200'
          height='215'
          fill='currentColor'
          opacity='0.28'
        />
        <rect
          x='180'
          y='120'
          width='200'
          height='215'
          fill='url(#striations)'
        />
        <rect
          x='180'
          y='120'
          width='200'
          height='215'
          stroke='currentColor'
          strokeWidth='1.2'
          fill='none'
          opacity='0.5'
        />
      </g>
      <g mask='url(#rightBlockMask)'>
        <rect
          x='620'
          y='120'
          width='200'
          height='215'
          fill='currentColor'
          opacity='0.28'
        />
        <rect
          x='620'
          y='120'
          width='200'
          height='215'
          fill='url(#striations)'
        />
        <rect
          x='620'
          y='120'
          width='200'
          height='215'
          stroke='currentColor'
          strokeWidth='1.2'
          fill='none'
          opacity='0.5'
        />
      </g>
      <g>
        <rect
          x='60'
          y='200'
          width='120'
          height='135'
          fill='currentColor'
          opacity='0.2'
        />
        <rect x='60' y='200' width='120' height='135' fill='url(#striations)' />
        <rect
          x='60'
          y='200'
          width='120'
          height='135'
          stroke='currentColor'
          strokeWidth='1'
          fill='none'
          opacity='0.4'
        />
        <rect x='75' y='220' width='12' height='80' fill='#0c0c0c' />
        <rect x='95' y='220' width='12' height='80' fill='#0c0c0c' />
        <rect x='115' y='220' width='12' height='80' fill='#0c0c0c' />
        <rect x='135' y='220' width='12' height='80' fill='#0c0c0c' />
        <rect x='155' y='220' width='12' height='80' fill='#0c0c0c' />
      </g>
      <g>
        <rect
          x='820'
          y='200'
          width='120'
          height='135'
          fill='currentColor'
          opacity='0.2'
        />
        <rect
          x='820'
          y='200'
          width='120'
          height='135'
          fill='url(#striations)'
        />
        <rect
          x='820'
          y='200'
          width='120'
          height='135'
          stroke='currentColor'
          strokeWidth='1'
          fill='none'
          opacity='0.4'
        />
        <rect x='833' y='220' width='12' height='80' fill='#0c0c0c' />
        <rect x='853' y='220' width='12' height='80' fill='#0c0c0c' />
        <rect x='873' y='220' width='12' height='80' fill='#0c0c0c' />
        <rect x='893' y='220' width='12' height='80' fill='#0c0c0c' />
        <rect x='913' y='220' width='12' height='80' fill='#0c0c0c' />
      </g>
      <rect
        x='40'
        y='335'
        width='920'
        height='8'
        fill='currentColor'
        opacity='0.25'
      />
      <g opacity='0.4' transform='translate(0, 350) scale(1, -0.4)'>
        <rect
          x='390'
          y='55'
          width='220'
          height='280'
          fill='url(#reflectionGrad)'
        />
        <rect
          x='180'
          y='120'
          width='200'
          height='215'
          fill='url(#reflectionGrad)'
        />
        <rect
          x='620'
          y='120'
          width='200'
          height='215'
          fill='url(#reflectionGrad)'
        />
      </g>
      <g stroke='currentColor' opacity='0.1'>
        <line x1='100' y1='380' x2='900' y2='380' strokeWidth='0.5' />
        <line x1='150' y1='400' x2='850' y2='400' strokeWidth='0.5' />
        <line x1='200' y1='420' x2='800' y2='420' strokeWidth='0.5' />
        <line x1='250' y1='440' x2='750' y2='440' strokeWidth='0.5' />
      </g>
      <g stroke='currentColor' fill='none' opacity='0.5'>
        <circle cx='500' cy='195' r='75' strokeWidth='1' />
        <circle cx='420' cy='95' r='22' strokeWidth='0.8' />
        <circle cx='500' cy='85' r='28' strokeWidth='0.8' />
        <circle cx='580' cy='95' r='22' strokeWidth='0.8' />
        <ellipse cx='500' cy='320' rx='55' ry='35' strokeWidth='0.8' />
        <polygon points='280,70 340,180 220,180' strokeWidth='0.8' />
        <circle cx='280' cy='235' r='50' strokeWidth='0.8' />
        <polygon points='720,70 780,180 660,180' strokeWidth='0.8' />
        <circle cx='720' cy='235' r='50' strokeWidth='0.8' />
      </g>
    </svg>
  );
}
