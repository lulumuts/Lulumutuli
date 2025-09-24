// Vue 3 Portfolio Application
console.log('Vue app script loaded!');
console.log('Vue available:', typeof Vue !== 'undefined');

const { createApp, ref, onMounted, computed, watch, nextTick } = Vue;

const app = createApp({
  setup() {
    // Reactive state
    const loading = ref(true);
    const currentView = ref('home');
    const overlay = ref(null);
    const overlayWord = ref(null);
    const transitionLabel = ref('');
    const showTransition = ref(false);
    const svgOverlay = ref(null);
    const showBlackOverlay = ref(false);
    const blackOverlay = ref(null);
    const isFirstLoad = ref(true);

    // Computed properties
    const overlayLabel = computed(() => {
      switch (currentView.value) {
        case 'home': return 'Home';
        case 'work': return 'Work';
        case 'about': return 'About';
        case 'contact': return 'Contact';
        default: return 'Home';
      }
    });

    // SVG Animation state
    let isAnimating = false;
    let currentAnimation = null;

    // SVG Animation Function
    const animateSVGTransition = (viewName) => {
      console.log('Starting transition to:', viewName);
      
      // If already animating, reverse current animation first
      if (isAnimating && currentAnimation) {
        console.log('Reversing current animation...');
        
        // Clean up the current overlay before reversing
        const overlayElement = document.querySelector('.svg-transition-overlay');
        if (overlayElement) {
          overlayElement.classList.remove('show');
          const textElement = overlayElement.querySelector('.transition-text');
          const svgElement = overlayElement.querySelector('.work-transition-svg');
          
          if (textElement) {
            textElement.classList.remove('show');
          }
          if (svgElement) {
            svgElement.classList.remove('show');
          }
        }
        
        // Reverse the animation
        currentAnimation.reverse();
        currentAnimation.finished.then(() => {
          // Clean up state
          showTransition.value = false;
          transitionLabel.value = '';
          if (overlayElement) {
            overlayElement.style.display = 'none';
          }
          
          // Reset animation state
          isAnimating = false;
          currentAnimation = null;
          
          // Wait a bit more for the reverse to complete visually
          setTimeout(() => {
            startNewAnimation(viewName);
          }, 300);
        }).catch(() => {
          // Safety fallback if animation fails
          console.log('Animation reverse failed, cleaning up...');
          showTransition.value = false;
          transitionLabel.value = '';
          if (overlayElement) {
            overlayElement.style.display = 'none';
          }
          isAnimating = false;
          currentAnimation = null;
          
          setTimeout(() => {
            startNewAnimation(viewName);
          }, 300);
        });
        return;
      }
      
      startNewAnimation(viewName);
    };

    const startNewAnimation = (viewName) => {
      // Set the transition label and show overlay immediately
      transitionLabel.value = viewName;
      showTransition.value = true;
      
      // Safety timeout to ensure transition always completes (5 seconds max)
      const safetyTimeout = setTimeout(() => {
        console.log('Safety timeout triggered - forcing transition completion');
        if (showTransition.value) {
          currentView.value = viewName;
          showTransition.value = false;
          transitionLabel.value = '';
          isAnimating = false;
          currentAnimation = null;
          
          const overlayElement = document.querySelector('.svg-transition-overlay');
          if (overlayElement) {
            overlayElement.style.display = 'none';
            overlayElement.classList.remove('show');
          }
        }
      }, 5000);

      // Wait for DOM update
      nextTick(() => {
        const overlayElement = document.querySelector('.svg-transition-overlay');
        console.log('Overlay element found:', !!overlayElement);
        console.log('showTransition value:', showTransition.value);
        console.log('transitionLabel value:', transitionLabel.value);
        
        if (overlayElement) {
          // Make overlay visible first, then add show class for smooth fade-in transition
          overlayElement.style.display = 'block';
          
          // Force a reflow to ensure the element is rendered before transition
          overlayElement.offsetHeight;
          
          // Add show class to trigger the fade-in transition
          overlayElement.classList.add('show');
          
          // Add delayed fade-in for the text or SVG
          const textElement = overlayElement.querySelector('.transition-text');
          const svgElement = overlayElement.querySelector('.work-transition-svg');
          
          console.log('Text element found:', !!textElement);
          console.log('SVG element found:', !!svgElement);
          console.log('transitionLabel:', transitionLabel.value);
          
          if (textElement) {
            setTimeout(() => {
              textElement.classList.add('show');
            }, 200); // Text starts fading in after 200ms - much faster
          }
          
          if (svgElement) {
            setTimeout(() => {
              svgElement.classList.add('show');
              
              // Animate the SVG paths with stroke-dasharray animation
              const paths = svgElement.querySelectorAll('#animated-svg path');
              console.log('Found all paths:', paths.length); // Debug log
              
              // Filter to only the visible paths (the ones with mask attribute)
              const visiblePaths = Array.from(paths).filter(path => path.hasAttribute('mask'));
              console.log('Found visible paths:', visiblePaths.length); // Debug log
              
              visiblePaths.forEach((path, index) => {
                const length = path.getTotalLength(); // total length of the stroke
                console.log(`Visible path ${index} length:`, length); // Debug log
                
                // Ensure the path is properly set up for animation
                path.setAttribute('stroke-dasharray', length);
                path.setAttribute('stroke-dashoffset', length);
                path.setAttribute('stroke', 'white');
                // Set stroke width based on transition type
                const strokeWidth = transitionLabel === 'contact' ? '0.75' : '1';
                path.setAttribute('stroke-width', strokeWidth);
                console.log('Setting stroke-width to:', strokeWidth, 'for transition:', transitionLabel);
                path.setAttribute('fill', 'none');
                path.setAttribute('stroke-linecap', 'round');
                path.setAttribute('stroke-linejoin', 'round');
                
                // Force a reflow to ensure the path is ready
                path.getBoundingClientRect();
              });
              
              // Animate paths one by one
              // Set up the animation
              isAnimating = true;
              currentAnimation = anime({
                targets: visiblePaths,
                strokeDashoffset: [anime.setDashoffset, 0],
                easing: 'easeInOutSine',
                duration: 1500,
                delay: (el, i) => i * 200, // staggered draw
                direction: 'normal',
                loop: false,
                autoplay: false, // Don't start automatically
                begin: function() {
                  console.log('Animation started!'); // Debug log
                },
                complete: function() {
                  console.log('Animation completed!'); // Debug log
                  // Don't reset animation state here - let the timeout handle it
                }
              });
              
              // Start the animation
              currentAnimation.play();
            }, 200); // SVG starts fading in after 200ms
          }
          
          // Show for 4 seconds then fade out (to allow animation to complete)
          setTimeout(() => {
            // Always proceed with transition completion (animation may have finished already)
            console.log('Starting transition completion...');
            
            // Change view first, then start fade out
            currentView.value = viewName;
            
            // Start fade out after a brief delay to allow view change
            setTimeout(() => {
              overlayElement.classList.remove('show');
              
              // Wait for fade-out transition to complete before hiding overlay
              setTimeout(() => {
                showTransition.value = false;
                transitionLabel.value = '';
                
                // Clean up text and SVG classes
                const textElement = overlayElement.querySelector('.transition-text');
                const svgElement = overlayElement.querySelector('.work-transition-svg');
                
                if (textElement) {
                  textElement.classList.remove('show');
                }
                
                if (svgElement) {
                  svgElement.classList.remove('show');
                }
                
                // Hide the overlay completely
                overlayElement.style.display = 'none';
                
                // Reset animation state
                isAnimating = false;
                currentAnimation = null;
                
                // Clear the safety timeout since we completed normally
                clearTimeout(safetyTimeout);
                console.log('Transition completed and cleaned up');
              }, 400); // Reduced from 800ms to 400ms
            }, 50); // Reduced delay before fade out
          }, 2500); // Show for 2.5 seconds to allow animation to complete
          
        } else {
          console.log('Overlay element not found');
          // Fallback - immediate transition
          currentView.value = viewName;
          showTransition.value = false;
          transitionLabel.value = '';
        }
      });
    };

    // Navigation function
    const go = (next) => {
      console.log('Navigation function called with:', next);
      console.log('Current view before change:', currentView.value);
      // Show SVG transition immediately
      animateSVGTransition(next);
    };

    // View transition animation (GSAP)
    const animateViewTransition = (newView) => {
      if (overlay.value && overlayWord.value) {
        gsap.timeline()
          .to(overlay.value, {
            duration: 0.5,
            scaleY: 1,
            transformOrigin: 'top',
            ease: 'power2.inOut'
          })
          .to(overlayWord.value, {
            duration: 0.7,
            opacity: 1,
            y: 0,
            ease: 'power2.out'
          }, '-=0.2')
          .to(overlay.value, {
            duration: 0.5,
            scaleY: 0,
            transformOrigin: 'bottom',
            ease: 'power2.inOut'
          });
      }
    };

    // Lifecycle hooks
    // GSAP Animation Functions
    const animateHomeElements = () => {
      if (currentView.value !== 'home') return;
      
      // Create a timeline for the home animations
      const tl = gsap.timeline();
      
      // Animate the "I'm" heading - subtle fade and slide
      tl.fromTo('.line-drawing-demo h1', 
        { 
          opacity: 0, 
          y: 20 
        },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: "power2.out" 
        }
      );
      
      // Animate the SVG line drawing - smooth and elegant
      tl.fromTo('.lines path', 
        { 
          strokeDasharray: "1000", 
          strokeDashoffset: "1000"
        },
        { 
          strokeDashoffset: "0", 
          duration: 1.5, 
          ease: "power1.inOut" 
        }, "-=0.3"
      );
      
      // Animate SVG opacity separately to avoid affecting stroke properties
      tl.to('.lines path', 
        { 
          opacity: 1, 
          duration: 0.1, 
          ease: "none" 
        }, "-=1.4"
      );
      
      // Animate the subtitle - gentle fade and slide
      tl.fromTo('.line-drawing-demo h2', 
        { 
          opacity: 0, 
          y: 15 
        },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: "power2.out" 
        }, "-=1.0"
      );
      
      // Animate the profile image - ultra smooth blur to focus effect
      tl.fromTo('.background-image', 
        { 
          opacity: 0, 
          filter: "blur(15px) brightness(1.1)",
          scale: 1.02
        },
        { 
          opacity: 1, 
          filter: "blur(0px) brightness(1)",
          scale: 1, 
          duration: 2.0, 
          ease: "power1.inOut" 
        }, "-=0.6"
      );
    };

    // GSAP Hover Floating Animations for Home Elements
    const initHoverFloatingAnimations = () => {
      if (currentView.value !== 'home') return;

      // Hover floating animation for "I'm" text
      gsap.to('.line-drawing-demo h1', {
        y: -8,
        duration: 0.6,
        ease: "power2.out",
        paused: true
      });

      // Hover floating animation for "a UI/UX Designer..." text
      gsap.to('.line-drawing-demo h2', {
        y: -6,
        duration: 0.6,
        ease: "power2.out",
        paused: true
      });

      // Hover floating animation for SVG line drawing
      gsap.to('.line-drawing-demo svg', {
        y: -10,
        duration: 0.6,
        ease: "power2.out",
        paused: true
      });

      // Hover floating animation for background image
      gsap.to('.background-image', {
        y: -12,
        duration: 0.6,
        ease: "power2.out",
        paused: true
      });

      // Add hover event listeners
      const h1Element = document.querySelector('.line-drawing-demo h1');
      const h2Element = document.querySelector('.line-drawing-demo h2');
      const svgElement = document.querySelector('.line-drawing-demo svg');
      const imageElement = document.querySelector('.background-image');

      if (h1Element) {
        h1Element.addEventListener('mouseenter', () => {
          gsap.to(h1Element, { 
            y: -8, 
            duration: 0.6, 
            ease: "power2.out",
            scale: 1.02
          });
        });
        h1Element.addEventListener('mouseleave', () => {
          gsap.to(h1Element, { 
            y: 0, 
            duration: 0.6, 
            ease: "power2.out",
            scale: 1
          });
        });
      }

      if (h2Element) {
        h2Element.addEventListener('mouseenter', () => {
          gsap.to(h2Element, { 
            y: -6, 
            duration: 0.6, 
            ease: "power2.out",
            scale: 1.01
          });
        });
        h2Element.addEventListener('mouseleave', () => {
          gsap.to(h2Element, { 
            y: 0, 
            duration: 0.6, 
            ease: "power2.out",
            scale: 1
          });
        });
      }

      if (svgElement) {
        svgElement.addEventListener('mouseenter', () => {
          gsap.to(svgElement, { 
            y: -10, 
            duration: 0.6, 
            ease: "power2.out" 
          });
        });
        svgElement.addEventListener('mouseleave', () => {
          gsap.to(svgElement, { 
            y: 0, 
            duration: 0.6, 
            ease: "power2.out" 
          });
        });
      }

      // Keep background image in same position (no hover animation)
      // Removed imageElement hover animations
    };

    // Reset elements when leaving a view
    const resetViewElements = (viewName) => {
      let elementsToReset = [];
      
      switch(viewName) {
        case 'work':
          elementsToReset = [
            '#carouselExampleCaptions',
            '.carousel-indicators',
            '.carousel-inner',
            '.carousel-caption'
          ];
          break;
        case 'about':
          elementsToReset = [
            '.about',
            '.about h2',
            '.about p',
            '.about .content'
          ];
          break;
        case 'contact':
          elementsToReset = [
            '.contact .card-content > div',
            '.contact p',
            '.contact .content',
            '.contact button'
          ];
          break;
        default:
          return;
      }

      elementsToReset.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          gsap.set(element, {
            opacity: 0,
            y: 20,
            scale: 0.98
          });
        });
      });
    };

    // Dynamic content animations for different views
    const animateViewContent = (viewName) => {
      let elementsToAnimate = [];
      
      switch(viewName) {
        case 'work':
          elementsToAnimate = [
            '#carouselExampleCaptions',
            '.carousel-indicators',
            '.carousel-inner',
            '.carousel-caption'
          ];
          break;
        case 'about':
          elementsToAnimate = [
            '.about',
            '.about h2',
            '.about p',
            '.about .content'
          ];
          break;
        case 'contact':
          elementsToAnimate = [
            '.contact .card-content > div',
            '.contact p',
            '.contact .content',
            '.contact button'
          ];
          break;
        default:
          return;
      }

      // Create timeline for view content
      const tl = gsap.timeline();
      
      elementsToAnimate.forEach((selector, index) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, elementIndex) => {
          // Set initial state
          gsap.set(element, {
            opacity: 0,
            y: 20,
            scale: 0.98
          });
          
          // Animate in
          tl.to(element, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out"
          }, index * 0.1 + elementIndex * 0.05);
        });
      });
    };


    onMounted(() => {
      setTimeout(() => {
        loading.value = false;
        // Animate home elements after loading
        setTimeout(() => {
          animateHomeElements();
          // Start hover floating animations after initial animation completes
          setTimeout(() => {
            initHoverFloatingAnimations();
          }, 2000); // Wait for initial animation to complete
          // Mark first load as complete
          isFirstLoad.value = false;
        }, 500);
      }, 500); // Loader duration - reduced for faster display
    });

    // Watch for loading completion
    watch(loading, (isLoading) => {
      if (!isLoading) {
        nextTick(() => {
          // Show the card by overriding the CSS display: none
          const card = document.getElementById('card');
          if (card) {
            card.style.display = 'block';
          }
          
          // Animate the glassmorphism overlay
          const homeGlass = document.querySelector('.home-glass');
          if (homeGlass && window.gsap) {
            gsap.fromTo(
              homeGlass,
              { opacity: 1, backdropFilter: 'blur(10px)' },
              {
                opacity: 0,
                backdropFilter: 'blur(0px)',
                duration: 1.8,
                delay: 0.5,
                ease: 'power2.out'
              }
            );
          }
        });
      }
    });

    // Watch for view changes to trigger animations
    watch(currentView, (newView, oldView) => {
      nextTick(() => {
        // Reset previous view elements first
        if (oldView && oldView !== 'home') {
          resetViewElements(oldView);
        }
        
        setTimeout(() => {
          if (newView === 'home') {
            // Only animate home elements on first load, not on subsequent clicks
            if (isFirstLoad.value) {
              animateHomeElements();
            }
        } else if (newView === 'work') {
            // Work view animations only
            animateViewContent(newView);
          } else {
            animateViewContent(newView);
          }
        }, 300); // Small delay to ensure DOM is ready
      });
    });

    // Embla code removed per cleanup

    // Return reactive state and methods
    return {
      loading,
      currentView,
      overlay,
      overlayWord,
      overlayLabel,
      transitionLabel,
      showTransition,
      svgOverlay,
      showBlackOverlay,
      blackOverlay,
      go,
      
    };
  }
});

// Mount the application
console.log('About to mount Vue app...');
console.log('App element exists:', !!document.getElementById('app'));
app.mount('#app');
console.log('Vue app mounted successfully!');
