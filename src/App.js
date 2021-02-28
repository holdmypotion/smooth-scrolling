import React, { useEffect, useRef } from "react";

import "./App.css";
import useWindowSize from "./hooks/useWindowSize";
import Section from "./components/section";

function App() {
  // 1.
  const windowSize = useWindowSize();

  //2.
  const scrollingContainerRef = useRef();

  // 3.
  const data = {
    ease: 0.1,
    current: 0,
    previous: 0,
    rounded: 0,
  };

  // 4.
  useEffect(() => {
    setBodyHeight();
  }, [windowSize.height]);

  const setBodyHeight = () => {
    document.body.style.height = `${
      scrollingContainerRef.current.getBoundingClientRect().height
    }px`;
  };

  // 5.
  useEffect(() => {
    requestAnimationFrame(() => smoothScrolling());
  }, []);

  const smoothScrolling = () => {
    data.current = window.scrollY;
    data.previous += (data.current - data.previous) * data.ease;
    data.rounded = Math.round(data.previous * 100) / 100;

    scrollingContainerRef.current.style.transform = `translateY(-${data.previous}px)`;

    // Recursive call
    requestAnimationFrame(() => smoothScrolling());
  };

  return (
    <div className="App">
      <div ref={scrollingContainerRef}>
        <div>
          <h2>Smooth Scrolling</h2>
          <Section flexDirection="row" />
          <Section flexDirection="row-reverse" />
          <Section flexDirection="row" />
          <Section flexDirection="row-reverse" />
          <Section flexDirection="row" />
          <Section flexDirection="row-reverse" />
        </div>
      </div>
    </div>
  );
}

export default App;
