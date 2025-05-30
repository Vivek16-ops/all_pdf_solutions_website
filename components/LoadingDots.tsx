import React from 'react';

interface LoadingDotsProps {
  isDark?: boolean;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({ isDark = false }) => {
  return (
    <span className="inline-flex items-center">
      Converting
      <span className="flex ml-2">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className={`w-1.5 h-1.5 mx-0.5 rounded-full ${
              isDark ? 'bg-purple-400' : 'bg-purple-600'
            } animate-loading-dot`}
            style={{
              animationDelay: `${dot * 0.2}s`,
            }}
          />
        ))}
      </span>
    </span>
  );
};

export default LoadingDots;
