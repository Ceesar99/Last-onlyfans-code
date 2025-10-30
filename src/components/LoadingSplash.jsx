// components/LoadingSplash.jsx
import React, { useState, useEffect, useCallback } from 'react';

const LoadingSplash = ({ children }) => {
  const [stage, setStage] = useState('logo'); // 'logo', 'spinner', 'fading'
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  // Fade out duration matches CSS transition
  const FADE_DURATION = 500;

  const handleComplete = useCallback(() => {
    setIsFading(true);
    setTimeout(() => {
      setIsVisible(false);
    }, FADE_DURATION);
  }, []);

  useEffect(() => {
    // Randomize times slightly for natural feel
    const logoTime = Math.random() * 2000 + 3000; // 3-5 seconds
    const logoTimer = setTimeout(() => {
      setStage('spinner');
      const spinnerTime = Math.random() * 1000 + 2000; // 2-3 seconds
      const spinnerTimer = setTimeout(() => {
        handleComplete();
      }, spinnerTime);
      return () => clearTimeout(spinnerTimer);
    }, logoTime);
    return () => clearTimeout(logoTimer);
  }, [handleComplete]);

  if (!isVisible) {
    return children; // Show the profile page content
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        opacity: isFading ? 0 : 1,
        transition: `opacity ${FADE_DURATION}ms ease-out`,
        pointerEvents: isFading ? 'none' : 'auto',
      }}
      role="status"
      aria-live="polite"
      aria-label="Loading..."
    >
      {stage === 'logo' && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="91"
          height="150"
          viewBox="0 0 91 150"
          style={{
            width: '91px',
            height: '150px',
            animation: 'breathe 800ms ease-in-out infinite',
          }}
          aria-hidden="true"
        >
          <image
            xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUg
