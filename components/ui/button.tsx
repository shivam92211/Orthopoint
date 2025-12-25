import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "accent";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    const classes = cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
      {
        "bg-primary text-primary-foreground hover:bg-primary/90":
          variant === "default",
        "bg-secondary text-secondary-foreground hover:bg-secondary/80":
          variant === "secondary",
        "bg-accent text-accent-foreground hover:bg-accent/90":
          variant === "accent",
        "border border-input hover:bg-accent hover:text-accent-foreground":
          variant === "outline",
        "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
        "bg-red-500 text-white hover:bg-red-600":
          variant === "destructive",
        "h-10 py-2 px-4": size === "default",
        "h-9 px-3 rounded-md": size === "sm",
        "h-11 px-8 rounded-md": size === "lg",
        "h-10 w-10": size === "icon",
      },
      className
    );

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: cn((children as any).props.className, classes),
        ref,
        ...props,
      });
    }

    const Comp = asChild ? "span" : "button";

    return (
      <Comp className={classes} ref={ref as any} {...props}>
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button };
