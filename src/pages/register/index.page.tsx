import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react';
import { AxiosError } from 'axios';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { api } from '@/src/lib/axios';
import { Container, Form, FormError, Header } from './styles';

const registerFormSchema = z.object({
    username: z
        .string()
        .min(3, { message: 'O nome de usuário deve ter pelo menos 3 caracteres.' })
        .regex(/^([a-z\\-]+)$/i, { message: 'O nome de usuário deve conter apenas letras e hífens.' })
        .transform((username) => username.toLowerCase()),
    name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
});

type RegisterFormData = z.infer<typeof registerFormSchema>;

export default function Register() {
    const {
        register,
        formState: { isSubmitting, errors },
        handleSubmit,
        setValue,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormSchema),
    });

    const router = useRouter();

    useEffect(() => {
        if (router.query.username) {
            setValue('username', String(router.query.username));
        }
    }, [router.query.username, setValue]);

    async function handleRegister(data: RegisterFormData) {
        try {
            await api.post('/users', { username: data.username, name: data.name });

            await router.push('/register/connect-calendar');
        } catch (error) {
            if (error instanceof AxiosError && error.response?.data?.message) {
                alert(error.response.data.message);
                return;
            }
        }
    }

    return (
        <Container>
            <Header>
                <Heading as="strong">Bem vindo ao Ignite Call!</Heading>

                <Text>
                    Precisamos de algumas informações para criar seu perfil! Ah, você pode editar essas informações
                    depois.
                </Text>

                <MultiStep size={4} currentStep={1} />
            </Header>
            <Form as="form" onSubmit={handleSubmit(handleRegister)}>
                <label htmlFor="username">
                    <Text size="sm">Nome de usuários</Text>
                    <TextInput {...register('username')} placeholder="seu-usuario" prefix="ignite.com/" />

                    {errors.username && <FormError size="sm">{errors.username.message}</FormError>}
                </label>

                <label htmlFor="name">
                    <Text size="sm">Nome completo</Text>
                    <TextInput {...register('name')} placeholder="Seu nome" />

                    {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
                </label>

                <Button type="submit" size="sm">
                    {isSubmitting ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        <>
                            Próximo passo
                            <ArrowRight />
                        </>
                    )}
                </Button>
            </Form>
        </Container>
    );
}
