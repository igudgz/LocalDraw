import type { HTMLAttributes } from "react";

type PanelProps = HTMLAttributes<HTMLElement>;

export function Panel(props: PanelProps) {
  return <section {...props} />;
}
