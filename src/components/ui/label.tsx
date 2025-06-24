import { cn } from "@/lib/utils";

export const Label: React.FC<{
  children: React.ReactNode;
  className: string | undefined;
}> = ({ children, className }) => (
  <label
    className={cn(
      "focus-visible:border-ring focus-visible:ring-ring/50 inline-flex shrink-0 items-center justify-center gap-2 rounded-md whitespace-nowrap outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none",
      "text-foreground rounded-xl bg-slate-500/10 p-3 text-center text-3xl font-extrabold uppercase select-none hover:opacity-100",
      "hover:bg-foreground hover:text-accent-foreground dark:border-input border shadow-xs",
      "transition-[background-color,color,opacity,border-color] duration-200 ease-in-out",
      "has-checked:bg-accent has-checked:text-slate-900 has-checked:opacity-100",
      className,
    )}
  >
    {children}
  </label>
);
