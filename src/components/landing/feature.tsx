import { type LucideIcon } from "lucide-react";

export const Feature: React.FC<{
  title: string;
  desc: string;
  icon: LucideIcon;
}> = ({ title, desc, icon: Icon }) => (
  <div className="inline-grid gap-5">
    <div className="justify-self-center rounded-full border-2 border-indigo-800 bg-linear-to-br from-indigo-900 to-indigo-950 p-4 text-indigo-200 md:justify-self-start">
      <Icon size={30} />
    </div>
    <div>
      <h4 className="text-2xl font-bold text-indigo-100">{title}</h4>
      <p className="text-indigo-300">{desc}</p>
    </div>
  </div>
);
