export function Logo({ 
  className = "", 
  variant = 'dark',
  hideText = false,
  size = "md"
}: { 
  className?: string;
  variant?: 'dark' | 'light';
  hideText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const textColor = variant === 'dark' ? 'text-[#0da143]' : 'text-white';
  
  const sizeMap = {
    sm: { svg: 24, text: 'text-xl' },
    md: { svg: 32, text: 'text-2xl' },
    lg: { svg: 40, text: 'text-3xl' },
    xl: { svg: 56, text: 'text-5xl' }
  };
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg 
        width={sizeMap[size].svg} 
        height={sizeMap[size].svg} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="shrink-0"
      >
        <path d="M30 36 V25 C30 15 38 7 50 7 C62 7 70 15 70 25 V36" stroke="#04bd36" strokeWidth="12" />
        <path d="M25 32 L15 85 C14 90 18 95 25 95 H75 C82 95 86 90 85 85 L75 32 C74 27 70 23 65 23 H35 C30 23 26 27 25 32 Z" fill="#04bd36" />
        <path d="M30 75 L70 45" stroke="#000000" strokeWidth="12" strokeLinecap="round" />
      </svg>
      {!hideText && (
        <span className={`font-bold tracking-tight ${sizeMap[size].text} ${textColor}`}>
          Slasham
        </span>
      )}
    </div>
  );
}
