import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[background-color,color,opacity,border-color,box-shadow] duration-200 ease-in-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        accent: "bg-accent text-accent-foreground shadow-xs hover:bg-accent/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "text-primary-foreground hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        subtle:
          "text-foreground bg-primary-foreground/80 hover:bg-primary-foreground dark:bg-slate-500/10 dark:hover:bg-slate-500/20",
        ghostInverted:
          "text-foreground hover:bg-primary-foreground dark:hover:bg-foreground/10",
        ghostInvertedAccent:
          "text-accent hover:bg-primary-foreground dark:hover:bg-foreground/10",
        link: "text-primary underline-offset-4 hover:underline",
        "text-toggle":
          "uppercase text-foreground opacity-50 hover:opacity-100 data-selected:opacity-100 data-selected:text-accent",
        "action-draw":
          "w-md max-w-[90vw] rounded-full bg-linear-to-br from-30% py-4 text-4xl font-extrabold text-slate-900 uppercase shadow-lg/40 transition-all duration-300 select-none text-shadow-xs from-accent to-accent-dark text-shadow-accent",
        "action-next":
          "w-md max-w-[90vw] rounded-full bg-linear-to-br from-30% py-4 text-4xl font-extrabold text-slate-950 shadow-lg/40 transition-all duration-300 select-none text-shadow-xs from-cyan-300 to-indigo-800 text-shadow-cyan-400/60",
        none: "",
      },
      size: {
        default: "h-9 text-md px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 text-lg rounded-md px-6 has-[>svg]:px-4",
        xl: "h-12 text-xl rounded-md px-6 has-[>svg]:px-4 [&_svg:not([class*='size-'])]:size-6",
        icon: "size-9 rounded-full [&_svg:not([class*='size-'])]:size-5",
        "icon-lg":
          "size-10 text-lg rounded-full [&_svg:not([class*='size-'])]:size-5",
        "icon-xl":
          "size-12 text-xl rounded-full [&_svg:not([class*='size-'])]:size-6",
        pill: "h-9 px-5 min-w-[100px] rounded-full [&_svg:not([class*='size-'])]:size-5 text-xl",
        "pill-lg":
          "h-10 px-5 min-w-[100px] rounded-full [&_svg:not([class*='size-'])]:size-5 text-xl",
        "pill-xl":
          "h-12 px-5 min-w-[100px] rounded-full [&_svg:not([class*='size-'])]:size-6 text-2xl",
        "4xl": "text-4xl p-4",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
