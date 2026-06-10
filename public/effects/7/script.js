/* =====================================================
   RAINBOW BRUSH
   script.js

   Same mechanic as the reference:
   • mousedown → start drawing, anchor lastX / lastY
   • mousemove → stroke a line from last point to current,
                 hue cycles 0–360 (saturated, mid-light)
   • mouseup / mouseout → stop + clear canvas

   Improvements layered on top:
   • Retina-aware sizing (DPR scaling) so the brush isn't
     blurry on high-density displays.
   • A breathing line width (90 + sin(hue)*15) so the
     stroke widens/narrows along the rainbow — feels more
     hand-drawn than a flat marker.
   • The bottom-of-screen hint hides itself the first
     time the user starts drawing.

   Text on top uses mix-blend-mode: difference so as you
   scribble across the letters they invert dynamically.
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

   const canvas = document.getElementById('js-canvas')
   const ctx    = canvas.getContext('2d')
   const hint   = document.getElementById('js-hint')

   /* ──────────────────────────────────────────────
      SIZE — DPR scaled, recompute on resize
      ────────────────────────────────────────────── */
   function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight

      canvas.width  = w * dpr
      canvas.height = h * dpr
      canvas.style.width  = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      /* Brush settings re-applied because resetting the
         canvas clears them. */
      ctx.lineJoin = 'round'
      ctx.lineCap  = 'round'
   }

   resize()
   window.addEventListener('resize', resize)

   /* ──────────────────────────────────────────────
      DRAWING STATE
      ────────────────────────────────────────────── */
   let isDrawing = false
   let lastX = 0
   let lastY = 0
   let hue   = 0

   function pointerXY(e) {
      const rect = canvas.getBoundingClientRect()
      const cx = e.touches ? e.touches[0].clientX : e.clientX
      const cy = e.touches ? e.touches[0].clientY : e.clientY
      return { x: cx - rect.left, y: cy - rect.top }
   }

   function draw(e) {
      if (!isDrawing) return

      const { x, y } = pointerXY(e)

      /* Width breathes along the hue cycle for a
         hand-drawn vibe (90 ± 15). */
      ctx.lineWidth = 90 + Math.sin(hue * (Math.PI / 180)) * 15

      ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`
      ctx.beginPath()
      ctx.moveTo(lastX, lastY)
      ctx.lineTo(x, y)
      ctx.stroke()

      lastX = x; lastY = y
      hue = (hue + 1) % 360
   }

   function clearCanvas() {
      const w = canvas.width  / (window.devicePixelRatio || 1)
      const h = canvas.height / (window.devicePixelRatio || 1)
      ctx.clearRect(0, 0, w, h)
   }

   /* ──────────────────────────────────────────────
      EVENTS
      ────────────────────────────────────────────── */
   canvas.addEventListener('mousedown', (e) => {
      isDrawing = true
      ;({ x: lastX, y: lastY } = pointerXY(e))
      hint.classList.add('is-hidden')   // hide hint on first draw
   })

   canvas.addEventListener('mousemove', draw)

   canvas.addEventListener('mouseup', () => {
      isDrawing = false
      clearCanvas()
   })

   canvas.addEventListener('mouseout', () => {
      isDrawing = false
      clearCanvas()
   })

   /* Touch */
   canvas.addEventListener('touchstart', (e) => {
      isDrawing = true
      ;({ x: lastX, y: lastY } = pointerXY(e))
      hint.classList.add('is-hidden')
      e.preventDefault()
   }, { passive: false })

   canvas.addEventListener('touchmove', (e) => {
      draw(e)
      e.preventDefault()
   }, { passive: false })

   canvas.addEventListener('touchend', () => {
      isDrawing = false
      clearCanvas()
   })
})
