let overallImageScaleTween = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
  initOverallImageScrollAnimation();
}
function preload() {
  mySound = loadSound("assets/04_Master.wav");
}

function draw() {
  background(250, 248, 246);
//   drawGuideGrid(12, 12, 64, 16);
}

// function drawGuideGrid(cols, rows, margin, gutterSize) {
//   const gridW = width - margin * 2;
//   const gridH = height - margin * 2;
//   if (gridW <= 0 || gridH <= 0) return;
//   const cellW = (gridW - gutterSize * (cols - 1)) / cols;
//   const cellH = (gridH - gutterSize * (rows - 1)) / rows;
//   if (cellW <= 0 || cellH <= 0) return;
//   push();
//   noFill();
//   stroke(255, 0, 0, 26);
//   strokeWeight(1);
//   for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) rect(margin + c * (cellW + gutterSize), margin + r * (cellH + gutterSize), cellW, cellH);
//   pop();
// }

function initOverallImageScrollAnimation() {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  if (overallImageScaleTween) {
    if (overallImageScaleTween.scrollTrigger) overallImageScaleTween.scrollTrigger.kill();
    overallImageScaleTween.kill();
  }

  gsap.set(".overall-image", { scale: 0.8 });

  overallImageScaleTween = gsap.to(".overall-image", {
    scale: 1,
    ease: "none",
    scrollTrigger: {
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 1
    }
  });

// NOTE RIGHT
gsap.fromTo("#note-right", 
  { opacity: 0.8 }, // STARTING STATE
  { 
    opacity: 1,   // ENDING STATE
    scrollTrigger: {
      trigger: "#note-right",
      start: "top 35%", 
      end: "+=3200", 
      pin: true, 
      
      // scrub: true ties the animation to your scroll bar. 
      // It will slowly fade from 0 to 1 over the 3200px scroll distance.
      scrub: true, 
      markers: false, 
    }
});

// NOTE LEFT
gsap.fromTo("#note-left", 
  { opacity: 0.8 }, // STARTING STATE
  { 
    opacity: 1,   // ENDING STATE
    scrollTrigger: {
      trigger: "#note-left",
      start: "top 70%", 
      end: "+=2200", 
      pin: true, 
      
      // scrub: true ties the animation to your scroll bar.
      scrub: true, 
      markers: false, 
    }
});

  let logoAndButtonTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: "#logo",
      start: "top 20%", 
      // We increased the end distance to 400px to give you enough 
      // scrolling room for BOTH the logo fade and the button fade
      end: "+=120", 
      pin: true, 
      scrub: true, // Ties both animations smoothly to the scrollbar
      markers: false 
    }
  });

  // 1st Animation: Fade in the logo
  logoAndButtonTimeline.fromTo("#logo", 
    { opacity: 0 }, 
    { opacity: 1, ease: "none" }
  )
  // 2nd Animation: Fade in the button right AFTER the logo reaches 100%
  .fromTo(".home-link", 
    { 
      autoAlpha: 0 // autoAlpha sets opacity to 0 AND makes it unclickable
    }, 
    { 
      autoAlpha: 1, // Fades to 100% and becomes clickable
      ease: "none" 
    }
  );

  ScrollTrigger.create({
  start: 1,
  end: "max",
  onUpdate: (self) => {
    if (self.scroll() > 0) {
      gsap.to(".scroll-navigation", {
        opacity: 0,
        duration: 0.3,
        overwrite: "auto"
      });
    } else {
      gsap.to(".scroll-navigation", {
        opacity: 1,
        duration: 0.3,
        overwrite: "auto"
      });
    }
  }
});
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (window.ScrollTrigger) ScrollTrigger.refresh();
}


