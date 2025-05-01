// src/components/ParticleAnimation.jsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ParticleAnimation = () => {
  const mountRef = useRef(null);
  const isMounted = useRef(true);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(100, 100);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for device pixel ratio
    mountRef.current.appendChild(renderer.domElement);

    const particleCount = 50; // Reduced from 100 to 50
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      velocities[i * 3] = (Math.random() - 0.5) * 0.05; // Reduced speed
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xF06292,
      size: 0.2,
      transparent: true,
      opacity: 0.8,
    });

    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Simplified lines (fewer connections)
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];
    const maxDistance = 4; // Increased to reduce the number of lines

    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (distance < maxDistance) {
          linePositions.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
          );
        }
      }
    }

    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xF06292, opacity: 0.3, transparent: true });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    camera.position.z = 15;

    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (event) => {
      if (!isMounted.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      if (!isMounted.current) return;
      requestAnimationFrame(animate);

      const positionsArray = particleSystem.geometry.attributes.position.array;
      const linePositionsArray = lines.geometry.attributes.position.array;

      for (let i = 0; i < particleCount; i++) {
        positionsArray[i * 3] += velocities[i * 3];
        positionsArray[i * 3 + 1] += velocities[i * 3 + 1];
        positionsArray[i * 3 + 2] += velocities[i * 3 + 2];

        if (Math.abs(positionsArray[i * 3]) > 5) velocities[i * 3] *= -1;
        if (Math.abs(positionsArray[i * 3 + 1]) > 5) velocities[i * 3 + 1] *= -1;
        if (Math.abs(positionsArray[i * 3 + 2]) > 5) velocities[i * 3 + 2] *= -1;
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;

      // Update lines less frequently (every 5 frames)
      if (Math.random() > 0.8) {
        linePositions.length = 0;
        for (let i = 0; i < particleCount; i++) {
          for (let j = i + 1; j < particleCount; j++) {
            const dx = positionsArray[i * 3] - positionsArray[j * 3];
            const dy = positionsArray[i * 3 + 1] - positionsArray[j * 3 + 1];
            const dz = positionsArray[i * 3 + 2] - positionsArray[j * 3 + 2];
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (distance < maxDistance) {
              linePositions.push(
                positionsArray[i * 3], positionsArray[i * 3 + 1], positionsArray[i * 3 + 2],
                positionsArray[j * 3], positionsArray[j * 3 + 1], positionsArray[j * 3 + 2]
              );
            }
          }
        }
        lines.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        lines.geometry.attributes.position.needsUpdate = true;
      }

      particleSystem.rotation.y = mouseX * 0.5;
      particleSystem.rotation.x = mouseY * 0.5;
      lines.rotation.y = mouseX * 0.5;
      lines.rotation.x = mouseY * 0.5;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!isMounted.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      isMounted.current = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-16 h-16" />;
};

export default ParticleAnimation;