'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Clock,
  Code,
  Copy,
  Check,
  Globe,
  Hash,
  LoaderCircle,
  Network,
  Play,
  Radio,
  Send,
  ShieldAlert,
  Webhook,
  Zap,
  type LucideIcon,
} from 'lucide-react'

const GITHUB = 'https://github.com/pragyann007/GoFlow'
const LOGIN_HREF = '/auth/login'
const REGISTER_HREF = '/auth/register'

/* ─────────────────────────────────────────────────────────────
   SUBTLE 3D AMBIENT PARTICLES (Dark Orange Theme)
   Clean, performant, no clutter. Adds depth without distraction.
   ───────────────────────────────────────────────────────────── */
function AmbientBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.z = 15

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    })
    renderer.setSize(container.clientWidth, container.clientHeight, false)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

    // Floating orange dust
    const count = 90
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))

    const mat = new THREE.PointsMaterial({
      size: 0.14,
      color: 0xf97316,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    })
    const points = new THREE.Points(geo, mat)
    scene.add(points)

    let reqId = 0
    let clock = 0

    const handleResize = () => {
      if (!container || !camera || !renderer) return
      const w = container.clientWidth
      const h = container.clientHeight
      if (w === 0 || h === 0) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }

    const observer = new ResizeObserver(handleResize)
    observer.observe(container)

    const animate = () => {
      reqId = requestAnimationFrame(animate)
      clock += 0.003
      points.rotation.y = clock * 0.3
      points.rotation.x = Math.sin(clock) * 0.1
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(reqId)
      observer.disconnect()
      geo.dispose()
      mat.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(234,88,12,0.14),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(234,88,12,0.06),transparent)]" />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   AUTHENTIC INTERACTIVE WORKFLOW PREVIEW
   Directly mirrors GoFlow's real execution engine:
   Webhook -> Switch Condition -> AI Agent (or Skipped) -> Slack
   Connected edges with animated flowing data dots from outputs to inputs.
   ───────────────────────────────────────────────────────────── */
interface CanvasNode {
  id: string
  title: string
  subtitle: string
  icon: LucideIcon
  x: number
  y: number
  width: number
  height: number
}

const FLOW_NODES: CanvasNode[] = [
  { id: 'webhook', title: 'Webhook Trigger', subtitle: 'POST /v1/lead', icon: Webhook, x: 20, y: 110, width: 160, height: 70 },
  { id: 'switch', title: 'Switch Condition', subtitle: 'lead.score >= 80', icon: Network, x: 260, y: 110, width: 160, height: 70 },
  { id: 'ai', title: 'AI Agent', subtitle: 'Gemini / OpenAI draft', icon: Bot, x: 500, y: 35, width: 160, height: 70 },
  { id: 'archive', title: 'Cold Storage', subtitle: 'Branch Pruned', icon: ShieldAlert, x: 500, y: 185, width: 160, height: 70 },
  { id: 'slack', title: 'Slack Notification', subtitle: 'Post #vip-deals', icon: Hash, x: 740, y: 35, width: 160, height: 70 },
]

function InteractiveFlowCanvas() {
  const [running, setRunning] = useState(false)
  const [activeEdge, setActiveEdge] = useState<string | null>(null)
  const [nodeStatus, setNodeStatus] = useState<Record<string, 'idle' | 'running' | 'completed' | 'skipped'>>({})
  const [logs, setLogs] = useState<string[]>([])

  const triggerExecution = () => {
    if (running) return
    setRunning(true)
    setNodeStatus({})
    setActiveEdge(null)
    setLogs(['[Socket] Emitting execute event for workflow wf_demo_01...'])

    // 1. Webhook runs
    setTimeout(() => {
      setNodeStatus((s) => ({ ...s, webhook: 'running' }))
      setLogs((l) => [...l, '[0ms] Webhook received payload: { lead: "Acme Corp", score: 92 }'])
    }, 200)

    setTimeout(() => {
      setNodeStatus((s) => ({ ...s, webhook: 'completed' }))
      // Data flows along Edge 1 to Switch
      setActiveEdge('edge1')
      setLogs((l) => [...l, '[18ms] Data flowing from Webhook output → Switch input'])
    }, 700)

    // 2. Switch condition evaluates
    setTimeout(() => {
      setNodeStatus((s) => ({ ...s, switch: 'running' }))
      setLogs((l) => [...l, '[35ms] Evaluating Switch: score (92) >= 80 -> TRUE'])
    }, 1200)

    setTimeout(() => {
      setNodeStatus((s) => ({ ...s, switch: 'completed', archive: 'skipped' }))
      // Data flows along True branch to AI Agent
      setActiveEdge('edge2')
      setLogs((l) => [...l, '[52ms] True branch active → routing output into AI Agent input'])
      setLogs((l) => [...l, '[54ms] False branch pruned: "Cold Storage" marked as SKIPPED'])
    }, 1800)

    // 3. AI Agent runs
    setTimeout(() => {
      setNodeStatus((s) => ({ ...s, ai: 'running' }))
      setLogs((l) => [...l, '[110ms] AI Agent invoking model with customer context...'])
    }, 2400)

    setTimeout(() => {
      setNodeStatus((s) => ({ ...s, ai: 'completed' }))
      // Data flows to Slack
      setActiveEdge('edge4')
      setLogs((l) => [...l, '[420ms] AI Agent output ready → routing payload into Slack input'])
    }, 3100)

    // 4. Slack posts
    setTimeout(() => {
      setNodeStatus((s) => ({ ...s, slack: 'running' }))
    }, 3600)

    setTimeout(() => {
      setNodeStatus((s) => ({ ...s, slack: 'completed' }))
      setActiveEdge(null)
      setLogs((l) => [...l, '[475ms] Slack message delivered to #vip-deals. Workflow complete.'])
      setRunning(false)
    }, 4200)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-orange-500/25 bg-neutral-950/90 shadow-2xl backdrop-blur-xl">
      {/* Canvas Top Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-neutral-800 bg-neutral-900/60 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-neutral-700" />
            <span className="size-2.5 rounded-full bg-neutral-700" />
            <span className="size-2.5 rounded-full bg-neutral-700" />
          </div>
          <span className="font-mono text-xs text-neutral-400">
            workflow / <span className="font-medium text-orange-400">lead-qualification-v1</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-400">
            <Radio className="size-3 text-emerald-500 animate-pulse" />
            <span>WebSocket Live Stream</span>
          </div>
          <button
            onClick={triggerExecution}
            disabled={running}
            className="flex items-center gap-2 rounded-lg bg-orange-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-orange-600/30 transition hover:bg-orange-500 disabled:opacity-50"
          >
            {running ? (
              <>
                <LoaderCircle className="size-3.5 animate-spin" /> Executing DAG...
              </>
            ) : (
              <>
                <Play className="size-3.5 fill-current" /> Run Workflow
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Node Graph Area */}
      <div className="relative overflow-x-auto p-6 sm:p-8">
        <div className="relative h-[290px] min-w-[940px] select-none">
          {/* SVG Connecting Edges & Animated Flowing Data Dots */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 940 290" aria-hidden="true">
            <defs>
              <filter id="dot-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* EDGE 1: Webhook (180, 145) -> Switch (260, 145) */}
            <path
              id="path-edge1"
              d="M 180 145 C 220 145, 220 145, 260 145"
              fill="none"
              stroke={activeEdge === 'edge1' ? '#f97316' : '#3f3f46'}
              strokeWidth={activeEdge === 'edge1' ? 2.5 : 1.75}
              className="transition-colors duration-300"
            />
            {/* Animated data dot traveling from Webhook output to Switch input */}
            <circle r="4.5" fill="#fb923c" filter="url(#dot-glow)">
              <animateMotion
                path="M 180 145 C 220 145, 220 145, 260 145"
                dur={activeEdge === 'edge1' ? '0.8s' : '2.2s'}
                repeatCount="indefinite"
              />
            </circle>

            {/* EDGE 2: Switch True Output (420, 130) -> AI Agent Input (500, 70) */}
            <path
              id="path-edge2"
              d="M 420 130 C 460 130, 460 70, 500 70"
              fill="none"
              stroke={activeEdge === 'edge2' ? '#f97316' : '#ea580c'}
              strokeWidth={activeEdge === 'edge2' ? 2.5 : 1.75}
              className="transition-colors duration-300"
            />
            <text x="450" y="92" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">
              [TRUE]
            </text>
            {/* Animated data dot traveling from Switch TRUE output to AI Agent input */}
            <circle r="4.5" fill="#fb923c" filter="url(#dot-glow)">
              <animateMotion
                path="M 420 130 C 460 130, 460 70, 500 70"
                dur={activeEdge === 'edge2' ? '0.8s' : '2.6s'}
                repeatCount="indefinite"
              />
            </circle>

            {/* EDGE 3: Switch False Output (420, 160) -> Cold Storage Input (500, 220) */}
            <path
              id="path-edge3"
              d="M 420 160 C 460 160, 460 220, 500 220"
              fill="none"
              stroke="#27272a"
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
            <text x="446" y="196" fill="#71717a" fontSize="10" fontFamily="monospace">
              [FALSE]
            </text>

            {/* EDGE 4: AI Agent Output (660, 70) -> Slack Input (740, 70) */}
            <path
              id="path-edge4"
              d="M 660 70 C 700 70, 700 70, 740 70"
              fill="none"
              stroke={activeEdge === 'edge4' ? '#f97316' : '#3f3f46'}
              strokeWidth={activeEdge === 'edge4' ? 2.5 : 1.75}
              className="transition-colors duration-300"
            />
            {/* Animated data dot traveling from AI Agent output to Slack input */}
            <circle r="4.5" fill="#fb923c" filter="url(#dot-glow)">
              <animateMotion
                path="M 660 70 C 700 70, 700 70, 740 70"
                dur={activeEdge === 'edge4' ? '0.8s' : '2.4s'}
                repeatCount="indefinite"
              />
            </circle>
          </svg>

          {/* Render Actual Node Cards With Visible Connectors */}
          {FLOW_NODES.map((n) => {
            const Icon = n.icon
            const st = nodeStatus[n.id] || 'idle'

            let border = 'border-neutral-800'
            let bg = 'bg-neutral-900/90'
            let statusText = 'Idle'
            let statusColor = 'text-neutral-500'

            if (st === 'running') {
              border = 'border-orange-500 ring-2 ring-orange-500/25'
              bg = 'bg-neutral-900'
              statusText = 'Running...'
              statusColor = 'text-orange-400'
            } else if (st === 'completed') {
              border = 'border-emerald-500/80 shadow-emerald-500/10'
              bg = 'bg-neutral-900'
              statusText = 'Completed'
              statusColor = 'text-emerald-400'
            } else if (st === 'skipped') {
              border = 'border-neutral-800/80 opacity-35'
              bg = 'bg-neutral-950'
              statusText = 'Skipped'
              statusColor = 'text-neutral-500'
            }

            const isSwitch = n.id === 'switch'
            const isWebhook = n.id === 'webhook'
            const isEnd = n.id === 'slack' || n.id === 'archive'

            return (
              <div
                key={n.id}
                style={{
                  left: `${n.x}px`,
                  top: `${n.y}px`,
                  width: `${n.width}px`,
                  height: `${n.height}px`,
                }}
                className={`absolute flex items-center gap-3 rounded-xl border p-3 shadow-xl transition-all duration-300 ${border} ${bg}`}
              >
                {/* Input Handle Port on Left (except root webhook trigger) */}
                {!isWebhook && (
                  <span
                    className="absolute -left-2 top-1/2 -translate-y-1/2 size-3.5 rounded-full border-2 border-neutral-950 bg-orange-500 shadow-sm transition hover:scale-125"
                    title="Input Port"
                  />
                )}

                {/* Output Handle Port on Right */}
                {!isEnd && !isSwitch && (
                  <span
                    className="absolute -right-2 top-1/2 -translate-y-1/2 size-3.5 rounded-full border-2 border-neutral-950 bg-orange-500 shadow-sm transition hover:scale-125"
                    title="Output Port"
                  />
                )}

                {/* For Switch: Dual Output Ports (True top, False bottom) */}
                {isSwitch && (
                  <>
                    <span
                      style={{ top: '20px' }}
                      className="absolute -right-2 size-3.5 rounded-full border-2 border-neutral-950 bg-emerald-500 shadow-sm"
                      title="True Output Branch"
                    />
                    <span
                      style={{ top: '50px' }}
                      className="absolute -right-2 size-3.5 rounded-full border-2 border-neutral-950 bg-neutral-600 shadow-sm"
                      title="False Output Branch"
                    />
                  </>
                )}

                {/* Node Icon */}
                <div
                  className={`grid size-9 shrink-0 place-items-center rounded-lg ${
                    st === 'running'
                      ? 'bg-orange-500/20 text-orange-400'
                      : st === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  <Icon className="size-4" />
                </div>

                {/* Node Content */}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold text-neutral-100">{n.title}</div>
                  <div className="truncate font-mono text-[10px] text-neutral-400">{n.subtitle}</div>
                  <div className={`mt-0.5 font-mono text-[9px] font-medium uppercase tracking-wider ${statusColor}`}>
                    {statusText}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Real-time Execution Output Terminal */}
      <div className="border-t border-neutral-800/80 bg-neutral-950 px-4 py-3 font-mono text-xs text-neutral-300">
        <div className="mb-2 flex items-center justify-between text-neutral-500">
          <span className="text-[11px] uppercase tracking-wider">WebSocket Event Stream</span>
          <span>NestJS DAG Worker</span>
        </div>
        <div className="min-h-[56px] space-y-1">
          {logs.length === 0 ? (
            <div className="text-neutral-500 italic">Click &quot;Run Workflow&quot; above to watch real-time data packets stream from output to input.</div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="leading-relaxed">
                <span className="text-orange-400">›</span> {log}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   AUTHENTIC REAL NODES (The actual ones in GoFlow backend)
   ───────────────────────────────────────────────────────────── */
interface NodeDetail {
  icon: LucideIcon
  name: string
  tag: string
  description: string
  endpoint: string
}

const REAL_NODES: NodeDetail[] = [
  {
    icon: Webhook,
    name: 'Webhook Trigger',
    tag: 'Trigger',
    description: 'Listen for external events with custom endpoints and HMAC signature verification.',
    endpoint: 'POST /workflows/:id/webhook',
  },
  {
    icon: Globe,
    name: 'HTTP Request',
    tag: 'Network',
    description: 'Execute REST requests (GET, POST, PUT, DELETE) with custom headers, query params, and body.',
    endpoint: 'axios / fetch',
  },
  {
    icon: Network,
    name: 'Switch Condition',
    tag: 'Logic',
    description: 'Evaluate JavaScript conditions dynamically. Automatically skips unchosen branches to optimize execution.',
    endpoint: 'Branch Pruning',
  },
  {
    icon: Bot,
    name: 'AI Agent Node',
    tag: 'AI',
    description: 'Run LLM reasoning chains with Google Gemini or OpenAI using context from upstream node outputs.',
    endpoint: 'Gemini / OpenAI API',
  },
  {
    icon: Hash,
    name: 'Slack Message',
    tag: 'Integration',
    description: 'Post automated notifications, error alerts, and payload summaries directly to your Slack channels.',
    endpoint: 'Slack Webhook / Bot API',
  },
  {
    icon: Send,
    name: 'Discord Webhook',
    tag: 'Integration',
    description: 'Broadcast updates and embedded alerts directly into Discord server channels.',
    endpoint: 'Discord Webhook API',
  },
  {
    icon: Code,
    name: 'Custom JavaScript',
    tag: 'Transform',
    description: 'Execute custom JavaScript functions to parse, transform, filter, and format incoming data payloads.',
    endpoint: 'V8 Sandbox',
  },
  {
    icon: Clock,
    name: 'Schedule Trigger',
    tag: 'Trigger',
    description: 'Automate periodic executions on recurring cron intervals without external cron servers.',
    endpoint: 'Interval / Cron',
  },
]

/* ─────────────────────────────────────────────────────────────
   MAIN HIGH-CONVERTING LANDING PAGE
   ───────────────────────────────────────────────────────────── */
export default function Page() {
  const [copied, setCopied] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const ctx = gsap.context(() => {
      gsap.from('.fade-up', {
        y: 24,
        opacity: 0,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power2.out',
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  const copyDockerCmd = () => {
    navigator.clipboard.writeText('docker run -p 3000:3000 -p 8080:8080 ghcr.io/pragyann007/goflow:latest')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div ref={heroRef} className="relative min-h-screen bg-[#09090b] text-neutral-100 antialiased selection:bg-orange-500/20 selection:text-orange-300">
      {/* 3D Ambient Canvas */}
      <AmbientBackground />

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-neutral-800/80 bg-[#09090b]/80 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Logo - Plain text as requested: "Goflow" */}
          <a href="#top" className="text-xl font-bold tracking-tight text-white transition hover:text-orange-400">
            Goflow
          </a>

          {/* Links */}
          <div className="hidden items-center gap-6 text-sm text-neutral-300 sm:flex">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#nodes" className="transition hover:text-white">Nodes</a>
            <a href="#how-it-works" className="transition hover:text-white">How it works</a>
            <a href={GITHUB} target="_blank" rel="noreferrer" className="flex items-center gap-1 transition hover:text-white">
              GitHub <ArrowUpRight className="size-3.5" />
            </a>
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            <a
              href={LOGIN_HREF}
              className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-neutral-300 transition hover:text-white"
            >
              Sign in
            </a>
            <a
              href={REGISTER_HREF}
              className="rounded-lg bg-orange-600 px-4 py-1.5 text-sm font-semibold text-white shadow-md shadow-orange-600/20 transition hover:bg-orange-500"
            >
              Get Started
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 sm:pt-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          {/* Honest Status Badge */}
          <div className="fade-up inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-medium text-orange-400">
            <span className="size-1.5 rounded-full bg-orange-500" />
            Open-Source Workflow Automation · NestJS + Next.js + React Flow
          </div>

          {/* Main Hero Title */}
          <h1 className="fade-up mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Automate workflows visually.{' '}
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              Execute with zero delay.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="fade-up mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-400 sm:text-lg">
            Connect webhooks, logic gates, AI models, and communication channels on an interactive canvas. GoFlow runs your DAG pipeline in deterministic order and streams live execution status over WebSockets.
          </p>

          {/* Primary CTA Buttons */}
          <div className="fade-up mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a
              href={REGISTER_HREF}
              className="flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-600/30 transition hover:bg-orange-500 hover:scale-[1.02]"
            >
              Start Free Today <ArrowRight className="size-4" />
            </a>
            <a
              href={GITHUB}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-900 px-6 py-3 text-sm font-semibold text-neutral-200 transition hover:border-neutral-600 hover:bg-neutral-800"
            >
              Star on GitHub <ArrowUpRight className="size-4" />
            </a>
          </div>

          {/* Quickstart Command */}
          <div className="fade-up mx-auto mt-6 flex max-w-md items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 font-mono text-xs text-neutral-400">
            <span className="truncate">docker run -p 3000:3000 -p 8080:8080 goflow</span>
            <button
              onClick={copyDockerCmd}
              className="ml-2 flex items-center gap-1 rounded px-2 py-1 text-neutral-300 transition hover:bg-neutral-800"
            >
              {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Live Interactive Canvas Preview */}
        <div className="fade-up mx-auto mt-14 max-w-5xl px-4 pb-20 sm:px-6">
          <InteractiveFlowCanvas />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t border-neutral-800/80 bg-neutral-950/60 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-xl">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-orange-400">
              Core Capabilities
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Engineered for reliability, not buzzwords.
            </h2>
            <p className="mt-3 text-neutral-400">
              GoFlow provides the exact primitives you need to orchestrate complex logic without black boxes.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Radio,
                title: 'WebSocket Live Streaming',
                desc: 'Node transitions (Running, Completed, Skipped, Failed) stream directly to your frontend canvas in real-time over Socket.IO.',
              },
              {
                icon: Network,
                title: 'Topological DAG Sort',
                desc: 'Nodes execute strictly based on resolved parent dependencies. Circular dependencies are rejected before execution starts.',
              },
              {
                icon: ShieldAlert,
                title: 'Branch Pruning',
                desc: 'When a switch condition evaluates to true, the false branch (and all its children) are automatically marked as SKIPPED to save runtime.',
              },
              {
                icon: Bot,
                title: 'AI Agent Nodes',
                desc: 'Prompt OpenAI or Google Gemini directly inside your pipeline. Inject previous node outputs into the prompt with dynamic templating.',
              },
              {
                icon: Webhook,
                title: 'Signed Webhooks',
                desc: 'Trigger workflows via signed POST requests. Authenticate incoming requests and map payloads to downstream node inputs.',
              },
              {
                icon: Zap,
                title: 'Self-Hostable Architecture',
                desc: 'Runs on standard PostgreSQL, Redis, NestJS, and Next.js. Full control of your data with zero vendor lock-in.',
              },
            ].map((f, i) => {
              const Icon = f.icon
              return (
                <div
                  key={i}
                  className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 transition hover:border-orange-500/40 hover:bg-neutral-900/80"
                >
                  <div className="grid size-10 place-items-center rounded-lg bg-orange-500/10 text-orange-400">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Nodes Section */}
      <section id="nodes" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-orange-400">
                Node Library
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready-to-use workflow nodes
              </h2>
            </div>
            <p className="max-w-md text-sm text-neutral-400">
              Every node provides configurable inputs, outputs, and validation for deterministic execution.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {REAL_NODES.map((n) => {
              const Icon = n.icon
              return (
                <div
                  key={n.name}
                  className="flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-950 p-5 transition hover:border-orange-500/40 hover:bg-neutral-900/60"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="grid size-8 place-items-center rounded-md bg-orange-500/10 text-orange-400">
                        <Icon className="size-4" />
                      </div>
                      <span className="rounded bg-neutral-800 px-2 py-0.5 font-mono text-[10px] text-neutral-300">
                        {n.tag}
                      </span>
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-white">{n.name}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-neutral-400">{n.description}</p>
                  </div>
                  <div className="mt-4 border-t border-neutral-800/80 pt-2.5 font-mono text-[10px] text-neutral-500 truncate">
                    {n.endpoint}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="border-t border-neutral-800/80 bg-neutral-950/40 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-orange-400">
              Workflow Lifecycle
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              From visual design to live execution
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Design on Canvas',
                desc: 'Add triggers, condition switches, and AI agents. Connect handles on an interactive React Flow canvas with custom edge routes.',
              },
              {
                step: '02',
                title: 'Map Data & Logic',
                desc: 'Pass upstream outputs to downstream inputs. Configure HTTP headers, AI prompt templates, and Slack channel hooks.',
              },
              {
                step: '03',
                title: 'Execute & Observe',
                desc: 'Dispatch via Webhook or manual run. Watch node progress update live over WebSockets with granular logs and error handling.',
              },
            ].map((s) => (
              <div key={s.step} className="relative rounded-xl border border-neutral-800 bg-neutral-900/60 p-6">
                <span className="font-mono text-2xl font-bold text-orange-500">{s.step}</span>
                <h3 className="mt-3 text-base font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="rounded-2xl border border-orange-500/30 bg-gradient-to-b from-orange-500/10 via-neutral-950 to-neutral-950 p-8 sm:p-12">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Build your first workflow in minutes
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-neutral-400">
              Create an account or deploy the container to your own server. Fully open-source and MIT licensed.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href={REGISTER_HREF}
                className="flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-orange-500"
              >
                Create Free Account <ArrowRight className="size-4" />
              </a>
              <a
                href={LOGIN_HREF}
                className="rounded-xl border border-neutral-700 bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-neutral-200 transition hover:bg-neutral-800"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs text-neutral-400 sm:flex-row sm:px-6">
          <div className="flex items-center gap-4">
            <span className="text-base font-bold text-white">Goflow</span>
            <span>·</span>
            <span>Open-source visual workflow automation</span>
          </div>

          <div className="flex items-center gap-6">
            <a href={LOGIN_HREF} className="hover:text-white">Sign In</a>
            <a href={REGISTER_HREF} className="hover:text-white">Sign Up</a>
            <a href={GITHUB} target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a>
          </div>

          <div className="font-mono">
            Created by{' '}
            <a
              href="https://www.instagram.com/not_pragyann/"
              target="_blank"
              rel="noreferrer"
              className="text-orange-400 hover:underline"
            >
              Pragyan Thapaliya
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
