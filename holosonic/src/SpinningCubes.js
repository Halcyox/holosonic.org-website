// SpinningCubes.js
import React from 'react';
import { Canvas } from '@react-three/fiber';

function Box(props) {
  return (
    <mesh rotation={props.rotation}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={props.color} />
    </mesh>
  );
}

function SpinningCubes() {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box rotation={[0.5, 0.5, 0]} color="red" />
      <Box rotation={[0, 0.5, 0.5]} color="blue" position={[2, 0, 0]} />
      <Box rotation={[0.5, 0, 0.5]} color="green" position={[-2, 0, 0]} />
    </Canvas>
  );
}

export default SpinningCubes;
