// src/components/TypingIndicator.jsx
import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="flex rounded-full p-1 items-center space-x-2 mx-5">
      <div className="w-2 h-2 bg-custom-blue rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-custom-blue rounded-full animate-bounce delay-75"></div>
      <div className="w-2 h-2 bg-custom-blue rounded-full animate-bounce delay-150"></div>
      <span className="text-custom-blue">Typing...</span>
    </div>
  );
}

export default TypingIndicator;
