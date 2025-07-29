import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components"

interface VerificationEmailProps {
  name?: string
  url: string
}

export function VerificationEmail({ name, url }: VerificationEmailProps) {
  const displayName = name ?? "Friend"

  return (
    <Html>
      <Head />
      <Preview>Please confirm your email address to get started with Forum</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-5 pb-12 max-w-[560px]">
            <Heading className="text-black text-2xl font-bold my-10 p-0">Hello {displayName},</Heading>

            <Text className="text-gray-800 text-base leading-[26px]">
              Thanks for creating an account with <strong>Forum</strong>! To get started, we just need to verify your
              email address.
            </Text>

            <Section className="text-center my-[30px]">
              <Button
                className="bg-black rounded text-white text-base font-bold no-underline text-center inline-block py-3 px-6 hover:bg-gray-800"
                href={url}
              >
                Verify My Email
              </Button>
            </Section>

            <Text className="text-gray-800 text-base leading-[26px]">
              If that button doesn&apos;t work, copy & paste this link:
            </Text>

            <Text className="text-gray-800 text-base leading-[26px] break-all">
              <Link href={url} className="text-black underline">
                {url}
              </Link>
            </Text>

            <Text className="text-gray-800 text-base leading-[26px]">This link expires in 1 hour.</Text>

            <Hr className="border-gray-300 border-t border-none my-[30px]" />

            <Text className="text-gray-600 text-base leading-[26px]">
              If you didn&apos;t sign up, just ignore this email.
            </Text>

            <Text className="text-gray-800 text-base leading-[26px]">
              Cheers,
              <br />
              <strong>Forum</strong> Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
