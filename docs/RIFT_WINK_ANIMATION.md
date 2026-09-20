# ⚡ Rift Wink Animation System

## Overview

The Rift Wink Animation is a premium, randomized micro-interaction that adds subtle personality to the Rift interface. When users interact with eligible elements, there's a 10% chance the Rift thunder symbol will perform a smooth wink animation with a tiny spark effect.

This creates a "hidden personality" effect - the interface feels alive without being distracting or gimmicky.

## 🎯 Core Behavior

### Random Trigger System
- **Probability**: 10% chance per eligible interaction
- **Cooldown**: 10 seconds between winks
- **Feel**: Unexpected and special, never predictable

### Animation Sequence
Total duration: ~650-850ms

```
0ms      → Idle state
0-100ms  → Anticipation (subtle scale up)
100-360ms → Wink deformation (smooth skew)
300-380ms → Spark ignition
380-520ms → Spark discharge (particles)
520-620ms → Spark dissipation
620-800ms → Recovery (smooth return to idle)
800ms+   → Back to idle
```

## 🎨 Animation Phases

### Phase 1: Anticipation (80-120ms)
- Scale: 1.00 → 1.025
- Translation: 1-2px toward interaction point
- Opacity: unchanged
- Feel: Physical responsiveness

### Phase 2: Wink (220-300ms)
- Scale: 1.025 → 1.04 → 1.025
- SkewX: 0° → -2° → 1° → 0°
- SkewY: 0° → 0.5° → -0.5° → 0°
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- Feel: Smooth, elegant deformation

### Phase 3: Spark (180-260ms)
- Primary spark: tiny point of light
- Particles: 2-4 micro particles
- Travel distance: 6-14px
- Light emission: subtle, localized
- Feel: Tiny electrical discharge

### Phase 4: Recovery (180-240ms)
- Scale: 1.025 → 1.00
- Skew: return to 0°
- Easing: ease-out
- Feel: Spring-like settling

## 🔧 Implementation

### Components

#### `useRiftWink` Hook
```typescript
const { shouldWink, triggerWink, forceWink } = useRiftWink();
```

**Returns:**
- `shouldWink`: boolean - whether animation should play
- `triggerWink()`: function - 10% chance to trigger
- `forceWink()`: function - always trigger (respects cooldown)

**Configuration:**
```typescript
const WINK_CHANCE = 0.10; // 10% probability
const COOLDOWN_MS = 10000; // 10 seconds
```

#### `RiftWink` Component
```typescript
<RiftWink 
  trigger={shouldWink} 
  size={16} 
  onComplete={() => {}} 
/>
```

**Props:**
- `trigger`: boolean - when true, plays animation
- `size`: number - icon size in pixels
- `onComplete`: function - callback after animation

**Animation Variants:**
- `idle`: resting state
- `anticipation`: subtle scale up
- `wink`: smooth deformation
- `spark`: electrical effect
- `recovery`: return to idle

## 📍 Integration Points

### Eligible Interactions

The wink can trigger from:

1. **Logo Click** (Header)
   - User clicks the Rift logo
   - 10% chance to wink
   - Most common trigger point

2. **Copy Link** (ReadyView)
   - User copies transfer link
   - 10% chance to wink
   - Celebratory moment

### Implementation Example

```typescript
import { useRiftWink } from '../hooks/useRiftWink';
import { RiftWink } from './RiftWink';

function Header() {
  const { shouldWink, triggerWink } = useRiftWink();
  
  return (
    <button onClick={() => {
      handleReset();
      triggerWink(); // 10% chance
    }}>
      <RiftWink trigger={shouldWink} size={16} />
    </button>
  );
}
```

## 🎭 Design Principles

### DO ✅
- Subtle and premium
- Smooth physics-based motion
- Tiny, controlled spark
- Soft light effects
- Precise timing
- 10% randomness
- 10-second cooldown
- Never interfere with functionality

### DO NOT ❌
- Cartoon-like winks
- Emoji appearances
- Exaggerated deformation
- Large lightning bolts
- Neon explosions
- Screen-wide flashes
- Confetti
- Excessive particles
- Constant glowing
- Rapid animations
- Flashy gaming UI
- Childish mascot behavior

## ⚡ Spark Effect Details

### Visual Elements
1. **Primary Spark**: 1px white dot
2. **Particles**: 2-4 violet dots (0.5px each)
3. **Glow**: 4px violet blur (30% opacity)
4. **Travel**: 12px from center

### Animation Timing
```
0-60ms   → Ignition (spark appears)
60-110ms → Discharge (particles move)
110-220ms → Dissipation (fade out)
```

### Particle Behavior
- Random angles (evenly distributed)
- Slight variation (±0.5 radians)
- Ease-out motion
- Fade during travel
- No collision physics

## 🎯 User Experience

### What Users Should Feel

**Most interactions:**
> "Normal click, nothing special"

**Occasional wink (10% chance):**
> "Wait... did that just wink?"
> "That was cool"
> "Nice detail"

**Never:**
> "Why is this animating every time?"
> "This is distracting"
> "Make it stop"

### Emotional Journey
```
anticipation → wink → tiny spark → smooth recovery → silence
```

The animation should feel like discovering a hidden detail in a premium product.

## 🔒 Cooldown System

### Why Cooldown?
- Prevents animation fatigue
- Maintains surprise factor
- Ensures wink feels special
- Avoids distracting repetition

### Implementation
```typescript
const lastWinkTime = useRef(0);

function triggerWink() {
  const now = Date.now();
  const timeSinceLastWink = now - lastWinkTime.current;
  
  // Enforce 10-second cooldown
  if (timeSinceLastWink < 10000) {
    return;
  }
  
  // 10% chance
  if (Math.random() < 0.10) {
    setShouldWink(true);
    lastWinkTime.current = now;
  }
}
```

## 🎨 Visual Design

### Color Palette
- **Icon**: Violet-500 (#8b5cf6)
- **Spark**: White (#ffffff)
- **Particles**: Violet-300 (#c4b5fd)
- **Glow**: Violet-400/30 (#a78bfa with 30% opacity)

### Materials
- **Glass highlight**: White/20% gradient sweep
- **Refraction**: Subtle internal light movement
- **Blur**: Restrained, localized

### Typography
- Not applicable (icon-only animation)

## 📊 Performance

### Target Metrics
- **Frame Rate**: 60 FPS
- **Animation Duration**: 650-850ms
- **Memory**: Minimal (no persistent state)
- **CPU**: Negligible (GPU-accelerated transforms)

### Optimizations
- Use `transform` and `opacity` only
- Avoid layout thrashing
- Use `will-change` sparingly
- Clean up animations on unmount
- Respect `prefers-reduced-motion`

## ♿ Accessibility

### Reduced Motion
```typescript
@media (prefers-reduced-motion: reduce) {
  // Disable wink animation
  // Keep basic interaction feedback
}
```

### Screen Readers
- Animation is purely visual
- No ARIA announcements needed
- Doesn't affect functionality

### Keyboard Navigation
- Wink triggers on click/enter
- Works with keyboard interaction
- No focus management needed

## 🧪 Testing

### Manual Testing Checklist
- [ ] Logo click triggers wink 10% of time
- [ ] Copy link triggers wink 10% of time
- [ ] Cooldown prevents rapid winks
- [ ] Animation is smooth at 60 FPS
- [ ] Spark particles appear correctly
- [ ] Recovery returns to exact idle state
- [ ] No visual glitches or artifacts
- [ ] Works on mobile devices
- [ ] Respects reduced motion preference

### Automated Testing
```typescript
test('triggerWink respects cooldown', () => {
  const { triggerWink } = useRiftWink();
  
  triggerWink(); // First trigger
  triggerWink(); // Should be blocked by cooldown
  
  // Verify only one wink occurred
});

test('triggerWink has 10% probability', () => {
  // Run 1000 times
  // Expect ~100 winks (±20 for randomness)
});
```

## 🚀 Future Enhancements

### Potential Additions
1. **Context-aware sparks**: Different colors for different actions
2. **Sound effects**: Tiny, optional audio feedback
3. **Seasonal variations**: Holiday-themed sparks
4. **User preferences**: Toggle wink frequency
5. **Achievement system**: "You found the wink!" message

### Not Planned
- Frequent animations (would be annoying)
- Large, obvious effects
- Mascot-like behavior
- Gamification elements

## 📝 Code Structure

```
src/
├── hooks/
│   └── useRiftWink.ts          # Animation logic
├── components/
│   ├── RiftWink.tsx            # Animation component
│   ├── Header.tsx              # Logo integration
│   └── ReadyView.tsx           # Copy link integration
└── docs/
    └── RIFT_WINK_ANIMATION.md  # This file
```

## 🎯 Success Metrics

### Qualitative
- Users notice the wink occasionally
- Users smile or feel delighted
- Interface feels alive but not distracting
- Animation feels premium and intentional

### Quantitative
- Animation triggers ~10% of eligible interactions
- No user complaints about distraction
- No performance degradation
- 60 FPS maintained consistently

## 💡 Design Philosophy

The Rift Wink Animation embodies the principle:

> **"Rift works seriously. Rift occasionally has personality."**

It's a tiny moment of delight hidden in an otherwise professional interface. Users who notice it will appreciate the attention to detail. Users who don't notice it won't be bothered by it.

The animation should feel like:
- A secret handshake
- A wink from the product itself
- A moment of connection
- A reward for paying attention

But never:
- A distraction
- A gimmick
- A source of annoyance
- A performance issue

## 🔗 Related Documentation

- [Proximity Transfer System](./PROXIMITY_TRANSFER_SYSTEM.md)
- [Thunder Flash Effect](./THUNDER_FLASH.md)
- [Liquid Glass Design](./LIQUID_GLASS_DESIGN.md)
- [AuthKit Design System](./AUTHKIT_DESIGN_SYSTEM.md)

---

**Status**: ✅ Implemented and Production Ready  
**Version**: 1.0.0  
**Last Updated**: 2024  
**Author**: Saby
