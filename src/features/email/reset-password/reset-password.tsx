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

interface ResetPasswordEmailProps {
  name?: string
  url: string
}

export function ResetPasswordEmail({ name, url }: ResetPasswordEmailProps) {
  const displayName = name ?? "there"

  return (
    <Html>
      <Head />
      <Preview>Reset your Forum account password</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-5 pb-12 max-w-[560px]">
            <Heading className="text-black text-2xl font-bold my-10 p-0">Hello {displayName},</Heading>

            <Text className="text-gray-800 text-base leading-[26px]">
              You requested a password reset for your Forum account.
            </Text>

            <Section className="text-center my-[30px]">
              <Button
                className="bg-black rounded text-white text-base font-bold no-underline text-center inline-block py-3 px-6 hover:bg-gray-800"
                href={url}
              >
                Reset Password
              </Button>
            </Section>

            <Text className="text-gray-800 text-base leading-[26px]">If that link doesn&apos;t work, copy & paste:</Text>

            <Text className="text-gray-800 text-base leading-[26px] break-all">
              <Link href={url} className="text-black underline">
                {url}
              </Link>
            </Text>

            <Text className="text-gray-800 text-base leading-[26px]">This link expires in 1 hour.</Text>

            <Hr className="border-gray-300 border-t border-none my-[30px]" />

            <Text className="text-gray-600 text-base leading-[26px]">
              If you didn&apos;t request this, ignore this email.
            </Text>

            <Text className="text-gray-800 text-base leading-[26px]">
              Thank you,
              <br />
              Forum Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
