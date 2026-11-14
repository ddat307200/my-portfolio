import type { ReactNode } from "react";

/** Terminal-style frame: 1px border, top bar with a mono label (e.g. "web.ts") and an optional right slot. */
export function Frame({
  label,
  right,
  children,
  className = "",
  as: Tag = "div",
  ...rest
}: {
  label: ReactNode;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article" | "section";
} & Record<`data-${string}`, string | boolean | undefined>) {
  return (
    <Tag className={`frame ${className}`} {...rest}>
      <div className="frame-bar">
        <span className="truncate">{label}</span>
        {right}
      </div>
      {children}
    </Tag>
  );
}
