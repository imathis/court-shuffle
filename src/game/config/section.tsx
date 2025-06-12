import clsx from "clsx";

export const ConfigSection: React.FC<{
  title?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
}> = ({ title, children, className, disabled = false }) => {
  return (
    <fieldset
      disabled={disabled}
      className={clsx(
        "flex flex-col transition-all duration-[250ms] ease-in-out",
        disabled ? "opacity-0 blur-sm" : "opacity-100 blur-[0px]",
        className,
      )}
    >
      {title ? (
        <h2 className="bg-black/30 py-4 text-center text-2xl font-bold uppercase dark:text-slate-200">
          {title}
        </h2>
      ) : null}
      <div className="px-4 py-3">{children}</div>
    </fieldset>
  );
};
