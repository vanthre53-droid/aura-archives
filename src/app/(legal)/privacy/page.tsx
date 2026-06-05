import type { Metadata } from 'next'
import { LegalDocument } from '@/components/layout/LegalDocument'
import { APP_NAME, PRIVACY_EMAIL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${APP_NAME} collects, uses, and protects your personal information.`,
}

export default function PrivacyPage(): React.ReactElement {
  return (
    <LegalDocument
      title="Privacy Policy"
      effectiveDate="1 January 2026"
      intro={`${APP_NAME} respects your privacy. This policy explains what we collect and how we use it.`}
      sections={[
        {
          heading: 'Information we collect',
          paragraphs: [
            'Account details you provide — name, email address, and shipping address — when you register or place an order.',
            'Order history and wishlist items, which are stored against your account so we can fulfil and reference them.',
            'Technical data such as device type and pages visited, collected to keep the service secure and improve it.',
          ],
        },
        {
          heading: 'How we use your information',
          paragraphs: [
            'To process and deliver your orders, respond to enquiries, and provide customer support.',
            'To send transactional messages, such as order confirmations and shipping updates.',
            'To detect and prevent fraud, and to comply with our legal obligations.',
          ],
        },
        {
          heading: 'Sharing',
          paragraphs: [
            'We share data only with the processors needed to run the store — payment, hosting, and delivery partners — under contracts that require them to protect it.',
            'We never sell your personal information.',
          ],
        },
        {
          heading: 'Your rights',
          paragraphs: [
            'You may request access to, correction of, or deletion of your personal data at any time.',
            `To exercise any of these rights, contact us at ${PRIVACY_EMAIL}.`,
          ],
        },
        {
          heading: 'Retention',
          paragraphs: [
            'We keep order records for as long as required for tax and accounting purposes, and account data until you ask us to delete it.',
          ],
        },
      ]}
    />
  )
}
