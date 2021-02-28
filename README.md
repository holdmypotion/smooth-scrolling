I have been wanting to redo my portfolio, and one of the major things I wanted it to have was smooth scrolling. So, I created a super simple smooth-scrolling effect with no extra dependencies but react.

In this blog, we'll be creating that together. So, let's get right into it.

Live Link: [https://usqn6.csb.app/](https://usqn6.csb.app/)

CodeSandBox: [https://codesandbox.io/s/react-super-simple-smooth-scrolling-usqn6](https://codesandbox.io/s/react-super-simple-smooth-scrolling-usqn6)

Github: [https://github.com/holdmypotion/smooth-scrolling](https://github.com/holdmypotion/smooth-scrolling)

# Setup

Run the following commands to set up a react app.

```bash
npx create-react-app smooth-scroll
cd smooth-scroll
yarn start
```

# Overview

So essentially what we are trying to do is to simply translate a div in Y-direction with a delay.
This div will hold the full SPA (Single Page Application), resulting in an all-out smooth scrolling effect.

```html
<div className="parent">
  <div ref={scrollingContainer}>
    {/* The Complete App */}
  </div>
</div
```

```css
.parent {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}
```

In this set up the div with the ref `scrollingContainer` will translate in Y-direction.
Notice that the div with a class of "parent" is set to `position: fixed`. This is essential otherwise the children div will just translate up leaving the space empty down below.

By doing this we are basically letting the browser know that our whole app is a fixed container of "width=100%" and "height=100%", with no scroll and stuff.

Later on, we'll be setting the height of the <body> tag equal to the "`scrollingContainer` div" and that will allow us to scroll.

On Scroll we'll translate the "`scrollingContainer` div".

Don't worry if this doesn't make sense. Hopefully, the code will make it clearer.

# Final File Structure

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/fe39b8f9-d15f-451e-8c9a-d361df1c5bf9/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/fe39b8f9-d15f-451e-8c9a-d361df1c5bf9/Untitled.png)

# SmoothScroll.js

Create a file in **`src/components/SmoothScroll/SmoothScroll.js`** and paste the code below.
Don't worry about the imports just yet. We'll be creating them shortly.

```jsx
import React, { useEffect, useRef } from "react";

import "./SmoothScroll.css";
import useWindowSize from "../../hooks/useWindowSize";

const SmoothScroll = ({ children }) => {
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
    requestAnimationFrame(() => smoothScrollingHandler());
  }, []);

  const smoothScrollingHandler = () => {
    data.current = window.scrollY;
    data.previous += (data.current - data.previous) * data.ease;
    data.rounded = Math.round(data.previous * 100) / 100;

    scrollingContainerRef.current.style.transform = `translateY(-${data.previous}px)`;

    // Recursive call
    requestAnimationFrame(() => smoothScrollingHandler());
  };

  return (
    <div className="parent">
      <div ref={scrollingContainerRef}>{children}</div>
    </div>
  );
};

export default SmoothScroll;
```

Let's break it down.

1. useWindowSize() is a custom hook that returns the current innerWidth and innerHeight of the window.
2. scrollingContainerRef is used to apply translateY property on the div, on the fly.
3. `data` is not a state because we don't want our react component re-rendering each time we scroll.
4. This useEffect runs only if the `windowSize` changes (if the user resizes the browser). `setBodyHeight` makes the height property on <body> equal to the height of the "`scrollingContainerRef` div". After passing "position: fixed" to the "parent div", this makes sure that we have enough room to scroll through the whole "`scrollingContainerRef` div"
5. This useEffect runs only once and calls the `smoothScrolling` function.
   The `smoothScrolling` function runs recursively changing the translate property on the "`scrollingContainerRef` div" whenever the user scroll.

Notice that we are calling the `smoothScrolling` function through `requestAnimationFrame()` function.

> The `window.requestAnimationFrame(**)**` method tells the browser that you wish to perform an animation and requests that the browser calls a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint.

> **Note:** Your callback routine must itself call `requestAnimationFrame()` again if you want to animate another frame at the next repaint. `requestAnimationFrame()` is 1 shot.

### SmoothScrolling.css

Create a file in **`src/components/SmoothScroll/SmoothScroll.css`** and paste the code below.

```css
.parent {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}
```

# useWindowSize.js

Create a file in **src/hooks/useWindowSize.js** and paste the code below

```jsx
import { useState, useEffect } from "react";

export default function useWindowSize() {
  const getSize = () => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  };

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(getSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
```

This is a pretty straightforward hook that listens to the event of window `resize` and returns the latest `innerWidth` and `innerHeight` of the window.

# Section.js

Create a file `src/components/Section/Section.js` and paste the code below.

```jsx
import React from "react";

import "./section.css";

const section = ({ flexDirection }) => {
  return (
    <div className="section" style={{ flexDirection: flexDirection }}>
      <div className="left-container">
        <div className="block"></div>
      </div>

      <div className="right-container">
        <div className="container">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. In
            laudantium esse fugiat illum tempore sapiente soluta labore voluptas
            iusto deleniti ab suscipit dolores quisquam corrupti facilis, id
            temporibus mollitia repellat omnis tempora commodi eveniet.
            Incidunt, perspiciatis, adipisci laboriosam dolores quos dolor
            voluptate odio magnam aperiam, alias asperiores pariatur! Nisi,
            libero!
          </p>
        </div>
      </div>
    </div>
  );
};

export default section;
```

### SmoothScrolling.css

Create a file `src/components/Section/Section.css` and paste the code below.

```css
.section {
  display: flex;
  justify-content: space-around;
  width: 100%;
  align-items: center;
  height: 100vh;
}

.block {
  width: 250px;
  height: 250px;
  padding: 60px;
  background-color: peachpuff;
}

.container {
  width: 500px;
}

p {
  font-size: 1.5rem;
}
```

Just a react component to fill up some space in our scrolling Container

# App.js

```jsx
import React from "react";

import "./App.css";
import Section from "./components/Section/Section";
import SmoothScroll from "./components/SmoothScroll/SmoothScroll";

function App() {
  return (
    <SmoothScroll>
      <h2>Smooth Scrolling</h2>
      <Section flexDirection="row" />
      <Section flexDirection="row-reverse" />
      <Section flexDirection="row" />
      <Section flexDirection="row-reverse" />
      <Section flexDirection="row" />
      <Section flexDirection="row-reverse" />
    </SmoothScroll>
  );
}

export default App;
```

### App.css

```css
h2 {
  text-align: center;
  margin: 40px auto;
  font-size: 4rem;
}
```

Live Link: [https://usqn6.csb.app/](https://usqn6.csb.app/)

CodeSandBox: [https://codesandbox.io/s/react-super-simple-smooth-scrolling-usqn6](https://codesandbox.io/s/react-super-simple-smooth-scrolling-usqn6)

Github: [https://github.com/holdmypotion/smooth-scrolling](https://github.com/holdmypotion/smooth-scrolling)

### Thank you for reading!

Would love to hear your thought!
