import { AvatarProps } from "@radix-ui/react-avatar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AvatarWithInitialsProps extends AvatarProps {
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  bgColor?: string;
}

export function getInitials(name: string): string {
  if (!name) return "";
  
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export function AvatarWithInitials({
  name,
  className,
  size = "md",
  bgColor = "bg-primary",
  ...props
}: AvatarWithInitialsProps) {
  const initials = getInitials(name);
  
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base"
  };
  
  return (
    <Avatar 
      className={`${sizeClasses[size]} ${className}`} 
      {...props}
    >
      <AvatarFallback className={`${bgColor} text-white flex items-center justify-center`}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
