import { useEffect, useMemo, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { SplitText } from 'gsap/SplitText'
import { BackgroundStage } from './components/BackgroundStage'
import './App.css'

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, SplitText)

const chapters = [
  { id: 'beginning', number: '01', label: '时代的抉择' },
  { id: 'route', number: '02', label: '山河为证' },
  { id: 'crossings', number: '03', label: '血与火的考验' },
  { id: 'people', number: '04', label: '平凡中的伟大' },
  { id: 'spirit', number: '05', label: '穿越时空的力量' },
  { id: 'legacy', number: '06', label: '长征从未远去' },
]

const dotSections = [
  { id: 'top', num: '00', label: '序章' },
  { id: 'beginning', num: '01', label: '抉择' },
  { id: 'route', num: '02', label: '路线' },
  { id: 'crossings', num: '03', label: '险阻' },
  { id: 'people', num: '04', label: '人民' },
  { id: 'spirit', num: '05', label: '精神' },
  { id: 'legacy', num: '06', label: '传承' },
  { id: 'ending', num: '07', label: '尾声' },
]

/* Every stop of chapter 01 drives BOTH columns: the archive card on the left
   and the detail block on the right. */
type CardRow = { label: string; value?: string; num?: number; unit?: string; approx?: boolean }
type Milestone = {
  year: string
  title: string
  place: string
  text: string
  card: {
    corner: string
    seal: string
    tag: string
    overline: string
    heading: string
    rows: CardRow[]
    note: string
  }
}

const milestones: Milestone[] = [
  {
    year: '1934.10',
    title: '战略转移',
    place: '于都',
    text: '中央红军从江西于都等地出发，开始战略转移。漫漫征途由此启程。',
    card: {
      corner: 'A',
      seal: '征',
      tag: '中央苏区',
      overline: 'ESTABLISHED · 1931—1934',
      heading: '中华苏维埃共和国',
      rows: [
        { label: '首都', value: '瑞金' },
        { label: '面积', num: 40, unit: '万 km²', approx: true },
        { label: '人口', num: 2500, unit: '万', approx: true },
        { label: '红军', num: 30, unit: '万', approx: true },
      ],
      note: '历史档案与图表为艺术化表达，请以权威史料为准',
    },
  },
  {
    year: '1935.01',
    title: '历史转折',
    place: '遵义',
    text: '遵义会议在危急关头召开，成为中国革命的重要转折点。',
    card: {
      corner: 'B',
      seal: '转',
      tag: '危急关头',
      overline: 'CONFERENCE · 1935.01',
      heading: '遵义会议',
      rows: [
        { label: '时间', value: '1935 年 1 月' },
        { label: '地点', value: '贵州 · 遵义' },
        { label: '会议', value: '政治局扩大会议' },
        { label: '意义', value: '历史转折' },
      ],
      note: '会议表述为艺术化提炼，请以权威史料为准',
    },
  },
  {
    year: '1935.05',
    title: '飞夺泸定桥',
    place: '泸定',
    text: '红军强渡大渡河、飞夺泸定桥，打开北上通道。',
    card: {
      corner: 'C',
      seal: '桥',
      tag: '天险',
      overline: 'THE CROSSING · 1935.05',
      heading: '大渡河 · 泸定桥',
      rows: [
        { label: '河流', value: '大渡河' },
        { label: '铁索', num: 13, unit: '根' },
        { label: '位置', value: '四川 · 泸定' },
        { label: '结果', value: '打开北上通道' },
      ],
      note: '场景为艺术化视觉表达，请以权威史料为准',
    },
  },
  {
    year: '1935.10',
    title: '到达陕北',
    place: '吴起镇',
    text: '中央红军到达陕北，中央红军的长征胜利结束。',
    card: {
      corner: 'D',
      seal: '胜',
      tag: '抵达',
      overline: 'THE ARRIVAL · 1935.10',
      heading: '陕北 · 吴起镇',
      rows: [
        { label: '时间', value: '1935 年 10 月' },
        { label: '地点', value: '陕北 · 吴起镇' },
        { label: '行程', value: '二万五千里' },
        { label: '结果', value: '长征胜利结束' },
      ],
      note: '行程为通行表述，具体里程史料记载略有差异',
    },
  },
]

/* One portrait plate per stop. Drop the generated stills into
   `public/images/` with these names and the card switches photographs;
   while a file is missing the card falls back to the CSS silhouette. */
const people = [
  { name: '一名红军战士', role: '无数无名者之一', quote: '把有限的干粮留给战友，把继续前行的勇气留给自己。', mark: '01', color: 'ember', img: '/images/people-01.jpg' },
  { name: '一位沿途群众', role: '同行的人民', quote: '征途并非孤身跋涉。每一份理解、照料与支持，都成为前行的力量。', mark: '02', color: 'earth', img: '/images/people-02.jpg' },
  { name: '一位年轻干部', role: '在实践中求索', quote: '在困难面前寻找出路，在复杂局势中校准方向。', mark: '03', color: 'slate', img: '/images/people-03.jpg' },
]

const spirits = [
  { title: '理想与信念', en: 'CONVICTION', copy: '越是艰险，越要知道为何出发。坚定的理想信念，让脚下的每一步都有方向。', proof: '长征途中，红军在极端艰苦的条件下坚持北上，保存并锤炼了革命力量。' },
  { title: '实事求是', en: 'COURAGE TO SEEK', copy: '从实际出发，在实践中寻找正确道路。敢于纠正偏差，才能走向新的转机。', proof: '遵义会议深刻总结经验教训，推动中国革命走向新的阶段。' },
  { title: '依靠人民', en: 'WITH THE PEOPLE', copy: '前行的力量来自人民。尊重、团结并依靠人民，是这段历史的重要底色。', proof: '长征途经多个省区，红军与沿途群众之间留下了许多相互扶助的历史记忆。' },
]

const crossingScenes = [
  {
    video: '/videos/04-luding-bridge.mp4',
    meta: '1935 · 泸定桥',
    en: 'RIVER · COURAGE',
    title: '十三根铁索，',
    titleEm: '连接生死与信念。',
    desc: '大渡河水流湍急，铁索悬空。勇士们攀索向前，在枪林弹雨中为队伍打开北上的通道。',
  },
  {
    video: '/videos/05-snow-mountain.mp4',
    meta: '雪山 · 严酷的考验',
    en: 'ALTITUDE · RESOLVE',
    title: '雪山无言，',
    titleEm: '信念有声。',
    desc: '海拔数千米的雪山，空气稀薄、风雪刺骨。战士们相互搀扶，一步一步翻越生命禁区。',
  },
  {
    video: '/videos/06-marsh.mp4',
    meta: '草地 · 向前',
    en: 'FOG · TOGETHER',
    title: '在最艰难的路上，',
    titleEm: '依然向前。',
    desc: '茫茫草地，沼泽遍布、补给断绝。队伍结队前行，把生的希望留给彼此。',
  },
]

function useChapterSectionRefs() {
  const heroRef = useRef<HTMLElement>(null)
  const historyRef = useRef<HTMLElement>(null)
  const routeRef = useRef<HTMLElement>(null)
  const crossingsRef = useRef<HTMLElement>(null)
  const peopleRef = useRef<HTMLElement>(null)
  const spiritRef = useRef<HTMLElement>(null)
  const legacyRef = useRef<HTMLElement>(null)
  const endingRef = useRef<HTMLElement>(null)
  return [heroRef, historyRef, routeRef, crossingsRef, peopleRef, spiritRef, legacyRef, endingRef] as const
}

function MountainArt() {
  return (
    <svg className="mountain-art" viewBox="0 0 1600 850" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="ridge-back" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#55514d" />
          <stop offset="1" stopColor="#171616" />
        </linearGradient>
        <linearGradient id="ridge-front" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#39312e" />
          <stop offset="1" stopColor="#0c0c0c" />
        </linearGradient>
        <linearGradient id="road" x1="0" x2="1">
          <stop stopColor="#a84a32" stopOpacity="0" />
          <stop offset=".55" stopColor="#c4714b" stopOpacity=".65" />
          <stop offset="1" stopColor="#c4714b" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path fill="url(#ridge-back)" d="M0 530 115 442l86 42 151-183 125 161 120-112 89 66 113-235 94 175 108-125 96 105 91-65 108 97 103-132 195 155v459H0z" />
      <path fill="#a7a19b" opacity=".12" d="m352 301 40 24-24 10-27-11-33 14zm418-120 55 88-38-25-24 12-22-19zm300 59 43 33-33-10-23 12-20-13z" />
      <path fill="url(#ridge-front)" d="m0 621 155-91 111 54 144-156 148 175 124-105 103 38 111-157 123 133 117-89 117 85 129-98 118 94v346H0z" />
      <path d="M1230 850c-67-78-183-117-257-123-96-8-196 35-266 26-62-8-83-63-133-68-63-6-88 57-160 67-54 7-113-18-180 20" fill="none" stroke="url(#road)" strokeWidth="3" />
      <path d="M0 734c160-46 232 74 393 13 102-39 134-111 232-91 105 21 166 116 284 92 122-25 161-142 291-130 140 13 197 137 400 102" fill="none" stroke="#d3c5b4" strokeOpacity=".12" strokeWidth="1" />
    </svg>
  )
}

function App() {
  const root = useRef<HTMLElement>(null)
  const [heroRef, historyRef, routeRef, crossingsRef, peopleRef, spiritRef, legacyRef, endingRef] = useChapterSectionRefs()
  // Stable identity: BackgroundStage keys its setup on this array.
  const sectionRefs = useMemo(
    () => [heroRef, historyRef, routeRef, crossingsRef, peopleRef, spiritRef, legacyRef, endingRef],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const [activeMilestone, setActiveMilestone] = useState(0)
  const [routeMilestone, setRouteMilestone] = useState(0)
  const [activePerson, setActivePerson] = useState(0)
  const [activeSpirit, setActiveSpirit] = useState(0)
  const [choice, setChoice] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(0)
  const [crossingIndex, setCrossingIndex] = useState(0)
  /** Marks whose portrait plate failed to load — those keep the CSS silhouette. */
  const [photoFailed, setPhotoFailed] = useState<Record<string, boolean>>({})

  /** Current stop of chapter 01 — feeds both the archive card and the detail block. */
  const milestone = milestones[activeMilestone]

  /** Absolute scroll offsets of pinned sections, keyed by section id. */
  const pinStartBySection = useRef<Record<string, number>>({})
  const historyPinRef = useRef<ScrollTrigger | null>(null)
  const routePinRef = useRef<ScrollTrigger | null>(null)
  const peoplePinRef = useRef<ScrollTrigger | null>(null)
  const spiritPinRef = useRef<ScrollTrigger | null>(null)
  const historyDetailRef = useRef<HTMLDivElement>(null)
  const historyCardRef = useRef<HTMLDivElement>(null)
  const routeInfoRef = useRef<HTMLDivElement>(null)
  const portraitRef = useRef<HTMLDivElement>(null)
  const spiritDetailRef = useRef<HTMLDivElement>(null)
  const heroVideoRef = useRef<HTMLVideoElement>(null)
  const endingVideoRef = useRef<HTMLVideoElement>(null)

  /** Smooth-scroll to a section start (pinned sections use their pin offset). */
  const goTo = (id: string) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (!el) return
    const pinned = pinStartBySection.current[id]
    const y = pinned != null ? pinned : el.offsetTop
    gsap.to(window, { scrollTo: { y, autoKill: true }, duration: 1.05, ease: 'power3.inOut' })
  }

  /** Scroll to the n-th stop inside a pinned option section (keeps scroll & state in sync). */
  const scrollToOption = (st: ScrollTrigger | null, index: number, count: number) => {
    if (!st) return
    const y = st.start + ((st.end - st.start) * index) / (count - 1)
    gsap.to(window, { scrollTo: { y, autoKill: true }, duration: 0.85, ease: 'power2.inOut' })
  }

  /* Option switching feedback — GSAP transitions instead of a CSS keyframe */
  useEffect(() => {
    const card = portraitRef.current
    if (!card) return
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    const figure = card.querySelector('.portrait-figure')
    if (figure) {
      // focus-in: the plate settles out of a blur while it rises
      tl.fromTo(figure,
        { autoAlpha: 0, y: 30, scale: 1.06, filter: 'blur(9px)' },
        { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.85 }, 0)
    }
    tl.fromTo(
      card.querySelectorAll('.portrait-number, .portrait-caption > *'),
      { autoAlpha: 0, y: 16 },
      { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05 }, 0.12,
    )
    return () => { tl.kill() }
  }, [activePerson])

  useEffect(() => {
    const el = spiritDetailRef.current
    if (!el) return
    const tl = gsap.fromTo(el.children,
      { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.07, ease: 'power3.out' })
    return () => { tl.kill() }
  }, [activeSpirit])

  /* Milestone switching — section 01 and section 02 keep their own index so
     each chapter always arrives showing its own first stop. The archive card
     on the left follows the very same index: staggered re-entry, its seal
     gets re-stamped and a light sweep crosses the paper. */
  const firstMilestoneRun = useRef(true)
  useEffect(() => {
    const isFirst = firstMilestoneRun.current
    firstMilestoneRun.current = false

    const detail = historyDetailRef.current
    const card = historyCardRef.current
    const tls: (gsap.core.Tween | gsap.core.Timeline)[] = []

    if (detail) {
      tls.push(gsap.fromTo(detail.children,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' }))
    }

    if (card) {
      // the sweep band is driven on its own timeline, so keep it out of the stagger
      const parts = Array.from(card.children).filter((el) => !el.classList.contains('card-sweep'))
      tls.push(gsap.fromTo(parts,
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.05, ease: 'power3.out' }))

      const seal = card.querySelector('.card-seal')
      if (seal) {
        tls.push(gsap.fromTo(seal,
          { rotation: -46, scale: 0.72 },
          { rotation: -13, scale: 1, duration: 0.75, ease: 'back.out(1.6)', delay: 0.16 }))
      }

      const sweep = card.querySelector('.card-sweep')
      if (sweep && !isFirst) {
        tls.push(gsap.timeline()
          .set(sweep, { xPercent: -165, autoAlpha: 0 })
          .to(sweep, { autoAlpha: 0.9, duration: 0.16 }, 0)
          .to(sweep, { xPercent: 165, duration: 0.95, ease: 'power2.inOut' }, 0)
          .to(sweep, { autoAlpha: 0, duration: 0.3 }, 0.68))
      }

      // counters tick up again for every new stop (first entrance is handled
      // by the on-scroll counter triggers below)
      if (!isFirst) {
        card.querySelectorAll<HTMLElement>('.stat-num').forEach((el) => {
          const target = Number(el.dataset.target || 0)
          const obj = { v: 0 }
          tls.push(gsap.to(obj, {
            v: target, duration: 1.15, ease: 'power2.out',
            onUpdate: () => { el.textContent = String(Math.round(obj.v)) },
          }))
        })
      }
    }

    return () => { tls.forEach((tl) => tl.kill()) }
  }, [activeMilestone])

  /* Only the visible crossing panel keeps decoding — three always-on videos
     were the main source of scroll jank in this chapter. */
  useEffect(() => {
    document.querySelectorAll<HTMLVideoElement>('.h-panel-video').forEach((v, i) => {
      if (i === crossingIndex) v.play().catch(() => {})
      else v.pause()
    })
  }, [crossingIndex])

  useEffect(() => {
    const el = routeInfoRef.current
    if (!el) return
    const tl = gsap.fromTo(el.children,
      { autoAlpha: 0, y: 16 },
      { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' })
    return () => { tl.kill() }
  }, [routeMilestone])

  useGSAP(() => {
    const cleanups: Array<() => void> = []

    /* ── 1. Hero entrance: split chars + staggered chrome ── */
    const split = new SplitText('.hero-title strong', { type: 'chars' })
    const intro = gsap.timeline({ delay: 0.2, defaults: { ease: 'power3.out' } })
    intro
      .from('.hero-kicker', { y: 24, autoAlpha: 0, duration: 0.8 })
      .from(split.chars, {
        yPercent: 120, autoAlpha: 0, rotateX: -50, transformOrigin: '50% 100%',
        stagger: 0.07, duration: 1.1, ease: 'power4.out',
      }, '-=0.4')
      .from('.hero-deck', { y: 26, autoAlpha: 0, duration: 0.8 }, '-=0.6')
      .from('.hero-actions .button', { y: 20, autoAlpha: 0, stagger: 0.12, duration: 0.7 }, '-=0.5')
      .from('.hero-side-label, .hero-coordinate, .hero-bottom', { autoAlpha: 0, duration: 1 }, '-=0.4')

    /* ── 2. Hero scrub-out ── */
    {
      const hv = heroVideoRef.current
      if (hv) {
        hv.muted = true
        hv.play().catch(() => {})
        gsap.fromTo(hv,
          { yPercent: -4, scale: 1.08 },
          {
            yPercent: 6, scale: 1.18, ease: 'none',
            scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
          })
        // stop decoding the hero film once the hero has left the viewport
        ScrollTrigger.create({
          trigger: heroRef.current, start: 'top bottom', end: 'bottom top',
          onToggle: (self) => { self.isActive ? hv.play().catch(() => {}) : hv.pause() },
        })
      }
    }
    gsap.to('.hero-copy', {
      yPercent: -12, autoAlpha: 0.15, ease: 'none',
      scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom 30%', scrub: true },
    })
    gsap.to('.hero-mountain-silhouette', {
      yPercent: 10, ease: 'none',
      scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
    })

    /* ── 2b. Closing chapter film (07 · 尾声) — slow push-in, decode only while visible ── */
    {
      const ev = endingVideoRef.current
      if (ev) {
        ev.muted = true
        ev.play().catch(() => {})
        gsap.fromTo(ev,
          { scale: 1.16, yPercent: -3.5 },
          {
            scale: 1.03, yPercent: 3, ease: 'none',
            scrollTrigger: { trigger: endingRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
          })
        ScrollTrigger.create({
          trigger: endingRef.current, start: 'top bottom', end: 'bottom top',
          onToggle: (self) => { self.isActive ? ev.play().catch(() => {}) : ev.pause() },
        })
        // the closing copy drifts up as the film pushes in
        gsap.fromTo('.ending-content',
          { yPercent: 5 },
          {
            yPercent: -5, ease: 'none',
            scrollTrigger: { trigger: endingRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
          })
      }
    }

    /* ── 3. Hero mouse parallax ── */
    {
      const hero = heroRef.current
      if (hero) {
        const titleX = gsap.quickTo('.hero-title', 'x', { duration: 0.8, ease: 'power3' })
        const titleY = gsap.quickTo('.hero-title', 'y', { duration: 0.8, ease: 'power3' })
        const mtnX = gsap.quickTo('.hero-mountain-silhouette', 'x', { duration: 1, ease: 'power3' })
        const onMove = (e: MouseEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          titleX(nx * 16); titleY(ny * 10); mtnX(nx * -26)
        }
        hero.addEventListener('mousemove', onMove)
        cleanups.push(() => hero.removeEventListener('mousemove', onMove))
      }
    }

    /* ── 4. Magnetic buttons ── */
    gsap.utils.toArray<HTMLElement>('.magnetic').forEach((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' })
      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect()
        xTo((e.clientX - (r.left + r.width / 2)) * 0.28)
        yTo((e.clientY - (r.top + r.height / 2)) * 0.38)
      }
      const leave = () => { xTo(0); yTo(0) }
      el.addEventListener('mousemove', move)
      el.addEventListener('mouseleave', leave)
      cleanups.push(() => {
        el.removeEventListener('mousemove', move)
        el.removeEventListener('mouseleave', leave)
      })
    })

    /* ── 5. Per-section reveal ── */
    gsap.utils.toArray<HTMLElement>('.chapter:not(.crossings), .ending').forEach((sec) => {
      const items = sec.querySelectorAll('.rv')
      if (!items.length) return
      gsap.from(items, {
        y: 42, autoAlpha: 0, duration: 0.9, stagger: 0.09, ease: 'power3.out',
        scrollTrigger: { trigger: sec, start: 'top 58%', once: true },
      })
    })

    /* ── 6. Archive card counters — first entrance only; every later card
       switch is counted by the milestone effect above ── */
    gsap.utils.toArray<HTMLElement>('.history-card .stat-num').forEach((el) => {
      const target = Number(el.dataset.target || 0)
      ScrollTrigger.create({
        trigger: el, start: 'top 88%', once: true,
        onEnter: () => {
          const obj = { v: 0 }
          gsap.to(obj, {
            v: target, duration: 1.8, ease: 'power2.out',
            onUpdate: () => { el.textContent = String(Math.round(obj.v)) },
          })
        },
      })
    })

    /* ── 7. Stat counters are section 01 content; route line is drawn with the pin (step 8) ── */

    /* ── 8. Pinned sections (horizontal track + option switching) + page snap — desktop only ── */
    const mm = gsap.matchMedia()
    mm.add('(min-width: 821px)', () => {
      const pinTriggers: { st: ScrollTrigger; stops: number }[] = []

      /* Pins MUST refresh in document order, otherwise a pin further down the
         page measures its start before the pins above it have added their
         spacer — which makes two sections pin on top of each other. The
         creation order below already matches the page order; refreshPriority
         makes it explicit and survives re-creating the triggers. */
      const PRIORITY = { beginning: 6, route: 5, crossings: 4, people: 3, spirit: 2 }

      /* 01 / 02 / 04 / 05 · pinned option switching — scrolling up OR down steps the tabs */
      const buildOptionPin = (
        sectionRef: React.RefObject<HTMLElement | null>,
        id: string,
        count: number,
        onIndex: (i: number) => void,
        sectionIndex: number,
        refreshPriority: number,
        extra?: (distance: () => number) => void,
      ) => {
        let current = -1
        const distance = () => window.innerHeight * (count - 1)
        const st = ScrollTrigger.create({
          trigger: sectionRef.current!,
          start: 'top top',
          end: () => '+=' + distance(),
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority,
          onRefresh: (self) => { pinStartBySection.current[id] = self.start },
          onEnter: () => setActiveSection(sectionIndex),
          onEnterBack: () => setActiveSection(sectionIndex),
          onUpdate: (self) => {
            const fill = sectionRef.current?.querySelector('.opt-progress-fill') as HTMLElement | null
            if (fill) gsap.set(fill, { scaleX: self.progress })
            const next = Math.round(self.progress * (count - 1))
            if (next !== current) {
              current = next
              onIndex(next)
            }
          },
        })
        pinStartBySection.current[id] = st.start
        pinTriggers.push({ st, stops: count })

        // gentle depth drift so the switch feels silky rather than stepped
        const depth = sectionRef.current!.querySelectorAll<HTMLElement>('[data-depth]')
        if (depth.length) {
          gsap.fromTo(depth, { yPercent: 1.5 }, {
            yPercent: -1.5, ease: 'none',
            scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: () => '+=' + distance(), scrub: 1 },
          })
        }

        extra?.(distance)
        return st
      }

      /* 01 · beginning — pinned, scroll steps through the four milestones */
      historyPinRef.current = buildOptionPin(
        historyRef, 'beginning', milestones.length, setActiveMilestone, 1, PRIORITY.beginning,
      )

      /* 02 · route — same mechanic, its own index, map line draws with the steps */
      routePinRef.current = buildOptionPin(
        routeRef, 'route', milestones.length, setRouteMilestone, 2, PRIORITY.route,
        (distance) => {
          // the route line draws itself as you step through the milestones
          gsap.to('.route-line', {
            strokeDashoffset: 0, ease: 'none',
            scrollTrigger: { trigger: routeRef.current, start: 'top top', end: () => '+=' + distance(), scrub: 1 },
          })
        },
      )

      /* 03 · crossings — pinned horizontal track (created after 01 / 02 pins) */
      const panels = gsap.utils.toArray<HTMLElement>('.h-panel')
      const n = panels.length

      const scrollTween = gsap.to('.h-track', {
        xPercent: -100 * (n - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: crossingsRef.current,
          start: 'top top',
          end: () => '+=' + window.innerWidth * (n - 1),
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          refreshPriority: PRIORITY.crossings,
          onRefresh: (self) => { pinStartBySection.current.crossings = self.start },
          onUpdate: (self) => {
            gsap.set('.h-progress-fill', { scaleX: self.progress })
            setCrossingIndex(Math.round(self.progress * (n - 1)))
          },
        },
      })
      const hST = scrollTween.scrollTrigger!
      pinStartBySection.current.crossings = hST.start
      pinTriggers.push({ st: hST, stops: n })

      // Panel inner parallax + content entrances (containerAnimation)
      panels.forEach((panel) => {
        const vid = panel.querySelector('video')
        const content = panel.querySelector('.h-panel-content')
        if (vid) {
          // safety: ensure panel films actually play (autoplay + muted)
          vid.muted = true
          vid.play().catch(() => {})
          gsap.fromTo(vid, { xPercent: -7 }, {
            xPercent: 7, ease: 'none',
            scrollTrigger: { trigger: panel, containerAnimation: scrollTween, start: 'left right', end: 'right left', scrub: true },
          })
        }
        if (content) {
          gsap.from(content.children, {
            y: 60, autoAlpha: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: panel, containerAnimation: scrollTween, start: 'left 60%', once: true },
          })
        }
      })

      /* 04 / 05 · people / spirit */
      peoplePinRef.current = buildOptionPin(peopleRef, 'people', people.length, setActivePerson, 4, PRIORITY.people)
      spiritPinRef.current = buildOptionPin(spiritRef, 'spirit', spirits.length, setActiveSpirit, 5, PRIORITY.spirit)

      /* Full-page snap: section tops + every pinned stop */
      const above = [heroRef]
      const below = [legacyRef, endingRef]
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        snap: {
          duration: { min: 0.25, max: 0.8 },
          ease: 'power2.inOut',
          snapTo: (value) => {
            const max = ScrollTrigger.maxScroll(window)
            if (!max) return value
            const pts: number[] = above.map((r) => r.current!.offsetTop)
            pinTriggers.forEach(({ st: pin, stops }) => {
              for (let i = 0; i < stops; i++) {
                pts.push(pin.start + ((pin.end - pin.start) * i) / (stops - 1))
              }
            })
            below.forEach((r) => pts.push(r.current!.offsetTop))
            pts.push(max)
            const norm = pts.map((p) => gsap.utils.clamp(0, 1, p / max))
            return norm.reduce((prev, curr) => (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev))
          },
        },
      })

      return () => {
        pinStartBySection.current = {}
        historyPinRef.current = null
        routePinRef.current = null
        peoplePinRef.current = null
        spiritPinRef.current = null
      }
    })

    /* ── 9. Active section tracking (dot nav) ── */
    sectionRefs.forEach((ref, i) => {
      if (!ref.current) return
      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => { if (self.isActive) setActiveSection(i) },
      })
    })

    /* ── 10. Page progress bar ── */
    ScrollTrigger.create({
      trigger: root.current!,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const bar = document.querySelector('.progress-bar .bar-fill') as HTMLElement | null
        if (bar) bar.style.transform = `scaleX(${self.progress})`
      },
    })

    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    cleanups.push(() => window.removeEventListener('load', onLoad))

    /* Every pin inflates the page, so let the triggers that were created
       before the pins (reveals, background switch, dot nav, counters)
       re-measure once the spacers are in the document. */
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh())
    cleanups.push(() => cancelAnimationFrame(raf))

    cleanups.push(() => mm.revert())

    return () => cleanups.forEach((fn) => fn())
  }, { scope: root })

  return (
    <div className="app-shell">
      <BackgroundStage />

      <main ref={root}>
        {/* ─── Hero ─── */}
        <section className="hero fullpage" id="top" ref={heroRef}>
          <video
            ref={heroVideoRef}
            className="hero-video"
            src="/videos/01-prologue.mp4"
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
          />
          <div className="hero-video-scrim" />
          <div className="hero-mountain-silhouette"><MountainArt /></div>
          <div className="hero-copy">
            <p className="hero-kicker">
              <span className="red-rule" /> 一段用信仰与意志写就的历史
              <span className="en-kicker">A JOURNEY THROUGH TIME</span>
            </p>
            <h1 className="hero-title">
              <span>二万五千里</span>
              <strong>征途<span className="title-dot">.</span></strong>
            </h1>
            <p className="hero-deck">
              走过万水千山，跨越历史长河。<br />
              长征，是一段仍在照亮未来的精神征途。
            </p>
            <div className="hero-actions">
              <a className="button button-red magnetic" href="#beginning" onClick={(e) => { e.preventDefault(); goTo('beginning') }}>
                开始征途 <span>↘</span>
              </a>
              <a className="button button-line magnetic" href="#route" onClick={(e) => { e.preventDefault(); goTo('route') }}>
                探索长征地图 <span>↗</span>
              </a>
            </div>
          </div>
          <div className="hero-side-label">THE LONG MARCH <span>·</span> 1934—1936</div>
          <div className="hero-bottom">
            <span>01 / 08</span>
            <span className="scroll-cue"><i /> SCROLL TO EXPLORE</span>
            <span>中国 · 山河之间</span>
          </div>
          <div className="hero-coordinate">26°16′N<br />115°24′E</div>
        </section>

        {/* ─── Chapter 01: Beginning ─── */}
        <section className="chapter history fullpage" id="beginning" ref={historyRef}>
          <div className="section-head rv">
            <span className="eyebrow">01 / THE BEGINNING</span>
            <span className="section-count">从哪里出发</span>
          </div>
          <div className="history-grid" data-depth>
            <div className="history-card rv" ref={historyCardRef}>
              <div className="card-sweep" aria-hidden="true" />
              <div className="card-corner">
                <span>{milestone.card.corner}</span>
                <b>{String(activeMilestone + 1).padStart(2, '0')} / 0{milestones.length}</b>
              </div>
              <p className="overline">{milestone.card.overline}</p>
              <h3>{milestone.card.heading}</h3>
              <div className="card-seal" data-seal={milestone.card.seal} />
              <span className="card-watermark" aria-hidden="true">{milestone.card.seal}</span>
              <div className="card-grid" key={milestone.year}>
                {milestone.card.rows.map((row) => (
                  <div key={row.label}>
                    <span>{row.label}</span>
                    {row.num != null ? (
                      <b>
                        {row.approx ? '约 ' : ''}
                        <i className="stat-num" data-target={row.num}>0</i>
                        {row.unit ? ` ${row.unit}` : ''}
                      </b>
                    ) : (
                      <b>{row.value}</b>
                    )}
                  </div>
                ))}
              </div>
              <div className="card-tag">
                <i />
                {milestone.card.tag}
                <em>{milestone.place}</em>
              </div>
              <small>{milestone.card.note}</small>
            </div>
            <div className="history-copy rv">
              <p className="overline">THE TURNING POINT</p>
              <h2>历史的转折，<br /><em>从一次出发开始。</em></h2>
              <div className="history-detail" ref={historyDetailRef}>
                <span className="route-step">{String(activeMilestone + 1).padStart(2, '0')} <i>/ 0{milestones.length}</i></span>
                <p className="route-date">{milestones[activeMilestone].year} <span>· {milestones[activeMilestone].place}</span></p>
                <h3>{milestones[activeMilestone].title}</h3>
                <p>{milestones[activeMilestone].text}</p>
              </div>
              <div className="timeline">
                {milestones.map((item, i) => (
                  <button
                    key={item.year}
                    className={`timeline-item ${activeMilestone === i ? 'selected' : ''}`}
                    onClick={() => { setActiveMilestone(i); scrollToOption(historyPinRef.current, i, milestones.length) }}
                  >
                    <span className="timeline-year">{item.year}</span>
                    <span className="timeline-marker" />
                    <span className="timeline-detail">
                      <b>{item.title}</b>
                      <small>{item.place}</small>
                    </span>
                  </button>
                ))}
              </div>
              <div className="opt-progress" aria-hidden="true"><div className="opt-progress-fill" /></div>
              <span className="opt-hint">向上 / 向下滚动 · 逐节切换 ↑↓</span>
            </div>
          </div>
        </section>

        {/* ─── Chapter 02: Route ─── */}
        <section className="chapter route-section fullpage" id="route" ref={routeRef}>
          <div className="section-head rv">
            <span className="eyebrow">02 / THE ROUTE</span>
            <span className="section-count">一条路，不止一种抵达</span>
          </div>
          <div className="route-heading rv">
            <p className="overline">MOUNTAINS · RIVERS · FOOTSTEPS</p>
            <h2>山河为证，<em>足迹为路。</em></h2>
          </div>
          <div className="map-layout" data-depth>
            <div className="map-visual rv">
              <div className="map-label map-label-north">陕北 · 吴起镇</div>
              <div className="map-label map-label-east">江西 · 于都</div>
              <div className="map-label map-label-center">遵义</div>
              <div className="map-label map-label-west">雪山 · 草地</div>
              <svg className="route-map" viewBox="0 0 700 660" aria-label="中央红军长征路线示意图">
                <path className="china-shape" d="m110 95 77-41 78 23 47-25 43 34 63-4 38 39 77 12 27 46 68 26-8 57 29 42-24 44 23 42-33 64-39 24-18 65-70 16-40-39-51 17-46-34-38 15-57-48-45 23-39-28-48-83-51-36-25-72 13-58-19-51z" />
                <path className="route-underlay" d="M520 520 C482 454 420 448 390 398 S318 322 330 270 280 201 245 175 218 138 230 112" />
                <path className="route-line" d="M520 520 C482 454 420 448 390 398 S318 322 330 270 280 201 245 175 218 138 230 112" />
                {[['520', '520'], ['390', '398'], ['330', '270'], ['230', '112']].map(([cx, cy], i) => (
                  <circle
                    key={cx}
                    className={`route-node ${i === routeMilestone ? 'active' : ''}`}
                    cx={cx}
                    cy={cy}
                    r={i === routeMilestone ? 8 : 5}
                    onClick={() => {
                      setRouteMilestone(i)
                      scrollToOption(routePinRef.current, i, milestones.length)
                    }}
                  />
                ))}
                <text x="531" y="528">于都</text>
                <text x="340" y="267">遵义</text>
                <text x="241" y="103">吴起镇</text>
              </svg>
              <div className="map-legend">
                <span><i /> 中央红军路线示意</span>
                <span>示意图 · 非精确比例</span>
              </div>
            </div>
            <div className="route-info rv">
              <div ref={routeInfoRef}>
                <span className="route-step">{String(routeMilestone + 1).padStart(2, '0')} <i>/ 0{milestones.length}</i></span>
                <p className="route-date">{milestones[routeMilestone].year} <span>· {milestones[routeMilestone].place}</span></p>
                <h3>{milestones[routeMilestone].title}</h3>
                <p>{milestones[routeMilestone].text}</p>
              </div>
              <div className="route-pager">
                {milestones.map((m, i) => (
                  <button
                    key={m.year}
                    className={routeMilestone === i ? 'active' : ''}
                    onClick={() => { setRouteMilestone(i); scrollToOption(routePinRef.current, i, milestones.length) }}
                    aria-label={`${m.year} ${m.title}`}
                  />
                ))}
              </div>
              <small className="route-note">地图为中央红军长征路线的艺术化示意。其他红军部队路线各有不同。</small>
              <div className="opt-progress" aria-hidden="true"><div className="opt-progress-fill" /></div>
              <span className="opt-hint">向上 / 向下滚动 · 逐点推进 ↑↓</span>
            </div>
          </div>
          <div className="route-coordinate">一九三四年十月 — 一九三六年十月</div>
        </section>

        {/* ─── Chapter 03: Crossings (pinned horizontal scroll) ─── */}
        <section className="chapter crossings fullpage" id="crossings" ref={crossingsRef}>
          <div className="crossings-head">
            <div className="section-head">
              <span className="eyebrow">03 / THE CROSSINGS</span>
              <span className="section-count">山河 · 血与火的考验</span>
            </div>
            <div className="crossings-status">
              <span>{crossingScenes[crossingIndex].meta}</span>
              <span className="crossings-hint">继续滚动 · 横向穿越 ⟶</span>
            </div>
          </div>

          <div className="h-track">
            {crossingScenes.map((s, i) => (
              <article className="h-panel" key={s.en} data-num={String(i + 1).padStart(2, '0')}>
                <video className="h-panel-video" src={s.video} muted loop playsInline autoPlay preload="metadata" />
                <div className="h-panel-shade" />
                <div className="h-panel-content">
                  <span className="h-panel-index">{String(i + 1).padStart(2, '0')} <i>/ 03</i></span>
                  <p className="overline">{s.en}</p>
                  <h3>{s.title}<br /><em>{s.titleEm}</em></h3>
                  <p className="h-panel-desc">{s.desc}</p>
                  <span className="h-panel-meta">{s.meta}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="h-progress"><div className="h-progress-fill" /></div>
        </section>

        {/* ─── Chapter 04: People ─── */}
        <section className="chapter people-section fullpage" id="people" ref={peopleRef}>
          <div className="section-head rv">
            <span className="eyebrow">04 / THE PEOPLE</span>
            <span className="section-count">历史由人书写</span>
          </div>
          <div className="people-layout" data-depth>
            <div className="people-copy rv">
              <p className="overline">ORDINARY LIVES · EXTRAORDINARY JOURNEY</p>
              <h2>伟大，常常<br /><em>从平凡处生长。</em></h2>
              <p className="body-copy">
                长征的故事里，有领路者，也有无数没有留下姓名的人。
                他们在风雪中相互照应，在村庄里彼此守望，共同走过艰难岁月。
              </p>
              <div className="people-selector">
                {people.map((person, i) => (
                  <button
                    key={person.mark}
                    onClick={() => { setActivePerson(i); scrollToOption(peoplePinRef.current, i, people.length) }}
                    className={activePerson === i ? 'active' : ''}
                  >
                    <span>{person.mark}</span>
                    {person.name}
                    <i>↗</i>
                  </button>
                ))}
              </div>
              <div className="opt-progress" aria-hidden="true"><div className="opt-progress-fill" /></div>
              <span className="opt-hint">向上 / 向下滚动 · 依次遇见 ↑↓</span>
            </div>
            <div ref={portraitRef} className={`portrait-card ${people[activePerson].color} rv`}>
              <div className="portrait-number">
                {people[activePerson].mark} <span>FIELD NOTES</span>
              </div>
              <div className={`portrait-figure ${people[activePerson].img && !photoFailed[people[activePerson].mark] ? 'has-photo' : ''}`}>
                <div className="portrait-halo" />
                <div className="portrait-silhouette">
                  <i className="head" />
                  <i className="body" />
                  <i className="bag" />
                </div>
                {people.map((person, i) => (
                  <img
                    key={person.mark}
                    className={`portrait-photo ${i === activePerson ? 'is-active' : ''} ${photoFailed[person.mark] ? 'is-failed' : ''}`}
                    src={person.img}
                    alt={`${person.name} · 艺术化视觉表达`}
                    onError={() => setPhotoFailed((prev) => (prev[person.mark] ? prev : { ...prev, [person.mark]: true }))}
                  />
                ))}
                <div className="portrait-lines" />
              </div>
              <div className="portrait-caption">
                <span>{people[activePerson].role}</span>
                <h3>{people[activePerson].name}</h3>
                <p>"{people[activePerson].quote}"</p>
              </div>
              <div className="portrait-index">人物故事 · 艺术化视觉表达</div>
            </div>
          </div>
        </section>

        {/* ─── Chapter 05: Spirit ─── */}
        <section className="chapter spirit-section fullpage" id="spirit" ref={spiritRef}>
          <div className="spirit-content">
            <div className="section-head rv">
              <span className="eyebrow">05 / THE SPIRIT</span>
              <span className="section-count">穿越时空的力量</span>
            </div>
            <div className="spirit-question rv">
              <p className="overline">A QUESTION ACROSS TIME</p>
              <h2>什么，让一支队伍<br />穿越万水千山<span>？</span></h2>
            </div>
            <div className="spirit-explorer" data-depth>
              <div className="spirit-tabs rv">
                {spirits.map((spirit, i) => (
                  <button
                    key={spirit.en}
                    onClick={() => { setActiveSpirit(i); scrollToOption(spiritPinRef.current, i, spirits.length) }}
                    className={activeSpirit === i ? 'active' : ''}
                  >
                    <span>0{i + 1}</span>
                    {spirit.title}
                    <i>↗</i>
                  </button>
                ))}
              </div>
              <div className="spirit-detail rv" ref={spiritDetailRef}>
                <span className="spirit-en">{spirits[activeSpirit].en}</span>
                <h3>{spirits[activeSpirit].title}</h3>
                <p>{spirits[activeSpirit].copy}</p>
                <div className="spirit-evidence">
                  <span>HISTORICAL CONTEXT</span>
                  <p>{spirits[activeSpirit].proof}</p>
                </div>
              </div>
            </div>
            <div className="opt-progress" aria-hidden="true"><div className="opt-progress-fill" /></div>
            <span className="opt-hint">向上 / 向下滚动 · 依次展开 ↑↓</span>
            <p className="spirit-footnote rv">精神内涵依据长征历史与相关权威表述提炼；本页文字为主题阐释，非历史原文。</p>
          </div>
        </section>

        {/* ─── Chapter 06: Legacy ─── */}
        <section className="chapter legacy-section fullpage" id="legacy" ref={legacyRef}>
          <div className="section-head rv">
            <span className="eyebrow">06 / THE LEGACY</span>
            <span className="section-count">走向今天</span>
          </div>
          <div className="legacy-heading rv">
            <p className="overline">THE ROAD CONTINUES</p>
            <h2>长征，<em>从未远去。</em></h2>
          </div>
          <div className="legacy-columns rv">
            {[
              { n: '01', t: '在学习中坚持', b: '面对困难保持专注，在一次次尝试中积累新的能力。' },
              { n: '02', t: '在实践中探索', b: '面对未知保持思考，在行动中寻找解决问题的方法。' },
              { n: '03', t: '在集体中担当', b: '关心身边的人，在共同目标中承担自己的责任。' },
            ].map((item) => (
              <article className="legacy-card" key={item.n}>
                <span>{item.n}</span>
                <h3>{item.t}</h3>
                <p>{item.b}</p>
              </article>
            ))}
          </div>
          <div className="my-journey rv">
            <div>
              <span className="overline">MY JOURNEY</span>
              <h3>面对困难，你会选择怎样继续前行？</h3>
            </div>
            <div className="journey-choices">
              <button className={choice === '探索' ? 'chosen' : ''} onClick={() => setChoice('探索')}>
                坚持探索 <span>↗</span>
              </button>
              <button className={choice === '调整' ? 'chosen' : ''} onClick={() => setChoice('调整')}>
                调整方向 <span>↗</span>
              </button>
              <button className={choice === '同行' ? 'chosen' : ''} onClick={() => setChoice('同行')}>
                与他人同行 <span>↗</span>
              </button>
              {choice && (
                <p className="choice-response swap-anim" key={choice}>
                  {choice === '探索'
                    ? '保持好奇，继续寻找前路。每一次尝试，都是向前的一步。'
                    : choice === '调整'
                    ? '方向可以在实践中校准。理解现实，才能更坚定地出发。'
                    : '同行让路途不再孤单。倾听、协作，也是一种力量。'}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ─── Closing ─── */}
        <footer className="ending fullpage" id="ending" ref={endingRef}>
          <video
            ref={endingVideoRef}
            className="ending-video"
            src="/videos/10-ending.mp4"
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
          />
          <div className="ending-video-scrim" />
          <div className="hero-mountain-silhouette ending-mountain-silhouette"><MountainArt /></div>
          <div className="ending-content">
            <p className="overline rv">THE ROAD GOES ON</p>
            <h2 className="rv">铭记历史<br /><em>穿越时空的力量</em><br />奋进新时代</h2>
            <a className="button button-light magnetic rv" href="#top" onClick={(e) => { e.preventDefault(); goTo('top') }}>
              回到征途起点 <span>↑</span>
            </a>
          </div>
          <div className="ending-foot">
            <div className="ending-credit rv">
              <span className="ending-credit-label">AUTHOR</span>
              <b>南京信息职业技术学院 · 移动应用2504 · 陈涛</b>
            </div>
            <div className="ending-bottom">
              <span>《征途 · 不灭的火种》</span>
              <span>历史资料与图片出处将在正式发布时补充</span>
              <span>© 2026 · DIGITAL STORYTELLING</span>
            </div>
          </div>
        </footer>
      </main>

      {/* Floating UI — topbar / menu / progress / dot nav */}
      <header className="topbar">
        <a className="brand" href="#top" aria-label="征途首页" onClick={(e) => { e.preventDefault(); goTo('top') }}>
          <span className="brand-seal">征</span>
          <span>不灭的火种<small>THE LONG MARCH · ETERNAL FLAME</small></span>
        </a>
        <div className="topbar-right">
          <span className="edition">数字叙事 · 1934—1936</span>
          <button
            className={`menu-toggle ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="切换章节导航"
          >
            <i /><i />
          </button>
        </div>
        <nav className={`chapter-menu ${menuOpen ? 'is-open' : ''}`} aria-label="章节导航">
          {chapters.map((c) => (
            <a key={c.id} href={`#${c.id}`} onClick={(e) => { e.preventDefault(); goTo(c.id) }}>
              <span>{c.number}</span>
              {c.label}
            </a>
          ))}
        </nav>
      </header>

      <nav className="dot-nav" aria-label="页面导航">
        {dotSections.map((s, i) => (
          <button
            key={s.id}
            className={activeSection === i ? 'active' : ''}
            onClick={() => goTo(s.id)}
            aria-label={s.label}
          >
            <span>{s.num}</span>
          </button>
        ))}
      </nav>

      <div className="progress-bar" aria-hidden="true">
        <div className="bar-fill" />
      </div>
    </div>
  )
}

export default App
