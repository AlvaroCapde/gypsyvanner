import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  variant?: "dark" | "light"; // refers to background it sits on
  size?: "md" | "lg" | "xl";
}

export default function Logo({ className = "", variant = "dark", size = "md" }: LogoProps) {
  const sizeClasses = {
    md: "w-12 h-10 sm:w-16 sm:h-12",
    lg: "w-32 h-24 sm:w-48 sm:h-36",
    xl: "w-48 h-36 sm:w-64 sm:h-48"
  }[size];

  return (

    <div className={`relative ${sizeClasses}`}>
      <Image
        src="/gvhs-logo.png"
        alt="GVHS México Logo"
        fill
        className="object-contain scale-[1.3]"
        priority
      />
    </div>

  );
}
