'use client';

import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
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
  Center
} from '@react-three/drei';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// --- INDUSTRIAL INVENTORY DATA ---
const PRODUCTS = [
  { 
    id: 'boot-apex', 
    name: 'K-LAK™ TITAN BOOT', 
    price: 48500, 
    category: 'FOOTWEAR', 
    weight: '1.2kg',
    rating: 'S3 SRC',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600',
    desc: 'Steel-toe reinforcement with Kevlar mid-sole for puncture resistance.',
    specs: ['Impact Force: 200J', 'Anti-static Base', 'Oil Resistant']
  },
  { 
    id: 'helm-carbon', 
    name: 'ONYX-SHELL™ V4', 
    price: 18200, 
    category: 'HEADWEAR', 
    weight: '450g',
    rating: 'EN 397',
    img: 'https://images.unsplash.com/photo-1590674899484-13da0d1b58f5?q=80&w=600',
    desc: 'Carbon-fiber composite shell with 6-point suspension technology.',
    specs: ['Lateral Deformation Protection', 'Molten Metal Splash Resistance', 'Vented']
  },
  { 
    id: 'harness-pro', 
    name: 'APEX RIG™ FALL-ARREST', 
    price: 42000, 
    category: 'HARNESS', 
    weight: '2.1kg',
    rating: 'ANSI Z359',
    img: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=600',
    desc: 'Integrated shock absorber with zero-gravity pressure distribution.',
    specs: ['5-Point Adjustment', 'D-Ring Tensile: 5000lbs', 'Breathable Mesh']
  }
];

// --- 3D COMPONENT: HERO INDUSTRIAL ENGINE ---
function IndustrialCore({ scrollYProgress }: { scrollYProgress: any }) {
  const group = useRef<THREE.Group>(null);
  
  const rotY = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 6]);
  const sphereScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 2.2, 1.5]);

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
          <MeshDistortMaterial color="#FF6B00" speed={3} distort={0.4} metalness={0.9} roughness={0.1} />
        </mesh>
        
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.8, 0.02, 16, 100]} />
          <meshStandardMaterial color="#ffffff" emissive="#FF6B00" emissiveIntensity={2} />
        </mesh>

        <Text position={[2.5, 0, 0]} fontSize={0.2} color="white" font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf">
          ISO-9001 CERTIFIED
        </Text>
      </Float>
    </group>
  );
}

// --- 3D COMPONENT: PROCEDURAL CAD PRODUCT VIEWER ---
function ProductModel3D({ type }: { type: string }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.005;
  });

  // Procedural abstract CAD representations of the products
  return (
    <group ref={ref}>
      <Center>
        {type === 'boot-apex' && (
          <group>
            <mesh position={[0, -0.6, 0]} castShadow>
              <boxGeometry args={[1.2, 0.3, 2.8]} />
              <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.6, -0.4]}>
              <boxGeometry args={[1, 2, 1.8]} />
              <meshStandardMaterial color="#FF6B00" wireframe transparent opacity={0.6} />
            </mesh>
            <mesh position={[0, -0.2, 1.1]}>
              <sphereGeometry args={[0.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#fff" metalness={1} roughness={0.1} />
            </mesh>
          </group>
        )}

        {type === 'helm-carbon' && (
          <group>
            <mesh position={[0, 0, 0]} castShadow>
              <sphereGeometry args={[1.2, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#111" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, -0.2, 0.9]} rotation={[-0.2, 0, 0]}>
              <boxGeometry args={[1.8, 0.6, 0.8]} />
              <meshStandardMaterial color="#FF6B00" transparent opacity={0.7} emissive="#FF6B00" emissiveIntensity={0.5} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.2, 0]}>
              <torusGeometry args={[1.25, 0.05, 16, 100]} />
              <meshStandardMaterial color="#fff" wireframe />
            </mesh>
          </group>
        )}

        {type === 'harness-pro' && (
          <group>
            <mesh rotation={[Math.PI / 4, 0, 0]} position={[0, 0.5, 0]}>
              <torusGeometry args={[1, 0.15, 16, 100]} />
              <meshStandardMaterial color="#FF6B00" wireframe />
            </mesh>
            <mesh rotation={[-Math.PI / 4, 0, 0]} position={[0, -0.5, 0]}>
              <torusGeometry args={[1, 0.15, 16, 100]} />
              <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0, -1]}>
              <boxGeometry args={[0.4, 0.6, 0.2]} />
              <meshStandardMaterial color="#fff" metalness={1} roughness={0} />
            </mesh>
          </group>
        )}
      </Center>
    </group>
  );
}

// --- MAIN PAGE ---
export default function KhaddyApex() {
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const container = useRef(null);
  const { scrollYProgress } = useScroll({ target: container });

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const grandTotal = Object.entries(cart).reduce((acc, [id, qty]) => {
    const p = PRODUCTS.find(prod => prod.id === id);
    return acc + (p ? p.price * qty : 0);
  }, 0);

  const addToCart = (id: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setIsCartOpen(true);
    setViewingProduct(null); // Close 3D viewer if open
  };

  const handleCheckout = () => {
    const orderId = Math.random().toString(36).toUpperCase().substring(2, 8);
    let msg = `*PURCHASE ORDER: #${orderId}*\n*CLIENT: KHADDY MULTI-CONCEPTS*\n\n`;
    Object.entries(cart).forEach(([id, qty]) => {
      const p = PRODUCTS.find(prod => prod.id === id);
      if (qty > 0 && p) msg += `🔳 *${p.name}*\nQTY: ${qty} | Sub: ₦${(p.price * qty).toLocaleString()}\n\n`;
    });
    msg += `--------------------------\n*ESTIMATED TOTAL: ₦${grandTotal.toLocaleString()}*\n--------------------------\n_Dispatch from Ibadan Hub_`;
    window.open(`https://wa.me/2348000000000?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div ref={container} style={{ backgroundColor: '#080808', color: '#fff', overflowX: 'hidden' }}>
      
      {/* Cinematic Overlays */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999, opacity: 0.03, background: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />
      <div style={{ position: 'fixed', inset: 0, border: '40px solid #080808', pointerEvents: 'none', zIndex: 90 }} />

      {/* --- ELITE NAV --- */}
      <nav style={{ position: 'fixed', top: 40, left: 40, right: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
        <div style={{ display: 'flex', gap: '60px', alignItems: 'center' }}>
          <span style={{ fontWeight: 900, letterSpacing: '8px', fontSize: '1.2rem', color: '#FF6B00' }}>KHADDY.</span>
          <div style={{ display: 'flex', gap: '30px', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '3px', color: '#444', textTransform: 'uppercase' }}>
            <span style={{ color: '#fff' }}>Systems</span>
            <span>Logistics</span>
            <span>Enterprise</span>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCartOpen(true)}
          style={{ background: '#FF6B00', color: '#000', border: 'none', padding: '12px 25px', borderRadius: '2px', fontWeight: 900, cursor: 'pointer', fontSize: '0.7rem' }}
        >
          MANIFEST [{totalItems}]
        </motion.button>
      </nav>

      {/* --- HERO SECTION --- */}
      <section style={{ height: '200vh', position: 'relative' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          <motion.div style={{ position: 'absolute', zIndex: 10, textAlign: 'center', y: useTransform(scrollYProgress, [0, 0.2], [0, -200]), opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }}>
            <h1 style={{ fontSize: '12vw', fontWeight: 900, letterSpacing: '-8px', lineHeight: 0.8, margin: 0 }}>CORE<br/>SAFETY.</h1>
            <p style={{ color: '#444', letterSpacing: '12px', marginTop: '20px', fontSize: '0.8rem' }}>ENGINEERED BY KHADDY MULTI-CONCEPTS</p>
          </motion.div>

          <Canvas shadows camera={{ position: [0, 0, 8], fov: 40 }}>
            <Suspense fallback={null}>
              <PresentationControls global config={{ mass: 1, tension: 200 }} snap={{ mass: 2, tension: 400 }}>
                <IndustrialCore scrollYProgress={scrollYProgress} />
              </PresentationControls>
              <Environment preset="city" />
              <ContactShadows position={[0, -3, 0]} opacity={0.5} scale={15} blur={1.5} />
              <BakeShadows />
              <AdaptiveEvents />
            </Suspense>
          </Canvas>
        </div>
      </section>

      {/* --- INVENTORY GRID --- */}
      <section style={{ padding: '0 10% 150px 10%', position: 'relative', zIndex: 10 }}>
        <div style={{ marginBottom: '100px' }}>
          <h2 style={{ fontSize: '4rem', fontWeight: 900, margin: 0 }}>Inventory.</h2>
          <div style={{ height: '2px', width: '100px', background: '#FF6B00', marginTop: '20px' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '80px' }}>
          {PRODUCTS.map(p => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ border: '1px solid #111', background: '#0a0a0a', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ height: '450px', position: 'relative', overflow: 'hidden' }}>
                <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                <div style={{ position: 'absolute', top: 20, right: 20, background: '#FF6B00', color: '#000', padding: '5px 10px', fontSize: '0.6rem', fontWeight: 900 }}>{p.rating}</div>
              </div>
              <div style={{ padding: '40px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '2px' }}>{p.category} // {p.weight}</span>
                    <h3 style={{ fontSize: '1.8rem', margin: '10px 0' }}>{p.name}</h3>
                  </div>
                  <span style={{ fontSize: '1.4rem', fontWeight: 700 }}>₦{p.price.toLocaleString()}</span>
                </div>
                <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: '1.6', margin: '20px 0 40px 0', flex: 1 }}>{p.desc}</p>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => setViewingProduct(p)}
                    style={{ flex: 1, background: 'none', border: '1px solid #333', color: '#fff', padding: '20px', fontWeight: 900, letterSpacing: '1px', cursor: 'pointer', transition: '0.3s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#fff')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#333')}
                  >
                    INSPECT 3D
                  </button>
                  <button 
                    onClick={() => addToCart(p.id)}
                    style={{ flex: 1, background: '#FF6B00', border: '1px solid #FF6B00', color: '#000', padding: '20px', fontWeight: 900, letterSpacing: '1px', cursor: 'pointer', transition: '0.3s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    ADD ITEM
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- ENTERPRISE FOOTER --- */}
      <footer style={{ padding: '150px 10% 50px 10%', background: '#050505', borderTop: '1px solid #111' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '100px' }}>
          <div>
            <h4 style={{ fontWeight: 900, letterSpacing: '5px', color: '#FF6B00', margin: 0 }}>KHADDY.</h4>
            <p style={{ color: '#444', fontSize: '0.8rem', marginTop: '20px', lineHeight: '1.8' }}>
              Specialized Multi-Concepts in Industrial Safety Infrastructure.<br/>
              AL-WAHEED COMPLEX, PLOT 61, KUOLA, IBADAN.
            </p>
          </div>
          {['Infrastructure', 'Connect', 'Certifications'].map(title => (
            <div key={title}>
              <h5 style={{ fontSize: '0.7rem', letterSpacing: '3px', color: '#666', marginBottom: '30px', margin: 0 }}>{title.toUpperCase()}</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: '#888', fontSize: '0.8rem', marginTop: '20px' }}>
                <span>{title === 'Connect' ? 'Sales: +234 800 000 0000' : 'Operational Guide'}</span>
                <span>{title === 'Connect' ? 'HQ: Ibadan, Nigeria' : 'ISO Compliance'}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '100px', borderTop: '1px solid #111', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', color: '#333', fontSize: '0.6rem', fontWeight: 700 }}>
          <span>© 2026 KHADDY MULTI-CONCEPTS. ALL RIGHTS RESERVED.</span>
          <span>DEVELOPED FOR INDUSTRIAL EXCELLENCE.</span>
        </div>
      </footer>

      {/* --- 3D PRODUCT INSPECTOR OVERLAY --- */}
      <AnimatePresence>
        {viewingProduct && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(5,5,5,0.98)', display: 'flex' }}
          >
            {/* Left side: 3D Canvas */}
            <div style={{ flex: 2, position: 'relative', cursor: 'grab' }}>
              <div style={{ position: 'absolute', top: 40, left: 40, zIndex: 10 }}>
                <span style={{ color: '#FF6B00', fontWeight: 900, letterSpacing: '4px', fontSize: '0.8rem' }}>LIVE RENDER // </span>
                <span style={{ color: '#666', letterSpacing: '2px', fontSize: '0.8rem' }}>DRAG TO ORBIT</span>
              </div>
              <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                <ambientLight intensity={0.2} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                <Environment preset="studio" />
                <ProductModel3D type={viewingProduct.id} />
                <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={0.5} />
                <ContactShadows position={[0, -1.5, 0]} opacity={0.7} scale={10} blur={2} />
              </Canvas>
            </div>

            {/* Right side: Product Data */}
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.4 }}
              style={{ flex: 1, minWidth: '400px', maxWidth: '500px', background: '#080808', borderLeft: '1px solid #1a1a1a', padding: '60px', display: 'flex', flexDirection: 'column' }}
            >
              <button onClick={() => setViewingProduct(null)} style={{ alignSelf: 'flex-end', background: 'none', border: 'none', color: '#666', fontSize: '2rem', cursor: 'pointer' }}>×</button>
              
              <div style={{ marginTop: '40px', flex: 1 }}>
                <span style={{ background: '#111', padding: '5px 10px', fontSize: '0.7rem', color: '#FF6B00', letterSpacing: '2px' }}>{viewingProduct.rating}</span>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginTop: '20px', lineHeight: 1.1 }}>{viewingProduct.name}</h2>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#aaa', margin: '20px 0 40px 0' }}>₦{viewingProduct.price.toLocaleString()}</div>
                
                <div style={{ marginBottom: '40px' }}>
                  <h4 style={{ color: '#555', letterSpacing: '2px', fontSize: '0.7rem', marginBottom: '15px' }}>TECHNICAL SPECS</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {viewingProduct.specs.map((spec, i) => (
                      <li key={i} style={{ borderBottom: '1px solid #111', padding: '15px 0', fontSize: '0.9rem', color: '#ddd', display: 'flex', alignItems: 'center' }}>
                        <span style={{ color: '#FF6B00', marginRight: '15px' }}>›</span> {spec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button 
                onClick={() => addToCart(viewingProduct.id)}
                style={{ width: '100%', background: '#FF6B00', color: '#000', border: 'none', padding: '25px', fontWeight: 900, cursor: 'pointer', letterSpacing: '2px' }}
              >
                COMPILE TO MANIFEST
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CART DRAWER --- */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, backdropFilter: 'blur(20px)' }} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30 }} style={{ position: 'fixed', right: 0, top: 0, height: '100vh', width: '100%', maxWidth: '500px', background: '#080808', zIndex: 1001, padding: '60px', borderLeft: '1px solid #111', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '80px' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>Manifest.</h2>
                <button onClick={() => setIsCartOpen(false)} style={{ background: 'none', border: 'none', color: '#444', fontSize: '2rem', cursor: 'pointer' }}>×</button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {Object.entries(cart).map(([id, qty]) => {
                  const p = PRODUCTS.find(prod => prod.id === id);
                  return qty > 0 && p && (
                    <div key={id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', borderBottom: '1px solid #111', paddingBottom: '20px' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{p.name}</h4>
                        <span style={{ color: '#555', fontSize: '0.8rem' }}>{p.rating} // UNIT: ₦{p.price.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button onClick={() => setCart(prev => ({...prev, [id]: Math.max(0, prev[id]-1)}))} style={{ width: '30px', height: '30px', background: '#111', border: 'none', color: '#fff', cursor: 'pointer' }}>-</button>
                        <span style={{ fontWeight: 900 }}>{qty}</span>
                        <button onClick={() => addToCart(id)} style={{ width: '30px', height: '30px', background: '#111', border: 'none', color: '#fff', cursor: 'pointer' }}>+</button>
                      </div>
                    </div>
                  );
                })}
                {totalItems === 0 && <p style={{ color: '#444' }}>Your manifest is empty.</p>}
              </div>
              <div style={{ paddingTop: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                  <span style={{ color: '#555', fontWeight: 700 }}>EST. INVESTMENT</span>
                  <span style={{ fontSize: '2rem', fontWeight: 900 }}>₦{grandTotal.toLocaleString()}</span>
                </div>
                <button onClick={handleCheckout} style={{ width: '100%', background: '#fff', color: '#000', border: 'none', padding: '25px', fontWeight: 900, cursor: 'pointer', letterSpacing: '2px' }}>
                  GENERATE PURCHASE ORDER
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}