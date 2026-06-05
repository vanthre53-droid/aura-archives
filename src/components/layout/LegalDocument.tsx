import { CollectionHero } from '@/components/shop/CollectionHero'

interface LegalSection {
  heading: string
  paragraphs: string[]
}

interface LegalDocumentProps {
  title: string
  effectiveDate: string
  intro?: string
  sections: LegalSection[]
}

/** Shared shell for prose-style legal documents (privacy, terms, cookies). */
export function LegalDocument({
  title,
  effectiveDate,
  intro,
  sections,
}: LegalDocumentProps): React.ReactElement {
  return (
    <>
      <CollectionHero eyebrow={`Effective ${effectiveDate}`} title={title} description={intro} />
      <div className="mx-auto flex max-w-3xl flex-col gap-12 px-4 py-16 md:px-10">
        {sections.map((section, i) => (
          <section key={section.heading} className="flex flex-col gap-3">
            <h2 className="font-serif text-2xl">
              <span className="mr-3 text-sm text-text-muted">{String(i + 1).padStart(2, '0')}</span>
              {section.heading}
            </h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="text-sm leading-relaxed text-text-muted">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </>
  )
}
