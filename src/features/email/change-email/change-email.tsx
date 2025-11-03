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
} from "@react-email/components";

interface ChangeEmailVerificationProps {
  name?: string;
  url: string;
}

export function ChangeEmailVerification({
  name,
  url,
}: ChangeEmailVerificationProps) {
  const displayName = name ?? "Friend";

  return (
    <Html>
      <Head />
      <Preview>
        Please confirm your new email address to complete your change
      </Preview>

      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-5 pb-12 max‑w‑[560px]">
            <Heading className="text-black text-2xl font-bold my-10 p-0">
              Hi {displayName},
            </Heading>

            <Text className="text-gray-800 text-base leading-[26px]">
              You recently requested to update the email address associated with
              your <strong>Forum</strong> account. To complete the change, please
              verify your new email address by clicking the button below:
            </Text>

            <Section className="text-center my-[30px]">
              <Button
                href={url}
                className="bg-black rounded text-white text-base font-bold no-underline inline-block py-3 px-6 hover:bg-gray-800"
              >
                Confirm New Email Address
              </Button>
            </Section>

            <Text className="text-gray-800 text-base leading-[26px]">
              Or copy & paste this link into your browser:
            </Text>

            <Text
              className="text-gray-800 text-base leading-[26px] break-all"
            >
              <Link href={url} className="text-black underline">
                {url}
              </Link>
            </Text>

            <Text className="text-gray-800 text-base leading-[26px]">
              This verification link will expire in 1 hour.
            </Text>

            <Hr className="border-gray-300 border‑t border-none my-[30px]" />

            <Text className="text-gray-600 text-base leading-[26px]">
              Didn’t request this change? You can ignore this email and your
              current email will remain unchanged.
            </Text>

            <Text className="text-gray-800 text-base leading-[26px]">
              Thanks,
              <br />
              The <strong>Forum</strong> Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
