# LLM-Renderable Motion Animations
### Pure HTML + CSS + Vanilla JS — No External Libraries, No Build Tools

> **Inclusion criteria:**
> - ✅ Pure HTML + CSS + vanilla JS (no GSAP, no Three.js, no canvas libraries)
> - ✅ No external fonts, images, or network requests
> - ✅ Works inside a single `.html` file (or an artifact/preview pane)
> - ✅ No WebGL, no Web Audio API, no experimental APIs

---

# PART 1: ENTRANCE / EXIT
*CSS `@keyframes` + `opacity` / `transform`*

---

## 01. Fade In / Fade Out
**How:** `opacity` transition from 0 to 1.
**Tools:** CSS `@keyframes`, `transition`.

---

## 02. Slide In / Slide Out
**How:** `transform: translateX()` / `translateY()`.
**Tools:** CSS `@keyframes`.

---

## 03. Scale In / Scale Out
**How:** `transform: scale()` from 0 to 1.
**Tools:** CSS `@keyframes`.

---

## 04. Rotate In / Rotate Out
**How:** `transform: rotate()` + `opacity`.
**Tools:** CSS `@keyframes`.

---

## 05. Flip In / Flip Out
**How:** `rotateY()` + `perspective` on parent.
**Tools:** CSS 3D transforms.

---

## 06. Bounce In / Bounce Out
**How:** Multi-step `@keyframes` with overshoot easing.
**Tools:** CSS `cubic-bezier()`.

---

## 07. Drop In / Drop Out
**How:** `translateY()` from negative + overshoot.
**Tools:** CSS `@keyframes`.

---

## 08. Mask Reveal
**How:** `clip-path: inset()` or `overflow: hidden` container.
**Tools:** CSS.

---

# PART 2: ATTENTION / EMPHASIS
*CSS `@keyframes` infinite loops*

---

## 09. Pulse
**How:** Oscillating `scale()`.
**Tools:** CSS `@keyframes`.

---

## 10. Shake
**How:** Rapid `translateX()` alternation.
**Tools:** CSS `@keyframes`.

---

## 11. Wobble
**How:** `rotate()` + `translateX()` loop.
**Tools:** CSS `@keyframes`.

---

## 12. Heartbeat
**How:** Double-pulse pattern.
**Tools:** CSS `@keyframes`.

---

## 13. Flash
**How:** Rapid `opacity` toggling.
**Tools:** CSS `@keyframes`.

---

## 14. Swing
**How:** `rotate()` with `transform-origin: top center`.
**Tools:** CSS `@keyframes`.

---

## 15. Tada
**How:** `scale()` + `rotate()` + `translate()` combo.
**Tools:** CSS `@keyframes`.

---

# PART 3: LOOPING / AMBIENT

---

## 16. Float
**How:** Subtle `translateY()` oscillation.
**Tools:** CSS `@keyframes` ease-in-out.

---

## 17. Breathe
**How:** Slow `scale()` + `opacity` cycle.
**Tools:** CSS `@keyframes`.

---

## 18. Spin / Rotate
**How:** Continuous `rotate(360deg)` linear.
**Tools:** CSS `@keyframes`.

---

## 19. Orbit
**How:** `rotate()` on parent, `translateX()` on child.
**Tools:** CSS nested transforms.

---

## 20. Wave (Staggered)
**How:** Same `translateY()` animation, different `animation-delay` per child.
**Tools:** CSS `animation-delay`.

---

## 21. Ripple
**How:** Expanding circle via `scale()` + `opacity`.
**Tools:** CSS `@keyframes`.

---

## 22. Glow / Pulse Glow
**How:** `box-shadow` oscillation.
**Tools:** CSS `@keyframes`.

---

## 23. Gradient Shift
**How:** `background-position` on a wide gradient.
**Tools:** CSS `@keyframes`, `background-size: 200%`.

---

## 24. Shimmer / Skeleton Loader
**How:** Sweeping gradient stripe.
**Tools:** CSS `@keyframes`.

---

## 25. Scan Line
**How:** Thin bar `translateY()` across container.
**Tools:** CSS `@keyframes`.

---

# PART 4: TRANSITION / STATE-CHANGE
*CSS `:hover`, `:focus`, `:active`*

---

## 26. Hover Effects
**How:** `:hover` with `transition` on transform/color/shadow.
**Tools:** CSS transitions.

---

## 27. Focus States
**How:** `:focus-visible` with outline/scale/glow.
**Tools:** CSS.

---

## 28. Active / Pressed
**How:** `:active` with `scale(0.95)`.
**Tools:** CSS.

---

## 29. Toggle Switch
**How:** `translateX()` on knob + `:checked` selector.
**Tools:** CSS + checkbox hack.

---

## 30. Accordion Expand / Collapse
**How:** `max-height` transition or `grid-template-rows` trick.
**Tools:** CSS transitions + JS class toggle.

---

## 31. Modal Open / Close
**How:** `opacity` + `scale` + `translateY` combined.
**Tools:** CSS + JS class toggle.

---

## 32. Drawer Slide
**How:** `translateX()` from off-screen.
**Tools:** CSS transitions.

---

## 33. Tab Indicator Slide
**How:** Animated underline via `translateX()` + `width`.
**Tools:** CSS + JS measurement.

---

# PART 5: SCROLL-DRIVEN
*IntersectionObserver + CSS classes*

---

## 34. Scroll Reveal
**How:** Add class when element enters viewport.
**Tools:** `IntersectionObserver` + CSS.

---

## 35. Scroll-Linked Progress Bar
**How:** Width tied to scroll percentage.
**Tools:** JS `scroll` listener.

---

## 36. Sticky Scroll Effects
**How:** `position: sticky` + transforms.
**Tools:** CSS `position: sticky` + JS.

---

## 37. Scroll Snap
**How:** `scroll-snap-type` + `scroll-snap-align`.
**Tools:** Pure CSS.

---

## 38. Parallax (Simple)
**How:** `translateY()` tied to scroll position.
**Tools:** JS `scroll` + `requestAnimationFrame`.

---

# PART 6: CURSOR / POINTER
*JS mouse events*

---

## 39. Custom Cursor
**How:** `cursor: none` + div following mouse.
**Tools:** JS `mousemove`.

---

## 40. Magnetic Button
**How:** Button translates toward cursor.
**Tools:** JS `mousemove` + `getBoundingClientRect`.

---

## 41. Hover Spotlight
**How:** Radial gradient follows cursor via CSS custom property.
**Tools:** JS `mousemove` + CSS `--mouse-x`.

---

## 42. Tilt on Hover
**How:** `rotateX` / `rotateY` based on cursor position.
**Tools:** JS `mousemove` + CSS 3D transforms.

---

## 43. Ripple on Click
**How:** Expanding circle from click coordinates.
**Tools:** JS creating elements + CSS animation.

---

# PART 7: TEXT ANIMATIONS

---

## 44. Typewriter
**How:** CSS `width` + `steps()` + `overflow: hidden`, or JS char-by-char.
**Tools:** CSS `@keyframes` or JS.

---

## 45. Text Scramble / Decode
**How:** Random character cycling before settling.
**Tools:** JS + `requestAnimationFrame`.

---

## 46. Split Text Reveal (Chars/Words)
**How:** Split into spans, stagger animation.
**Tools:** JS split + CSS `animation-delay`.

---

## 47. Text Mask Reveal
**How:** `clip-path` or `overflow: hidden` reveal.
**Tools:** CSS + IntersectionObserver.

---

## 48. Gradient Text
**How:** `background-clip: text` + animated gradient.
**Tools:** CSS `@keyframes`.

---

## 49. Counting Numbers
**How:** Increment number from 0 to target.
**Tools:** JS `requestAnimationFrame`.

---

## 50. Text Wave
**How:** Staggered `translateY()` per character.
**Tools:** CSS `animation-delay` per span.

---

## 51. Underline Draw
**How:** Animated `scaleX` on pseudo-element.
**Tools:** CSS transitions.

---

# PART 8: SVG-SPECIFIC
*Inline SVG, no libraries*

---

## 52. Path Draw (Stroke Dash)
**How:** `stroke-dasharray` + `stroke-dashoffset` animation.
**Tools:** CSS `@keyframes`.

---

## 53. Animated Line Graph
**How:** Path `d` updates or stroke reveal.
**Tools:** JS + inline SVG.

---

## 54. Particle Trail on Path
**How:** Dots follow via `getPointAtLength()`.
**Tools:** JS + SVG.

---

## 55. Animated Icons
**How:** Draw-on, morph, or transform SVG parts.
**Tools:** CSS + inline SVG.

---

## 56. SVG Filter Effects
**How:** `feGaussianBlur`, `feTurbulence` animated.
**Tools:** Inline SVG filters + CSS.

---

## 57. Gooey Effect
**How:** `feGaussianBlur` + `feColorMatrix` on merging blobs.
**Tools:** Inline SVG filters.

---

# PART 9: 3D / TRANSFORM
*CSS only*

---

## 58. 3D Card Flip
**How:** `rotateY(180deg)` + `backface-visibility: hidden`.
**Tools:** CSS 3D transforms.

---

## 59. Cube Rotation
**How:** Six faces positioned in 3D, container rotates.
**Tools:** CSS `transform-style: preserve-3d`.

---

## 60. Parallax Layers (3D)
**How:** Layers at different `translateZ()` values.
**Tools:** CSS 3D + mouse tracking.

---

## 61. Isometric Motion
**How:** `rotateX(60deg) rotateZ(45deg)` on flat shapes.
**Tools:** CSS transforms.

---

## 62. Extrude Effect
**How:** Layered `translateZ()` copies of a shape.
**Tools:** CSS 3D transforms.

---

# PART 10: CANVAS 2D
*Vanilla `<canvas>`, no libraries*

---

## 63. Particle Systems
**How:** Dots with velocity, gravity, collision.
**Tools:** `<canvas>` 2D + `requestAnimationFrame`.

---

## 64. Confetti
**How:** Colored rectangles falling with rotation.
**Tools:** `<canvas>` 2D.

---

## 65. Starfield
**How:** Dots moving toward camera via `z` depth.
**Tools:** `<canvas>` 2D.

---

## 66. Matrix Rain
**How:** Falling characters with `fillText`.
**Tools:** `<canvas>` 2D.

---

## 67. Fireworks
**How:** Particles exploding from a point with gravity.
**Tools:** `<canvas>` 2D.

---

## 68. Waveform Visualizer (Fake)
**How:** Randomized bars via JS loop.
**Tools:** `<canvas>` 2D (no Web Audio needed).

---

## 69. Noise / Grain Overlay
**How:** Random pixel flicker.
**Tools:** `<canvas>` 2D.

---

# PART 11: PHYSICS-BASED
*Vanilla JS math only*

---

## 70. Spring Animation
**How:** Mass-spring-damper math in JS.
**Tools:** JS + `requestAnimationFrame`.

---

## 71. Inertia / Momentum
**How:** Continue motion after input with deceleration.
**Tools:** JS + `requestAnimationFrame`.

---

## 72. Drag & Throw
**How:** Pointer Events + velocity tracking.
**Tools:** JS Pointer Events.

---

## 73. Gravity Simulation
**How:** Objects fall with acceleration.
**Tools:** `<canvas>` + JS physics loop.

---

## 74. Pendulum
**How:** Angular motion based on gravity.
**Tools:** JS + `requestAnimationFrame`.

---

# PART 12: TIMING / SEQUENCING

---

## 75. Stagger
**How:** Sequential `animation-delay` per child.
**Tools:** CSS `animation-delay`.

---

## 76. Choreography
**How:** Multiple elements animated in sequence.
**Tools:** CSS `animation-delay` + JS class toggles.

---

## 77. Easing Curves
**How:** Control acceleration via `cubic-bezier()` or `steps()`.
**Tools:** CSS `animation-timing-function`.

---

## 78. Keyframe Sequences
**How:** Multi-step animations with percentage stops.
**Tools:** CSS `@keyframes`.

---

## 79. Reverse / Ping-Pong
**How:** `animation-direction: alternate` or `reverse`.
**Tools:** CSS.

---

# Excluded (Not LLM-Renderable Without Extras)

| Animation Type | Why Excluded |
|---|---|
| GSAP / anime.js choreography | Requires external library |
| Framer Motion / React Spring | Requires React + npm |
| Three.js / WebGL shaders | Requires external library + GPU |
| Matter.js / Planck.js physics | Requires external library |
| Lottie animations | Requires JSON asset + player |
| Scroll-triggered timelines (GSAP) | Requires GSAP ScrollTrigger |
| Audio-reactive (Web Audio API) | Restricted in sandboxed previews |
| Video textures | Requires external media files |
| Font-dependent motion | Requires external font loading |
| View Transitions API | Not supported in most preview panes |
| CSS `animation-timeline: scroll()` | Limited browser support in previews |

---

# Quick Reference: What LLMs Can Actually Render

| Layer | Available |
|---|---|
| **CSS** | `@keyframes`, `transition`, `transform`, `clip-path`, `filter`, `box-shadow`, `background-clip`, `animation-delay`, `animation-direction`, `cubic-bezier`, `steps()` |
| **HTML** | `<div>`, `<span>`, `<svg>`, `<canvas>`, `<input>`, `<details>` |
| **JS** | `requestAnimationFrame`, `IntersectionObserver`, `mousemove`, `scroll`, `getBoundingClientRect`, `getPointAtLength`, Pointer Events, class toggles |
| **SVG** | Inline `<path>`, `<circle>`, `<rect>`, `feGaussianBlur`, `feTurbulence`, `stroke-dasharray` |
| **Canvas** | 2D context only (`fillRect`, `arc`, `fillText`, `gradient`) |

---

# Summary Count

| Category | Count |
|---|---|
| Entrance / Exit | 8 |
| Attention / Emphasis | 7 |
| Looping / Ambient | 10 |
| Transition / State-Change | 8 |
| Scroll-Driven | 5 |
| Cursor / Pointer | 5 |
| Text | 8 |
| SVG | 6 |
| 3D / Transform | 5 |
| Canvas 2D | 7 |
| Physics-Based | 5 |
| Timing / Sequencing | 5 |
| **Total** | **79** |

---

*End of guide — 79 motion animations renderable with pure HTML, CSS, and vanilla JS.*