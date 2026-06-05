/**
 * Renders a JSON-LD script tag. The payload is app-controlled (never user HTML);
 * `<` is escaped to `<` to prevent any script-tag breakout.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }): React.ReactElement {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
