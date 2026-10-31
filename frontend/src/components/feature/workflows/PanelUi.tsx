import React, { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Pane header – sticky bar at the top of each column                  */
/* ------------------------------------------------------------------ */
export const PaneHeader = ({
  title,
  description,
  badge,
  icon,
}: {
  title: string
  description?: string
  badge?: React.ReactNode
  icon?: React.ReactNode
}) => (
  <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-background/80 px-5 py-3.5 backdrop-blur">
    <div className="flex min-w-0 items-center gap-3">
      {icon && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground ring-1 ring-primary/20">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <h2 className="truncate text-sm font-semibold leading-none tracking-tight">{title}</h2>
        {description && (
          <p className="mt-1.5 truncate text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
    {badge}
  </div>
)

/* ------------------------------------------------------------------ */
/* Count / status pill                                                 */
/* ------------------------------------------------------------------ */
export const Pill = ({
  children,
  tone = 'muted',
}: {
  children: React.ReactNode
  tone?: 'muted' | 'primary' | 'success'
}) => (
  <span
    className={cn(
      'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium',
      tone === 'muted' && 'bg-secondary text-secondary-foreground',
      tone === 'primary' && 'bg-accent text-accent-foreground ring-1 ring-primary/25',
      tone === 'success' &&
        'bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-400',
    )}
  >
    {children}
  </span>
)

/* ------------------------------------------------------------------ */
/* Empty state                                                         */
/* ------------------------------------------------------------------ */
export const EmptyState = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) => (
  <div className="flex h-full min-h-60 flex-col items-center justify-center px-8 py-10 text-center">
    <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-dashed border-border bg-card text-muted-foreground shadow-xs">
      {icon}
    </div>
    <p className="text-sm font-medium">{title}</p>
    <p className="mt-1.5 max-w-60 text-xs leading-relaxed text-muted-foreground">{description}</p>
  </div>
)

/* ------------------------------------------------------------------ */
/* Copy button                                                         */
/* ------------------------------------------------------------------ */
export const CopyButton = ({ value, className }: { value: string; className?: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable – ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="Copy JSON"
      className={cn(
        'inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        className,
      )}
    >
      {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* JSON viewer with light syntax colouring                             */
/* ------------------------------------------------------------------ */
const highlight = (json: string) => {
  const escaped = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      if (/^"/.test(match)) {
        return /:$/.test(match)
          ? `<span class="text-accent-foreground dark:text-primary">${match}</span>` // key
          : `<span class="text-emerald-700 dark:text-emerald-400">${match}</span>` // string
      }
      if (/true|false/.test(match)) {
        return `<span class="text-violet-600 dark:text-violet-400">${match}</span>`
      }
      if (/null/.test(match)) {
        return `<span class="text-muted-foreground italic">${match}</span>`
      }
      return `<span class="text-sky-600 dark:text-sky-400">${match}</span>` // number
    },
  )
}

export const JsonView = ({ data, className }: { data: unknown; className?: string }) => {
  const text = JSON.stringify(data, null, 2) ?? 'undefined'

  return (
    <div className={cn('group relative', className)}>
      <CopyButton
        value={text}
        className="absolute top-2 right-2 bg-card/80 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
      />
      <pre
        className="overflow-auto p-4 font-mono text-xs leading-relaxed text-foreground/90"
        dangerouslySetInnerHTML={{ __html: highlight(text) }}
      />
    </div>
  )
}