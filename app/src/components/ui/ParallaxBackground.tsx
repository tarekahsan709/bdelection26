export function ParallaxBackground() {
  return (
    <div className='fixed inset-0 pointer-events-none'>
      <div className='absolute inset-0 bg-[#0c0c0c]' />
      <div
        className='absolute inset-0 opacity-40'
        style={{
          background: `
            radial-gradient(ellipse 100% 80% at 10% 20%, rgba(13, 148, 136, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 90% 80%, rgba(245, 158, 11, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 40%)
          `,
        }}
      />
      <div
        className='absolute inset-0 opacity-[0.02]'
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      <div
        className='absolute inset-0'
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      />
    </div>
  );
}
