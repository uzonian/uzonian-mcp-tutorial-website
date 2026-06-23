import type { SVGProps } from "react";

/**
 * The shared Uzonian Dev brand mark — a rounded azure tile with a "UD"
 * monogram, matching the modules' square logo language (cf. the MCP module's
 * azure "MCP" tile). Used in the top bar and footer so the hub and every module
 * read as one product.
 */
export function BrandMark({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      role="img"
      aria-label="Uzonian Dev"
      className={className}
      {...props}
    >
      <rect width="64" height="64" rx="14" className="fill-azure-600" />
      <text
        x="50%"
        y="50%"
        dy="0.06em"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Segoe UI, system-ui, sans-serif"
        fontSize="24"
        fontWeight="700"
        fill="#ffffff"
      >
        UD
      </text>
    </svg>
  );
}
