interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function Logo({ className = "", width = 40, height = 40 }: LogoProps) {
  return (
    <div className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 ${className}`} style={{ width, height }}>
      <svg
        width={width * 0.5}
        height={height * 0.5}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 5.14v13.72L19 12L8 5.14z"
          fill="white"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
