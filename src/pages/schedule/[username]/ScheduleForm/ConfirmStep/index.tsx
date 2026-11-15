import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Text, TextArea, TextInput } from '@ignite-ui/react';
import { Calendar, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { ConfirmForm, FormActions, FormError, FormHeader } from './styles';

const confirmFormSchema = z.object({
    name: z.string().min(3, { message: 'O nome precisa ter pelo menos 3 letras' }),
    email: z.email({ message: 'Digite um e-mail válido' }),
    observations: z.string(),
});

type ConfirmFormData = z.infer<typeof confirmFormSchema>;

export function ConfirmStep() {
    const {
        register,
        formState: { isSubmitting, errors },
        handleSubmit,
    } = useForm<ConfirmFormData>({
        resolver: zodResolver(confirmFormSchema),
    });

    function handleConfirmSchedule(data: ConfirmFormData) {
        console.log(data);
    }

    return (
        <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmSchedule)}>
            <FormHeader>
                <Text>
                    <Calendar />
                    22 de setembro de 2022
                </Text>

                <Text>
                    <Clock />
                    18:00h
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
                <Button type="button" variant="tertiary">
                    Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    Confirmar
                </Button>
            </FormActions>
        </ConfirmForm>
    );
}
