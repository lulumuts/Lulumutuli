# 🏠 Home SVG Animation System

A comprehensive SVG line animation system built with anime.js that creates stunning line-drawing animations for the Home.svg file. This system integrates seamlessly with Vue.js applications and provides multiple animation triggers and interactive effects.

## ✨ Features

### 🎬 Core Animations

- **Line Drawing Animation**: SVG paths are drawn sequentially with smooth, timed animations
- **Sequential Path Animation**: Each path animates with a configurable delay for dramatic effect
- **Flourish Animation**: Final scale and rotation effects after line drawing completes

### 🖱️ Interactive Effects

- **Hover Effects**: Paths change color and stroke width on hover
- **Click Effects**: Ripple effects and bounce animations on click
- **Floating Animation**: Gentle up-and-down floating motion
- **Particle Effects**: Dynamic particle explosions

### 🔧 Technical Features

- **Vue.js Integration**: Seamlessly works with existing Vue.js applications
- **Performance Optimized**: Uses CSS transforms and will-change properties
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Supports reduced motion preferences
- **Cross-browser Compatible**: Works on all modern browsers

## 🚀 Installation

### 1. Include Required Files

Add the CSS and JavaScript files to your HTML:

```html
<!-- CSS -->
<link rel="stylesheet" href="./css/home-svg-animations.css" />

<!-- JavaScript (after anime.js) -->
<script src="https://cdn.jsdelivr.net/npm/animejs@3.0.1/lib/anime.min.js"></script>
<script src="./js/home-svg-animations.js"></script>
```

### 2. HTML Structure

Ensure your Home.svg has the proper class:

```html
<img src="img/Home.svg" class="home-title-svg" alt="Home" />
```

### 3. SVG Requirements

Your Home.svg should have paths with the `home-path` class:

```svg
<svg width="154" height="35" viewBox="0 0 154 35" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path class="home-path" d="..." stroke="white" stroke-width="2" fill="none"/>
  <path class="home-path" d="..." stroke="white" stroke-width="2" fill="none"/>
  <!-- More paths... -->
</svg>
```

## 📖 Usage

### Basic Animation

```javascript
// The animation automatically triggers on:
// 1. Page load (if home view is active)
// 2. Transition to home view
// 3. Manual trigger

// Manual trigger
if (window.homeSVGAnimator) {
  window.homeSVGAnimator.animate();
}
```

### Vue.js Integration

The system automatically detects Vue.js view changes and triggers animations:

```javascript
// In your Vue.js app
const go = (next) => {
  if (next === "home") {
    // Animation will automatically trigger
    currentView.value = next;
  }
};
```

### Custom Event Listeners

```javascript
// Listen for animation completion
document.addEventListener("homeSVGAnimationComplete", (e) => {
  console.log("Home SVG animation completed:", e.detail);
  // Trigger additional actions
});

// Listen for view changes
document.addEventListener("viewChange", (e) => {
  console.log(`View changed from ${e.detail.from} to ${e.detail.to}`);
});
```

## 🎛️ Configuration

### Animation Timing

```javascript
// Customize animation timing in the CSS
.home-path-animatable {
    transition: all 0.3s ease; /* Adjust timing */
}

// Or modify the JavaScript timing
this.animationTimeline = anime.timeline({
    easing: 'easeOutExpo',
    duration: 800 // Adjust overall duration
});
```

### Stagger Delays

```javascript
// Adjust delay between path animations
this.paths.forEach((path, index) => {
  this.animationTimeline.add(
    {
      targets: path,
      strokeDashoffset: [length, 0],
      opacity: [0, 1],
      duration: 1200,
      delay: index * 150, // Adjust stagger delay
      easing: "easeInOutSine",
    },
    index * 100
  );
});
```

## 🎨 Customization

### Colors and Effects

```css
/* Customize hover colors */
.home-path-animatable:hover {
  stroke: #00ff88; /* Change hover color */
  stroke-width: 3; /* Change hover stroke width */
}

/* Customize glow effects */
.home-svg-container:hover {
  filter: drop-shadow(0 0 15px rgba(0, 255, 136, 0.5));
}
```

### Animation States

```css
/* Loading state */
.home-svg-container.loading {
  opacity: 0.7;
  filter: grayscale(0.3);
}

/* Success state */
.home-svg-container.success {
  filter: drop-shadow(0 0 20px rgba(0, 255, 136, 0.8));
}

/* Error state */
.home-svg-container.error {
  filter: drop-shadow(0 0 20px rgba(255, 0, 0, 0.8));
}
```

## 🔍 API Reference

### HomeSVGAnimator Class

#### Methods

- `animate()` - Manually trigger the animation
- `reset()` - Reset animation to initial state
- `addHoverEffects()` - Add hover effects to paths
- `addClickEffects()` - Add click effects to paths
- `createFloatingAnimation()` - Create floating animation
- `createParticleEffect()` - Create particle explosion effect

#### Properties

- `isAnimating` - Boolean indicating if animation is running
- `animationTimeline` - Reference to the current animation timeline
- `svgContainer` - Reference to the SVG container element
- `paths` - Array of SVG path elements

### VueTransitionDetector Class

#### Methods

- `checkForViewChanges()` - Check for view changes in the DOM
- `handleViewChange(from, to)` - Handle view transitions

#### Events

- `viewChange` - Dispatched when view changes
- `homeSVGAnimationComplete` - Dispatched when animation completes

## 🌐 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Design

The system automatically adapts to different screen sizes:

```css
@media (max-width: 768px) {
  .home-svg-animated {
    width: 120px;
    height: 27px;
  }
}

@media (max-width: 480px) {
  .home-svg-animated {
    width: 100px;
    height: 23px;
  }
}
```

## ♿ Accessibility

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .home-svg-container,
  .home-path-animatable {
    animation: none;
    transition: none;
  }
}
```

### High Contrast Mode

```css
@media (prefers-contrast: high) {
  .home-svg-container {
    filter: contrast(1.5);
  }

  .home-path-animatable {
    stroke-width: 3;
  }
}
```

## 🧪 Testing

### Demo Page

Open `home-svg-demo.html` in your browser to test all features:

- 🎬 Play Animation
- 🔄 Reset
- 🖱️ Add Hover Effects
- 👆 Add Click Effects
- 🦋 Floating Animation
- ✨ Particle Effect

### Console Logging

The system provides detailed console logging for debugging:

```javascript
// View changes
console.log(`View changed from ${e.detail.from} to ${e.detail.to}`);

// Animation completion
console.log("Home SVG animation completed:", e.detail);
```

## 🐛 Troubleshooting

### Common Issues

1. **Animation not triggering**

   - Check if anime.js is loaded
   - Verify SVG has `home-path` classes
   - Check console for errors

2. **Paths not animating**

   - Ensure SVG is properly converted to inline SVG
   - Check if paths have valid `d` attributes
   - Verify CSS is loaded

3. **Performance issues**
   - Reduce stagger delays
   - Limit particle count
   - Use `will-change` CSS property

### Debug Mode

Enable debug logging:

```javascript
// Add to your JavaScript
localStorage.setItem("homeSVGDebug", "true");
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [anime.js](https://animejs.com/) - Animation library
- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- SVG path animation techniques from the web animation community

---

**Happy Animating! 🎉**
