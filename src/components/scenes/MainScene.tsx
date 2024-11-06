import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import PlayerController from "@/components/PlayerController";
import BoxComponent from "@/components/BoxComponent";
import GroundComponent from "@/components/GroundComponent";

export default function MainScene() {

    return (
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Physics gravity={[0, -9.81, 0]}>
                <PlayerController />
                <GroundComponent />
                <axesHelper args={[10]} />
                <gridHelper args={[10, 20]} />
                <BoxComponent position={[4.9, 2, 0]} args={[0.1, 3, 3]} image_url={"/experience.png"}/>
                <BoxComponent position={[4.9, 2, 3.5]} args={[0.1, 3, 3]} image_url={"/underconstruction.png"}/>
                <BoxComponent position={[4.9, 2, -3.5]} args={[0.1, 3, 3]} image_url={"/comingsoon.png"}/>s
            </Physics>
            <OrbitControls />
        </Canvas>
    );
}
