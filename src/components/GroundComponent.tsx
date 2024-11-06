import { RigidBody } from "@react-three/rapier";

export default function GroundComponent() {
  
  return (
    <RigidBody type="fixed">
      <mesh receiveShadow position={[0, -0.5, 0]}>
        <boxGeometry args={[10, 1, 10]} />
        <meshStandardMaterial color="gray" />
      </mesh>
    </RigidBody>
  );
  
};