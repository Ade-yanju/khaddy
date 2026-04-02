"use client";

import React, { useRef, useState, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  Float,
  MeshDistortMaterial,
  PresentationControls,
  OrbitControls,
  Center,
  Text,
} from "@react-three/drei";
import {
  useScroll,
  useTransform,
  motion,
  AnimatePresence,
} from "framer-motion";
import * as THREE from "three";

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
    specs: ["Lateral Deformation Protection", "Vented"],
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
    specs: ["5-Point Adjustment", "D-Ring Tensile: 5000lbs"],
  },
];

function IndustrialCore({
  scrollYProgress,
  isMobile,
}: {
  scrollYProgress: any;
  isMobile: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const rotY = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 4]);
  const sphereScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    isMobile ? [0.7, 1.4, 1] : [1, 2.2, 1.5],
  );

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = rotY.get();
      group.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.1;
    }
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh scale={sphereScale.get() as any}>
          <sphereGeometry args={[1, 64, 64]} />
          <MeshDistortMaterial
            color="#FF6B00"
            speed={4}
            distort={0.3}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[isMobile ? 1.4 : 1.8, 0.02, 16, 100]} />
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
  return (
    <Center>
      {type === "boot-apex" && (
        <mesh castShadow>
          <boxGeometry args={[1.5, 0.5, 2.5]} />
          <meshStandardMaterial color="#111" metalness={0.8} />
        </mesh>
      )}
      {type === "helm-carbon" && (
        <mesh castShadow>
          <sphereGeometry
            args={[1.2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]}
          />
          <meshStandardMaterial color="#FF6B00" />
        </mesh>
      )}
      {type === "harness-pro" && (
        <mesh castShadow rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1, 0.2, 16, 50]} />
          <meshStandardMaterial color="#555" wireframe />
        </mesh>
      )}
    </Center>
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
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    let msg = `*PO: #${orderId}*\n`;
    Object.entries(cart).forEach(([id, qty]) => {
      const p = PRODUCTS.find((prod) => prod.id === id);
      if (qty > 0 && p) msg += `- ${p.name} (x${qty})\n`;
    });
    msg += `*TOTAL: ₦${grandTotal.toLocaleString()}*`;
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
      {/* --- HEADER --- */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          padding: isMobile ? "20px" : "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 100,
          background:
            "linear-gradient(to bottom, rgba(8,8,8,1), rgba(8,8,8,0))",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: isMobile ? "15px" : "40px",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontWeight: 900,
              letterSpacing: "4px",
              fontSize: isMobile ? "1rem" : "1.2rem",
              color: "#FF6B00",
            }}
          >
            KHADDY.
          </span>
          {!isMobile && (
            <div
              style={{
                display: "flex",
                gap: "20px",
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "2px",
                color: "#444",
              }}
            >
              <span>SYSTEMS</span>
              <span>LOGISTICS</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCartOpen(true)}
          style={{
            background: "#FF6B00",
            color: "#000",
            border: "none",
            padding: isMobile ? "8px 12px" : "12px 24px",
            fontWeight: 900,
            fontSize: "0.65rem",
            cursor: "pointer",
          }}
        >
          {isMobile ? `[${totalItems}]` : `MANIFEST [${totalItems}]`}
        </button>
      </nav>

      {/* --- HERO --- */}
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
              opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]),
            }}
          >
            <h1
              style={{
                fontSize: isMobile ? "18vw" : "12vw",
                fontWeight: 900,
                letterSpacing: "-4px",
                lineHeight: 0.8,
                margin: 0,
              }}
            >
              CORE
              <br />
              SAFETY.
            </h1>
            <p
              style={{
                color: "#444",
                letterSpacing: "8px",
                marginTop: "10px",
                fontSize: "0.6rem",
              }}
            >
              INDUSTRIAL INFRASTRUCTURE
            </p>
          </motion.div>
          <Canvas
            shadows
            camera={{ position: [0, 0, isMobile ? 10 : 8], fov: 40 }}
          >
            <Suspense fallback={null}>
              <PresentationControls global snap>
                <IndustrialCore
                  scrollYProgress={scrollYProgress}
                  isMobile={isMobile}
                />
              </PresentationControls>
              <Environment preset="city" />
              <ContactShadows
                position={[0, -3, 0]}
                opacity={0.4}
                scale={10}
                blur={2}
              />
            </Suspense>
          </Canvas>
        </div>
      </section>

      {/* --- INVENTORY --- */}
      <section
        style={{
          padding: isMobile ? "20px" : "0 10% 100px",
          zIndex: 10,
          position: "relative",
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? "2.5rem" : "4rem",
            fontWeight: 900,
            margin: "0 0 40px",
          }}
        >
          Inventory.
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit, minmax(380px, 1fr))",
            gap: isMobile ? "20px" : "40px",
          }}
        >
          {PRODUCTS.map((p) => (
            <div
              key={p.id}
              style={{
                background: "#0c0c0c",
                border: "1px solid #1a1a1a",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <img
                src={p.img}
                alt={p.name}
                style={{
                  width: "100%",
                  height: isMobile ? "250px" : "350px",
                  objectFit: "cover",
                  opacity: 0.6,
                }}
              />
              <div style={{ padding: "25px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.6rem",
                      color: "#FF6B00",
                      fontWeight: 700,
                    }}
                  >
                    {p.category}
                  </span>
                  <span style={{ fontSize: "0.6rem", color: "#444" }}>
                    {p.rating}
                  </span>
                </div>
                <h3 style={{ fontSize: "1.4rem", margin: "0 0 10px" }}>
                  {p.name}
                </h3>
                <p
                  style={{
                    color: "#666",
                    fontSize: "0.85rem",
                    lineHeight: 1.5,
                    height: "3.2em",
                    overflow: "hidden",
                  }}
                >
                  {p.desc}
                </p>
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "20px" }}
                >
                  <button
                    onClick={() => setViewingProduct(p)}
                    style={{
                      flex: 1,
                      background: "none",
                      border: "1px solid #333",
                      color: "#fff",
                      padding: "12px",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    INSPECT
                  </button>
                  <button
                    onClick={() => addToCart(p.id)}
                    style={{
                      flex: 1,
                      background: "#FF6B00",
                      border: "none",
                      color: "#000",
                      padding: "12px",
                      fontSize: "0.7rem",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    ADD ITEM
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer
        style={{
          padding: isMobile ? "60px 20px" : "100px 10%",
          background: "#050505",
          borderTop: "1px solid #111",
          marginTop: "100px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: "40px",
          }}
        >
          <div>
            <h4
              style={{
                color: "#FF6B00",
                margin: "0 0 20px",
                letterSpacing: "3px",
              }}
            >
              KHADDY.
            </h4>
            <p style={{ color: "#444", fontSize: "0.75rem", lineHeight: 1.8 }}>
              Industrial Safety Infrastructure.
              <br />
              KUOLA, IBADAN, NIGERIA.
            </p>
          </div>
          {!isMobile &&
            ["Infrastructure", "Compliance"].map((col) => (
              <div key={col}>
                <h5
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "2px",
                    color: "#666",
                    margin: "0 0 20px",
                  }}
                >
                  {col.toUpperCase()}
                </h5>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    color: "#333",
                    fontSize: "0.75rem",
                  }}
                >
                  <span>Sales & Support</span>
                  <span>Technical Docs</span>
                </div>
              </div>
            ))}
        </div>
        <div
          style={{
            marginTop: "60px",
            paddingTop: "20px",
            borderTop: "1px solid #111",
            fontSize: "0.55rem",
            color: "#222",
            textAlign: "center",
          }}
        >
          © 2026 KHADDY MULTI-CONCEPTS.
        </div>
      </footer>

      {/* --- MODALS (3D Inspector & Cart) --- */}
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
                flex: isMobile ? "none" : 2,
                height: isMobile ? "50%" : "100%",
                position: "relative",
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
                  cursor: "pointer",
                }}
              >
                ×
              </button>
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ProductModel3D type={viewingProduct.id} />
                <OrbitControls enableZoom={false} autoRotate />
                <Environment preset="studio" />
              </Canvas>
            </div>
            <div
              style={{
                flex: 1,
                padding: isMobile ? "20px" : "60px",
                background: "#0a0a0a",
                borderLeft: isMobile ? "none" : "1px solid #111",
              }}
            >
              <h2 style={{ fontSize: "2rem", margin: 0 }}>
                {viewingProduct.name}
              </h2>
              <p
                style={{
                  color: "#FF6B00",
                  fontSize: "1.5rem",
                  fontWeight: 900,
                  margin: "10px 0 30px",
                }}
              >
                ₦{viewingProduct.price.toLocaleString()}
              </p>
              <button
                onClick={() => addToCart(viewingProduct.id)}
                style={{
                  width: "100%",
                  background: "#FF6B00",
                  padding: "20px",
                  fontWeight: 900,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                CONFIRM TO MANIFEST
              </button>
            </div>
          </motion.div>
        )}
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
                background: "rgba(0,0,0,0.9)",
                zIndex: 1000,
                backdropFilter: "blur(10px)",
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
                width: isMobile ? "100%" : "400px",
                background: "#080808",
                zIndex: 1001,
                padding: isMobile ? "30px" : "50px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "40px",
                }}
              >
                <h2 style={{ margin: 0 }}>Manifest.</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#fff",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>
              <div style={{ flex: 1, overflowY: "auto" }}>
                {Object.entries(cart).map(
                  ([id, qty]) =>
                    qty > 0 && (
                      <div
                        key={id}
                        style={{
                          marginBottom: "20px",
                          borderBottom: "1px solid #111",
                          paddingBottom: "10px",
                        }}
                      >
                        {PRODUCTS.find((p) => p.id === id)?.name} (x{qty})
                      </div>
                    ),
                )}
              </div>
              <div style={{ borderTop: "1px solid #111", paddingTop: "20px" }}>
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
                    cursor: "pointer",
                  }}
                >
                  CHECKOUT VIA WHATSAPP
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
