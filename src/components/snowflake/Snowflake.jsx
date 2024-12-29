"use client";

import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";

export function Snowflake({ size = 10, style }) {
  const [params, setParams] = useState({
    x: Math.random() * 100,
    y: -50,
    rotation: Math.random() * 360,
    xSpeed: Math.random() * 0.8 - 0.4, // More gentle horizontal movement
    ySpeed: 0.2 + Math.random() * 0.3, // Even slower, more consistent vertical speed
    rotationSpeed: (Math.random() * 1 - 0.5) * 0.5, // Gentler rotation
    wobble: Math.random() * Math.PI * 2, // Add wobble effect
    wobbleSpeed: 0.02 + Math.random() * 0.02, // Wobble speed
  });

  // Animation loop
  const animate = useCallback(() => {
    setParams((prev) => ({
      ...prev,
      x: prev.x + prev.xSpeed * 0.1,
      y: prev.y + prev.ySpeed * 0.5,
      rotation: prev.rotation + prev.rotationSpeed,
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, [animate]);

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        ...style,
        transform: `translate(${params.x}vw, ${params.y}vh) rotate(${params.rotation}deg)`,
        transition: "transform 0.05s linear",
      }}
    >
      <div
        className="text-[#cfdee7] opacity-80"
        style={{
          fontSize: size,
          lineHeight: 1,
        }}
      >
        ❄
      </div>
    </div>
  );
}

Snowflake.propTypes = {
  size: PropTypes.number,
  style: PropTypes.object,
};
