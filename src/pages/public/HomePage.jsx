import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedCounter from '../../components/common/AnimatedCounter';

const heroSlides = [
  {
    theme: "Royal Jaipur Palace Wedding",
    title: "Every love story deserves an extraordinary beginning.",
    subtitle: "We turn your wedding vision into an unforgettable celebration.",
    location: "City Palace · Jaipur",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=85",
    alt: "Royal Jaipur Palace Wedding"
  },
  {
    theme: "Udaipur Destination Wedding",
    title: "Every love story deserves an extraordinary beginning.",
    subtitle: "We turn your wedding vision into an unforgettable celebration.",
    location: "Lake Palace · Udaipur",
    image: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1800&q=85",
    alt: "Udaipur Destination Wedding"
  },
  {
    theme: "Elegant Floral Wedding",
    title: "Every love story deserves an extraordinary beginning.",
    subtitle: "We turn your wedding vision into an unforgettable celebration.",
    location: "Botanical Pavilions",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1800&q=85",
    alt: "Elegant Floral Wedding"
  },
  {
    theme: "Grand Evening Reception",
    title: "Every love story deserves an extraordinary beginning.",
    subtitle: "We turn your wedding vision into an unforgettable celebration.",
    location: "Heritage Courtyards",
    image: "https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1800&q=85",
    alt: "Grand Evening Reception"
  }
];

const destinations = [
  {
    name: "Jaipur",
    state: "Rajasthan",
    description: "Centuries-old royal palaces, grand courtyards, and starlit open-air banquets with regal hospitality.",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=85"
  },
  {
    name: "Udaipur",
    state: "Rajasthan",
    description: "Romantic lakefront pavilions, illuminated island palaces, and tranquil sunset boat processions.",
    image: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=85"
  },
  {
    name: "Hyderabad",
    state: "Telangana",
    description: "Magnificent Nizami palaces, heritage banquet halls, and grand culinary banquets steeped in history.",
    image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=85"
  },
  {
    name: "Kerala",
    state: "South India",
    description: "Serene backwater resorts, private beachfront estates, and lush tropical coconut grove ceremonies.",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=85"
  }
];

export default function HomePage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="home" className="w-full min-h-screen bg-surface text-on-surface flex flex-col font-sans">
      {/* 1. NAVIGATION BAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-surface/95 backdrop-blur-md shadow-sm border-b border-secondary/25 py-3'
            : 'bg-surface/85 backdrop-blur-sm border-b border-secondary/15 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* LEFT: Vivaah Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-primary-container text-secondary flex items-center justify-center border border-secondary/30 transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-[17px]">diamond</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-serif text-[20px] tracking-[0.16em] uppercase text-primary font-medium leading-none">
                VIVAAH
              </span>
              <span className="font-sans text-[8.5px] uppercase tracking-[0.25em] text-secondary mt-0.5 font-semibold">
                Luxury Weddings
              </span>
            </div>
          </Link>

          {/* CENTRE: Home, About Us, Enquire Us (Desktop) */}
          <div className="hidden md:flex items-center gap-10 font-sans text-[13px] font-medium tracking-wide text-on-surface-variant">
            <button
              onClick={() => scrollToSection('home')}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              About Us
            </button>
            <Link
              to="/enquire"
              className="hover:text-primary transition-colors"
            >
              Enquire Us
            </Link>
          </div>

          {/* RIGHT: Login & Enquire Now */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="text-on-surface-variant hover:text-primary font-sans text-xs uppercase tracking-wider px-4 py-2 rounded transition-colors font-medium border border-secondary/20 hover:border-secondary/50 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">lock</span>
              <span>Login</span>
            </Link>
            <Link
              to="/enquire"
              className="bg-primary text-on-primary px-5 py-2 font-sans text-xs uppercase tracking-wider rounded font-medium hover:bg-secondary-dark transition-all duration-200 shadow-sm border border-secondary/30"
            >
              Enquire Now
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-3">
            <Link
              to="/enquire"
              className="bg-primary text-on-primary px-3.5 py-1.5 font-sans text-[11px] uppercase tracking-wider rounded font-medium"
            >
              Enquire
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded text-on-surface hover:bg-surface-container transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-surface-container-lowest border-b border-secondary/20 px-6 py-4 space-y-3 font-sans text-sm animate-fadeIn">
            <button
              onClick={() => scrollToSection('home')}
              className="block w-full text-left py-1 text-on-surface hover:text-secondary font-medium"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left py-1 text-on-surface hover:text-secondary font-medium"
            >
              About Us
            </button>
            <Link
              to="/enquire"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-1 text-on-surface hover:text-secondary font-medium"
            >
              Enquire Us
            </Link>
            <div className="pt-2 border-t border-secondary/15 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-on-surface-variant hover:text-primary font-medium flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-secondary">lock</span>
                  <span>Portal Login</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-secondary">arrow_forward</span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* 2. HERO SLIDESHOW SECTION */}
      <section className="relative w-full h-[88vh] min-h-[580px] pt-16 flex items-center">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentSlide === idx ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover transition-transform duration-[8000ms] ease-out scale-100"
            />
            {/* Elegant dark overlay ensuring clear readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-primary/30" />
            <div className="absolute inset-0 bg-black/25" />
          </div>
        ))}

        {/* Hero Foreground Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 w-full text-surface flex flex-col justify-between py-12 h-full">
          {/* Top Theme Tag */}
          <div className="pt-6">
            <span className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-secondary-fixed bg-primary/40 backdrop-blur-sm px-3 py-1 rounded border border-secondary/30">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed" />
              {heroSlides[currentSlide].theme}
            </span>
          </div>

          {/* Central Title & Supporting Text */}
          <div className="max-w-3xl space-y-5 my-auto">
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-[1.1] tracking-tight font-light text-surface-bright">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="font-sans text-base sm:text-xl text-surface-container font-light leading-relaxed max-w-2xl">
              {heroSlides[currentSlide].subtitle}
            </p>
            <div className="pt-3">
              <Link
                to="/enquire"
                className="inline-flex items-center gap-2.5 bg-surface text-primary px-7 py-3 rounded font-sans text-xs uppercase tracking-widest font-semibold hover:bg-secondary-container hover:text-on-secondary-container transition-all duration-200 shadow-xl"
              >
                <span>Plan Your Wedding</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Bottom Controls & Indicators */}
          <div className="flex items-center justify-between pt-4 border-t border-surface/20">
            <div className="flex items-center gap-3">
              <span className="font-sans text-xs text-secondary-fixed font-tabular-nums tracking-widest font-semibold">
                0{currentSlide + 1} / 0{heroSlides.length}
              </span>
              <div className="flex items-center gap-1.5 ml-2">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-[2px] rounded-full transition-all duration-300 ${
                      currentSlide === idx ? 'w-6 bg-secondary-fixed' : 'w-2 bg-surface/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="w-9 h-9 rounded-full bg-surface/15 hover:bg-surface/30 flex items-center justify-center text-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="w-9 h-9 rounded-full bg-surface/15 hover:bg-surface/30 flex items-center justify-center text-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ANIMATED STATISTICS BAR */}
      <section className="w-full bg-surface-container-low border-b border-secondary/20 py-10 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left divide-y sm:divide-y-0 sm:divide-x divide-secondary/20">
            {/* Stat 1 */}
            <div className="flex flex-col items-center sm:items-start space-y-1 sm:px-6 first:pl-0">
              <div className="font-serif text-4xl sm:text-5xl text-primary font-normal text-secondary">
                <AnimatedCounter end={100} suffix="+" />
              </div>
              <span className="font-sans text-xs uppercase tracking-wider text-secondary font-semibold">
                Weddings Celebrated
              </span>
              <p className="font-sans text-xs text-on-surface-variant">
                Crafted across historic heritage palaces and private estates.
              </p>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center sm:items-start space-y-1 sm:px-8 pt-6 sm:pt-0">
              <div className="font-serif text-4xl sm:text-5xl text-primary font-normal text-secondary">
                <AnimatedCounter end={30} suffix="+" />
              </div>
              <span className="font-sans text-xs uppercase tracking-wider text-secondary font-semibold">
                Trusted Vendors
              </span>
              <p className="font-sans text-xs text-on-surface-variant">
                Carefully vetted caterers, floral designers, and production artisans.
              </p>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center sm:items-start space-y-1 sm:px-8 pt-6 sm:pt-0">
              <div className="font-serif text-4xl sm:text-5xl text-primary font-normal text-secondary">
                <AnimatedCounter end={15} suffix="+" />
              </div>
              <span className="font-sans text-xs uppercase tracking-wider text-secondary font-semibold">
                Wedding Destinations
              </span>
              <p className="font-sans text-xs text-on-surface-variant">
                Unmatched destination access in Rajasthan, South India, and beyond.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ABOUT US SECTION */}
      <section id="about" className="w-full py-24 px-6 lg:px-12 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Story & Philosophy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="font-sans text-xs uppercase tracking-widest text-secondary font-semibold flex items-center gap-2">
                  <span className="w-5 h-px bg-secondary" />
                  About Vivaah
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary leading-[1.15]">
                  More than a wedding.<br />
                  <span className="italic text-secondary">A story crafted around you.</span>
                </h2>
              </div>

              <div className="space-y-4 font-sans text-sm sm:text-base text-on-surface-variant leading-relaxed">
                <p>
                  Vivaah was founded on a simple belief: a wedding is a sacred coming together of two families, rich traditions, and profound love. We combine timeless elegance with meticulous coordination so you and your families can celebrate every moment with total peace of mind.
                </p>
                <p>
                  From intimate Mehendi gatherings and high-energy Sangeet evenings to sacred wedding ceremonies at sunset and grand receptions, our dedicated team manages every single detail with warmth, precision, and care.
                </p>
              </div>

              {/* Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 bg-surface-container-low rounded border border-secondary/20 space-y-2">
                  <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                    <span className="material-symbols-outlined text-[18px]">design_services</span>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-primary">Thoughtful Design</h3>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    Custom mandap scenography, floral arrangements, and tasteful lighting tailored to your vision.
                  </p>
                </div>

                <div className="p-5 bg-surface-container-low rounded border border-secondary/20 space-y-2">
                  <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                    <span className="material-symbols-outlined text-[18px]">support_agent</span>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-primary">Warm Hospitality</h3>
                  <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                    Dedicated support for the couple, smooth guest arrivals, and seamless on-ground coordination.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: High Quality Authentic Indian Wedding Photography */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-lg overflow-hidden shadow-xl border border-secondary/25 aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&w=1200&q=85"
                  alt="Authentic traditional Indian royal wedding ceremony"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent flex items-end p-6">
                  <p className="font-serif text-surface text-lg italic">
                    “Every celebration handled with genuine warmth and care.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WEDDING PACKAGES (EXACTLY TWO PRIMARY PACKAGES) */}
      <section className="w-full py-24 px-6 lg:px-12 bg-surface-container-low border-y border-secondary/20">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="font-sans text-xs uppercase tracking-widest text-secondary font-semibold">
              Our Services
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-primary">
              Wedding Packages Tailored to You
            </h2>
            <p className="font-sans text-xs sm:text-sm text-on-surface-variant">
              Choose the level of planning support that fits your timeline and requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Package 1: Full-Service Wedding Planning */}
            <div className="bg-surface rounded-lg border border-secondary/25 shadow-md hover:shadow-xl transition-all duration-300 p-8 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex items-start justify-between">
                  <span className="font-serif text-3xl text-secondary">01</span>
                  <span className="px-3 py-1 bg-primary text-on-primary rounded text-[10px] font-sans uppercase tracking-wider font-medium">
                    Comprehensive
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-2xl text-primary font-medium">
                    Full-Service Wedding Planning
                  </h3>
                  <p className="font-sans text-xs text-on-surface-variant mt-2 leading-relaxed">
                    End-to-end guidance from the initial vision to the final farewell, ensuring every milestone is executed flawlessly.
                  </p>
                </div>

                <div className="pt-2 border-t border-secondary/15">
                  <h4 className="font-sans text-xs uppercase tracking-wider text-secondary font-semibold mb-3">
                    What's Included:
                  </h4>
                  <ul className="space-y-2.5 font-sans text-xs text-on-surface-variant">
                    <li className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      <span>Wedding theme and design conceptualization</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      <span>Venue selection and booking assistance</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      <span>Vendor coordination and contract management</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      <span>Guest management and RSVP assistance</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      <span>Multi-day event schedules and timelines</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      <span>Complete wedding-day coordination on the ground</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/enquire?package=Full-Service+Wedding+Planning"
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-on-primary py-3.5 px-6 rounded font-sans text-xs uppercase tracking-wider font-semibold hover:bg-secondary-dark transition-all duration-200 shadow-md border border-secondary/30 group"
                >
                  <span>Plan Your Wedding</span>
                  <span className="material-symbols-outlined text-[15px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Package 2: Partial / Day-of Coordination */}
            <div className="bg-surface rounded-lg border border-secondary/25 shadow-md hover:shadow-xl transition-all duration-300 p-8 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex items-start justify-between">
                  <span className="font-serif text-3xl text-secondary">02</span>
                  <span className="px-3 py-1 bg-surface-container-high text-primary rounded text-[10px] font-sans uppercase tracking-wider font-medium">
                    Coordination
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-2xl text-primary font-medium">
                    Partial / Day-of Coordination
                  </h3>
                  <p className="font-sans text-xs text-on-surface-variant mt-2 leading-relaxed">
                    Designed for couples who have already chosen their core vendors and need seasoned professionals to run the day smoothly.
                  </p>
                </div>

                <div className="pt-2 border-t border-secondary/15">
                  <h4 className="font-sans text-xs uppercase tracking-wider text-secondary font-semibold mb-3">
                    What's Included:
                  </h4>
                  <ul className="space-y-2.5 font-sans text-xs text-on-surface-variant">
                    <li className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      <span>Schedule and timeline management</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      <span>Vendor arrival and setup coordination</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      <span>Family movement and ritual schedule guidance</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      <span>On-ground assistance for the couple</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      <span>Event-day execution and problem solving</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/enquire?package=Partial+/+Day-of+Coordination"
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-on-primary py-3.5 px-6 rounded font-sans text-xs uppercase tracking-wider font-semibold hover:bg-secondary-dark transition-all duration-200 shadow-md border border-secondary/30 group"
                >
                  <span>Plan Your Wedding</span>
                  <span className="material-symbols-outlined text-[15px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DESTINATIONS (SIMPLIFIED 4 CARDS: JAIPUR, UDAIPUR, HYDERABAD, KERALA) */}
      <section className="w-full py-24 px-6 lg:px-12 bg-surface">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-sans text-xs uppercase tracking-widest text-secondary font-semibold">
              Destinations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-primary">
              Popular Wedding Destinations
            </h2>
            <p className="font-sans text-xs sm:text-sm text-on-surface-variant">
              From majestic palaces in Rajasthan to tranquil coastal retreats.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((dest) => (
              <div
                key={dest.name}
                className="bg-surface-container-lowest rounded-lg border border-secondary/20 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-primary/80 backdrop-blur-sm text-surface text-[10px] font-sans uppercase tracking-wider px-2.5 py-0.5 rounded font-medium">
                      {dest.state}
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-serif text-xl text-primary font-medium">{dest.name}</h3>
                    <p className="font-sans text-xs text-on-surface-variant leading-relaxed">
                      {dest.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/enquire?destination=${dest.name}`}
                    className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-secondary hover:text-primary transition-colors"
                  >
                    <span>Enquire for {dest.name}</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="w-full py-20 px-6 lg:px-12 bg-primary-container text-surface text-center border-t border-secondary/25">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="font-sans text-xs uppercase tracking-widest text-secondary font-semibold">
            Get In Touch
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-surface-bright font-light">
            Your dream wedding starts with a conversation.
          </h2>
          <p className="font-sans text-sm sm:text-base text-surface-container max-w-xl mx-auto font-light leading-relaxed">
            Tell us the story you want to celebrate. We'll take care of bringing it to life.
          </p>
          <div className="pt-4 flex justify-center">
            <Link
              to="/enquire"
              className="bg-secondary text-primary px-8 py-3.5 rounded font-sans text-xs uppercase tracking-widest font-semibold hover:bg-secondary-fixed transition-colors shadow-lg"
            >
              Let's Plan Your Wedding
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FOOTER (CLEAN, NO PUBLIC PORTAL SWITCHING / INTERNAL LINKS) */}
      <footer className="w-full py-12 px-6 lg:px-12 bg-surface-container-high border-t border-secondary/20 font-sans text-xs text-on-surface-variant mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl tracking-[0.16em] uppercase text-primary font-medium">
                VIVAAH
              </span>
            </div>
            <p className="text-on-surface-variant leading-relaxed max-w-xs">
              Luxury wedding planning and coordination creating memorable celebrations across India and abroad.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-sans uppercase text-[11px] text-primary font-semibold tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => scrollToSection('home')} className="hover:text-primary transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('about')} className="hover:text-primary transition-colors cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <Link to="/enquire" className="hover:text-primary transition-colors">
                  Enquire Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-sans uppercase text-[11px] text-primary font-semibold tracking-wider">
              Contact &amp; Offices
            </h4>
            <p className="leading-relaxed">
              Jaipur · Mumbai · Udaipur · Hyderabad
            </p>
            <p className="text-secondary font-medium">
              hello@vivaahweddings.com · +91 98200 44123
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-sans uppercase text-[11px] text-primary font-semibold tracking-wider">
              Portal Access
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/login" className="hover:text-primary transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  <span>Portal Login</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-secondary/15 flex flex-col sm:flex-row items-center justify-between text-[11px] text-on-surface-variant/70 gap-3">
          <p>© 2026 Vivaah Luxury Wedding Planning. All rights reserved.</p>
          <p>Designed with care for unforgettable celebrations.</p>
        </div>
      </footer>
    </div>
  );
}
