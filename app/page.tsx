"use client";

import React, { useRef, useState, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  Preload,
  AdaptiveEvents,
  Float,
  MeshDistortMaterial,
  Text,
  PresentationControls,
  BakeShadows,
  OrbitControls,
  Center,
} from "@react-three/drei";
import {
  useScroll,
  useTransform,
  motion,
  AnimatePresence,
} from "framer-motion";
import * as THREE from "three";

// --- INDUSTRIAL INVENTORY DATA ---
const PRODUCTS = [
  {
    id: "boot-apex",
    name: "K-LAK™ TITAN BOOT",
    price: 48500,
    category: "FOOTWEAR",
    weight: "1.2kg",
    rating: "S3 SRC",
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600",
    desc: "Steel-toe reinforcement with Kevlar mid-sole for puncture resistance.",
    specs: ["Impact Force: 200J", "Anti-static Base", "Oil Resistant"],
  },
  {
    id: "helm-carbon",
    name: "ONYX-SHELL™ V4",
    price: 18200,
    category: "HEADWEAR",
    weight: "450g",
    rating: "EN 397",
    img: "https://images.unsplash.com/photo-1590674899484-13da0d1b58f5?q=80&w=600",
    desc: "Carbon-fiber composite shell with 6-point suspension technology.",
    specs: [
      "Lateral Deformation Protection",
      "Molten Metal Splash Resistance",
      "Vented",
    ],
  },
  {
    id: "harness-pro",
    name: "APEX RIG™ FALL-ARREST",
    price: 42000,
    category: "HARNESS",
    weight: "2.1kg",
    rating: "ANSI Z359",
    img: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600",
    desc: "Integrated shock absorber with zero-gravity pressure distribution.",
    specs: ["5-Point Adjustment", "D-Ring Tensile: 5000lbs", "Breathable Mesh"],
  },
];

// --- 3D COMPONENT: HERO INDUSTRIAL ENGINE ---
function IndustrialCore({ scrollYProgress }: { scrollYProgress: any }) {
  const group = useRef<THREE.Group>(null);
  const rotY = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 6]);
  const sphereScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.8, 1.8, 1.2],
  ); // Slightly smaller for mobile safety

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = rotY.get();
      group.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.2;
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <mesh scale={sphereScale.get() as any}>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshDistortMaterial
            color="#FF6B00"
            speed={3}
            distort={0.4}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.8, 0.02, 16, 100]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#FF6B00"
            emissiveIntensity={2}
          />
        </mesh>
      </Float>
    </group>
  );
}

function ProductModel3D({ type }: { type: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.005;
  });
  return (
    <group ref={ref}>
      <Center>
        {type === "boot-apex" && (
          <group>
            <mesh position={[0, -0.6, 0]} castShadow>
              <boxGeometry args={[1.2, 0.3, 2.8]} />
              <meshStandardMaterial
                color="#111"
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
            <mesh position={[0, 0.6, -0.4]}>
              <boxGeometry args={[1, 2, 1.8]} />
              <meshStandardMaterial
                color="#FF6B00"
                wireframe
                transparent
                opacity={0.6}
              />
            </mesh>
          </group>
        )}
        {/* ... Other models remain same but wrapped in Center for auto-alignment ... */}
        {type === "helm-carbon" && (
          <mesh castShadow>
            <sphereGeometry
              args={[1.2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]}
            />
            <meshStandardMaterial
              color="#111"
              metalness={0.9}
              roughness={0.2}
            />
          </mesh>
        )}
        {type === "harness-pro" && (
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[1, 0.15, 16, 100]} />
            <meshStandardMaterial color="#FF6B00" wireframe />
          </mesh>
        )}
      </Center>
    </group>
  );
}

export default function KhaddyApex() {
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<
    (typeof PRODUCTS)[0] | null
  >(null);
  const [isMobile, setIsMobile] = useState(false);

  const container = useRef(null);
  const { scrollYProgress } = useScroll({ target: container });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const grandTotal = Object.entries(cart).reduce((acc, [id, qty]) => {
    const p = PRODUCTS.find((prod) => prod.id === id);
    return acc + (p ? p.price * qty : 0);
  }, 0);

  const addToCart = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setIsCartOpen(true);
    setViewingProduct(null);
  };

  const handleCheckout = () => {
    const orderId = Math.random().toString(36).toUpperCase().substring(2, 8);
    let msg = `*PURCHASE ORDER: #${orderId}*\n*CLIENT: KHADDY MULTI-CONCEPTS*\n\n`;
    Object.entries(cart).forEach(([id, qty]) => {
      const p = PRODUCTS.find((prod) => prod.id === id);
      if (qty > 0 && p)
        msg += `🔳 *${p.name}*\nQTY: ${qty} | Sub: ₦${(p.price * qty).toLocaleString()}\n\n`;
    });
    msg += `--------------------------\n*TOTAL: ₦${grandTotal.toLocaleString()}*`;
    window.open(
      `https://wa.me/2348000000000?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  return (
    <div
      ref={container}
      style={{ backgroundColor: "#080808", color: "#fff", overflowX: "hidden" }}
    >
      {/* Dynamic Border - Hidden on Mobile */}
      {!isMobile && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            border: "30px solid #080808",
            pointerEvents: "none",
            zIndex: 90,
          }}
        />
      )}

      {/* --- RESPONSIVE NAV --- */}
      <nav
        style={{
          position: "fixed",
          top: isMobile ? 20 : 40,
          left: isMobile ? 20 : 40,
          right: isMobile ? 20 : 40,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: isMobile ? "20px" : "60px",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontWeight: 900,
              letterSpacing: isMobile ? "4px" : "8px",
              fontSize: isMobile ? "0.9rem" : "1.2rem",
              color: "#FF6B00",
            }}
          >
            KHADDY.
          </span>
          {!isMobile && (
            <div
              style={{
                display: "flex",
                gap: "30px",
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "3px",
                color: "#444",
              }}
            >
              <span style={{ color: "#fff" }}>SYSTEMS</span>
              <span>LOGISTICS</span>
            </div>
          )}
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCartOpen(true)}
          style={{
            background: "#FF6B00",
            color: "#000",
            border: "none",
            padding: isMobile ? "8px 15px" : "12px 25px",
            fontWeight: 900,
            fontSize: "0.6rem",
          }}
        >
          {isMobile ? `[${totalItems}]` : `MANIFEST [${totalItems}]`}
        </motion.button>
      </nav>

      {/* --- HERO SECTION --- */}
      <section style={{ height: "180vh", position: "relative" }}>
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            style={{
              position: "absolute",
              zIndex: 10,
              textAlign: "center",
              width: "100%",
              padding: "0 20px",
              y: useTransform(scrollYProgress, [0, 0.2], [0, -150]),
              opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]),
            }}
          >
            <h1
              style={{
                fontSize: isMobile ? "18vw" : "12vw",
                fontWeight: 900,
                letterSpacing: isMobile ? "-2px" : "-8px",
                lineHeight: 0.8,
              }}
            >
              CORE
              <br />
              SAFETY.
            </h1>
            <p
              style={{
                color: "#444",
                letterSpacing: isMobile ? "4px" : "12px",
                marginTop: "20px",
                fontSize: "0.6rem",
              }}
            >
              ENGINEERED BY KHADDY MULTI-CONCEPTS
            </p>
          </motion.div>

          <Canvas
            shadows
            camera={{
              position: [0, 0, isMobile ? 10 : 8],
              fov: isMobile ? 50 : 40,
            }}
          >
            <Suspense fallback={null}>
              <PresentationControls
                global
                config={{ mass: 1, tension: 200 } as any}
                snap={{ mass: 2, tension: 400 } as any}
              >
                <IndustrialCore scrollYProgress={scrollYProgress} />
              </PresentationControls>
              <Environment preset="city" />
              <ContactShadows
                position={[0, -3, 0]}
                opacity={0.4}
                scale={15}
                blur={2}
              />
            </Suspense>
          </Canvas>
        </div>
      </section>

      {/* --- INVENTORY GRID --- */}
      <section
        style={{
          padding: isMobile ? "0 20px 100px" : "0 10% 150px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ marginBottom: isMobile ? "50px" : "100px" }}>
          <h2
            style={{ fontSize: isMobile ? "2.5rem" : "4rem", fontWeight: 900 }}
          >
            Inventory.
          </h2>
          <div
            style={{ height: "2px", width: "60px", background: "#FF6B00" }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit, minmax(400px, 1fr))",
            gap: isMobile ? "40px" : "80px",
          }}
        >
          {PRODUCTS.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #111",
                background: "#0a0a0a",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  height: isMobile ? "300px" : "450px",
                  position: "relative",
                }}
              >
                <img
                  src={p.img}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.5,
                  }}
                />
              </div>
              <div style={{ padding: isMobile ? "25px" : "40px" }}>
                <span style={{ fontSize: "0.6rem", color: "#444" }}>
                  {p.category}
                </span>
                <h3
                  style={{
                    fontSize: isMobile ? "1.4rem" : "1.8rem",
                    margin: "5px 0",
                  }}
                >
                  {p.name}
                </h3>
                <p
                  style={{
                    color: "#666",
                    fontSize: "0.85rem",
                    margin: "15px 0 30px",
                  }}
                >
                  {p.desc}
                </p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => setViewingProduct(p)}
                    style={{
                      flex: 1,
                      padding: "15px",
                      background: "none",
                      border: "1px solid #333",
                      color: "#fff",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                    }}
                  >
                    3D VIEW
                  </button>
                  <button
                    onClick={() => addToCart(p.id)}
                    style={{
                      flex: 1,
                      padding: "15px",
                      background: "#FF6B00",
                      color: "#000",
                      border: "none",
                      fontSize: "0.7rem",
                      fontWeight: 900,
                    }}
                  >
                    ADD
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- RESPONSIVE 3D INSPECTOR --- */}
      <AnimatePresence>
        {viewingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              background: "#080808",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <div
              style={{
                flex: 1,
                position: "relative",
                height: isMobile ? "50vh" : "auto",
              }}
            >
              <button
                onClick={() => setViewingProduct(null)}
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  zIndex: 10,
                  background: "none",
                  border: "none",
                  color: "#fff",
                  fontSize: "2rem",
                }}
              >
                ×
              </button>
              <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                <ProductModel3D type={viewingProduct.id} />
                <OrbitControls enableZoom={false} autoRotate />
                <Environment preset="studio" />
              </Canvas>
            </div>
            <div
              style={{
                flex: 1,
                padding: isMobile ? "30px" : "60px",
                borderLeft: isMobile ? "none" : "1px solid #111",
                borderTop: isMobile ? "1px solid #111" : "none",
              }}
            >
              <h2 style={{ fontSize: "2rem", fontWeight: 900 }}>
                {viewingProduct.name}
              </h2>
              <p
                style={{ color: "#FF6B00", fontWeight: 700, marginTop: "10px" }}
              >
                ₦{viewingProduct.price.toLocaleString()}
              </p>
              <div style={{ margin: "30px 0" }}>
                {viewingProduct.specs.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "10px 0",
                      borderBottom: "1px solid #111",
                      fontSize: "0.8rem",
                    }}
                  >
                    {s}
                  </div>
                ))}
              </div>
              <button
                onClick={() => addToCart(viewingProduct.id)}
                style={{
                  width: "100%",
                  background: "#FF6B00",
                  padding: "20px",
                  fontWeight: 900,
                  border: "none",
                }}
              >
                ADD TO MANIFEST
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CART DRAWER --- */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.8)",
                zIndex: 1000,
              }}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              style={{
                position: "fixed",
                right: 0,
                top: 0,
                height: "100vh",
                width: isMobile ? "100%" : "450px",
                background: "#0a0a0a",
                zIndex: 1001,
                padding: isMobile ? "30px" : "60px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2 style={{ fontSize: "1.5rem", fontWeight: 900 }}>
                  Manifest.
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#fff",
                    fontSize: "1.5rem",
                  }}
                >
                  ×
                </button>
              </div>
              <div style={{ marginTop: "40px", flex: 1 }}>
                {totalItems === 0 ? (
                  <p style={{ color: "#444" }}>Empty.</p>
                ) : (
                  <p>Items Ready: {totalItems}</p>
                )}
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: 40,
                  left: isMobile ? 30 : 60,
                  right: isMobile ? 30 : 60,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <span>TOTAL</span>
                  <span style={{ fontWeight: 900 }}>
                    ₦{grandTotal.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  style={{
                    width: "100%",
                    background: "#fff",
                    color: "#000",
                    padding: "20px",
                    fontWeight: 900,
                    border: "none",
                  }}
                >
                  ORDER ON WHATSAPP
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
