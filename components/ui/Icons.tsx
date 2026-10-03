import type { SVGProps } from "react";

// Small inline icon set (24×24, stroke-based). Add icons here instead of pulling in a library.

type IconProps = SVGProps<SVGSVGElement>;

function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </Icon>
);

export const CompareIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3v18M5 7h4M15 7h4M3 15l3-8 3 8a3 3 0 01-6 0zM15 15l3-8 3 8a3 3 0 01-6 0z" />
  </Icon>
);

export const CalculatorIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01" />
  </Icon>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

export const ArrowLeftIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Icon>
);

export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
);

export const ShieldIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
  </Icon>
);

export const ChartIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </Icon>
);

export const LinkIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1" />
  </Icon>
);

export const MenuIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
);

export const LogoMark = (p: IconProps) => (
  <svg viewBox="0 0 32 32" aria-hidden {...p}>
    <rect width="32" height="32" rx="9" fill="var(--color-primary-600)" />
    <path
      d="M8 19.5l2-5.2a2 2 0 011.9-1.3h8.2a2 2 0 011.9 1.3l2 5.2M7.5 19.5h17v3h-17z"
      fill="none"
      stroke="#fff"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <circle cx="23" cy="9" r="3" fill="var(--color-accent-400)" />
  </svg>
);
