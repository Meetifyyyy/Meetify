import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { showToast } from '../utils/toast';
import Background from '../components/common/Background';
import Toast from '../components/common/Toast';
import logo from '../assets/images/logo.webp';
import heroImg from '../assets/images/hero-illustration.webp';
import '../styles/landing.css';


export default function LandingPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    setToastVisible(true);
  }, []);

  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: 'Find Your People',
      desc: 'Connect with like-minded creators, builders, and dreamers who share your passions.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      title: 'Real Conversations',
      desc: 'No noise. No algorithms. Just genuine discussions that matter to you.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      ),
      title: 'Communities That Click',
      desc: 'Build or join micro-communities around the things that make you come alive.',
    },
  ];

  const steps = [
    { num: '01', title: 'Create Your Space', desc: 'Set up your profile and tell the world what you\'re about.' },
    { num: '02', title: 'Discover & Connect', desc: 'Browse communities, follow interesting people, and start conversations.' },
    { num: '03', title: 'Grow Together', desc: 'Collaborate on ideas, share wins, and build something meaningful.' },
  ];

  const testimonials = [
    { name: 'Maya R.', handle: '@mayabuilds', text: 'Found my entire startup team through Meetify. This place just gets it.', gradient: 'linear-gradient(135deg, #2563EB, #3B82F6)' },
    { name: 'James K.', handle: '@jamesk_dev', text: 'The communities here feel alive. No empty feeds, no bots — just real people.', gradient: 'linear-gradient(135deg, #F59E0B, #F97316)' },
    { name: 'Priya S.', handle: '@priya_designs', text: 'I\'ve been on every social platform. Meetify is the first one that felt like home.', gradient: 'linear-gradient(135deg, #EC4899, #8B5CF6)' },
  ];

  const communityTags = [
    { name: 'Startups', color: '#2563EB' },
    { name: 'Design', color: '#EC4899' },
    { name: 'Music', color: '#F59E0B' },
    { name: 'Dev', color: '#10B981' },
    { name: 'Photography', color: '#8B5CF6' },
    { name: 'Gaming', color: '#06B6D4' },
    { name: 'Travel', color: '#F97316' },
    { name: 'Fitness', color: '#EF4444' },
    { name: 'Art', color: '#A855F7' },
    { name: 'Science', color: '#0EA5E9' },
    { name: 'Writing', color: '#14B8A6' },
    { name: 'Film', color: '#D946EF' },
  ];

  return (
    <>
      <Background />

      <header className="landing-header">
        <div className="nav-left" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img className="logo" src={logo} alt="Meetify" />
          <span className="brand">Meetify</span>
        </div>
        <nav className="nav-links">
          <a href="#why" className="nav-link-item">Why Meetify</a>
          <a href="#how" className="nav-link-item">How It Works</a>
          <a href="#explore" className="nav-link-item">Explore</a>
          <a href="#testimonials" className="nav-link-item">Voices</a>
        </nav>
        <div className="nav-actions">
          <button className="btn-login" onClick={() => navigate('/login')}>Log in</button>
          <button className="btn-signup" onClick={() => navigate('/signup')}>Join Meetify</button>
        </div>
      </header>

      {/* Scrollable landing content */}
      <div className="landing-scroll">

        <main id="mainContent" className="hero-section">
          <div className="hero-text-col">

             <h1 className="hero-title">
              MEET THE OTHER <span className="text-gradient">YOU</span>
            </h1>
            <p className="hero-subtitle">
              Find your tribe and your spotlight.
            </p>
            <div className="hero-actions">
              <button className="hero-btn-primary" onClick={() => navigate('/signup')}>
                Get Started
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>

          <div className="hero-graphic-col">
            <div className="hero-image-container">
              <img src={heroImg} alt="Meetify community illustration" className="hero-img" loading="lazy" />
              <div className="fragment fragment--1" style={{ animation: 'float 6s ease-in-out infinite' }}>
                <span className="live-dot" style={{ display: 'inline-block', width: 8, height: 8, background: '#10B981', borderRadius: '50%', marginRight: 8, animation: 'pulse 2s infinite' }}></span>
                Sarah just joined Design Thinkers
              </div>
              <div className="fragment fragment--2" style={{ animation: 'float 6s ease-in-out infinite 1.5s' }}>
                <span className="live-dot" style={{ display: 'inline-block', width: 8, height: 8, background: '#3B82F6', borderRadius: '50%', marginRight: 8, animation: 'pulse 2s infinite' }}></span>
                Alex posted in Startup Builders
              </div>
              <div className="fragment fragment--3" style={{ animation: 'float 6s ease-in-out infinite 3s' }}>
                <span className="live-dot" style={{ display: 'inline-block', width: 8, height: 8, background: '#F59E0B', borderRadius: '50%', marginRight: 8, animation: 'pulse 2s infinite' }}></span>
                New discussion in Engineering
              </div>
              <div className="fragment fragment--4" style={{ animation: 'float 6s ease-in-out infinite 4.5s' }}>
                <span className="live-dot" style={{ display: 'inline-block', width: 8, height: 8, background: '#EC4899', borderRadius: '50%', marginRight: 8, animation: 'pulse 2s infinite' }}></span>
                Maya followed James
              </div>
            </div>
          </div>
        </main>

        {/* ---------- Features ---------- */}
        <section className="landing-section features-section" id="why">
          <div className="section-inner reveal">
            <h2 className="landing-heading">
              Why <span className="text-gradient">Meetify</span>?
            </h2>
            <p className="landing-subheading">A space where connections are real and communities thrive.</p>
            <div className="features-grid">
              {features.map((f, i) => (
                <div className="feature-card" key={i}>
                  <div className="feature-icon">{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- How It Works ---------- */}
        <section className="landing-section steps-section" id="how">
          <div className="section-inner reveal">
            <h2 className="landing-heading">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="landing-subheading">Three steps. Zero friction.</p>
            <div className="steps-row">
              {steps.map((s, i) => (
                <div className="step-card" key={i}>
                  <span className="step-num">{s.num}</span>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  {i < steps.length - 1 && (
                    <div className="step-connector">
                      <svg width="40" height="12" viewBox="0 0 40 12" fill="none">
                        <path d="M0 6h32m0 0l-5-5m5 5l-5 5" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Communities ---------- */}
        <section className="landing-section communities-section" id="explore">
          <div className="section-inner reveal">
            <h2 className="landing-heading">
              Explore <span className="text-gradient">Communities</span>
            </h2>
            <p className="landing-subheading">Thousands of people are already here. Find where you belong.</p>
            <div className="community-tags">
              {communityTags.map((tag, i) => (
                <span className="community-tag" key={i} style={{ '--tag-color': tag.color, cursor: 'pointer' }} onClick={() => navigate('/login')}>
                  <span className="tag-dot" style={{ background: tag.color }} />
                  {tag.name}
                </span>
              ))}
            </div>
            <div className="community-stats-row">
              <div className="community-stat">
                <span className="community-stat-num">12k+</span>
                <span className="community-stat-label">Members & growing</span>
              </div>
              <div className="community-stat">
                <span className="community-stat-num">340+</span>
                <span className="community-stat-label">Communities</span>
              </div>
              <div className="community-stat">
                <span className="community-stat-num">89k+</span>
                <span className="community-stat-label">Conversations</span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Testimonials ---------- */}
        <section className="landing-section testimonials-section" id="testimonials">
          <div className="section-inner reveal">
            <h2 className="landing-heading">
              Voices from the <span className="text-gradient">Community</span>
            </h2>
            <div className="testimonials-grid">
              {testimonials.map((t, i) => (
                <div className="testimonial-card" key={i}>
                  <p className="testimonial-text">"{t.text}"</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar" style={{ background: t.gradient }}>
                      {t.name.charAt(0)}
                    </div>
                    <div className="testimonial-meta">
                      <div className="testimonial-name">{t.name}</div>
                      <div className="testimonial-handle">{t.handle}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- CTA ---------- */}
        <section className="landing-section cta-section">
          <div className="section-inner cta-inner reveal">
            <div className="cta-content-wrapper">
              <h2 className="cta-heading">Ready to find your people?</h2>
              <p className="cta-sub">Join thousands of creators, builders, and dreamers already sharing their spotlight.</p>
              <button className="cta-btn" onClick={() => navigate('/signup')}>
                Get Started
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* ---------- Footer ---------- */}
        <footer className="landing-footer">
          <div className="footer-inner">
            <div className="footer-top">
              <div className="footer-brand">
                <img className="logo" src={logo} alt="Meetify" />
                <span className="brand">Meetify</span>
              </div>

              <div className="footer-links">
                <div className="footer-col">
                  <h4>Product</h4>
                  <a href="#explore" className="footer-link-item">Communities</a>
                  <a href="#why" className="footer-link-item">Features</a>
                  <span className="footer-link-item disabled-link">Messaging <span className="soon-badge">soon</span></span>
                </div>
                <div className="footer-col">
                  <h4>Company</h4>
                  <span className="footer-link-item disabled-link">About <span className="soon-badge">soon</span></span>
                  <span className="footer-link-item disabled-link">Blog <span className="soon-badge">soon</span></span>
                  <span className="footer-link-item disabled-link">Careers <span className="soon-badge">soon</span></span>
                </div>
                <div className="footer-col">
                  <h4>Support</h4>
                  <span className="footer-link-item disabled-link">Help Center <span className="soon-badge">soon</span></span>
                  <span className="footer-link-item disabled-link">Privacy <span className="soon-badge">soon</span></span>
                  <span className="footer-link-item disabled-link">Terms <span className="soon-badge">soon</span></span>
                </div>
              </div>
            </div>

            <div className="footer-bottom">
              <span className="footer-copy">&copy; 2026 Meetify. All rights reserved.</span>
              <div className="footer-socials">
                <a href="#" aria-label="Twitter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
                <a href="#" aria-label="GitHub">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
                </a>
                <a href="#" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      <Toast
        message={toastMsg}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </>
  );
}
