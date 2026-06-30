# GTA-style house — Three.js explorer

A furnished, explorable house built with vanilla Three.js (r128). No build
step required — open it in a browser via a local server.

## Run it

Browsers block ES modules / some APIs over `file://`, so serve the folder:

```bash
cd gta-house
python3 -m http.server 8000
# then open http://localhost:8000
```

Or with Node:

```bash
npx serve .
```

## Controls

- **Orbit view** (default) — drag to rotate, scroll to zoom, see the whole house from outside.
- **Walk inside** — click the canvas to lock the pointer, then:
  - `W A S D` or arrow keys to move
  - mouse to look around
  - `Shift` to run
  - on touch devices, drag to look, since there's no keyboard — see "Integrating your own character" below for swapping in joystick controls.
- **Day / Night** toggle works in both modes.

## File structure

```
gta-house/
  index.html              entry point, UI chrome, script load order
  js/
    colliders.js           scene + box()/cyl()/plane() mesh helpers + AABB collider list
    build-exterior.js      ground, road, trees, fence, parked car, house shell, roof
    build-interior.js      dividing walls, room furniture, ceiling lights
    controls.js             first-person walk controller + orbit camera
    main.js                 renderer, lighting, UI wiring, render loop
```

## Layout

The interior is an **open-plan layout** — every room connects to its
neighbor through a wide doorway (1.6–5m) with a visible swinging door propped
open, so you can walk straight through without getting stuck on furniture or
walls:

- **Front door** (z=5, facing the porch) → opens into the **Living room**
- **Garage door** (z=5, west end) → opens into the **Garage**
- **Garage ↔ Living room**: 4m-wide doorway in the shared wall
- **Living room ↔ Kitchen/Bedroom wing**: 5m-wide doorway
- **Kitchen ↔ Bedroom**: 3m-wide doorway, clear of the island and desk
- **Bedroom ↔ Bathroom nook**: dedicated door in the corner

Rooms:
- **Living room** (front-left) — sofa, coffee table, TV stand, bookshelf, floor lamp, accent chairs, rug
- **Kitchen** (back-left) — L-shaped counter, island + bar stools, dining table, fridge, stove, sink
- **Bedroom** (back-right) — bed, nightstands, wardrobe, desk
- **Bathroom** (bedroom's back-right corner) — toilet, sink cabinet
- **Garage** (far left) — second car, workbench, tool shelf
- **Front yard** — exterior, parked car, palm trees, driveway, fence, walkway + porch steps

## Integrating your own character model

The walk mode here drives a free-floating camera directly (`controls.js`).
To swap in your own character model:

1. Load your model/rig in `main.js` and add it to `scene`.
2. In `controls.js`, instead of `camera.position.set(player.x, player.y, player.z)`
   inside `updatePlayer()`, set your character mesh's position/rotation to
   `player.x / player.y / player.z / player.yaw`, then position the camera
   behind/above the character (third-person) or at its head bone (first-person).
3. The `colliders` array (built in `build-exterior.js` / `build-interior.js`
   via the `collide: true` option on `box()`/`cyl()` calls) is reusable as-is —
   `collideMove()` in `controls.js` already checks your character's position
   against it each frame.
4. If your character has its own animation/movement controller, you likely only
   need the `colliders` array and the room geometry — you can delete the
   `updatePlayer`/pointer-lock logic in `controls.js` entirely and drive
   `player.x/z` from your own controller instead.

## Customizing the house

- Change wall colors: edit `wallColor` / `wallColorSide` in `build-exterior.js`.
- Add furniture: use the `box(w, h, d, color, x, y, z, opts)` or
  `cyl(rTop, rBottom, h, segments, color, x, y, z, opts)` helpers from
  `colliders.js` — pass `{ collide: true }` if you want the player to bump
  into it.
- Resize rooms: the house footprint is x: -10..5, z: -5..5 (garage occupies
  x: -10..-5). Wall positions are documented inline as comments in
  `build-exterior.js` and `build-interior.js`.
