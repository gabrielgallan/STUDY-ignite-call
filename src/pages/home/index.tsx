import { Heading, Text } from '@ignite-ui/react';
import Image from 'next/image';
import previewImage from '../../assets/app-preview.png';
import { ClaimUsernameForm } from './components/ClaimUsernameForm';
import { Container, Hero, Preview } from './styles';
import Head from 'next/head';
import { generateNextSeo } from 'next-seo/pages'

export default function Home() {
    return (
        <>
         <Head>
                {generateNextSeo({
                    title: 'Descomplique sua agenda',
                    description: 'Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre.',
                })}
            </Head>
        <Container>
            <Hero>
                <Heading size="4xl">Agendamento descomplicado</Heading>
                <Text size="lg">
                    Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre.
                </Text>

                <ClaimUsernameForm />
            </Hero>

            <Preview>
                <Image
                    src={previewImage}
                    alt="Calendário simbolizando aplicação em funcionamento"
                    height={400}
                    quality={100}
                    priority
                />
            </Preview>
        </Container>
        </>
    );
}
