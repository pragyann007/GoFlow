'use client'

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  CheckCircle2,
  Clock,
  Code,
  Copy,
  Cpu,
  ExternalLink,
  GitBranch,
  GitPullRequest,
  Globe,
  Hash,
  Layers,
  LoaderCircle,
  Network,
  Play,
  Radio,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Terminal,
  Webhook,
  Zap,
  Sliders,
  ChevronRight,
  Maximize2,
  Bell,
  Box,
  Flame,
  type LucideIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// Register GSAP plugins safely on client
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

const GITHUB = 'https://github.com/pragyann007/GoFlow'
const LOGIN_HREF = '/auth/login'
const REGISTER_HREF = '/auth/register'

/* ─────────────────────────────────────────────────────────────
   THREE.JS 3D WORKFLOW CONSTELLATION BACKGROUND
   Interactive 3D network: nodes, glowing Bezier curves,
   floating data pulses, responsive particle dust & mouse tilt
   ───────────────────────────────────────────────────────────── */
function ThreeWorkflowBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    // Scene & Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000)
    camera.position.set(0, 0, 24)

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(container.clientWidth, container.clientHeight, false)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Root interactive group
    const rootGroup = new THREE.Group()
    scene.add(rootGroup)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const amberLight = new THREE.PointLight(0xf59e0b, 2.5, 50)
    amberLight.position.set(10, 10, 10)
    scene.add(amberLight)

    const cyanLight = new THREE.PointLight(0x06b6d4, 2, 50)
    cyanLight.position.set(-10, -8, 8)
    scene.add(cyanLight)

    // 1. Constellation Star Dust
    const particleCount = 180
    const particleGeo = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleColors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 36
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 22
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 16

      // Golden amber to subtle cyan
      if (Math.random() > 0.4) {
        particleColors[i * 3] = 0.96 // R
        particleColors[i * 3 + 1] = 0.62 // G
        particleColors[i * 3 + 2] = 0.04 // B
      } else {
        particleColors[i * 3] = 0.2 // R
        particleColors[i * 3 + 1] = 0.7 // G
        particleColors[i * 3 + 2] = 0.9 // B
      }
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    })
    const particlePoints = new THREE.Points(particleGeo, particleMat)
    rootGroup.add(particlePoints)

    // 2. 3D DAG Nodes & Curves
    interface NetworkNode {
      pos: THREE.Vector3
      name: string
      color: number
      size: number
    }

    const networkNodes: NetworkNode[] = [
      { pos: new THREE.Vector3(-8.5, 2.2, 0), name: 'Webhook', color: 0xf59e0b, size: 0.7 },
      { pos: new THREE.Vector3(-3.2, 4.0, 1.2), name: 'Switch', color: 0x3b82f6, size: 0.6 },
      { pos: new THREE.Vector3(-2.8, -2.5, -0.8), name: 'HTTP Client', color: 0x10b981, size: 0.6 },
      { pos: new THREE.Vector3(2.5, 2.8, 1.5), name: 'AI Agent', color: 0xec4899, size: 0.75 },
      { pos: new THREE.Vector3(3.0, -2.2, -0.5), name: 'Code Script', color: 0x8b5cf6, size: 0.6 },
      { pos: new THREE.Vector3(8.0, 1.5, 0.5), name: 'Slack Hook', color: 0x14b8a6, size: 0.65 },
      { pos: new THREE.Vector3(7.5, -3.2, -1.0), name: 'Database', color: 0xf97316, size: 0.6 },
    ]

    const nodeMeshes: THREE.Mesh[] = []
    const rings: THREE.Mesh[] = []

    const sphereGeo = new THREE.SphereGeometry(1, 24, 24)
    const ringGeo = new THREE.RingGeometry(1.25, 1.38, 32)

    networkNodes.forEach((node) => {
      // Core sphere
      const sphereMat = new THREE.MeshStandardMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8,
      })
      const mesh = new THREE.Mesh(sphereGeo, sphereMat)
      mesh.position.copy(node.pos)
      mesh.scale.setScalar(node.size)
      rootGroup.add(mesh)
      nodeMeshes.push(mesh)

      // Orbiting halo ring
      const ringMat = new THREE.MeshBasicMaterial({
        color: node.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.position.copy(node.pos)
      ring.scale.setScalar(node.size)
      ring.rotation.x = Math.PI / 3
      ring.rotation.y = Math.random() * Math.PI
      rootGroup.add(ring)
      rings.push(ring)
    })

    // 3. Curved Edges connecting DAG nodes
    const edgeConnections: [number, number][] = [
      [0, 1], // Webhook -> Switch
      [0, 2], // Webhook -> HTTP
      [1, 3], // Switch -> AI Agent
      [2, 4], // HTTP -> Code Script
      [3, 5], // AI Agent -> Slack
      [4, 6], // Code -> Database
      [1, 4], // Switch -> Code
    ]

    const curves: THREE.QuadraticBezierCurve3[] = []
    const lineObjects: THREE.Line[] = []

    edgeConnections.forEach(([startIdx, endIdx]) => {
      const p1 = networkNodes[startIdx].pos
      const p2 = networkNodes[endIdx].pos
      // Midpoint pulled up or down for organic 3D curve
      const mid = new THREE.Vector3()
        .addVectors(p1, p2)
        .multiplyScalar(0.5)
        .add(new THREE.Vector3(0, (Math.random() - 0.3) * 1.8, 1.2))

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2)
      curves.push(curve)

      const points = curve.getPoints(36)
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x475569,
        transparent: true,
        opacity: 0.4,
      })
      const line = new THREE.Line(lineGeo, lineMat)
      rootGroup.add(line)
      lineObjects.push(line)
    })

    // 4. Flowing Data Packets (pulsing along curves)
    const packetCount = curves.length * 2
    const packetGeo = new THREE.SphereGeometry(0.18, 12, 12)
    const packetMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.95,
    })

    interface Packet {
      mesh: THREE.Mesh
      curveIdx: number
      t: number
      speed: number
    }

    const packets: Packet[] = []
    for (let i = 0; i < packetCount; i++) {
      const pMesh = new THREE.Mesh(packetGeo, packetMat)
      const curveIdx = i % curves.length
      const initialT = (i * 0.5) % 1
      const initialPos = curves[curveIdx].getPoint(initialT)
      pMesh.position.copy(initialPos)
      rootGroup.add(pMesh)
      packets.push({
        mesh: pMesh,
        curveIdx,
        t: initialT,
        speed: 0.003 + Math.random() * 0.002,
      })
    }

    // Interactive mouse parallax
    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      targetX = x * 0.35
      targetY = y * 0.25
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    // Resize handling via ResizeObserver
    const handleResize = () => {
      if (!container || !renderer || !camera) return
      const w = container.clientWidth
      const h = container.clientHeight
      if (w === 0 || h === 0) return
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }

    const resizeObserver = new ResizeObserver(() => handleResize())
    resizeObserver.observe(container)

    // Render loop
    let reqId = 0
    let clock = 0

    const animate = () => {
      reqId = requestAnimationFrame(animate)
      clock += 0.01

      // Mouse lerp
      mouseX += (targetX - mouseX) * 0.04
      mouseY += (targetY - mouseY) * 0.04

      rootGroup.rotation.y = mouseX + Math.sin(clock * 0.15) * 0.08
      rootGroup.rotation.x = -mouseY + Math.cos(clock * 0.15) * 0.05

      // Star dust slow float
      particlePoints.rotation.y += 0.0006
      particlePoints.rotation.x = Math.sin(clock * 0.2) * 0.05

      // Node breathing & ring rotations
      nodeMeshes.forEach((mesh, idx) => {
        const offset = idx * 0.6
        const scale = networkNodes[idx].size * (1 + Math.sin(clock * 1.5 + offset) * 0.08)
        mesh.scale.setScalar(scale)
      })

      rings.forEach((ring, idx) => {
        ring.rotation.z += 0.015 * (idx % 2 === 0 ? 1 : -1)
      })

      // Move data packets along Bezier curves
      packets.forEach((pkt) => {
        pkt.t += pkt.speed
        if (pkt.t > 1) pkt.t = 0
        const pt = curves[pkt.curveIdx].getPoint(pkt.t)
        pkt.mesh.position.copy(pt)
        // subtle pulse scale
        const pScale = 1 + Math.sin(pkt.t * Math.PI) * 0.5
        pkt.mesh.scale.setScalar(pScale)
      })

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(reqId)
      window.removeEventListener('mousemove', handleMouseMove)
      resizeObserver.disconnect()

      // Cleanup GPU resources
      particleGeo.dispose()
      particleMat.dispose()
      sphereGeo.dispose()
      ringGeo.dispose()
      packetGeo.dispose()
      packetMat.dispose()
      lineObjects.forEach((line) => {
        line.geometry.dispose()
        ;(line.material as THREE.Material).dispose()
      })
      nodeMeshes.forEach((m) => (m.material as THREE.Material).dispose())
      rings.forEach((r) => (r.material as THREE.Material).dispose())
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="h-full w-full opacity-60 transition-opacity duration-1000" />
      {/* Radial fade mask */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--background)_80%)]" />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE LIVE WORKFLOW SIMULATOR
   Clickable nodes, branch pruning animation, live execution logs
   ───────────────────────────────────────────────────────────── */
interface SimNode {
  id: string
  label: string
  icon: LucideIcon
  type: string
  x: number
  y: number
  status: 'idle' | 'running' | 'success' | 'pruned'
  duration?: string
  payload?: string
}

interface Scenario {
  name: string
  desc: string
  nodes: SimNode[]
  edges: { from: string; to: string; path: string; condition?: string; pruned?: boolean }[]
  logs: { time: string; level: 'info' | 'warn' | 'success'; text: string }[]
}

const SCENARIOS: Scenario[] = [
  {
    name: 'E-Commerce Fraud Guard',
    desc: 'Signed Webhook → Switch conditional filter → AI Risk Analyzer → Slack Alert',
    nodes: [
      { id: 'n1', label: 'Webhook Trigger', icon: Webhook, type: 'Trigger', x: 40, y: 140, status: 'idle', duration: '3ms', payload: 'POST /v1/orders' },
      { id: 'n2', label: 'Switch Condition', icon: Network, type: 'Router', x: 260, y: 140, status: 'idle', duration: '1ms', payload: 'total > $250' },
      { id: 'n3', label: 'AI Risk Analyzer', icon: Bot, type: 'LLM Agent', x: 490, y: 60, status: 'idle', duration: '280ms', payload: 'Risk Score: 0.94' },
      { id: 'n4', label: 'Auto-Approve', icon: CheckCircle2, type: 'Action', x: 490, y: 220, status: 'idle', duration: '0ms', payload: 'Pruned branch' },
      { id: 'n5', label: 'Slack Alert', icon: Hash, type: 'Notify', x: 720, y: 60, status: 'idle', duration: '45ms', payload: '#fraud-ops pinged' },
    ],
    edges: [
      { from: 'n1', to: 'n2', path: 'M 190 170 C 225 170, 225 170, 260 170' },
      { from: 'n2', to: 'n3', path: 'M 410 170 C 445 170, 445 90, 490 90', condition: 'true' },
      { from: 'n2', to: 'n4', path: 'M 410 170 C 445 170, 445 250, 490 250', condition: 'false', pruned: true },
      { from: 'n3', to: 'n5', path: 'M 640 90 C 680 90, 680 90, 720 90' },
    ],
    logs: [
      { time: '14:22:01.102', level: 'info', text: 'Incoming signed webhook received [order_id: ord_9841]' },
      { time: '14:22:01.105', level: 'info', text: 'Topological sorter resolved execution graph: [n1 → n2 → (n3, n4) → n5]' },
      { time: '14:22:01.107', level: 'info', text: 'Condition matched: total ($489.00) > $250.00. Branching to AI Risk Analyzer.' },
      { time: '14:22:01.108', level: 'warn', text: 'Branch pruning applied: "Auto-Approve" node skipped to save execution cycles.' },
      { time: '14:22:01.388', level: 'success', text: 'AI Agent completed analysis: "High probability velocity spike from anonymous proxy".' },
      { time: '14:22:01.433', level: 'success', text: 'Workflow completed in 331ms. Payload delivered to #fraud-ops.' },
    ],
  },
  {
    name: 'GitHub Webhook & Discord Sync',
    desc: 'PR Merged event → TypeScript Code transform → Multi-channel notification',
    nodes: [
      { id: 'n1', label: 'GitHub Webhook', icon: Globe, type: 'Trigger', x: 40, y: 140, status: 'idle', duration: '2ms', payload: 'pull_request.closed' },
      { id: 'n2', label: 'Transform JS', icon: Code, type: 'Script', x: 260, y: 140, status: 'idle', duration: '4ms', payload: 'formatDiscordEmbed()' },
      { id: 'n3', label: 'Discord Bot', icon: Bell, type: 'Notify', x: 490, y: 60, status: 'idle', duration: '32ms', payload: 'Sent #changelog' },
      { id: 'n4', label: 'Deploy Webhook', icon: Zap, type: 'HTTP', x: 490, y: 220, status: 'idle', duration: '18ms', payload: 'Triggered preview' },
      { id: 'n5', label: 'Audit Log', icon: ShieldCheck, type: 'Database', x: 720, y: 140, status: 'idle', duration: '12ms', payload: 'Saved DB row' },
    ],
    edges: [
      { from: 'n1', to: 'n2', path: 'M 190 170 C 225 170, 225 170, 260 170' },
      { from: 'n2', to: 'n3', path: 'M 410 170 C 445 170, 445 90, 490 90' },
      { from: 'n2', to: 'n4', path: 'M 410 170 C 445 170, 445 250, 490 250' },
      { from: 'n3', to: 'n5', path: 'M 640 90 C 680 90, 680 170, 720 170' },
      { from: 'n4', to: 'n5', path: 'M 640 250 C 680 250, 680 170, 720 170' },
    ],
    logs: [
      { time: '17:40:12.001', level: 'info', text: 'GitHub HMAC SHA-256 signature verified.' },
      { time: '17:40:12.005', level: 'info', text: 'Code transform executed in V8 isolate (0ms cold start).' },
      { time: '17:40:12.037', level: 'success', text: 'Discord release broadcast dispatched to 1,240 subscribers.' },
      { time: '17:40:12.055', level: 'success', text: 'Cloud preview environment deployment triggered.' },
      { time: '17:40:12.067', level: 'success', text: 'Immutable audit entry committed with txId: tx_77341b.' },
    ],
  },
]

function InteractiveWorkflowSimulator() {
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [nodeStates, setNodeStates] = useState<Record<string, 'idle' | 'running' | 'success' | 'pruned'>>({})
  const [activeEdgeIdx, setActiveEdgeIdx] = useState<number>(-1)
  const [visibleLogs, setVisibleLogs] = useState<number>(0)
  const [selectedNodeId, setSelectedNodeId] = useState<string>('n1')

  const scenario = SCENARIOS[selectedScenarioIdx]

  // Reset states on scenario change
  useEffect(() => {
    const initial: Record<string, 'idle' | 'running' | 'success' | 'pruned'> = {}
    scenario.nodes.forEach((n) => {
      initial[n.id] = 'idle'
    })
    setNodeStates(initial)
    setIsRunning(false)
    setActiveEdgeIdx(-1)
    setVisibleLogs(0)
    setSelectedNodeId(scenario.nodes[0].id)
  }, [selectedScenarioIdx, scenario])

  const runSimulation = useCallback(() => {
    if (isRunning) return
    setIsRunning(true)
    setVisibleLogs(0)

    const initial: Record<string, 'idle' | 'running' | 'success' | 'pruned'> = {}
    scenario.nodes.forEach((n) => {
      initial[n.id] = 'idle'
    })
    setNodeStates(initial)

    // Step 1: Trigger
    setTimeout(() => {
      setNodeStates((prev) => ({ ...prev, [scenario.nodes[0].id]: 'running' }))
      setVisibleLogs(1)
    }, 200)

    setTimeout(() => {
      setNodeStates((prev) => ({ ...prev, [scenario.nodes[0].id]: 'success' }))
      setActiveEdgeIdx(0)
      setVisibleLogs(2)
    }, 800)

    // Step 2: Switch / Second Node
    setTimeout(() => {
      setNodeStates((prev) => ({ ...prev, [scenario.nodes[1].id]: 'running' }))
    }, 1300)

    setTimeout(() => {
      setNodeStates((prev) => ({ ...prev, [scenario.nodes[1].id]: 'success' }))
      setActiveEdgeIdx(1)
      setVisibleLogs(3)
    }, 1900)

    // Step 3: Branching / Pruning
    setTimeout(() => {
      if (scenario.nodes[3]) {
        if (selectedScenarioIdx === 0) {
          // In fraud guard: n3 runs, n4 is pruned
          setNodeStates((prev) => ({
            ...prev,
            [scenario.nodes[2].id]: 'running',
            [scenario.nodes[3].id]: 'pruned',
          }))
          setVisibleLogs(4)
        } else {
          // Concurrent branch execution
          setNodeStates((prev) => ({
            ...prev,
            [scenario.nodes[2].id]: 'running',
            [scenario.nodes[3].id]: 'running',
          }))
          setVisibleLogs(4)
        }
      }
    }, 2400)

    // Step 4: Downstream completion
    setTimeout(() => {
      setNodeStates((prev) => ({
        ...prev,
        [scenario.nodes[2].id]: 'success',
        ...(scenario.nodes[3]?.id ? { [scenario.nodes[3].id]: selectedScenarioIdx === 0 ? 'pruned' : 'success' } : {}),
      }))
      setActiveEdgeIdx(2)
      setVisibleLogs(5)
    }, 3200)

    // Step 5: Final output node
    setTimeout(() => {
      if (scenario.nodes[4]) {
        setNodeStates((prev) => ({ ...prev, [scenario.nodes[4].id]: 'running' }))
      }
    }, 3600)

    setTimeout(() => {
      if (scenario.nodes[4]) {
        setNodeStates((prev) => ({ ...prev, [scenario.nodes[4].id]: 'success' }))
      }
      setIsRunning(false)
      setActiveEdgeIdx(-1)
      setVisibleLogs(scenario.logs.length)
    }, 4200)
  }, [isRunning, scenario, selectedScenarioIdx])

  const selectedNode = scenario.nodes.find((n) => n.id === selectedNodeId) || scenario.nodes[0]

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/90 shadow-2xl backdrop-blur-xl transition-all duration-300">
      {/* Top Workspace Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/30 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-hidden>
            <span className="size-3 rounded-full bg-red-500/80" />
            <span className="size-3 rounded-full bg-yellow-500/80" />
            <span className="size-3 rounded-full bg-green-500/80" />
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span className="text-primary">workflow:</span>
            <span className="font-semibold text-foreground">{scenario.name}</span>
          </div>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="flex items-center gap-1.5">
          {SCENARIOS.map((sc, i) => (
            <button
              key={sc.name}
              onClick={() => setSelectedScenarioIdx(i)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                selectedScenarioIdx === i
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {sc.name.split(' ')[0]}
            </button>
          ))}
          <Button
            size="sm"
            onClick={runSimulation}
            disabled={isRunning}
            className="ml-2 gap-1.5 bg-primary text-xs font-medium text-primary-foreground shadow-md transition-all hover:scale-[1.02]"
          >
            {isRunning ? (
              <>
                <LoaderCircle className="size-3.5 animate-spin" /> Executing DAG...
              </>
            ) : (
              <>
                <Play className="size-3.5 fill-current" /> Run Live Sim
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="relative min-h-[380px] w-full overflow-x-auto bg-[color-mix(in_oklab,var(--background)_40%,black)] p-4 sm:p-6">
        {/* Subtle dot matrix grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        <svg viewBox="0 0 920 320" className="relative h-auto w-full min-w-[760px] select-none" role="img">
          {/* Connecting SVG Edges */}
          {scenario.edges.map((edge, idx) => {
            const isPruned = nodeStates[edge.to] === 'pruned'
            const isActive = activeEdgeIdx === idx
            return (
              <g key={`${edge.from}-${edge.to}`}>
                <path
                  d={edge.path}
                  fill="none"
                  stroke={isPruned ? 'oklch(0.35 0 0)' : 'var(--border)'}
                  strokeWidth={isPruned ? 1.5 : 2}
                  strokeDasharray={isPruned ? '4 4' : undefined}
                  className="transition-colors duration-300"
                />
                {isActive && (
                  <path
                    d={edge.path}
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeDasharray="16 120"
                    className="animate-[dash_1s_linear_infinite]"
                  />
                )}
                {edge.condition && (
                  <text
                    x={440}
                    y={edge.condition === 'true' ? 120 : 220}
                    fill={edge.condition === 'true' ? '#10b981' : '#94a3b8'}
                    fontSize={10}
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    [{edge.condition}]
                  </text>
                )}
              </g>
            )
          })}

          {/* Render Interactive Nodes */}
          {scenario.nodes.map((n) => {
            const state = nodeStates[n.id] || 'idle'
            const isSelected = selectedNodeId === n.id
            const Icon = n.icon

            let borderColor = 'var(--border)'
            let bgColor = 'var(--card)'
            let glow = 'none'

            if (state === 'running') {
              borderColor = 'var(--primary)'
              glow = 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.4))'
            } else if (state === 'success') {
              borderColor = '#10b981'
              glow = 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.3))'
            } else if (state === 'pruned') {
              borderColor = 'oklch(0.3 0 0)'
              bgColor = 'oklch(0.18 0 0)'
            }

            return (
              <g
                key={n.id}
                transform={`translate(${n.x}, ${n.y})`}
                onClick={() => setSelectedNodeId(n.id)}
                className="cursor-pointer transition-all duration-300 hover:opacity-90"
                style={{ filter: glow }}
              >
                {/* Node Box */}
                <rect
                  width={150}
                  height={62}
                  rx={10}
                  fill={bgColor}
                  stroke={isSelected ? 'var(--primary)' : borderColor}
                  strokeWidth={isSelected ? 2 : 1.5}
                  className="transition-all duration-300"
                />

                {/* Left Accent Icon Pill */}
                <rect x={8} y={8} width={46} height={46} rx={8} fill="var(--muted)" />
                <foreignObject x={18} y={18} width={26} height={26}>
                  <Icon
                    className={`size-6 ${
                      state === 'pruned'
                        ? 'text-muted-foreground/40'
                        : state === 'success'
                        ? 'text-emerald-400'
                        : state === 'running'
                        ? 'animate-pulse text-primary'
                        : 'text-primary'
                    }`}
                  />
                </foreignObject>

                {/* Labels */}
                <text x={62} y={26} fill="var(--foreground)" fontSize={11} fontWeight={600} fontFamily="Inter, sans-serif">
                  {n.label}
                </text>
                <text x={62} y={42} fill="var(--muted-foreground)" fontSize={9.5} fontFamily="monospace">
                  {n.type}
                </text>

                {/* Status Indicator */}
                {state === 'running' && (
                  <foreignObject x={126} y={8} width={16} height={16}>
                    <LoaderCircle className="size-4 animate-spin text-primary" />
                  </foreignObject>
                )}
                {state === 'success' && (
                  <foreignObject x={126} y={8} width={16} height={16}>
                    <CheckCircle2 className="size-4 text-emerald-400" />
                  </foreignObject>
                )}
                {state === 'pruned' && (
                  <text x={118} y={48} fill="#64748b" fontSize={8} fontFamily="monospace">
                    PRUNED
                  </text>
                )}

                {/* Handles */}
                <circle cx={0} cy={31} r={3} fill="var(--primary)" stroke="var(--card)" strokeWidth={1.5} />
                <circle cx={150} cy={31} r={3} fill="var(--primary)" stroke="var(--card)" strokeWidth={1.5} />
              </g>
            )
          })}
        </svg>

        {/* Floating Quick Node Inspector Card */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/50 bg-card/60 p-3.5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <selectedNode.icon className="size-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">{selectedNode.label}</span>
                <Badge variant="outline" className="text-[10px] uppercase">
                  {selectedNode.type}
                </Badge>
              </div>
              <p className="font-mono text-[11px] text-muted-foreground">{selectedNode.payload}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
            <div>
              <span>Latency: </span>
              <span className="font-semibold text-foreground">{selectedNode.duration}</span>
            </div>
            <div>
              <span>Status: </span>
              <span
                className={`font-semibold capitalize ${
                  nodeStates[selectedNode.id] === 'success'
                    ? 'text-emerald-400'
                    : nodeStates[selectedNode.id] === 'running'
                    ? 'text-primary'
                    : nodeStates[selectedNode.id] === 'pruned'
                    ? 'text-slate-500'
                    : 'text-muted-foreground'
                }`}
              >
                {nodeStates[selectedNode.id] || 'idle'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Streaming WebSocket Execution Console */}
      <div className="border-t border-border/70 bg-black/60 p-4 font-mono text-xs">
        <div className="mb-2 flex items-center justify-between text-muted-foreground">
          <div className="flex items-center gap-2">
            <Radio className="size-3.5 animate-pulse text-emerald-400" />
            <span className="text-[11px] uppercase tracking-wider text-emerald-400">ws://live-stream:8080/runs</span>
          </div>
          <span className="text-[10px] text-muted-foreground">GoFlow Engine v1.2 · Deterministic DAG</span>
        </div>

        <div className="space-y-1.5 overflow-hidden">
          {scenario.logs.slice(0, visibleLogs || 2).map((log, i) => (
            <div key={i} className="flex items-start gap-2.5 leading-relaxed">
              <span className="shrink-0 text-muted-foreground/60">{log.time}</span>
              <span
                className={`shrink-0 font-bold uppercase ${
                  log.level === 'warn'
                    ? 'text-yellow-400'
                    : log.level === 'success'
                    ? 'text-emerald-400'
                    : 'text-blue-400'
                }`}
              >
                [{log.level}]
              </span>
              <span className="text-foreground/90">{log.text}</span>
            </div>
          ))}
          {visibleLogs === 0 && (
            <div className="text-muted-foreground/60 italic">
              Ready. Click &quot;Run Live Sim&quot; above to watch real-time topological node execution.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   INTERACTIVE CODE & CLI QUICKSTART TABS
   cURL dispatch, TypeScript SDK, Docker Compose
   ───────────────────────────────────────────────────────────── */
function CodeQuickstartTabs() {
  const [activeTab, setActiveTab] = useState<'curl' | 'ts' | 'docker'>('curl')
  const [copied, setCopied] = useState(false)

  const codeSnippets = {
    curl: `# Trigger any GoFlow workflow with an authenticated webhook
curl -X POST https://api.goflow.run/v1/workflows/wf_982b1/dispatch \\
  -H "Authorization: Bearer gf_live_92019401" \\
  -H "X-GoFlow-Signature: sha256=4f9b201a..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "event": "user.signup",
    "user_id": "usr_4402",
    "tier": "enterprise",
    "metadata": { "region": "us-east", "seats": 20 }
  }'`,
    ts: `import { GoFlowClient } from '@goflow/sdk'

const goflow = new GoFlowClient({
  apiKey: process.env.GOFLOW_API_KEY!,
  endpoint: 'https://api.goflow.run'
})

// Dispatch workflow and await deterministic DAG execution
const execution = await goflow.dispatch('wf_fraud_filter', {
  payload: { transactionId: 'tx_981', amount: 450.00 },
  waitForCompletion: true,
  timeoutMs: 5000
})

console.log('Finished with status:', execution.status)
console.log('Pruned branches:', execution.prunedBranches)`,
    docker: `# Self-host GoFlow in 30 seconds with zero bloated queues
version: '3.8'
services:
  goflow-engine:
    image: ghcr.io/pragyann007/goflow:latest
    ports:
      - "8080:8080"
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://goflow:secret@db:5432/goflow
      - JWT_SECRET=super_secret_signing_key_32bytes
      - WEBSOCKET_PORT=8080
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=goflow
      - POSTGRES_PASSWORD=secret`,
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-2xl backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          {(['curl', 'ts', 'docker'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {tab === 'curl' ? 'cURL Webhook' : tab === 'ts' ? 'TypeScript SDK' : 'docker-compose.yml'}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <div className="relative p-5">
        <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-foreground/90">
          <code>{codeSnippets[activeTab]}</code>
        </pre>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────
   NODE MATRIX DATA
   ───────────────────────────────────────────────────────────── */
interface NodeItem {
  icon: LucideIcon
  name: string
  category: 'Triggers' | 'Logic' | 'AI & Transform' | 'Integrations'
  desc: string
  status: 'Ready' | 'Coming Soon'
  badgeColor?: string
}

const ALL_NODES: NodeItem[] = [
  { icon: Globe, name: 'HTTP Webhook', category: 'Triggers', desc: 'Signed HTTP POST listener with payload validation & HMAC verification.', status: 'Ready' },
  { icon: Clock, name: 'Schedule Cron', category: 'Triggers', desc: 'Trigger recurring executions with minute, hourly, or custom cron syntax.', status: 'Coming Soon' },
  { icon: Network, name: 'Switch Router', category: 'Logic', desc: 'Topological conditional brancher that prunes unselected paths.', status: 'Ready' },
  { icon: Code, name: 'Code Sandbox', category: 'AI & Transform', desc: 'Run zero-cold-start sandboxed JS/TS to transform state & schemas.', status: 'Coming Soon' },
  { icon: Bot, name: 'AI Reasoning Agent', category: 'AI & Transform', desc: 'Run prompt chains with OpenAI, Anthropic, or local Ollama models.', status: 'Ready' },
  { icon: Hash, name: 'Slack Dispatcher', category: 'Integrations', desc: 'Deliver rich markdown alerts, blocks, and channel pings.', status: 'Ready' },
  { icon: Bell, name: 'Multi-Channel Alert', category: 'Integrations', desc: 'Broadcast to Discord, Telegram, and SMTP email endpoints simultaneously.', status: 'Coming Soon' },
  { icon: ShieldCheck, name: 'HMAC Authenticator', category: 'Logic', desc: 'Verify secret headers before triggering heavy downstream nodes.', status: 'Ready' },
]

/* ─────────────────────────────────────────────────────────────
   MAIN LANDING PAGE EXPORT
   ───────────────────────────────────────────────────────────── */
export default function Page() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const heroRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  // GSAP Animations with useGSAP
  useGSAP(
    () => {
      // 1. Hero entrance timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.from('.hero-badge', { y: -20, opacity: 0, duration: 0.6 })
        .from('.hero-title-line', { y: 40, opacity: 0, stagger: 0.15, duration: 0.8 }, '-=0.3')
        .from('.hero-desc', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
        .from('.hero-cta-btn', { scale: 0.9, opacity: 0, stagger: 0.1, duration: 0.5 }, '-=0.3')
        .from('.hero-preview-box', { y: 60, opacity: 0, duration: 1 }, '-=0.3')

      // 2. Stat kinetic counter reveal with ScrollTrigger
      if (statsRef.current) {
        gsap.from('.stat-card', {
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
          },
          y: 30,
          opacity: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power2.out',
        })
      }

      // 3. Features reveal with ScrollTrigger
      if (featuresRef.current) {
        gsap.from('.feature-card', {
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 80%',
          },
          y: 40,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power2.out',
        })
      }
    },
    { scope: heroRef }
  )

  const filteredNodes = useMemo(() => {
    if (selectedCategory === 'All') return ALL_NODES
    return ALL_NODES.filter((n) => n.category === selectedCategory)
  }, [selectedCategory])

  return (
    <main
      ref={heroRef}
      id="top"
      className="dark relative min-h-screen overflow-x-hidden bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary"
    >
      {/* 3D Interactive Three.js Background Canvas */}
      <ThreeWorkflowBackground />

      {/* Modern Frosted Header Navigation */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <a href="#top" className="group flex items-center gap-2.5 text-base font-bold tracking-tight">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-chart-2 text-primary-foreground shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6">
              <Network className="size-5" />
            </span>
            <div className="flex flex-col">
              <span className="leading-tight">GoFlow</span>
              <span className="font-mono text-[9px] font-normal uppercase tracking-widest text-primary">
                DAG Engine
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-1 rounded-full border border-border/60 bg-muted/30 p-1 md:flex">
            {[
              ['Simulator', '#simulator'],
              ['Engine', '#engine'],
              ['Nodes', '#nodes'],
              ['Architecture', '#architecture'],
              ['GitHub', GITHUB],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                className="rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="sm" asChild className="text-xs">
              <a href={LOGIN_HREF}>Log in</a>
            </Button>
            <Button size="sm" asChild className="gap-1.5 bg-primary text-xs font-medium text-primary-foreground shadow-lg shadow-primary/25 hover:scale-[1.02]">
              <a href={REGISTER_HREF}>
                Start Building Free <ArrowUpRight className="size-3.5" />
              </a>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 lg:pt-28">
        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          {/* Animated Beta Badge */}
          <div className="hero-badge inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            <span>GoFlow v1.2 Beta · High-Performance DAG Workflow Engine</span>
            <Separator orientation="vertical" className="h-3" />
            <a href={GITHUB} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-mono text-[11px] underline-offset-4 hover:underline">
              GitHub Repo <ExternalLink className="size-3" />
            </a>
          </div>

          {/* Main Headline */}
          <h1 className="mt-8 text-balance text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="hero-title-line block bg-gradient-to-b from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              Visual Workflow Automation,
            </span>
            <span className="hero-title-line block bg-gradient-to-r from-primary via-chart-2 to-amber-300 bg-clip-text text-transparent drop-shadow-sm">
              Engineered for Developers
            </span>
          </h1>

          {/* Subtitle */}
          <p className="hero-desc mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Design DAG pipelines on a fluid canvas, execute deterministic steps with zero broker bloat, and watch every state transition over WebSockets in real time.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Button size="lg" asChild className="hero-cta-btn gap-2 bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:scale-[1.02]">
              <a href={REGISTER_HREF}>
                Start Building Free <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="hero-cta-btn gap-2 border-border/80 bg-card/60 backdrop-blur-md transition-all hover:bg-muted">
              <a href="#simulator">
                <Play className="size-4 text-primary fill-current" /> Interactive Playground
              </a>
            </Button>
          </div>

          <p className="mt-4 font-mono text-xs text-muted-foreground/80">
            Open-source · Self-hostable with single command · No credit card required
          </p>
        </div>

        {/* Hero Interactive Showcase / Simulator */}
        <div id="simulator" className="hero-preview-box relative mx-auto mt-14 max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
          <InteractiveWorkflowSimulator />
        </div>
      </section>

      {/* Kinetic Stat Counters */}
      <section ref={statsRef} className="relative border-y border-border/60 bg-muted/20 py-12 backdrop-blur-md">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 sm:px-6 lg:grid-cols-4 lg:gap-8 lg:px-8">
          {[
            { metric: '< 8ms', label: 'Topological dispatch latency', sub: 'Instant sub-millisecond DAG sorting' },
            { metric: '100%', label: 'Deterministic execution', sub: 'Zero race conditions or skipped states' },
            { metric: '0 Broker', label: 'Overhead eliminated', sub: 'Runs directly without heavy Celery/Redis' },
            { metric: '10k+', label: 'Concurrent stream runs', sub: 'Buffered WebSocket broadcast channels' },
          ].map((stat, i) => (
            <div key={i} className="stat-card flex flex-col justify-between rounded-xl border border-border/50 bg-card/40 p-5 backdrop-blur-sm">
              <span className="font-mono text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                {stat.metric}
              </span>
              <div className="mt-2">
                <p className="text-sm font-semibold text-foreground">{stat.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section id="engine" ref={featuresRef} className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <Badge variant="outline" className="mb-3 border-primary/30 text-primary">
            Architecture
          </Badge>
          <h2 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Built for developers who value speed and clarity
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Unlike legacy enterprise orchestrators, GoFlow focuses on predictable execution, zero black boxes, and real-time observability.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: GitBranch,
              title: 'Topological DAG Engine',
              text: 'Nodes run in rigorous mathematical dependency order. Cycles are rejected at compile time, guaranteeing clean, replayable pipelines.',
              badge: 'Deterministic',
            },
            {
              icon: Radio,
              title: 'WebSocket Live Streaming',
              text: 'Subscribe to execution progress at 60fps. Every node transition from Queued to Running to Complete streams directly to the frontend.',
              badge: 'Zero-Lag',
            },
            {
              icon: GitPullRequest,
              title: 'Conditional Branch Pruning',
              text: 'Unsatisfied condition branches are pruned dynamically. Downstream nodes are skipped instantly, saving CPU and LLM token costs.',
              badge: 'Cost Optimizer',
            },
            {
              icon: Bot,
              title: 'AI Agent Chaining',
              text: 'Connect LLMs directly into structured workflow graphs. Transform unstructured inputs into validated JSON schemas for downstream APIs.',
              badge: 'LLM Native',
            },
            {
              icon: ShieldCheck,
              title: 'Signed HMAC Webhooks',
              text: 'Give every workflow its own cryptographic endpoint. Requests are checked against SHA-256 signatures before a single worker is spawned.',
              badge: 'Enterprise Security',
            },
            {
              icon: Terminal,
              title: 'Versioned as Code',
              text: 'Export workflows as clean declarative JSON or TypeScript specs. Commit them to Git, test them in CI, and deploy with zero downtime.',
              badge: 'GitOps Ready',
            },
          ].map((feat, i) => {
            const Icon = feat.icon
            return (
              <Card
                key={i}
                className="feature-card group relative overflow-hidden border-border/70 bg-card/60 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" />
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">
                    {feat.badge}
                  </Badge>
                </div>
                <CardHeader className="p-0 pt-5">
                  <CardTitle className="text-lg font-semibold tracking-tight">{feat.title}</CardTitle>
                  <CardDescription className="pt-2 text-sm leading-relaxed text-muted-foreground">
                    {feat.text}
                  </CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Interactive Node Matrix Section */}
      <section id="nodes" className="relative border-t border-border/60 bg-muted/10 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <Badge variant="outline" className="mb-3 border-primary/30 text-primary">
                Node Ecosystem
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Composable primitives for real workloads
              </h2>
              <p className="mt-2 max-w-lg text-muted-foreground">
                Small, stable building blocks. Combine them into custom pipelines or write your own custom node plugins.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 rounded-xl border border-border/60 bg-card/60 p-1 backdrop-blur-md">
              {['All', 'Triggers', 'Logic', 'AI & Transform', 'Integrations'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Node Cards Grid */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredNodes.map((node) => {
              const Icon = node.icon
              const isComingSoon = node.status === 'Coming Soon'
              return (
                <div
                  key={node.name}
                  className="group relative flex flex-col justify-between rounded-xl border border-border/60 bg-card/60 p-5 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:bg-card/90"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-4" />
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          isComingSoon ? 'border-border text-muted-foreground' : 'border-emerald-500/30 text-emerald-400'
                        }`}
                      >
                        {node.status}
                      </Badge>
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-foreground">{node.name}</h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{node.desc}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
                    <span className="font-mono text-[10px] text-muted-foreground uppercase">{node.category}</span>
                    <span className="text-xs text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      Configure →
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Developer Quickstart & Code Terminal Section */}
      <section id="architecture" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Badge variant="outline" className="mb-3 border-primary/30 text-primary">
              Developer First
            </Badge>
            <h2 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
              Integrate with any stack in seconds
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Whether you trigger workflows from existing microservices via signed cURL requests, embed the TypeScript SDK in your Next.js application, or deploy GoFlow via Docker on your own cloud VM.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-foreground/90">
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-emerald-400" />
                <span>Zero vendor lock-in. Full PostgreSQL schema ownership.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-emerald-400" />
                <span>Single binary or Docker container deployment.</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="size-4 text-emerald-400" />
                <span>Cryptographically signed webhook endpoints out of the box.</span>
              </li>
            </ul>

            <div className="mt-8 flex gap-3">
              <Button asChild className="gap-2 bg-primary font-semibold text-primary-foreground shadow-lg shadow-primary/20">
                <a href={REGISTER_HREF}>
                  Get Started Free <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={GITHUB} target="_blank" rel="noreferrer" className="gap-2">
                  <GitBranch className="size-4" /> View Source
                </a>
              </Button>
            </div>
          </div>

          <div>
            <CodeQuickstartTabs />
          </div>
        </div>
      </section>

      {/* Comparison: Why GoFlow vs Heavy Monoliths */}
      <section className="relative border-t border-border/60 bg-muted/20 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              How GoFlow Compares
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Built specifically for engineers who want visual pipelines without heavy orchestration infrastructure.
            </p>
          </div>

          <div className="mt-10 overflow-hidden rounded-xl border border-border/70 bg-card/60 backdrop-blur-md">
            <div className="grid grid-cols-4 border-b border-border/70 bg-muted/40 p-4 font-mono text-xs font-semibold">
              <span>Capability</span>
              <span className="text-primary">GoFlow</span>
              <span className="text-muted-foreground">Legacy Airflow</span>
              <span className="text-muted-foreground">Zapier / Make</span>
            </div>

            {[
              ['Engine Overhead', '< 15MB RAM Go runtime', '> 2GB Python Celery stack', 'Proprietary Cloud'],
              ['Live Run Observability', 'Native WebSockets (60fps)', 'Polling / Batch logs', 'Delayed status polling'],
              ['Branch Pruning', 'Instant topological pruning', 'Custom BranchPythonOperators', 'Counts toward paid quota'],
              ['Deployment', 'Self-hostable single Docker', 'Kubernetes Helm cluster', 'Cloud SaaS only'],
              ['AI Native Node Chaining', 'First-class token streaming', 'External custom operators', 'Simple prompt blocks'],
            ].map(([cap, gof, air, zap], idx) => (
              <div key={idx} className="grid grid-cols-4 border-b border-border/40 p-4 text-xs last:border-0 hover:bg-muted/30">
                <span className="font-medium text-foreground">{cap}</span>
                <span className="font-semibold text-primary">{gof}</span>
                <span className="text-muted-foreground">{air}</span>
                <span className="text-muted-foreground">{zap}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* High-Impact Closing CTA Banner */}
      <section className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent p-8 sm:p-14 shadow-2xl shadow-primary/10">
          <div
            aria-hidden
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-xl">
              <Badge variant="outline" className="mb-3 border-primary/40 bg-primary/20 text-primary">
                Instant Setup
              </Badge>
              <h3 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">
                Ready to orchestrate your first workflow?
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Deploy with Docker in under two minutes or create a free cloud account. Fully open-source and MIT licensed.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild className="gap-2 bg-primary font-semibold text-primary-foreground shadow-xl shadow-primary/30 hover:scale-[1.02]">
                <a href={REGISTER_HREF}>
                  Create Free Account <ArrowUpRight className="size-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-border bg-card/60 backdrop-blur-md">
                <a href={GITHUB} target="_blank" rel="noreferrer">
                  Star on GitHub ⭐
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/70 bg-card/40 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              <div className="flex items-center gap-2 font-bold tracking-tight">
                <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                  <Network className="size-4" />
                </span>
                <span>GoFlow</span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                The open-source, deterministic visual workflow engine for modern developers. Built with high-performance DAG execution and real-time WebSockets.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 text-xs sm:grid-cols-3">
              <div className="flex flex-col gap-2.5">
                <span className="font-semibold text-foreground uppercase tracking-wider">Product</span>
                <a href="#simulator" className="text-muted-foreground hover:text-primary">Simulator</a>
                <a href="#engine" className="text-muted-foreground hover:text-primary">Engine</a>
                <a href="#nodes" className="text-muted-foreground hover:text-primary">Node Matrix</a>
                <a href="#architecture" className="text-muted-foreground hover:text-primary">Architecture</a>
              </div>
              <div className="flex flex-col gap-2.5">
                <span className="font-semibold text-foreground uppercase tracking-wider">Platform</span>
                <a href={LOGIN_HREF} className="text-muted-foreground hover:text-primary">Log in</a>
                <a href={REGISTER_HREF} className="text-muted-foreground hover:text-primary">Sign up</a>
                <a href={GITHUB} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary">Releases</a>
              </div>
              <div className="flex flex-col gap-2.5">
                <span className="font-semibold text-foreground uppercase tracking-wider">Open Source</span>
                <a href={GITHUB} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                  GitHub <ArrowUpRight className="size-3" />
                </a>
                <span className="text-muted-foreground">MIT License</span>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
            <span>© 2026 GoFlow. All rights reserved.</span>
            <span className="font-mono">
              Designed & built by{' '}
              <a
                href="https://www.instagram.com/not_pragyann/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Pragyan Thapaliya
              </a>
            </span>
          </div>
        </div>
      </footer>
    </main>
  )
}
