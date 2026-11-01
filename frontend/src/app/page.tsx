import {
  ArrowUpRight,
  Bell,
  Bot,
  CircleCheck,
  Clock,
  Code,
  GitBranch,
  GitPullRequest,
  Globe,
  Hash,
  LoaderCircle,
  Maximize,
  Minus,
  Moon,
  Network,
  PanelLeft,
  Play,
  Plus,
  Radio,
  Save,
  ShieldCheck,
  Webhook,
  type LucideIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

   Put real product media in /public and set ONE of these (video wins).
   Leave both empty to show the animated app preview built below. */
const PRODUCT_VIDEO = '' // e.g. '/demo.mp4'
const PRODUCT_POSTER = '' // optional, e.g. '/demo-poster.png'
const PRODUCT_IMAGE = '' // e.g. '/app-screenshot.png'

const GITHUB = 'https://github.com/pragyann007/GoFlow'
const LOGIN_HREF = '/auth/login'
const REGISTER_HREF = '/auth/register'

const nodeLibrary: { icon: LucideIcon; name: string; text: string; soon?: boolean }[] = [
  { icon: Globe, name: 'HTTP Request', text: 'Make an HTTP request to any API endpoint' },
  { icon: Webhook, name: 'Webhook Trigger', text: 'Start a workflow when a request hits your endpoint' },
  { icon: Bot, name: 'AI Agent', text: 'Process text or data using an LLM with custom instructions' },
  { icon: Network, name: 'Switch', text: 'Route execution to different branches by condition' },
  { icon: Hash, name: 'Slack', text: 'Post messages to a Slack channel' },
  { icon: Code, name: 'Code', text: 'Run custom JavaScript to transform workflow data', soon: true },
  { icon: Bell, name: 'Send Notification', text: 'Send alerts via Slack webhooks or SMTP email', soon: true },
  { icon: Clock, name: 'Schedule Trigger', text: 'Run workflows on an interval or cron expression', soon: true },
]

const features: { icon: LucideIcon; title: string; text: string; detail: string }[] = [
  {
    icon: GitBranch,
    title: 'DAG topological engine',
    text: 'Nodes run in strict dependency order. Every run is deterministic, replayable and easy to inspect.',
    detail: 'fetch → route → notify',
  },
  {
    icon: Radio,
    title: 'Live status streaming',
    text: 'Watch each node move from queued to complete over WebSockets while the workflow runs.',
    detail: 'ws://localhost:8080/runs/:id',
  },
  {
    icon: ShieldCheck,
    title: 'Secure custom webhooks',
    text: 'Give every workflow its own signed endpoint. Requests are verified before a single node executes.',
    detail: 'X-GoFlow-Signature: sha256=…',
  },
  {
    icon: GitPullRequest,
    title: 'Conditional branch pruning',
    text: 'Branches that fail a condition are skipped entirely, so runs stay fast and logs stay readable.',
    detail: 'status == 500 → 1 branch pruned',
  },
]

/* ── Animation timeline for the app preview (seconds, one 10s loop) ── */
const T = 10
const pct = (s: number) => `${((s / T) * 100).toFixed(2)}%`
const NODE_START = [0.4, 3.0, 5.6] // when each node starts running
const EDGE_START = [1.8, 4.4] // when data flows along each edge
const RUN_FOR = 1.4

const css =
  NODE_START.map(
    (s, i) =>
      `@keyframes gf-run${i}{0%,${pct(s - 0.1)}{opacity:0}${pct(s)},${pct(s + RUN_FOR)}{opacity:1}${pct(s + RUN_FOR + 0.1)},100%{opacity:0}}` +
      `@keyframes gf-done${i}{0%,${pct(s + RUN_FOR)}{opacity:0}${pct(s + RUN_FOR + 0.1)},${pct(9.2)}{opacity:1}${pct(9.5)},100%{opacity:0}}` +
      `@keyframes gf-hl${i}{0%,${pct(s - 0.1)}{stroke:var(--border)}${pct(s)},${pct(s + RUN_FOR)}{stroke:var(--primary)}${pct(s + RUN_FOR + 0.2)},100%{stroke:var(--border)}}`,
  ).join('') +
  EDGE_START.map(
    (e, i) =>
      `@keyframes gf-edge${i}{0%,${pct(e)}{stroke-dashoffset:14;opacity:0}${pct(e + 0.05)}{opacity:1}${pct(e + 1.4)}{stroke-dashoffset:-100;opacity:1}${pct(e + 1.45)},100%{opacity:0}}`,
  ).join('') +
  `@keyframes gf-rot{to{transform:rotate(360deg)}}
@keyframes gf-sheen{0%{background-position:200% 0}100%{background-position:-200% 0}}
.gf-spin{transform-box:fill-box;transform-origin:center;animation:gf-rot 1s linear infinite}
.gf-sheen{background-size:200% 100%;animation:gf-sheen 6s linear infinite}
@media(prefers-reduced-motion:reduce){
  .gf-spin,.gf-sheen,.gf-anim{animation:none!important}
  .gf-done{opacity:1!important}.gf-run,.gf-edge{opacity:0!important}
}`

/* ───────────────────────── Shared bits ───────────────────────── */

function Logo() {
  return (
    <a href="#top" className="group flex items-center gap-2.5 text-[15px] font-semibold tracking-tight">
      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:rotate-6">
        <Network className="size-4" />
      </span>
      GoFlow
    </a>
  )
}

/* ───────────────────────── App preview (mirrors the real UI) ───────────────────────── */

const NW = 170
const NH = 68
const nodes: { x: number; y: number; icon: LucideIcon; label: string; badge: number }[] = [
  { x: 60, y: 152, icon: Globe, label: 'HTTP Request', badge: 0 },
  { x: 290, y: 140, icon: Network, label: 'Switch', badge: 1 },
  { x: 540, y: 50, icon: Hash, label: 'Slack', badge: 2 },
  { x: 515, y: 222, icon: Hash, label: 'Slack', badge: -1 },
]
const edges = [
  'M230,186 C262,186 258,174 290,174',
  'M460,174 C500,174 500,84 540,84',
  'M460,174 C500,174 475,256 515,256',
]

function Handle({ cx, cy }: { cx: number; cy: number }) {
  return <circle cx={cx} cy={cy} r={3.5} fill="var(--primary)" stroke="var(--card)" strokeWidth={2} />
}

function CanvasSvg() {
  return (
    <svg viewBox="0 0 760 400" className="block h-auto w-full" role="img" aria-label="GoFlow workflow canvas: HTTP Request, Switch, Slack">
      {/* edges */}
      {edges.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="var(--muted-foreground)" strokeOpacity={0.55} strokeWidth={1.25} />
      ))}
      {/* data flowing along the first two edges */}
      {edges.slice(0, 2).map((d, i) => (
        <path
          key={`f${i}`}
          d={d}
          pathLength={100}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray="14 200"
          className="gf-edge gf-anim"
          style={{ opacity: 0, animation: `gf-edge${i} ${T}s linear infinite` }}
        />
      ))}

      {nodes.map((n, i) => {
        const Icon = n.icon
        const cy = n.y + NH / 2
        return (
          <g key={i}>
            <rect
              x={n.x}
              y={n.y}
              width={NW}
              height={NH}
              rx={8}
              fill="var(--card)"
              stroke="var(--border)"
              strokeWidth={1}
              className="gf-anim"
              style={n.badge >= 0 ? { animation: `gf-hl${n.badge} ${T}s linear infinite` } : undefined}
            />
            <rect x={n.x + 10} y={n.y + 10} width={48} height={48} rx={6} fill="var(--muted)" />
            <Icon x={n.x + 20} y={n.y + 20} width={28} height={28} strokeWidth={1.75} className="text-primary" />
            <text x={n.x + 72} y={cy + 4} fill="var(--foreground)" fontSize={13} fontWeight={500}>
              {n.label}
            </text>
            <Handle cx={n.x} cy={cy} />
            <Handle cx={n.x + NW} cy={cy} />

            {n.badge >= 0 && (
              <g>
                <rect x={n.x + NW - 46} y={n.y + NH - 9} width={32} height={18} rx={9} fill="var(--background)" stroke="var(--border)" />
                <g className="gf-run gf-anim" style={{ opacity: 0, animation: `gf-run${n.badge} ${T}s linear infinite` }}>
                  <LoaderCircle x={n.x + NW - 36} y={n.y + NH - 6} width={12} height={12} className="gf-spin text-primary" />
                </g>
                <g className="gf-done gf-anim" style={{ opacity: 0, animation: `gf-done${n.badge} ${T}s linear infinite` }}>
                  <CircleCheck x={n.x + NW - 36} y={n.y + NH - 6} width={12} height={12} className="text-emerald-500" />
                </g>
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function AppPreview() {
  return (
    <div className="flex bg-background text-left">
      {/* sidebar */}
      <aside className="hidden w-44 shrink-0 border-r border-border bg-sidebar sm:block">
        <div className="border-b border-border px-4 py-3.5 text-sm font-semibold">Go Flow</div>
        <div className="flex items-center gap-2.5 px-4 py-4 text-xs text-sidebar-foreground">
          <Network className="size-3.5 text-muted-foreground" />
          Workflows
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* top bar */}
        <div className="flex items-center gap-2 border-b border-border px-3 py-2.5 sm:gap-3 sm:px-4">
          <PanelLeft className="hidden size-4 text-muted-foreground sm:block" />
          <span className="min-w-0 truncate rounded-md bg-muted px-2.5 py-1.5 text-xs text-foreground/80 sm:w-40">my workflow-1</span>
          <span className="ml-auto hidden size-7 place-items-center rounded-md border border-border text-muted-foreground sm:grid">
            <Moon className="size-3.5" />
          </span>
          <span className="hidden items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs md:inline-flex">
            <Plus className="size-3.5" /> Add Node
          </span>
          <span className="hidden items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground sm:inline-flex">
            <Save className="size-3.5" /> Save Workflow
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground sm:ml-0">
            <Play className="size-3.5" /> Execute Workflow
          </span>
        </div>

        {/* canvas */}
        <div className="relative m-2 overflow-hidden rounded-md bg-[color-mix(in_oklab,var(--background)_35%,black)] sm:m-3">
          <div
            aria-hidden
            className="absolute inset-0 opacity-70"
            style={{ backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '18px 18px' }}
          />
          <div className="relative">
            <CanvasSvg />
          </div>
          {/* zoom controls + minimap, like the real editor */}
          <div className="absolute bottom-2 left-2 hidden flex-col overflow-hidden rounded border border-border bg-card text-muted-foreground sm:flex">
            <Plus className="size-6 p-1.5" />
            <Minus className="size-6 border-t border-border p-1.5" />
            <Maximize className="size-6 border-t border-border p-1.5" />
          </div>
          <div className="absolute bottom-2 right-2 hidden h-14 w-24 rounded border border-border bg-muted/60 sm:block">
            <span className="absolute left-3 top-6 h-1.5 w-3 rounded-sm bg-foreground/70" />
            <span className="absolute left-8 top-6 h-1.5 w-3 rounded-sm bg-foreground/70" />
            <span className="absolute right-3 top-3 h-1.5 w-4 rounded-sm bg-foreground/70" />
            <span className="absolute bottom-3 right-4 h-1.5 w-4 rounded-sm bg-foreground/70" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductShowcase() {
  return (
    <div className="rounded-2xl bg-gradient-to-b from-primary/60 via-primary/10 to-transparent p-px shadow-2xl shadow-primary/10">
      <div className="overflow-hidden rounded-[15px] bg-card">
        {/* browser bar */}
        <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-4 py-2.5">
          <div className="flex w-12 gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-muted-foreground/30" />
            <span className="size-2.5 rounded-full bg-muted-foreground/30" />
            <span className="size-2.5 rounded-full bg-muted-foreground/30" />
          </div>
          <div className="mx-auto min-w-0 max-w-sm flex-1 truncate rounded-md bg-background/70 px-3 py-1 text-center font-mono text-[11px] text-muted-foreground">
            goflow.app/dashboard/workflows/2d5e284e
          </div>
          <div className="w-12" aria-hidden />
        </div>

        {PRODUCT_VIDEO ? (
          <video
            src={PRODUCT_VIDEO}
            poster={PRODUCT_POSTER || undefined}
            autoPlay
            muted
            loop
            playsInline
            className="aspect-[16/9] w-full bg-background object-cover"
          />
        ) : PRODUCT_IMAGE ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={PRODUCT_IMAGE} alt="GoFlow workflow editor" className="aspect-[16/9] w-full bg-background object-cover" />
        ) : (
          <AppPreview />
        )}
      </div>
    </div>
  )
}

/* ───────────────────────── Page ───────────────────────── */

export default function Page() {
  return (
    // `dark` forces the .dark tokens from globals.css regardless of app theme.
    <main id="top" className="dark relative min-h-screen overflow-x-hidden bg-background text-foreground antialiased">
      <style>{css}</style>

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <nav className="mx-auto flex h-14 max-w-6xl items-center px-4 sm:h-16 sm:px-6 lg:px-8">
          <Logo />
          <div className="ml-8 hidden items-center gap-1 md:flex">
            {[
              ['Nodes', '#nodes'],
              ['Features', '#features'],
              ['GitHub', GITHUB],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <a href={LOGIN_HREF}>Log in</a>
            </Button>
            <Button size="sm" asChild>
              <a href={REGISTER_HREF}>Sign up</a>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[560px] bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--primary)_20%,transparent),transparent_65%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:56px_56px] opacity-30 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
        />

        <div className="relative mx-auto max-w-4xl px-4 pb-14 pt-16 text-center sm:px-6 sm:pt-20 lg:pt-28">
          <Badge variant="outline" className="animate-in fade-in slide-in-from-bottom-2 mb-6 gap-2 border-primary/30 bg-primary/10 px-3 py-1 font-normal text-primary duration-700">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
            </span>
            Open source · Now in beta
          </Badge>

          <h1 className="animate-in fade-in slide-in-from-bottom-3 text-balance text-4xl font-semibold tracking-tighter duration-700 sm:text-5xl lg:text-7xl">
            <span className="bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent">
              Visual Workflow Automation,
            </span>{' '}
            <span className="gf-sheen bg-gradient-to-r from-primary via-chart-2 to-primary bg-clip-text text-transparent">
              Built for Code
            </span>
          </h1>

          <p
            className="animate-in fade-in slide-in-from-bottom-3 mx-auto mt-5 max-w-xl text-pretty text-base leading-7 text-muted-foreground duration-700 sm:text-lg"
            style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}
          >
            Design workflows on a canvas, version them as code, and watch every run in real time. Self-host it and own every execution.
          </p>

          <div
            className="animate-in fade-in slide-in-from-bottom-3 mt-8 flex flex-col items-stretch justify-center gap-3 duration-700 sm:flex-row sm:items-center"
            style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}
          >
            <Button  className="shadow-lg shadow-primary/25 p-4 " asChild>
              <a className='flex gap-2 items-center' href={REGISTER_HREF}>
                Start Building Free <ArrowUpRight data-icon="inline-end" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={GITHUB} className='flex gap-2 items-center'  target="_blank" rel="noreferrer">
                <GitBranch data-icon="inline-start" /> View on GitHub
              </a>
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">Free and open source. Self-host with a single command.</p>
        </div>

        <div
          className="animate-in fade-in slide-in-from-bottom-6 relative mx-auto max-w-6xl px-4 pb-20 duration-1000 sm:px-6 sm:pb-24 lg:px-8"
          style={{ animationDelay: '300ms', animationFillMode: 'backwards' }}
        >
          <ProductShowcase />
        </div>
      </section>

      {/* Node library / Beta */}
      <section id="nodes" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <div className="lg:pt-4">
            <div className="mb-5 flex items-center gap-3">
              <Badge className="border border-primary/40 bg-primary/15 text-primary hover:bg-primary/15">Beta</Badge>
              <span className="text-sm text-muted-foreground">New nodes ship every week</span>
            </div>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              <span className="text-primary">Five production nodes</span>, ready to use today
            </h2>
            <p className="mt-4 max-w-md text-pretty leading-7 text-muted-foreground">
              The core is small on purpose and stable enough to run real workloads. More integrations are rolling out rapidly, and the node API is open if you want to write your own.
            </p>
            <Button className="mt-8" variant="outline" asChild>
              <a href={REGISTER_HREF}>
                Try them free <ArrowUpRight data-icon="inline-end" />
              </a>
            </Button>
          </div>

          {/* mirrors the in-app "Add Node" panel */}
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="border-b-2 border-primary px-5 py-4">
              <p className="text-sm font-semibold">Some Useful Nodes</p>
              <p className="mt-1 text-sm text-muted-foreground">Select the nodes you want to use in your workflow.</p>
            </div>
            <ul className="grid gap-3 p-4 sm:grid-cols-2">
              {nodeLibrary.map(({ icon: Icon, name, text, soon }) => (
                <li
                  key={name}
                  className={`flex gap-3 rounded-lg border p-3.5 transition-colors ${
                    soon
                      ? 'border-border bg-background'
                      : 'border-border bg-muted/40 hover:border-primary/50 hover:bg-primary/5'
                  }`}
                >
                  <Icon className={`mt-0.5 size-5 shrink-0 ${soon ? 'text-muted-foreground' : 'text-primary'}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{name}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>
                    {soon && (
                      <Badge className="mt-2.5 bg-primary px-2 py-0 text-[11px] font-medium text-primary-foreground hover:bg-primary">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="mb-12 max-w-xl">
          <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Automation without the black box
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            Everything you need to build workflows your team can read, debug and extend.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, text, detail }) => (
            <Card
              key={title}
              className="group relative gap-0 overflow-hidden border-border bg-card p-0 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className="absolute inset-x-0 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-primary to-transparent transition-transform duration-500 group-hover:scale-x-100" />
              <CardHeader className="gap-2 p-6 pb-5 sm:p-7 sm:pb-5">
                <span className="mb-3 grid size-10 place-items-center rounded-lg bg-primary/15 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <CardTitle className="text-base font-medium tracking-tight">{title}</CardTitle>
                <CardDescription className="leading-6">{text}</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6 sm:px-7 sm:pb-7">
                <code className="block truncate rounded-md border border-border bg-muted/40 px-3 py-2 font-mono text-xs text-muted-foreground">
                  <span className="text-primary">›</span> {detail}
                </code>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Closing CTA */}
        <div className="relative mt-20 overflow-hidden rounded-2xl bg-primary px-6 py-10 text-primary-foreground sm:px-10 sm:py-12">
          <div
            aria-hidden
            className="absolute inset-0 opacity-15"
            style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '18px 18px' }}
          />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-lg">
              <h3 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                Run your first workflow in five minutes
              </h3>
              <p className="mt-3 text-sm leading-6 opacity-80">
                One container, no usage limits. Create an account or self-host it yourself.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90" asChild>
                <a href={REGISTER_HREF} className='flex gap-2 items-center' >
                  Create free account <ArrowUpRight data-icon="inline-end" />
                </a>
              </Button>
              <Button size="lg" variant="ghost" className="text-primary-foreground hover:bg-black/10 hover:text-primary-foreground" asChild>
                <a href={LOGIN_HREF}>Log in</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-xs">
              <Logo />
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Open-source visual workflow automation, built for developers.
              </p>
            </div>
            <div className="flex gap-12 text-sm">
              <div className="flex flex-col gap-3">
                <span className="font-medium">Product</span>
                <a className="text-muted-foreground transition-colors hover:text-primary" href="#nodes">Nodes</a>
                <a className="text-muted-foreground transition-colors hover:text-primary" href="#features">Features</a>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-medium">Account</span>
                <a className="text-muted-foreground transition-colors hover:text-primary" href={LOGIN_HREF}>Log in</a>
                <a className="text-muted-foreground transition-colors hover:text-primary" href={REGISTER_HREF}>Sign up</a>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-medium">Open source</span>
                <a
                  className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary"
                  href={GITHUB}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub <ArrowUpRight className="size-3.5" />
                </a>
                <Badge variant="outline" className="w-fit border-primary/30 font-normal text-primary">
                  MIT licensed
                </Badge>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 GoFlow. All rights reserved.</span>
            <span className="font-mono">
              creator: <span className="text-primary">PraganThapaliya</span>
            </span>
          </div>
        </div>
      </footer>
    </main>
  )
}