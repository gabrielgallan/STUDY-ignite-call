import { Button, Heading, MultiStep, Text } from '@ignite-ui/react';
import { ArrowRight } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { Container, Header } from '../styles';
import { ConnectBox, ConnectItem } from './styles';

export default function ConnectCalendar() {
    // async function handleRegister(data: RegisterFormData) {
    // }

    return (
        <Container>
            <Header>
                <Heading as="strong">Bem vindo ao Ignite Call!</Heading>

                <Text>
                    Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas informações
                    depois.
                </Text>

                <MultiStep size={4} currentStep={2} />
            </Header>

            <ConnectBox>
                <ConnectItem>
                    <Text>Google Calendar</Text>

                    <Button variant="secondary" size="sm" onClick={() => signIn('google')}>
                        Conectar
                        <ArrowRight />
                    </Button>
                </ConnectItem>

                <Button type="submit" size="sm">
                    Próximo passo
                    <ArrowRight />
                </Button>
            </ConnectBox>
        </Container>
    );
}
