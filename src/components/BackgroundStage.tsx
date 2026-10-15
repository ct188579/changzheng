import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export interface ChapterVideo {
  id: string
  src: string
  /** DOM id of the section that owns this film */
  sectionId: string
}

/**
 * One background film per chapter, in document order.
 * The hero (top of the page) and the closing chapter carry their own inline
 * film, so this list starts at chapter 01 and stops at chapter 06 — every
 * generated clip is used exactly once.
 */
export const CHAPTER_VIDEOS: ChapterVideo[] = [
  { id: 'history',   sectionId: 'beginning', src: '/videos/02-history.mp4' },
  { id: 'route',     sectionId: 'route',     src: '/videos/03-route.mp4' },
  { id: 'crossings', sectionId: 'crossings', src: '/videos/04-luding-bridge.mp4' },
  { id: 'people',    sectionId: 'people',    src: '/videos/07-people.mp4' },
  { id: 'spirit',    sectionId: 'spirit',    src: '/videos/08-spirit.mp4' },
  { id: 'legacy',    sectionId: 'legacy',    src: '/videos/09-legacy.mp4' },
]

/** Cross-fade length between two chapter films (seconds). */
const FADE = 0.9

/**
 * BackgroundStage
 * ─────────────────────────────────────────────────────────────
 * Fixed-position video stage that plays one chapter film at a time and
 * cross-fades between them.
 *
 * Notes on the implementation:
 * - Films are looked up from the DOM instead of through React refs: this
 *   component sits *before* the sections in the tree, so its layout effect
 *   runs before the section refs are attached.
 * - The chapter that owns the background is resolved from each section's
 *   ScrollTrigger start (`top 50%` ≈ the middle of the hand-off window), so
 *   pinned sections — whose height on the page is inflated by their pin
 *   spacer — still switch the film at the right moment.
 */
export function BackgroundStage() {
  const stageRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const stage = stageRef.current
      if (!stage) return
      const films = Array.from(stage.querySelectorAll<HTMLVideoElement>('.bg-film'))
      if (films.length !== CHAPTER_VIDEOS.length) return

      films.forEach((v) => {
        v.muted = true
        v.loop = true
        v.playsInline = true
      })

      let active = -1
      let fade: gsap.core.Timeline | null = null

      const show = (index: number, immediate = false) => {
        const next = films[index]
        if (!next || index === active) return
        const prev = active >= 0 ? films[active] : null
        active = index

        fade?.kill()
        // never leave a third film mid-fade when chapters switch in quick succession
        films.forEach((v) => { if (v !== next && v !== prev) gsap.set(v, { autoAlpha: 0 }) })
        next.currentTime = 0
        next.play().catch(() => {})

        fade = gsap.timeline()
        fade.to(next, { autoAlpha: 1, duration: immediate ? 0 : FADE, ease: 'power2.inOut' }, 0)
        if (prev) {
          fade.to(prev, {
            autoAlpha: 0,
            duration: immediate ? 0 : FADE,
            ease: 'power2.inOut',
            onComplete: () => { prev.pause() },
          }, 0)
        }
      }

      show(0, true)

      // One lightweight trigger per chapter: only used as a refresh-safe
      // source for each chapter's switch point.
      const marks = CHAPTER_VIDEOS.map((chapter) => {
        const el = document.getElementById(chapter.sectionId)
        if (!el) return null
        return ScrollTrigger.create({ trigger: el, start: 'top 50%', end: 'bottom 50%' })
      })

      const sync = () => {
        const y = window.scrollY
        let index = 0
        marks.forEach((mark, i) => {
          if (mark && mark.start <= y + 1) index = i
        })
        show(index)
      }

      // Single updater: correct for normal scrolling, anchors, snap tweens
      // and any position change after a ScrollTrigger refresh.
      const master = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: sync })
      ScrollTrigger.addEventListener('refresh', sync)

      return () => {
        fade?.kill()
        ScrollTrigger.removeEventListener('refresh', sync)
        marks.forEach((m) => m?.kill())
        master.kill()
      }
    },
    { scope: stageRef, dependencies: [] },
  )

  return (
    <div ref={stageRef} className="bg-stage" aria-hidden="true">
      {CHAPTER_VIDEOS.map((chapter, i) => (
        <video
          key={chapter.id}
          className={`bg-film bg-film--${chapter.id}`}
          data-chapter={chapter.id}
          src={chapter.src}
          muted
          loop
          playsInline
          preload={i === 0 ? 'auto' : 'metadata'}
        />
      ))}
      <div className="bg-stage-grain" />
      <div className="bg-stage-vignette" />
      <div className="bg-stage-bottom-fade" />
    </div>
  )
}
