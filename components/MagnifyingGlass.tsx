/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

interface MagnifyingGlassProps {
  src: string;
  position: { x: number; y: number };
  visible: boolean;
  size?: number;
  zoomLevel?: number;
}

const MagnifyingGlass: React.FC<MagnifyingGlassProps> = ({
  src,
  position,
  visible,
  size = 150,
  zoomLevel = 2,
}) => {
  const lensRadius = size / 2;

  return (
    <div
      style={{
        display: visible ? 'block' : 'none',
        position: 'absolute',
        pointerEvents: 'none',
        height: `${size}px`,
        width: `${size}px`,
        top: `${position.y - lensRadius}px`,
        left: `${position.x - lensRadius}px`,
        border: '3px solid white',
        borderRadius: '50%',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        backgroundImage: `url("${src}")`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: `calc(100% * ${zoomLevel}) calc(100% * ${zoomLevel})`,
        backgroundPosition: `-${(position.x * zoomLevel) - lensRadius}px -${(position.y * zoomLevel) - lensRadius}px`,
        zIndex: 50,
      }}
    />
  );
};

export default MagnifyingGlass;
