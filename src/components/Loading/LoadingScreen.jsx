import React, { useState, useEffect } from 'react';

const LoadingScreen = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [loadingText, setLoadingText] = useState('Initializing Research Modules...');

  const loadingMessages = [
    'Initializing Research Modules...',
    'Loading Scientific Data...',
    'Preparing Analytics...',
    ' almost ready...',
    'Welcome to BIRSTBD'
  ];

  useEffect(() => {
    let progressInterval;
    let messageIndex = 0;

    const updateProgress = () => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setIsVisible(false);
          }, 800);
          return 100;
        }
        return prev + Math.random() * 12 + 3;
      });
    };

    const updateMessage = () => {
      setLoadingText(loadingMessages[messageIndex]);
      messageIndex = (messageIndex + 1) % loadingMessages.length;
    };

    progressInterval = setInterval(updateProgress, 150);
    const messageInterval = setInterval(updateMessage, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
      <div className="text-center">
        {/* Company Logo */}
        <img
          src="https://ik.imagekit.io/2lax2ytm2/Logo-v1%20(1).png"
          alt="Redleaf-BD Logo"
          className="w-64 h-64 md:w-80 md:h-80 mx-auto object-contain animate-pulse"
        />
      </div>
    </div>
  );
};

export default LoadingScreen;