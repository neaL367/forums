import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text, Tailwind } from "@react-email/components"

interface UsernameReminderEmailProps {
  name?: string
  username: string
}

export function UsernameReminderEmail({ name, username }: UsernameReminderEmailProps) {
  const displayName = name ?? "there"

  return (
    <Html>
      <Head />
      <Preview>Your Forum username reminder</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-5 pb-12 max-w-[560px]">
            <Heading className="text-black text-2xl font-bold my-10 p-0">Hello {displayName},</Heading>

            <Text className="text-gray-800 text-base leading-[26px]">
              You recently requested to recover your username for your Forum account.
            </Text>

            <Section className="bg-gray-100 border-l-4 border-black p-[15px] my-[25px] rounded">
              <Text className="m-0 text-base text-gray-800">
                Your username is: <strong className="text-lg text-black">{username}</strong>
              </Text>
            </Section>

            <Text className="text-gray-800 text-base leading-[26px]">
              You can use this username to sign in to your account.
            </Text>

            <Hr className="border-gray-300 border-t border-none my-[30px]" />

            <Text className="text-gray-600 text-base leading-[26px]">
              If you did not make this request, please ignore this email or contact support if you&apos;re concerned about
              your account security.
            </Text>

            <Text className="text-gray-800 text-base leading-[26px]">
              Thank you,
              <br />
              <strong>Forum</strong> Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
