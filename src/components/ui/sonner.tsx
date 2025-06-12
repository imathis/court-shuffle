import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--color-slate-100)",
          "--normal-text": "var(--color-slate-800)",
          "--normal-border": "var(--color-slate-300)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
