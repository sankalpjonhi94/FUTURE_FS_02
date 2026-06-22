import React from 'react';

const Loader = ({ size = 'md', fullScreen = false }) => {
  const sizes = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-4',
    lg: 'h-16 w-16 border-4',
  };

  const spinner = (
    <div className={`${sizes[size]} rounded-full border-blue-600 border-t-transparent animate-spin`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center items-center p-8">{spinner}</div>;
};

export default Loader;
