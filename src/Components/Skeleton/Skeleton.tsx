import "./Skeleton.css";

interface SkeletonProps {
  variant?: "text" | "title" | "subtitle" | "circle" | "card" | "row";
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton = ({
  variant = "text",
  className = "",
  style,
}: SkeletonProps) => {
  return (
    <div
      className={`skeleton skeleton--${variant} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};
