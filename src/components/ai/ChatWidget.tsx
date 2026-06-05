'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/lib/validations/schemas'

const GREETING: ChatMessage = {
  role: 'assistant',
  content: 'Welcome to Aura Archives. How may I help you find something today?',
}

/**
 * Floating concierge chat. Streams replies from /api/ai/chat as plain text and
 * appends deltas to the in-flight assistant message. Stateless on the server —
 * the full transcript is sent with each request.
 */
export function ChatWidget(): React.ReactElement {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const sessionId = useRef<string>(crypto.randomUUID())
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open])

  async function send(): Promise<void> {
    const text = input.trim()
    if (!text || pending) return

    const next: ChatMessage[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setPending(true)

    // Reserve the assistant slot we will stream into.
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.filter((m) => m.content.length > 0),
          sessionId: sessionId.current,
        }),
      })

      if (!res.ok || !res.body) {
        const message =
          res.status === 429
            ? 'You are sending messages a little quickly — please pause a moment.'
            : 'The concierge is unavailable right now. Please email support@auraarchives.com.'
        appendToLast(message)
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        appendToLast(decoder.decode(value, { stream: true }), true)
      }
    } catch {
      appendToLast('Something interrupted our conversation. Please try again.')
    } finally {
      setPending(false)
    }
  }

  /** Updates the trailing assistant message — replacing or appending its text. */
  function appendToLast(text: string, append = false): void {
    setMessages((prev) => {
      const copy = [...prev]
      const last = copy[copy.length - 1]
      if (last && last.role === 'assistant') {
        copy[copy.length - 1] = { role: 'assistant', content: append ? last.content + text : text }
      }
      return copy
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close concierge chat' : 'Open concierge chat'}
        aria-expanded={open}
        className="fixed bottom-28 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:bottom-6"
      >
        {open ? <X className="h-5 w-5" aria-hidden /> : <MessageCircle className="h-5 w-5" aria-hidden />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Aura Archives concierge"
          className="fixed bottom-44 right-4 z-40 flex h-[28rem] w-[min(22rem,calc(100vw-2rem))] flex-col border border-border bg-surface shadow-xl md:bottom-20"
        >
          <header className="border-b border-border px-4 py-3">
            <p className="font-serif text-sm tracking-wide text-text">Concierge</p>
            <p className="text-xs text-text-muted">Here to help you browse the archive</p>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  'max-w-[85%] px-3 py-2 text-sm leading-relaxed',
                  m.role === 'user'
                    ? 'ml-auto bg-primary text-white'
                    : 'mr-auto bg-surface-dim text-text',
                )}
              >
                {m.content || (
                  <span className="inline-flex gap-1" aria-label="Concierge is typing">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-text-muted" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-text-muted [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-text-muted [animation-delay:300ms]" />
                  </span>
                )}
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              void send()
            }}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={2000}
              placeholder="Ask about a piece, sizing, shipping…"
              aria-label="Message the concierge"
              className="h-10 flex-1 border border-border bg-surface px-3 text-sm text-text placeholder:text-text-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            <button
              type="submit"
              disabled={pending || input.trim().length === 0}
              aria-label="Send message"
              className="flex h-10 w-10 items-center justify-center bg-primary text-white transition-colors hover:bg-primary-hover disabled:pointer-events-none disabled:opacity-50"
            >
              <Send className="h-4 w-4" aria-hidden />
            </button>
          </form>
        </div>
      )}
    </>
  )
}
