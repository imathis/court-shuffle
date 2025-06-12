import { useState, useEffect, FC, SVGProps, useRef } from "react";
import { CardName } from "@/store/types";
import { 
  cardCache, 
  cardFiles, 
  cardPathMap 
} from "./cardSvgUtils";

// Props for the CardSvg component
interface CardSvgProps extends SVGProps<SVGSVGElement> {
  name: CardName;
}

// Component to render an SVG card dynamically
const CardSvg: FC<CardSvgProps> = ({ name, ...rest }) => {
  const [loadingState, setLoadingState] = useState<
    "loading" | "loaded" | "error"
  >("loading");
  const [error, setError] = useState<string | null>(null);
  const componentRef = useRef<FC<SVGProps<SVGSVGElement>> | null>(null);

  // Check if component is cached
  const cachedComponent = cardCache.get(name);
  if (cachedComponent && !componentRef.current) {
    componentRef.current = cachedComponent;
    if (loadingState === "loading") {
      setLoadingState("loaded");
    }
  }

  useEffect(() => {
    // Skip if already loaded
    if (componentRef.current || loadingState === "loaded") {
      return;
    }

    let isMounted = true;

    const loadCard = async () => {
      const importPath = cardPathMap.get(name);
      if (!importPath || !cardFiles[importPath]) {
        if (isMounted) {
          setError(`Card SVG not found: ${name}`);
          setLoadingState("error");
        }
        return;
      }

      try {
        const cardModule = await cardFiles[importPath]();

        if (isMounted) {
          const Component = cardModule.default;

          if (typeof Component !== "function") {
            throw new Error(
              `Expected a React component function for ${name}, but got: ${typeof Component}`,
            );
          }

          componentRef.current = Component;
          cardCache.set(name, Component);
          setLoadingState("loaded");
        }
      } catch (_err) {
        if (isMounted) {
          setError(`Failed to load card: ${name}`);
          setLoadingState("error");
        }
      }
    };

    loadCard();

    return () => {
      isMounted = false;
    };
  }, [name, loadingState]);

  if (error || loadingState === "error") {
    return (
      <div style={{ color: "red", border: "1px solid red", padding: "10px" }}>
        Error: {error}
      </div>
    );
  }

  if (loadingState === "loading") {
    return (
      <div style={{ border: "1px solid blue", padding: "10px" }}>
        Loading {name}...
      </div>
    );
  }

  const IconComponent = componentRef.current;
  if (!IconComponent) {
    return (
      <div
        style={{ color: "orange", border: "1px solid orange", padding: "10px" }}
      >
        No component for {name}
      </div>
    );
  }

  // Fallback SVG for rendering errors
  const FallbackSvg: FC<SVGProps<SVGSVGElement>> = (props) => (
    <svg width="100" height="100" viewBox="0 0 100 100" {...props}>
      <rect width="100" height="100" fill="lightgray" />
      <text x="50" y="50" textAnchor="middle" fill="black">
        {name}
      </text>
    </svg>
  );

  try {
    return <IconComponent {...rest} />;
  } catch (_renderError) {
    return <FallbackSvg {...rest} />;
  }
};

export { CardSvg };
