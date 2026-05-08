import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Brain, Cpu, MessageSquare, GraduationCap, ChevronRight, Menu, X, ArrowRight, Github, Twitter, Linkedin, Send, Bot } from 'lucide-react';
import * as THREE from 'three';

// ─── Chatbot ────────────────────────────────────────────────────────────────
interface ChatMessage { role: 'user' | 'assistant'; content: string; }

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hi! 👋 I\'m the LogicLabs AI assistant. Ask me anything about our services, workshops, or how to get in touch!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Sorry, something went wrong!' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error. Please try again!' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-brand-teal text-brand-ink shadow-2xl shadow-brand-teal/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
        aria-label="Open chat"
      >
        {open ? <X size={22} /> : <Bot size={22} />}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] max-w-[calc(100vw-2rem)] bg-[#0d1117] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            style={{ height: '480px' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 bg-brand-teal/10 border-b border-white/5">
              <div className="w-8 h-8 rounded-full bg-brand-teal flex items-center justify-center">
                <Bot size={16} className="text-brand-ink" />
              </div>
              <div>
                <p className="font-bold text-sm leading-none">LogicLabs AI</p>
                <p className="text-[10px] text-brand-teal mt-0.5">Powered by Gemini</p>
              </div>
              <span className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-brand-teal text-brand-ink rounded-br-sm font-medium'
                      : 'bg-white/5 text-white rounded-bl-sm'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
                    {[0,1,2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 bg-brand-teal rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick suggestions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {['What services do you offer?', 'Tell me about workshops', 'How to contact you?'].map(q => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="text-[11px] border border-brand-teal/30 text-brand-teal px-3 py-1 rounded-full hover:bg-brand-teal/10 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 py-3 border-t border-white/5 flex gap-2">
              <input
                className="flex-1 bg-white/5 text-white text-sm px-4 py-2.5 rounded-xl outline-none placeholder:text-white/30 focus:ring-1 focus:ring-brand-teal/50"
                placeholder="Ask me anything..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-brand-teal text-brand-ink flex items-center justify-center disabled:opacity-40 hover:bg-brand-teal-bright transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-brand-ink/80 backdrop-blur-lg border-b border-white/5 py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-brand-teal rounded-lg flex items-center justify-center">
            <Brain className="text-brand-ink" size={24} />
          </div>
          <div>
            <span className="text-xl font-bold font-head tracking-tight block leading-none">LogicLabs</span>
            <span className="text-[10px] text-brand-teal uppercase tracking-[0.2em] font-semibold">Intelligence Redefined</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Services', 'About', 'Workshops', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-brand-slate hover:text-brand-teal transition-colors"
            >
              {item}
            </a>
          ))}
          <a href="https://wa.me/918921104627" target="_blank" rel="noopener noreferrer" className="bg-brand-teal hover:bg-brand-teal-bright text-brand-ink px-6 py-2 rounded-full text-sm font-bold transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-brand-teal/20">
            Get Started
          </a>
        </div>

        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-brand-ink border-b border-white/5 p-6 md:hidden flex flex-col gap-4"
        >
          {['Services', 'About', 'Workshops', 'Contact'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className="text-lg font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <a href="https://wa.me/918921104627" target="_blank" rel="noopener noreferrer" className="bg-brand-teal text-brand-ink w-full py-3 rounded-xl font-bold text-center block">
            Get Started
          </a>
        </motion.div>
      )}
    </nav>
  );
};

const Hero3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create particles
    const geometry = new THREE.BufferGeometry();
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
      colors[i] = Math.random();
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.015,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Create a wireframe brain-like sphere
    const sphereGeo = new THREE.IcosahedronGeometry(1.5, 4);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x2dd4bf,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    camera.position.z = 3;

    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      points.rotation.y += 0.001;
      points.rotation.x += 0.0005;
      
      sphere.rotation.y += 0.002;
      sphere.rotation.x += 0.001;

      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none opacity-50" />;
};

interface ServiceCardProps {
  icon: any;
  title: string;
  description: string;
  delay?: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon: Icon, title, description, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="bg-brand-ink-light border border-white/5 p-8 rounded-3xl hover:border-brand-teal/30 transition-all group"
  >
    <div className="w-14 h-14 bg-brand-teal/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-teal group-hover:scale-110 transition-all duration-500">
      <Icon className="text-brand-teal group-hover:text-brand-ink transition-colors" size={28} />
    </div>
    <h3 className="text-xl font-bold mb-4 font-head">{title}</h3>
    <p className="text-brand-slate text-sm leading-relaxed mb-6">
      {description}
    </p>
    <a href="#" className="inline-flex items-center text-brand-teal text-xs font-bold uppercase tracking-wider gap-2 group/link">
      Learn More <ChevronRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
    </a>
  </motion.div>
);

export default function App() {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  const services = [
    {
      icon: GraduationCap,
      title: "AI Education",
      description: "Empowering teams with the knowledge to harness generative AI. From foundational concepts to advanced prompt engineering and model deployment."
    },
    {
      icon: Cpu,
      title: "Consultancy",
      description: "Strategic AI roadmaps tailored to your business. We identify high-impact automation opportunities and guide you through the transition."
    },
    {
      icon: MessageSquare,
      title: "AI Development",
      description: "Building custom AI agents and autonomous workflows. We bridge the gap between complex AI models and practical business results."
    }
  ];

  return (
    <div id="home" className="relative min-h-screen overflow-x-hidden font-body bg-brand-ink selection:bg-brand-teal selection:text-brand-ink">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        <Hero3D />
        
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-brand-teal/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-brand-amber/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-8"
            >
              <span className="w-2 h-2 bg-brand-teal rounded-full animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-slate">Kerala's Premier AI Agency</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-bold font-head leading-[0.9] tracking-tight mb-8"
            >
              Building the <br />
              <span className="text-brand-teal">Future</span> of <br />
              Intelligence.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-brand-slate max-w-xl mb-12 font-light leading-relaxed"
            >
              LogicLabs specializes in bridging the gap between cutting-edge AI research and real-world business implementation through education and strategic development.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <a href="https://wa.me/918921104627?text=Hi%20LogicLabs%2C%20I%20want%20to%20start%20a%20project!" target="_blank" rel="noopener noreferrer" className="bg-brand-teal hover:bg-brand-teal-bright text-brand-ink px-10 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group shadow-xl shadow-brand-teal/20">
                Start a Project <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="https://wa.me/918921104627?text=Hi%20LogicLabs%2C%20I%27m%20interested%20in%20your%20workshops!" target="_blank" rel="noopener noreferrer" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-10 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95">
                View Workshops
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-end mb-20">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-[1px] bg-brand-teal" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-brand-teal">What we do</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-head font-bold tracking-tight">Our Core Expertise</h2>
            </div>
            <p className="text-brand-slate text-lg font-light">
              We provide a comprehensive ecosystem for businesses to survive and thrive in the age of artificial intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((svc, i) => (
              <ServiceCard 
                key={svc.title} 
                icon={svc.icon} 
                title={svc.title} 
                description={svc.description} 
                delay={i * 0.1} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Values */}
      <section id="about" className="py-24 bg-brand-ink-light/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-brand-ink border border-white/5 rounded-[40px] p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/5 rounded-full blur-[100px] -mr-48 -mt-48" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
              <div className="md:w-1/2">
                <h2 className="text-4xl font-head font-bold mb-8 italic text-brand-amber opacity-90">"AI won't replace humans, but people using AI will replace those who don't."</h2>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-teal/20 rounded-full flex items-center justify-center">
                    <img 
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=manoj" 
                      alt="Manoj Kumar M" 
                      className="w-10 h-10 rounded-full bg-brand-ink p-1" 
                    />
                  </div>
                  <div>
                    <p className="font-bold leading-none">Manoj Kumar M</p>
                    <p className="text-[11px] text-brand-slate uppercase font-bold tracking-widest mt-1">Founder & CEO</p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 space-y-6 text-brand-slate font-light leading-relaxed">
                <p>
                  LogicLabs was founded on the principle that the next industrial revolution is happening right now. Our mission is to make advanced AI accessible and profitable for businesses of all sizes.
                </p>
                <p>
                  With over 7 years of deep-tech experience, we understand that successful AI integration is 20% technology and 80% strategy and mindset change.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="pt-32 pb-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-24">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-brand-teal rounded-lg flex items-center justify-center">
                  <Brain className="text-brand-ink" size={18} />
                </div>
                <span className="text-xl font-bold font-head tracking-tight">LogicLabs</span>
              </div>
              <p className="text-brand-slate max-w-sm font-light mb-8">
                Pioneering the Al implementation landscape in Kerala. Empowering the next generation of intelligent enterprises.
              </p>
              <div className="flex gap-4">
                {[Twitter, Linkedin, Github].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-teal hover:text-brand-ink transition-all">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 font-head tracking-wider uppercase text-xs text-brand-teal">Quick Links</h4>
              <ul className="space-y-4 text-brand-slate text-sm font-medium">
                {['Services', 'About', 'Workshops', 'Careers'].map(l => (
                  <li key={l}><a href="#" className="hover:text-brand-teal transition-colors tracking-tight">{l}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 font-head tracking-wider uppercase text-xs text-brand-teal">Contact</h4>
              <ul className="space-y-4 text-brand-slate text-sm">
                <li className="flex flex-col">
                  <strong>Email</strong>
                  <span className="opacity-80">hello@logiclabs.ai</span>
                </li>
                <li className="flex flex-col">
                  <strong>Location</strong>
                  <span className="opacity-80">Trivandrum, Kerala</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-brand-slate opacity-60">© 2025 LogicLabs Pvt Ltd. All rights reserved.</p>
            <div className="flex gap-8 text-[11px] font-bold uppercase tracking-widest text-brand-slate opacity-60">
              <a href="#" className="hover:text-brand-teal transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-brand-teal transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
      <Chatbot />
    </div>
  );
}
