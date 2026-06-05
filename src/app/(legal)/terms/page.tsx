import type { Metadata } from 'next'
import { LegalDocument } from '@/components/layout/LegalDocument'
import { APP_NAME, LEGAL_EMAIL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `The terms governing your use of ${APP_NAME}.`,
}

export default function TermsPage(): React.ReactElement {
  return (
    <LegalDocument
      title="Terms of Service"
      effectiveDate="1 January 2026"
      intro={`By using ${APP_NAME}, you agree to these terms. Please read them carefully.`}
      sections={[
        {
          heading: 'Using the store',
          paragraphs: [
            'You must be able to form a binding contract to place an order. You agree to provide accurate account and shipping information.',
            'You are responsible for keeping your account credentials confidential and for activity that occurs under your account.',
          ],
        },
        {
          heading: 'Orders and pricing',
          paragraphs: [
            'All orders are subject to acceptance and availability. We may decline or cancel an order if an item is mispriced or unavailable.',
            'Prices are shown in Indian Rupees and include applicable taxes unless stated otherwise.',
            'This prototype does not process real payments; orders placed here are for demonstration only.',
          ],
        },
        {
          heading: 'Intellectual property',
          paragraphs: [
            `All content on this site — imagery, copy, and design — is owned by ${APP_NAME} and may not be reproduced without permission.`,
          ],
        },
        {
          heading: 'Limitation of liability',
          paragraphs: [
            'The store is provided "as is". To the extent permitted by law, we are not liable for indirect or consequential losses arising from its use.',
          ],
        },
        {
          heading: 'Contact',
          paragraphs: [`Questions about these terms can be sent to ${LEGAL_EMAIL}.`],
        },
      ]}
    />
  )
}
