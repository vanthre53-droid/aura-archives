import { type NextRequest } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { getAnthropic } from '@/lib/ai/client'
import { CONCIERGE_SYSTEM_PROMPT } from '@/lib/ai/system-prompt'
import { AI_MODEL, AI_MAX_OUTPUT_TOKENS, AI_MAX_HISTORY } from '@/lib/ai/models'
import { logAiUsage, isOverMonthlyBudget } from '@/lib/ai/usage'
import { chatRequestSchema } from '@/lib/validations/schemas'
import { getSessionUser } from '@/lib/auth'
import { checkRateLimit, rateLimiters } from '@/lib/redis/rate-limit'
import { fail, invalidInput, rateLimited, serverError, getClientIp } from '@/lib/api/http'

/** Streams plain UTF-8 text deltas to the caller. */
export const runtime = 'nodejs'

/** POST /api/ai/chat — the Aura Archives concierge. Public, rate-limited. */
export async function POST(request: NextRequest): Promise<Response> {
  try {
    const ip = getClientIp(request)
    const limit = await checkRateLimit(rateLimiters.aiChat, ip)
    if (!limit.success) return rateLimited()

    const anthropic = getAnthropic()
    if (!anthropic) {
      return fail('The concierge is offline right now. Please email support@auraarchives.com.', 503)
    }

    if (await isOverMonthlyBudget()) {
      return fail('The concierge is resting for today. Please try again tomorrow.', 503)
    }

    const parsed = chatRequestSchema.safeParse(await request.json())
    if (!parsed.success) return invalidInput()

    // Guests are welcome; we only attach a user id when one is signed in.
    const user = await getSessionUser()

    const history = parsed.data.messages.slice(-AI_MAX_HISTORY)
    const startedAt = Date.now()
    const encoder = new TextEncoder()

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        let inputTokens = 0
        let outputTokens = 0
        let streamed = false
        try {
          const completion = anthropic.messages.stream({
            model: AI_MODEL,
            max_tokens: AI_MAX_OUTPUT_TOKENS,
            system: [
              {
                type: 'text',
                text: CONCIERGE_SYSTEM_PROMPT,
                cache_control: { type: 'ephemeral' },
              },
            ],
            messages: history.map((m) => ({ role: m.role, content: m.content })),
          })

          for await (const event of completion) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              streamed = true
              controller.enqueue(encoder.encode(event.delta.text))
            }
          }

          const final = await completion.finalMessage()
          inputTokens = final.usage.input_tokens
          outputTokens = final.usage.output_tokens

          await logAiUsage({
            userId: user?.id ?? null,
            sessionId: parsed.data.sessionId ?? null,
            model: AI_MODEL,
            inputTokens,
            outputTokens,
            latencyMs: Date.now() - startedAt,
            success: true,
          })
          controller.close()
        } catch (error) {
          Sentry.captureException(error)
          // Give the shopper something graceful rather than a hard abort.
          if (!streamed) {
            controller.enqueue(
              encoder.encode(
                'I had trouble responding just now. Please try again, or email support@auraarchives.com.',
              ),
            )
          }
          await logAiUsage({
            userId: user?.id ?? null,
            sessionId: parsed.data.sessionId ?? null,
            model: AI_MODEL,
            inputTokens,
            outputTokens,
            latencyMs: Date.now() - startedAt,
            success: false,
            errorMessage: error instanceof Error ? error.message : 'unknown',
          })
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (error) {
    Sentry.captureException(error)
    return serverError()
  }
}
