import { SiteLink as Link } from "@/components/ui/SiteLink";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "outline" | "text";

const variants: Record<Variant, string> = {
  outline:
    "min-h-11 rounded-control border border-ink px-4 hover:bg-ink hover:text-paper",
  text: "min-h-11 px-1 underline decoration-line-strong underline-offset-4 hover:decoration-ink",
};

type Props = { variant?: Variant; className?: string; children: ReactNode } & (
  | { href: string }
  | (Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
      href?: undefined;
    })
);

/**
 * Secondary actions: links that look like buttons, and real buttons.
 * Deliberately quieter than PlayButton, the only filled, shadowed control.
 */
export function Button({
  variant = "outline",
  className = "",
  children,
  ...props
}: Props) {
  const classes = `inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-100 ${variants[variant]} ${className}`;

  if (props.href === undefined)
    return (
      <button type="button" {...props} className={classes}>
        {children}
      </button>
    );

  return /^(https?:|mailto:)/.test(props.href) ? (
    <a href={props.href} className={classes}>
      {children}
    </a>
  ) : (
    <Link href={props.href} className={classes}>
      {children}
    </Link>
  );
}
