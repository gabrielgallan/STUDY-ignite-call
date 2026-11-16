import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Text, TextArea, TextInput } from '@ignite-ui/react';
import dayjs from 'dayjs';
import { Calendar, Clock } from 'lucide-react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { api } from '@/src/lib/axios';
import { ConfirmForm, FormActions, FormError, FormHeader } from './styles';

const confirmFormSchema = z.object({
    name: z.string().min(3, { message: 'O nome precisa ter pelo menos 3 letras' }),
    email: z.email({ message: 'Digite um e-mail válido' }),
    observations: z.string(),
});

type ConfirmFormData = z.infer<typeof confirmFormSchema>;

interface ConfirmStepProps {
    schedulingDate: Date;
    onCancelConfirmation: () => void;
}

export function ConfirmStep({ schedulingDate, onCancelConfirmation }: ConfirmStepProps) {
    const {
        register,
        formState: { isSubmitting, errors },
        handleSubmit,
    } = useForm<ConfirmFormData>({
        resolver: zodResolver(confirmFormSchema),
    });

    const router = useRouter();
    const username = String(router.query.username);

    async function handleConfirmSchedule(data: ConfirmFormData) {
        const { name, email, observations } = data;

        await api.post(`/users/${username}/schedule`, {
            name,
            email,
            observations,
            date: schedulingDate,
        });

        await router.push(`/schedule/${username}`);
    }

    const describedDate = dayjs(schedulingDate).format('DD[ de ]MMMM[ de ]YYYY');
    const describedTime = dayjs(schedulingDate).format('HH:mm[h]');

    return (
        <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmSchedule)}>
            <FormHeader>
                <Text>
                    <Calendar />
                    {describedDate}
                </Text>

                <Text>
                    <Clock />
                    {describedTime}
                </Text>
            </FormHeader>

            <label htmlFor="name">
                <Text size="sm">Nome completo</Text>
                <TextInput id="name" placeholder="Seu nome" {...register('name')} />
                {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
            </label>

            <label htmlFor="email">
                <Text size="sm">Endereço de e-mail</Text>
                <TextInput id="email" placeholder="john.doe@example.com" type="email" {...register('email')} />
                {errors.email && <FormError size="sm">{errors.email.message}</FormError>}
            </label>

            <label htmlFor="observations">
                <Text size="sm">Observações</Text>
                <TextArea
                    id="observations"
                    placeholder="Alguma observação sobre o agendamento"
                    {...register('observations')}
                />
            </label>

            <FormActions>
                <Button type="button" variant="tertiary" onClick={onCancelConfirmation}>
                    Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    Confirmar
                </Button>
            </FormActions>
        </ConfirmForm>
    );
}
