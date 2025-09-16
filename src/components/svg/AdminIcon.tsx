interface AdminIconProps {
  className?: string;
  size?: number;
}

export default function AdminIcon({ className = "", size = 44 }: AdminIconProps) {
  return (
    <span className={`flex items-center justify-center rounded-full bg-blue-500 ${className}`} style={{ width: size, height: size }}>
      <svg
        className="text-white"
        width={size * 0.55}
        height={size * 0.55}
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C13.1046 2 14 2.89543 14 4C14 5.10457 13.1046 6 12 6C10.8954 6 10 5.10457 10 4C10 2.89543 10.8954 2 12 2ZM12 8C8.68629 8 6 10.6863 6 14V16C6 17.1046 6.89543 18 8 18H16C17.1046 18 18 17.1046 18 16V14C18 10.6863 15.3137 8 12 8ZM4 14C4 9.58172 7.58172 6 12 6C16.4183 6 20 9.58172 20 14V16C20 18.2091 18.2091 20 16 20H8C5.79086 20 4 18.2091 4 16V14Z"
        />
      </svg>
    </span>
  );
}
