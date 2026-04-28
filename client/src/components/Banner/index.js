import React, { useRef } from "react";
import { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  useTexture,
  Center,
  ContactShadows,
  Environment,
} from "@react-three/drei";
import "./style.css";

const VEHICLE_URL = "/banner-assets/vehicle.glb";
const TREE_URL = "/banner-assets/tree.glb";
const HELI_URL = "/banner-assets/heli.glb";
const HDR_URL = "/banner-assets/env.hdr";

const TEXTURES = {
  metalnessMap: "/banner-assets/textures/metalness.jpg",
  map: "/banner-assets/textures/map.jpg",
  normalMap: "/banner-assets/textures/normal.jpg",
  roughnessMap: "/banner-assets/textures/roughness.jpg",
};

function Vehicle(props) {
  const { scene } = useGLTF(VEHICLE_URL);
  // <primitive /> merely throws an already existing threejs object into the scene.
  // You use it when you want to create an object imperatively, or when you get served one.
  // In this case THREE.GLTFLoader serves us a scene.
  return <primitive object={scene} {...props} />;
}

function Tree(props) {
  const { scene } = useGLTF(TREE_URL);
  return <primitive object={scene} {...props} />;
}

function Heli(props) {
  const group = useRef();
  const { scene } = useGLTF(HELI_URL);

  useFrame((state, delta) => {
    // This function runs 60 times/second, it binds this component to the render-loop.
    // On unmount this subscription is cleaned up automatically.
    const t = state.clock.getElapsedTime();

    // Make it float
    group.current.rotation.z = Math.sin(t / 1.5) / 10;
    group.current.rotation.x = Math.cos(t / 2) / 10;
    group.current.rotation.y = Math.sin(t / 2) / 10;
    group.current.position.y = 0.5 + (1 + Math.sin(t / 1.5)) / 5;
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

function TextureBall(props) {
  const textures = useTexture(TEXTURES);

  return (
    <mesh {...props}>
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshStandardMaterial metalness={1} {...textures} />
    </mesh>
  );
}

export default function BannerModel() {
  return (
    <Canvas className="canvas" dpr={[1, 2]} camera={{ position: [0, 2, 8] }}>
      <ambientLight intensity={0.2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Suspense fallback={null}>
        <Center alignTop>
          <Vehicle rotation={[0, Math.PI / 4, 0]} />
          <Tree position={[2, 0.5, 0]} />
          <Heli position={[4, -0.2, 0]} />
          <TextureBall position={[-2, 1, 0]} />
        </Center>
        <ContactShadows
          rotation-x={Math.PI / 2}
          opacity={0.5}
          width={10}
          height={10}
          blur={2}
          far={4}
        />
        <Environment files={HDR_URL} />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload(VEHICLE_URL);
useGLTF.preload(TREE_URL);
useGLTF.preload(HELI_URL);
