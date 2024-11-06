import { useLoader } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { TextureLoader } from 'three';

interface ModelProps {
  position: [x:number, y:number, z:number];
  args:  [x:number, y:number, z:number];
  image_url: string;
}

export default function BoxComponent({ position, args, image_url }: ModelProps) {
  
  const texture = useLoader(TextureLoader, image_url);
  
  return (
    <RigidBody>
    <mesh receiveShadow position={position}>
      <boxGeometry args={args} />
      <meshStandardMaterial
            attach={`material`}
            map={texture} 
            lightMap={texture}
            fog={true}
            />
    </mesh>
  </RigidBody>
  );
};