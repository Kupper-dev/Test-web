import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { DevLinkProvider } from './devlink/DevLinkProvider';
import { Global } from './devlink/Global';
import { Main } from './devlink/Main';
import { HeroSection } from './devlink/HeroSection';
import { HomeReel } from './devlink/HomeReel';

// Import DevLink and our custom sandbox styles
import './devlink/css/global.css';
import './style.css';

import { initAnimations, killAnimations } from './animations';

function App() {
  useEffect(() => {
    let isMounted = true;

    // Dynamically load main.js for scroll handlers (like Lenis)
    import('./main.js').then(() => {
      if (isMounted) {
        console.log('GSAP, Lenis, and Barba scroll handlers initialized.');
        // Clean up any previously registered animations first to avoid duplicate instances
        killAnimations();
        initAnimations();
      }
    });

    return () => {
      isMounted = false;
      killAnimations();
    };
  }, []);

  return (
    <DevLinkProvider>
      <Global
        text3={<span className="eyebrow">Our Products</span>}
        text4={<span className="eyebrow">Explore</span>}
        text8={
          <div className="tag">
            <div data-wf--button-theme--variant="neutral-800" className="button-bg"></div>
            <span className="eyebrow is--relative">Start</span>
          </div>
        }
        text9={
          <div className="tag">
            <div data-wf--button-theme--variant="purple" className="button-bg"></div>
            <span className="eyebrow is--relative">Learning</span>
          </div>
        }
        text10={
          <span className="button">
            <span data-wf--button-theme--variant="neutral-200" className="button-bg"></span>
            <span style={{ position: 'relative', zIndex: 1 }}>More info</span>
          </span>
        }
      />
      <Main
        mainContent={
          <>
            <HeroSection />
            <HomeReel />
          </>
        }
      />
    </DevLinkProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
