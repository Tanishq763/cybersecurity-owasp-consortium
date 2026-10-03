import React, { useRef, useState, useEffect } from 'react';

export default function Slider({ children, autoplay = 0, className = '' }) {
  const scrollRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [count, setCount] = useState(React.Children.count(children));
  
  useEffect(() => {
    setCount(React.Children.count(children));
  }, [children]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const newIdx = Math.round(scrollLeft / clientWidth);
    if (newIdx !== index) setIndex(newIdx);
  };

  const scrollTo = (idx) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({
      left: scrollRef.current.clientWidth * idx,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    if (!autoplay || window.MOTION_REDUCED) return;
    let timer;
    const play = () => {
      timer = setInterval(() => {
        setIndex(prev => {
          const next = (prev + 1) % count;
          scrollTo(next);
          return next;
        });
      }, autoplay);
    };
    play();
    
    const pause = () => clearInterval(timer);
    
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('mouseenter', pause);
      el.addEventListener('mouseleave', play);
      el.addEventListener('focusin', pause);
      el.addEventListener('focusout', play);
    }
    
    return () => {
      clearInterval(timer);
      if (el) {
        el.removeEventListener('mouseenter', pause);
        el.removeEventListener('mouseleave', play);
        el.removeEventListener('focusin', pause);
        el.removeEventListener('focusout', play);
      }
    };
  }, [autoplay, count]);

  return (
    <div className={`slider-container ${className}`} aria-roledescription="carousel">
      <div 
        className="slider-track" 
        ref={scrollRef} 
        onScroll={handleScroll}

      >
        {React.Children.map(children, (child, i) => (
          <div 
            className="slider-slide" 
            key={i} 
            style={{ scrollSnapAlign: 'start', flex: '0 0 auto' }}
            aria-roledescription="slide"
          >
            {child}
          </div>
        ))}
      </div>
      
      {count > 1 && (
        <div className="slider-controls" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`slider-dot ${i === index ? 'active' : ''}`}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: '10px', height: '10px', borderRadius: '50%', border: '1px solid var(--mute)',
                background: i === index ? 'var(--red)' : 'transparent',
                cursor: 'pointer', transition: 'background 0.3s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
