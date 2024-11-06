import React, { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useKeyboardControls } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import { useControls } from "leva";

export default function PlayerController() {
    const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED } = useControls(
      "Player Control",
      {
        WALK_SPEED: { value: 0.8, min: 0.1, max: 4, step: 0.1 },
        RUN_SPEED: { value: 1.6, min: 0.2, max: 12, step: 0.1 },
        ROTATION_SPEED: {
          value: degToRad(0.5),
          min: degToRad(0.1),
          max: degToRad(5),
          step: degToRad(0.1),
        },
      }
    );
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const rb = useRef<any>(null);
    const container = useRef<any>(null);
    const Player = useRef<any>(null);
    const cameraTarget = useRef<any>(null);
    const cameraPosition = useRef<any>(null);
    /* eslint-enable @typescript-eslint/no-explicit-any */

    /* const [animation, setAnimation] = useState("idle"); */
  
    const PlayerRotationTarget = useRef(0);
    const rotationTarget = useRef(0);
    const cameraWorldPosition = useRef(new THREE.Vector3());
    const cameraLookAtWorldPosition = useRef(new THREE.Vector3());
    const cameraLookAt = useRef(new THREE.Vector3());
    const [, get] = useKeyboardControls();
    const isClicking = useRef<boolean>(false);
  
    useEffect(() => {
      const onMouseDown = () => {
        isClicking.current = true;
      };
      const onMouseUp = () => {
        isClicking.current = false;
      };
      document.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mouseup", onMouseUp);
      // touch
      document.addEventListener("touchstart", onMouseDown);
      document.addEventListener("touchend", onMouseUp);
      return () => {
        document.removeEventListener("mousedown", onMouseDown);
        document.removeEventListener("mouseup", onMouseUp);
        document.removeEventListener("touchstart", onMouseDown);
        document.removeEventListener("touchend", onMouseUp);
      };
    }, []);
  
    useFrame(({ camera, mouse }) => {
      if (rb.current) {
        const vel = rb.current.linvel();
  
        const movement = {
          x: 0,
          z: 0,
        };
  
        if (get().forward) {
          movement.z = 1;
        }
        if (get().back) {
          movement.z = -1;
        }
  
        let speed = get().run ? RUN_SPEED : WALK_SPEED;
  
        if (isClicking.current) {
          console.log("clicking", mouse.x, mouse.y);
          if (Math.abs(mouse.x) > 0.1) {
            movement.x = -mouse.x;
          }
          movement.z = mouse.y + 0.4;
          if (Math.abs(movement.x) > 0.5 || Math.abs(movement.z) > 0.5) {
            speed = RUN_SPEED;
          }
        }
  
        if (get().left) {
          movement.x = 1;
        }
        if (get().right) {
          movement.x = -1;
        }
  
        if (movement.x !== 0) {
          rotationTarget.current += ROTATION_SPEED * movement.x;
        }
  
        if (movement.x !== 0 || movement.z !== 0) {
          PlayerRotationTarget.current = Math.atan2(movement.x, movement.z);
          vel.x =
            Math.sin(rotationTarget.current + PlayerRotationTarget.current) *
            speed;
          vel.z =
            Math.cos(rotationTarget.current + PlayerRotationTarget.current) *
            speed;
          if (speed === RUN_SPEED) {
            /* setAnimation("run"); */
          } else {
            /* setAnimation("walk"); */
          }
        } else {
          /* setAnimation("idle"); */
        }
        Player.current.rotation.y = lerpAngle(
          Player.current.rotation.y,
          PlayerRotationTarget.current,
          0.1
        );
  
        rb.current.setLinvel(vel, true);
      }
  
      // CAMERA
      container.current.rotation.y = THREE.MathUtils.lerp(
        container.current.rotation.y,
        rotationTarget.current,
        0.1
      );
  
      cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
      camera.position.lerp(cameraWorldPosition.current, 0.1);
  
      if (cameraTarget.current) {
        cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
        cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);
  
        camera.lookAt(cameraLookAt.current);
      }
    });
  
    return (
      <RigidBody colliders={false} lockRotations ref={rb}>
        <group ref={container}>
          <group ref={cameraTarget} position-z={1.5} />
          <group ref={cameraPosition} position-y={4} position-z={-4} />
          <mesh ref={Player}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" />
          </mesh>
        </group>
        <CapsuleCollider args={[0.08, 0.15]} />
      </RigidBody>
    );
  };
  
  const lerpAngle = (start: number, end: number, t: number) => {
    start = normalizeAngle(start);
    end = normalizeAngle(end);
  
    if (Math.abs(end - start) > Math.PI) {
      if (end > start) {
        start += 2 * Math.PI;
      } else {
        end += 2 * Math.PI;
      }
    }
  
    return normalizeAngle(start + (end - start) * t);
  };
  
  const normalizeAngle = (angle: number) => {
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;
    return angle;
  };

  /* to be implemented
  function Projectile({ position, direction }: { position: THREE.Vector3; direction: THREE.Vector3 }) {
    const ref = useRef<any>(null);
  
    useFrame(() => {
      if (ref.current) {
        const speed = 10;
        const velocity = new THREE.Vector3().copy(direction).multiplyScalar(speed);
        ref.current.setLinvel(velocity);
      }
    });
  
    return (
      <RigidBody ref={ref} position={[position.x, position.y, position.z]} colliders="ball" mass={0.1}>
        <mesh>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="yellow" />
        </mesh>
      </RigidBody>
    );
  } */


