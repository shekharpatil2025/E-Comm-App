import { useEffect, useState, useRef } from "react";
import { HashRouter, Routes, Route, Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const canvasRef = useRef(null);
  const cardRef = useRef(null);

  // Custom subtle tilt state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const timeout = setTimeout(() => {
      navigate("/");
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.async = true;
    script.onload = () => {
      initThreeScene();
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initThreeScene = () => {
    if (!canvasRef.current || !window.THREE) return;

    const THREE = window.THREE;
    const canvas = canvasRef.current;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 7;

    // Soft architectural lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const warmLight = new THREE.PointLight(0xd4a853, 1.2, 40);
    warmLight.position.set(6, 6, 4);
    scene.add(warmLight);

    const coolLight = new THREE.PointLight(0xc94b2b, 0.8, 30);
    coolLight.position.set(-6, -6, 2);
    scene.add(coolLight);

    // Fine, minimalist stellar dust particles
    const starsCount = 1200;
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsCount * 3);
    const starColors = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i += 3) {
      const radius = 8 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      starPositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = radius * Math.cos(phi) - 3;

      // Classy gold/amber stellar dust palette
      const mixRatio = Math.random();
      if (mixRatio > 0.7) {
        starColors[i] = 0.83; // R
        starColors[i + 1] = 0.65; // G
        starColors[i + 2] = 0.32; // B
      } else {
        starColors[i] = 0.3; // Subtle space grey
        starColors[i + 1] = 0.3;
        starColors[i + 2] = 0.35;
      }
    }

    starsGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3),
    );
    starsGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(starColors, 3),
    );

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.08, // Very delicate tiny stars
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });

    const starParticles = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starParticles);

    // Floating geometries
    const geometries = [
      new THREE.IcosahedronGeometry(0.3, 0),
      new THREE.TorusGeometry(0.25, 0.08, 6, 20),
      new THREE.OctahedronGeometry(0.25, 0),
    ];

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4a853,
      metalness: 0.85,
      roughness: 0.3,
      wireframe: true,
    });

    const floatingMeshes = [];
    const numObjects = 8; // Fewer objects for clean design

    for (let i = 0; i < numObjects; i++) {
      const geom = geometries[Math.floor(Math.random() * geometries.length)];
      const mesh = new THREE.Mesh(geom, goldMaterial);

      mesh.position.x = (Math.random() - 0.5) * 12;
      mesh.position.y = (Math.random() - 0.5) * 8;
      mesh.position.z = (Math.random() - 0.5) * 4 - 1;

      mesh.userData = {
        spinX: (Math.random() - 0.5) * 0.01,
        spinY: (Math.random() - 0.5) * 0.01,
        floatSpeed: 0.001 + Math.random() * 0.002,
        offset: Math.random() * Math.PI * 2,
      };

      scene.add(mesh);
      floatingMeshes.push(mesh);
    }

    let clientMouseX = 0;
    let clientMouseY = 0;

    const onMouseMove = (event) => {
      clientMouseX = (event.clientX / window.innerWidth) * 2 - 1;
      clientMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    let clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Soft, ultra-smooth parallax camera follow
      camera.position.x += (clientMouseX * 0.8 - camera.position.x) * 0.04;
      camera.position.y += (clientMouseY * 0.8 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      starParticles.rotation.y = elapsedTime * 0.012;

      floatingMeshes.forEach((mesh) => {
        mesh.rotation.x += mesh.userData.spinX;
        mesh.rotation.y += mesh.userData.spinY;
        mesh.position.y +=
          Math.sin(elapsedTime * 1.5 + mesh.userData.offset) *
          mesh.userData.floatSpeed;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
    };
  };

  const handleCardMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;

    // Tiny, premium tilt angles (max 6 degrees for subtle class)
    const factorX = (y / (box.height / 2)) * -6;
    const factorY = (x / (box.width / 2)) * 6;

    setMousePos({ x: factorY, y: factorX });
  };

  const handleCardMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <>
      {}
      <style>{`
        * {
          box-sizing: border-box;
          user-select: none;
        }

        body {
          margin: 0;
          overflow: hidden;
          background: #040404;
        }

        .nf-page {
          min-height: 100vh;
          width: 100vw;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          background: radial-gradient(circle at 50% 50%, #16110d 0%, #060606 100%);
        }

        /* Subtle glowing elements */
        .ambient-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          z-index: 1;
        }

        .glow1 {
          width: 250px;
          height: 250px;
          background: rgba(212, 168, 83, 0.08);
          top: 20%;
          left: 20%;
        }

        .glow2 {
          width: 300px;
          height: 300px;
          background: rgba(201, 75, 43, 0.06);
          bottom: 15%;
          right: 20%;
        }

        /* Sleek Glassmorphism Container with compact bounds */
        .glass-perspective {
          perspective: 1000px;
          z-index: 10;
          width: 90%;
          max-width: 520px; /* Reduced from 800px to make it highly compact and sleek */
        }

        .glass {
          position: relative;
          padding: 40px 35px; /* Delicate, comfortable padding */
          border-radius: 20px; /* Refined soft edges */
          backdrop-filter: blur(25px) saturate(160%);
          -webkit-backdrop-filter: blur(25px) saturate(160%);
          background: rgba(14, 12, 10, 0.7);
          border: 1px solid rgba(212, 168, 83, 0.12);
          text-align: center;
          box-shadow: 
            0 30px 70px rgba(0, 0, 0, 0.7),
            inset 0 0 30px rgba(212, 168, 83, 0.02),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
          transform-style: preserve-3d;
          transition: transform 0.15s ease-out, box-shadow 0.4s;
        }

        .glass:hover {
          box-shadow: 
            0 40px 90px rgba(212, 168, 83, 0.08),
            inset 0 0 40px rgba(212, 168, 83, 0.04);
        }

        .depth-element {
          transform: translateZ(25px);
          transition: transform 0.3s ease;
        }

        .depth-element-far {
          transform: translateZ(45px);
          transition: transform 0.3s ease;
        }

        /* Minimalist luxury subtitle */
        .subtitle {
          color: rgba(212, 168, 83, 0.85);
          letter-spacing: 5px;
          margin-bottom: 8px;
          text-transform: uppercase;
          font-size: 11px;
          font-weight: 600;
        }

        /* Scaled down elegant 404 */
        .error {
          font-size: 96px; /* Reduced from 180px */
          margin: 0;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: 2px;
          background: linear-gradient(135deg, #ffe0a3 0%, #d4a853 50%, #b37722 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 8px 20px rgba(212, 168, 83, 0.15));
        }

        /* Perfectly sized headings */
        h2 {
          color: #f7f5f2;
          margin-top: 10px;
          margin-bottom: 8px;
          font-size: 22px; /* Reduced from 40px */
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        /* Compact, classy description */
        .desc {
          color: #bcbcbc;
          font-size: 14px; /* Reduced from 18px */
          line-height: 1.6;
          max-width: 400px;
          margin: 15px auto 25px auto;
          opacity: 0.9;
        }

        /* Minimalist sleek countdown element */
        .timer {
          color: #a3a3a3;
          font-size: 13px;
          margin-top: 20px;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .timer span {
          color: #0f0f0e;
          background: linear-gradient(135deg, #ffe4a5, #d4a853);
          font-size: 14px;
          font-weight: 800;
          padding: 2px 10px;
          border-radius: 6px;
          box-shadow: 0 3px 10px rgba(212, 168, 83, 0.2);
          display: inline-block;
          min-width: 28px;
        }

        /* Premium refined CTA Button */
        .btn {
          display: inline-block;
          margin-top: 25px;
          padding: 11px 32px; /* Tightened from 16px 45px */
          border-radius: 30px;
          text-decoration: none;
          font-weight: 600;
          font-size: 13px; /* Reduced from 16px */
          color: #0c0c0c;
          background: linear-gradient(135deg, #ffe39f 0%, #d4a853 100%);
          box-shadow: 0 6px 20px rgba(212, 168, 83, 0.2);
          transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          cursor: pointer;
        }

        .btn:hover {
          transform: translateY(-3px) translateZ(20px);
          box-shadow: 
            0 12px 25px rgba(212, 168, 83, 0.3),
            0 0 15px rgba(212, 168, 83, 0.1);
          background: linear-gradient(135deg, #ffffff 0%, #ffe39f 40%, #d4a853 100%);
        }

        /* WebGL Background Canvas */
        .three-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
        }

        /* Responsive scaling */
        @media (max-width: 768px) {
          .glass {
            padding: 30px 20px;
            border-radius: 16px;
          }

          .error {
            font-size: 76px;
          }

          h2 {
            font-size: 19px;
          }

          .desc {
            font-size: 13px;
          }
        }
      `}</style>

      {}
      <div className="nf-page">
        {/* ThreeJS Background Canvas */}
        <canvas ref={canvasRef} className="three-canvas" />

        {/* Ambient Glows */}
        <div className="ambient-glow glow1"></div>
        <div className="ambient-glow glow2"></div>

        {/* Premium 3D Glass Card */}
        <div className="glass-perspective">
          <div
            ref={cardRef}
            className="glass"
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            style={{
              transform: `rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg)`,
            }}
          >
            {/* Minimalist Subtitle */}
            <div className="subtitle depth-element">TELUSKO E-COMMERCE</div>

            {/* Premium sized "404" */}
            <h1 className="error depth-element-far">404</h1>

            {/* Well-proportioned Headings */}
            <h2 className="depth-element">Page Not Found</h2>

            <p className="desc depth-element">
              The page you are looking for doesn't exist, may have been removed,
              or the URL is incorrect.
            </p>

            {/* Timer Badge */}
            <div className="timer depth-element">
              Redirecting to Home in <span>{countdown}</span> seconds
            </div>

            {/* Subtle CTA */}
            <Link className="btn depth-element-far" to="/">
              🏠 Go to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
