import type { Metadata } from 'next'
import { LegalDocument } from '@/components/layout/LegalDocument'
import { APP_NAME, PRIVACY_EMAIL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: `How ${APP_NAME} uses cookies and similar technologies.`,
}

export default function CookiesPage(): React.ReactElement {
  return (
    <LegalDocument
      title="Cookie Policy"
      effectiveDate="1 January 2026"
      intro="This policy explains the cookies we use and how you can control them."
      sections={[
        {
          heading: 'What cookies are',
          paragraphs: [
            'Cookies are small text files stored on your device that help a website remember your session and preferences.',
          ],
        },
        {
          heading: 'Cookies we use',
          paragraphs: [
            'Essential cookies keep you signed in and remember your cart. The store will not work correctly without them.',
            'Analytics cookies help us understand how the store is used so we can improve it. These are only set with your consent.',
          ],
        },
        {
          heading: 'Managing cookies',
          paragraphs: [
            'You can adjust your consent at any time, and you can block or delete cookies through your browser settings.',
            'Blocking essential cookies may prevent parts of the store from working.',
          ],
        },
        {
          heading: 'Contact',
          paragraphs: [`For questions about cookies, contact ${PRIVACY_EMAIL}.`],
        },
      ]}
    />
  )
}
