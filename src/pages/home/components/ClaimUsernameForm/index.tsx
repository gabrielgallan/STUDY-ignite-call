import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Text, TextInput } from '@ignite-ui/react';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Form, FormAnnotation } from './styles';

const claimUsernameFormSchema = z.object({
    username: z
        .string()
        .min(3, { message: 'O nome de usuário deve ter pelo menos 3 caracteres.' })
        .regex(/^([a-z\\-]+)$/i, { message: 'O nome de usuário deve conter apenas letras e hífens.' })
        .transform((username) => username.toLowerCase()),
});

type ClaimUsernameFormData = z.infer<typeof claimUsernameFormSchema>;

export function ClaimUsernameForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ClaimUsernameFormData>({
        resolver: zodResolver(claimUsernameFormSchema),
    });

    const router = useRouter();

    async function handlePreRegister(data: ClaimUsernameFormData) {
        const { username } = data;

        await router.push(`/register?username=${username}`);
    }

    return (
        <>
            <Form as="form" onSubmit={handleSubmit(handlePreRegister)}>
                <TextInput size="sm" prefix="ignite.com/" placeholder="seu-usuario" {...register('username')} />
                <Button size="sm" type="submit">
                    Reservar
                    <ArrowRight />
                </Button>
            </Form>

            <FormAnnotation>
                <Text size="sm">{errors.username ? errors.username.message : 'Digite um nome de usuário'}</Text>
            </FormAnnotation>
        </>
    );
}
