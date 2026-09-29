import React, { useEffect, useState, useRef } from 'react';
import '../assets/css/style.css';

import avatarGpt from '../assets/images/avatar-gpt.png';
import lazyfireLogo from '../assets/images/lazyfire-logo.svg';
import piratImg from '../assets/images/pirat.png';

export default function Home() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [loaderHidden, setLoaderHidden] = useState(false);
  const [greetingText, setGreetingText] = useState('Hi there! 👋');

  const heroPhotoRef = useRef(null);
  const decoTerminalRef = useRef(null);
  const heroContentRef = useRef(null);
  const paperTearBottomRef = useRef(null);

  // Theme effect
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Loader screen effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaderHidden(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Matrix typing effect for greeting
  useEffect(() => {
    const finalText = 'Hi there! 👋';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let iterations = 0;

    const interval = setInterval(() => {
      const current = finalText
        .split('')
        .map((char, index) => {
          if (index < iterations) return finalText[index];
          if (char === ' ' || char === '👋') return char;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      setGreetingText(current);

      if (iterations >= finalText.length) {
        clearInterval(interval);
      }
      iterations += 1 / 3;
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Scroll and Parallax Effects
  useEffect(() => {
    let photoTilted = false;
    let terminalFallen = false;

    const calculateFallDistance = () => {
      if (heroContentRef.current && decoTerminalRef.current) {
        const heroContentRect = heroContentRef.current.getBoundingClientRect();
        const terminalRect = decoTerminalRef.current.getBoundingClientRect();
        const terminalFall = Math.max(0, heroContentRect.bottom - terminalRect.bottom - 50);
        decoTerminalRef.current.style.setProperty('--fall-distance', `${terminalFall}px`);
      }
    };

    calculateFallDistance();
    window.addEventListener('resize', calculateFallDistance);

    // Dynamic Highlight data
    const highlightElements = document.querySelectorAll('.highlight');
    const highlightData = new Map();
    highlightElements.forEach((el, index) => {
      const direction = index % 2 === 0 ? 'left' : 'right';
      el.setAttribute('data-direction', direction);
      highlightData.set(el, { hasStarted: false, startScroll: 0, duration: 100 });
    });

    // Dynamic Language Stars data
    const languageItems = document.querySelectorAll('.language-item');
    const languageStarsData = new Map();
    languageItems.forEach((item) => {
      const stars = item.querySelectorAll('.language-stars .star');
      languageStarsData.set(item, { hasStarted: false, startScroll: 0, stars, starDelay: 50 });
    });

    // Dynamic Journey Timeline data
    const journeyTimeline = document.querySelector('.journey-timeline');
    const journeyTimelineBack = document.querySelector('.journey-timeline-back');
    const journeyTimelineData = { hasStarted: false, startScroll: 0, pageRange: 200 };

    // Navbar scroll logic
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    const onScroll = () => {
      const scrollY = window.scrollY;

      // Photo tilt
      if (!photoTilted && scrollY > 5 && heroPhotoRef.current) {
        heroPhotoRef.current.classList.add('tilted');
        photoTilted = true;
      }

      // Terminal fall
      if (!terminalFallen && scrollY > 5 && decoTerminalRef.current) {
        decoTerminalRef.current.classList.add('falling');
        terminalFallen = true;
      }

      // Paper tear transition
      const paperTearBottom = paperTearBottomRef.current;
      if (paperTearBottom) {
        paperTearBottom.style.setProperty('margin-top', '0px', 'important');
      }

      // Highlights effect
      const windowHeight = window.innerHeight;
      highlightElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const data = highlightData.get(el);
        if (!data) return;
        const triggerPoint = scrollY + windowHeight * 0.8;

        if (!data.hasStarted && triggerPoint >= elementTop) {
          data.hasStarted = true;
          data.startScroll = scrollY;
        }

        if (data.hasStarted) {
          const progress = Math.min(1, Math.max(0, (scrollY - data.startScroll) / data.duration));
          el.style.setProperty('--highlight-progress', `${progress * 100}%`);
        }

        if (data.hasStarted && scrollY < data.startScroll - 50) {
          data.hasStarted = false;
          el.style.setProperty('--highlight-progress', '0%');
        }
      });

      // Language stars effect
      languageItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const data = languageStarsData.get(item);
        if (!data) return;
        const triggerPoint = scrollY + windowHeight * 0.8;

        if (!data.hasStarted && triggerPoint >= elementTop) {
          data.hasStarted = true;
          data.startScroll = scrollY;
        }

        if (data.hasStarted) {
          const scrollProgress = scrollY - data.startScroll;
          data.stars.forEach((star, index) => {
            if (scrollProgress >= index * data.starDelay) {
              star.classList.add('visible');
            }
          });
        }
      });

      // Journey timeline book flip effect
      if (journeyTimeline && journeyTimelineBack && window.innerWidth >= 769) {
        const rect = journeyTimeline.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const triggerPoint = scrollY + windowHeight * 0.5;

        if (!journeyTimelineData.hasStarted && triggerPoint >= elementTop) {
          journeyTimelineData.hasStarted = true;
          journeyTimelineData.startScroll = scrollY;
        }

        if (journeyTimelineData.hasStarted) {
          const progress = Math.min(1, Math.max(0, (scrollY - journeyTimelineData.startScroll) / journeyTimelineData.pageRange));
          const rotateY = 180 - 180 * progress;

          journeyTimeline.style.transform = `rotateY(${rotateY}deg)`;
          journeyTimelineBack.style.transform = `rotateY(${rotateY}deg)`;

          if (rotateY > 95) {
            journeyTimeline.style.zIndex = '1';
            journeyTimelineBack.style.zIndex = '100';
          } else {
            journeyTimeline.style.zIndex = '100';
            journeyTimelineBack.style.zIndex = '1';
          }

          if (progress >= 1) {
            journeyTimeline.style.overflowY = 'auto';
          } else {
            journeyTimeline.style.overflowY = 'hidden';
          }
        } else {
          journeyTimeline.style.transform = 'rotateY(180deg)';
          journeyTimelineBack.style.transform = 'rotateY(180deg)';
          journeyTimeline.style.zIndex = '1';
          journeyTimelineBack.style.zIndex = '100';
          journeyTimeline.style.overflowY = 'hidden';
        }
      }



      // Progress Bar Fill
      const progressBarFill = document.querySelector('.progress-bar-fill');
      const checkpoints = document.querySelectorAll('.checkpoint');
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const progressPercent = documentHeight > 0 ? (scrollY / documentHeight) * 100 : 0;

      if (progressBarFill) {
        progressBarFill.style.width = progressPercent + '%';
      }

      const sections = ['hero', 'about', 'experience', 'skills'];
      let activeIndex = 0;
      sections.forEach((sectionId, index) => {
        const sec = document.getElementById(sectionId);
        if (sec) {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
            activeIndex = index;
          }
        }
      });

      checkpoints.forEach((checkpoint, index) => {
        if (index <= activeIndex) {
          checkpoint.classList.add('active');
        } else {
          checkpoint.classList.remove('active');
        }
      });

      // Active nav link
      sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
          const sectionTop = section.offsetTop - 100;
          const sectionHeight = section.offsetHeight;
          if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach((link) => {
              link.classList.remove('active');
              if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
              }
            });
          }
        }
      });

      lastScroll = scrollY;
    };

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);

    // Initial frame update
    requestAnimationFrame(onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('resize', calculateFallDistance);
    };
  }, []);

  // Intersection Observer for fade-in elements
  useEffect(() => {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.section, .timeline-item, .skill-box').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);



  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleDummyClick = (e) => {
    e.preventDefault();
  };

  return (
    <>


      {/* Loading Screen */}
      <div className={`loader-overlay ${loaderHidden ? 'hidden' : ''}`}>
        <div className="loader-shapes">
          <div className="loader-shape-svg loader-shape-1">
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
              <rect x="6" y="6" width="88" height="88" rx="8" fill="#66d9ef" stroke="#000" strokeWidth="4" />
              <rect x="3" y="3" width="88" height="88" rx="8" fill="#66d9ef" stroke="#000" strokeWidth="4" />
              <path d="M35 40 L20 50 L35 60" stroke="#000" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M65 40 L80 50 L65 60" stroke="#000" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="55" y1="35" x2="45" y2="65" stroke="#000" strokeWidth="5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="loader-shape-svg loader-shape-2">
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
              <rect x="6" y="6" width="88" height="88" rx="8" fill="#ffd93d" stroke="#000" strokeWidth="4" />
              <rect x="3" y="3" width="88" height="88" rx="8" fill="#ffd93d" stroke="#000" strokeWidth="4" />
              <path d="M25 35 L40 50 L25 65" stroke="#000" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="50" y1="65" x2="75" y2="65" stroke="#000" strokeWidth="5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="loader-shape-svg loader-shape-3">
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
              <rect x="6" y="6" width="88" height="88" rx="8" fill="#a8e6cf" stroke="#000" strokeWidth="4" />
              <rect x="3" y="3" width="88" height="88" rx="8" fill="#a8e6cf" stroke="#000" strokeWidth="4" />
              <rect x="20" y="20" width="60" height="60" rx="3" fill="#ffd93d" stroke="#000" strokeWidth="4" />
              <rect x="30" y="20" width="40" height="20" fill="#66d9ef" stroke="#000" strokeWidth="3" />
              <rect x="35" y="55" width="30" height="15" rx="2" fill="#000" />
              <circle cx="50" cy="35" r="3" fill="#000" />
            </svg>
          </div>
        </div>
        <div className="loader-wrapper">
          <div className="loader-letter">A</div>
          <div className="loader-letter">K</div>
        </div>
        <div className="loader-progress-bar">
          <div className="loader-progress-fill"></div>
        </div>
      </div>

      <div className="page-wrapper">

        {/* Navbar */}
        <nav className="navbar">
          <div className="nav-content">
            <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }} className="nav-brand">AK</a>
            <div className="nav-right">
              <a href="#hero" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>Home</a>
              <a href="#about" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a>
              <a href="#experience" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('experience'); }}>Journey</a>
              <a href="#skills" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('skills'); }}>Skills</a>
              <button id="theme-toggle" className="theme-toggle-nav" aria-label="Toggle theme" onClick={toggleTheme}>
                <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero" id="hero">
          <div className="hero-content" ref={heroContentRef}>
            <div className="hero-left">
              <p className="hero-greeting" id="hero-greeting">{greetingText}</p>
              <h1 className="hero-name">I'm Ajith Kumar.</h1>
              <p className="hero-description">
                I’m a passionate web developer who enjoys building responsive and user-friendly websites.
              </p>
              <div className="hero-social">
                <a href="#" onClick={handleDummyClick} className="social-btn" aria-label="GitHub">
                  <i className="fab fa-github"></i>
                </a>
                <a href="#" onClick={handleDummyClick} className="social-btn" aria-label="LinkedIn">
                  <i className="fab fa-linkedin"></i>
                </a>
              </div>
            </div>

            <div className="hero-right">
              <div className="hero-image-wrapper">
                <img
                  ref={heroPhotoRef}
                  src={avatarGpt}
                  alt="Ajith Kumar"
                  className="hero-photo"
                  width="400"
                  height="400"
                  onMouseEnter={() => heroPhotoRef.current?.classList.remove('tilted')}
                  onMouseLeave={() => heroPhotoRef.current?.classList.add('tilted')}
                />
                <div className="deco-code">
                  <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                    <rect x="6" y="6" width="88" height="88" rx="8" fill="#66d9ef" stroke="#000" strokeWidth="4" />
                    <rect x="3" y="3" width="88" height="88" rx="8" fill="#66d9ef" stroke="#000" strokeWidth="4" />
                    <path d="M35 40 L20 50 L35 60" stroke="#000" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M65 40 L80 50 L65 60" stroke="#000" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="55" y1="35" x2="45" y2="65" stroke="#000" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="deco-terminal" ref={decoTerminalRef}>
                  <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                    <rect x="6" y="6" width="88" height="88" rx="8" fill="#ffd93d" stroke="#000" strokeWidth="4" />
                    <rect x="3" y="3" width="88" height="88" rx="8" fill="#ffd93d" stroke="#000" strokeWidth="4" />
                    <path d="M25 35 L40 50 L25 65" stroke="#000" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="50" y1="65" x2="75" y2="65" stroke="#000" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="deco-floppy">
                  <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                    <rect x="6" y="6" width="88" height="88" rx="8" fill="#a8e6cf" stroke="#000" strokeWidth="4" />
                    <rect x="3" y="3" width="88" height="88" rx="8" fill="#a8e6cf" stroke="#000" strokeWidth="4" />
                    <rect x="20" y="20" width="60" height="60" rx="3" fill="#ffd93d" stroke="#000" strokeWidth="4" />
                    <rect x="30" y="20" width="40" height="20" fill="#66d9ef" stroke="#000" strokeWidth="3" />
                    <rect x="35" y="55" width="30" height="15" rx="2" fill="#000" />
                    <circle cx="50" cy="35" r="3" fill="#000" />
                  </svg>
                </div>
                <div className="deco-label">Web Developer</div>
              </div>
            </div>
          </div>

          <div className="tech-badges">
            <span className="tech-badge"><i className="fab fa-html5"></i> HTML5</span>
            <span className="tech-badge"><i className="fab fa-css3-alt"></i> CSS3</span>
            <span className="tech-badge"><i className="fab fa-js"></i> JavaScript</span>
            <span className="tech-badge"><i className="fab fa-react"></i> React</span>
            <span className="tech-badge"><i className="fab fa-bootstrap"></i> Bootstrap</span>
            <span className="tech-badge"><i className="fab fa-node-js"></i> Node.js</span>
            <span className="tech-badge"><i className="fab fa-git-alt"></i> Git</span>
          </div>
        </section>

        {/* Paper Tear Transition */}
        <div className="paper-tear paper-tear-top">
          <svg width="100%" height="30" viewBox="0 0 1440 30" preserveAspectRatio="none">
            <path d="M0,0 L0,15 Q10,5 20,15 T40,15 Q50,5 60,15 T80,15 Q90,20 100,15 T120,15 Q130,10 140,15 T160,15 Q170,5 180,15 T200,15 Q210,20 220,15 T240,15 Q250,8 260,15 T280,15 Q290,18 300,15 T320,15 Q330,5 340,15 T360,15 Q370,12 380,15 T400,15 Q410,20 420,15 T440,15 Q450,6 460,15 T480,15 Q490,16 500,15 T520,15 Q530,8 540,15 T560,15 Q570,20 580,15 T600,15 Q610,10 620,15 T640,15 Q650,5 660,15 T680,15 Q690,18 700,15 T720,15 Q730,12 740,15 T760,15 Q770,7 780,15 T800,15 Q810,20 820,15 T840,15 Q850,9 860,15 T880,15 Q890,14 900,15 T920,15 Q930,6 940,15 T960,15 Q970,19 980,15 T1000,15 Q1010,11 1020,15 T1040,15 Q1050,5 1060,15 T1080,15 Q1090,17 1100,15 T1120,15 Q1130,8 1140,15 T1160,15 Q1170,13 1180,15 T1200,15 Q1210,20 1220,15 T1240,15 Q1250,7 1260,15 T1280,15 Q1290,16 1300,15 T1320,15 Q1330,10 1340,15 T1360,15 Q1370,5 1380,15 T1400,15 Q1410,18 1420,15 T1440,15 L1440,0 Z" fill="#ffffff" stroke="none"/>
            <path d="M0,30 L0,15 Q10,5 20,15 T40,15 Q50,5 60,15 T80,15 Q90,20 100,15 T120,15 Q130,10 140,15 T160,15 Q170,5 180,15 T200,15 Q210,20 220,15 T240,15 Q250,8 260,15 T280,15 Q290,18 300,15 T320,15 Q330,5 340,15 T360,15 Q370,12 380,15 T400,15 Q410,20 420,15 T440,15 Q450,6 460,15 T480,15 Q490,16 500,15 T520,15 Q530,8 540,15 T560,15 Q570,20 580,15 T600,15 Q610,10 620,15 T640,15 Q650,5 660,15 T680,15 Q690,18 700,15 T720,15 Q730,12 740,15 T760,15 Q770,7 780,15 T800,15 Q810,20 820,15 T840,15 Q850,9 860,15 T880,15 Q890,14 900,15 T920,15 Q930,6 940,15 T960,15 Q970,19 980,15 T1000,15 Q1010,11 1020,15 T1040,15 Q1050,5 1060,15 T1080,15 Q1090,17 1100,15 T1120,15 Q1130,8 1140,15 T1160,15 Q1170,13 1180,15 T1200,15 Q1210,20 1220,15 T1240,15 Q1250,7 1260,15 T1280,15 Q1290,16 1300,15 T1320,15 Q1330,10 1340,15 T1360,15 Q1370,5 1380,15 T1400,15 Q1410,18 1420,15 T1440,15 L1440,30 Z" fill="#d0d0d0" stroke="none"/>
            <path d="M0,15 Q10,5 20,15 T40,15 Q50,5 60,15 T80,15 Q90,20 100,15 T120,15 Q130,10 140,15 T160,15 Q170,5 180,15 T200,15 Q210,20 220,15 T240,15 Q250,8 260,15 T280,15 Q290,18 300,15 T320,15 Q330,5 340,15 T360,15 Q370,12 380,15 T400,15 Q410,20 420,15 T440,15 Q450,6 460,15 T480,15 Q490,16 500,15 T520,15 Q530,8 540,15 T560,15 Q570,20 580,15 T600,15 Q610,10 620,15 T640,15 Q650,5 660,15 T680,15 Q690,18 700,15 T720,15 Q730,12 740,15 T760,15 Q770,7 780,15 T800,15 Q810,20 820,15 T840,15 Q850,9 860,15 T880,15 Q890,14 900,15 T920,15 Q930,6 940,15 T960,15 Q970,19 980,15 T1000,15 Q1010,11 1020,15 T1040,15 Q1050,5 1060,15 T1080,15 Q1090,17 1100,15 T1120,15 Q1130,8 1140,15 T1160,15 Q1170,13 1180,15 T1200,15 Q1210,20 1220,15 T1240,15 Q1250,7 1260,15 T1280,15 Q1290,16 1300,15 T1320,15 Q1330,10 1340,15 T1360,15 Q1370,5 1380,15 T1400,15 Q1410,18 1420,15 T1440,15" fill="none" stroke="var(--border)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="container">
          {/* About Section */}
          <section className="section" id="about">
            <h2 className="section-title">ABOUT</h2>
            <div className="card">
              <p className="text">
                I am a passionate <span className="highlight highlight-yellow">Web Developer</span> dedicated to crafting <span className="highlight highlight-cyan">responsive and user-friendly websites</span>.
                I specialize in modern frontend technologies including <span className="highlight highlight-pink">React, JavaScript, HTML5, and CSS3</span>.
              </p>
              <p className="text">
                My focus is on creating <span className="highlight highlight-cyan">seamless digital experiences</span>, writing clean scalable code, and staying updated with the <span className="highlight highlight-green">latest web development standards</span>.
              </p>
              <p className="text">
                I bring a strong combination of <span className="highlight highlight-yellow">technical skills</span>, creative design sense, and a drive to solve real-world problems through innovative web solutions.
              </p>
            </div>
          </section>

          {/* Journey / Experience Section */}
          <section className="section journey-section" id="experience">
            <h2 className="section-title-center">My Journey</h2>
            <div className="journey-container">
              <div className="journey-timeline">
                <h3 className="timeline-header">Experience Timeline</h3>
                <div className="timeline-list">
                  <div className="timeline-item-flat">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content-flat">
                      <h4 className="timeline-title">Web Developer</h4>
                      <p className="timeline-date">2021 - Present</p>
                      <p className="timeline-description">
                        Designing, building, and maintaining responsive, high-performance web applications using React, JavaScript, HTML5, CSS3, and modern UI frameworks.
                      </p>
                      <p className="timeline-location"><i className="fas fa-code"></i> Frontend & Fullstack Solutions</p>
                    </div>
                  </div>

                  <div className="timeline-item-flat">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content-flat">
                      <h4 className="timeline-title">Frontend Specialist</h4>
                      <p className="timeline-date">Specialization</p>
                      <p className="timeline-description">
                        Creating seamless user experiences, interactive web components, micro-animations, and responsive cross-browser layouts.
                      </p>
                      <p className="timeline-location"><i className="fas fa-check-circle"></i> High Quality Standards</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="journey-timeline-back">
                <svg className="treasure-map-svg" viewBox="0 0 400 600">
                  <rect width="400" height="600" fill="#f4e7d7" />
                  <g transform="translate(320, 80)">
                    <circle cx="0" cy="0" r="35" fill="none" stroke="#8B4513" strokeWidth="2" />
                    <circle cx="0" cy="0" r="30" fill="none" stroke="#8B4513" strokeWidth="1" />
                    <polygon points="0,-30 5,-10 -5,-10" fill="#D2691E" />
                    <polygon points="0,30 5,10 -5,10" fill="#8B4513" />
                    <polygon points="30,0 10,5 10,-5" fill="#8B4513" />
                    <polygon points="-30,0 -10,5 -10,-5" fill="#8B4513" />
                    <text x="0" y="-40" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#8B4513">N</text>
                  </g>
                  <path d="M 80,150 Q 120,200 100,250 T 140,350 Q 160,400 200,420" stroke="#D2691E" strokeWidth="3" fill="none" strokeDasharray="8,8" strokeLinecap="round" />
                  <circle cx="80" cy="150" r="8" fill="#8B4513" stroke="#654321" strokeWidth="2" />
                  <circle cx="100" cy="250" r="8" fill="#8B4513" stroke="#654321" strokeWidth="2" />
                  <circle cx="140" cy="350" r="8" fill="#8B4513" stroke="#654321" strokeWidth="2" />
                  <g transform="translate(200, 420)">
                    <circle cx="0" cy="0" r="25" fill="#FFD700" opacity="0.3" />
                    <line x1="-15" y1="-15" x2="15" y2="15" stroke="#DC143C" strokeWidth="4" strokeLinecap="round" />
                    <line x1="15" y1="-15" x2="-15" y2="15" stroke="#DC143C" strokeWidth="4" strokeLinecap="round" />
                  </g>
                  <g opacity="0.4">
                    <polygon points="250,200 270,150 290,200" fill="#8B4513" />
                    <polygon points="280,200 300,160 320,200" fill="#A0522D" />
                    <polygon points="220,220 245,170 270,220" fill="#8B4513" />
                  </g>
                  <g opacity="0.4">
                    <polygon points="100,450 110,420 120,450" fill="#228B22" />
                    <rect x="108" y="450" width="4" height="15" fill="#8B4513" />
                    <polygon points="150,480 160,450 170,480" fill="#228B22" />
                    <rect x="158" y="480" width="4" height="15" fill="#8B4513" />
                    <polygon points="70,500 80,470 90,500" fill="#228B22" />
                    <rect x="78" y="500" width="4" height="15" fill="#8B4513" />
                  </g>
                  <g opacity="0.3">
                    <path d="M 40,300 Q 50,295 60,300 T 80,300" stroke="#4682B4" strokeWidth="2" fill="none" />
                    <path d="M 40,310 Q 50,305 60,310 T 80,310" stroke="#4682B4" strokeWidth="2" fill="none" />
                    <path d="M 280,520 Q 290,515 300,520 T 320,520" stroke="#4682B4" strokeWidth="2" fill="none" />
                    <path d="M 280,530 Q 290,525 300,530 T 320,530" stroke="#4682B4" strokeWidth="2" fill="none" />
                  </g>
                  <rect x="10" y="10" width="380" height="580" fill="none" stroke="#8B4513" strokeWidth="3" strokeDasharray="10,5" />
                </svg>
              </div>

              <div className="journey-map-container" style={{ background: '#f4e7d7', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', textAlign: 'center', position: 'relative' }}>
                <svg className="map-overlay-lines">
                  <defs>
                    <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                      <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#000" strokeWidth="2" opacity="0.8" />
                    </pattern>
                    <pattern id="scratches" width="200" height="200" patternUnits="userSpaceOnUse">
                      <line x1="10" y1="20" x2="60" y2="25" stroke="#000" strokeWidth="2" opacity="0.7" />
                      <line x1="100" y1="50" x2="180" y2="48" stroke="#000" strokeWidth="1.5" opacity="0.6" />
                      <line x1="30" y1="120" x2="90" y2="115" stroke="#000" strokeWidth="2" opacity="0.7" />
                      <line x1="140" y1="160" x2="195" y2="165" stroke="#000" strokeWidth="1.5" opacity="0.6" />
                      <line x1="5" y1="180" x2="45" y2="175" stroke="#000" strokeWidth="1.5" opacity="0.6" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  <rect width="100%" height="100%" fill="url(#scratches)" />
                </svg>
                
                <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
                  <div style={{ background: 'var(--white)', border: '3px solid var(--border)', padding: '1.5rem', boxShadow: '6px 6px 0 var(--border)', marginBottom: '1.5rem', textAlign: 'left' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text)' }}>
                      <i className="fas fa-laptop-code" style={{ color: 'var(--cyan)', marginRight: '0.5rem' }}></i> Ajith Kumar
                    </h3>
                    <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: '0.75rem' }}>Web Developer</p>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--text)' }}>
                      Passionate web developer creating clean, responsive, and user-centric web applications. Focused on writing scalable code and crafting memorable web experiences.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                    <div style={{ background: 'var(--yellow)', border: '3px solid var(--border)', padding: '1rem', boxShadow: '4px 4px 0 var(--border)', textAlign: 'center', color: '#000' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>3+</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'Space Mono' }}>Years Exp</div>
                    </div>
                    <div style={{ background: 'var(--accent)', border: '3px solid var(--border)', padding: '1rem', boxShadow: '4px 4px 0 var(--border)', textAlign: 'center', color: '#000' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>100%</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, fontFamily: 'Space Mono' }}>Responsive</div>
                    </div>
                  </div>
                </div>

                <img src={piratImg} alt="Pirate" className="map-pirate-overlay" width="200" height="200" loading="lazy" />
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section className="section" id="skills">
            <h2 className="section-title">SKILLS</h2>
            <div className="skills-grid-modern">
              <div className="skill-box">
                <div className="skill-box-header">
                  <i className="fab fa-react skill-icon-large"></i>
                  <h3 className="skill-box-title">Frontend</h3>
                </div>
                <div className="tech-tags">
                  <span className="tag"><i className="fab fa-html5"></i> HTML5</span>
                  <span className="tag"><i className="fab fa-css3-alt"></i> CSS3</span>
                  <span className="tag"><i className="fab fa-js"></i> JavaScript</span>
                  <span className="tag"><i className="fab fa-react"></i> React.js</span>
                  <span className="tag"><i className="fab fa-bootstrap"></i> Bootstrap</span>
                  <span className="tag"><i className="fas fa-palette"></i> Responsive Design</span>
                </div>
              </div>

              <div className="skill-box">
                <div className="skill-box-header">
                  <i className="fas fa-code skill-icon-large"></i>
                  <h3 className="skill-box-title">Languages</h3>
                </div>
                <div className="tech-tags">
                  <span className="tag"><i className="fab fa-js"></i> JavaScript</span>
                  <span className="tag"><i className="fab fa-html5"></i> HTML</span>
                  <span className="tag"><i className="fab fa-css3"></i> CSS</span>
                </div>
              </div>

              <div className="skill-box">
                <div className="skill-box-header">
                  <i className="fab fa-node skill-icon-large"></i>
                  <h3 className="skill-box-title">Backend</h3>
                </div>
                <div className="tech-tags">
                  <span className="tag"><i className="fab fa-node-js"></i> Node.js</span>
                  <span className="tag"><i className="fas fa-server"></i> Express.js</span>
                  <span className="tag"><i className="fas fa-network-wired"></i> REST API</span>
                </div>
              </div>

              <div className="skill-box">
                <div className="skill-box-header">
                  <i className="fas fa-tools skill-icon-large"></i>
                  <h3 className="skill-box-title">Tools & Version Control</h3>
                </div>
                <div className="tech-tags">
                  <span className="tag"><i className="fab fa-git-alt"></i> Git</span>
                  <span className="tag"><i className="fab fa-github"></i> GitHub</span>
                  <span className="tag"><i className="fas fa-code"></i> VSCode</span>
                  <span className="tag"><i className="fas fa-vial"></i> Vite</span>
                </div>
              </div>
            </div>
          </section>



          {/* Education & Languages Section */}
          <section className="section education-languages-section">
            <div className="education-languages-grid">
              <div className="education-column">
                <h2 className="section-title">EDUCATION</h2>
                <div className="card education-card">
                  <div className="education-header">
                    <div>
                      <h3 className="education-title">Bachelor's Degree in Computer Science / IT</h3>
                      <p className="education-school">University</p>
                    </div>
                    <span className="badge">Graduate</span>
                  </div>
                  <p className="education-location"><i className="fas fa-map-marker-alt"></i> India</p>
                </div>
              </div>

              <div className="languages-column">
                <h2 className="section-title">LANGUAGES</h2>
                <div className="card languages-card">
                  <div className="language-item">
                    <span className="language-name-inline">English</span>
                    <div className="language-stars">
                      <span className="star filled"></span>
                      <span className="star filled"></span>
                      <span className="star filled"></span>
                    </div>
                  </div>
                  <div className="language-item">
                    <span className="language-name-inline">Tamil</span>
                    <div className="language-stars">
                      <span className="star filled"></span>
                      <span className="star filled"></span>
                      <span className="star filled"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="footer">
            <div className="footer-compact">
              <div className="footer-main">
                <div className="footer-brand-compact">
                  <strong>AJITH KUMAR</strong>
                  <span>Web Developer</span>
                </div>
                <div className="footer-nav-compact">
                  <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>Home</a>
                  <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}>About</a>
                  <a href="#experience" onClick={(e) => { e.preventDefault(); scrollToSection('experience'); }}>Experience</a>
                  <a href="#skills" onClick={(e) => { e.preventDefault(); scrollToSection('skills'); }}>Skills</a>
                </div>

              </div>
              <div className="footer-bottom-compact">
                <span>© 2025 Ajith Kumar</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
