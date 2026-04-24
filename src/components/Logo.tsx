export function Logo({ 
  className = "", 
  size = "md"
}: { 
  className?: string;
  variant?: 'dark' | 'light';
  hideText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const sizeMap = {
    sm: "h-16 scale-[2.5] origin-left mr-24 translate-y-2",
    md: "h-20 scale-[3] origin-left mr-40 translate-y-4",
    lg: "h-28 scale-[3.5] origin-left mr-48 translate-y-5",
    xl: "h-36 scale-[4] origin-left mr-56 translate-y-6"
  };
  
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/assets/slashamlogo.png" 
        alt="Slasham Logo" 
        className={`${sizeMap[size]} w-auto object-contain shrink-0`} 
      />
    </div>
  );
}
