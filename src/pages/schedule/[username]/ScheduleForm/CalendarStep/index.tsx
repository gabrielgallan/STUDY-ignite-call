import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { Calendar } from '@/src/components/Calendar';
import { api } from '@/src/lib/axios';
import { Container, TimePicker, TimePickerHeader, TimePickerItem, TimePickerList } from './styles';

interface Availability {
    possibleTimes: number[];
    availableTimes: number[];
}

export interface CalendarStepProps {
    onSelectDateTime: (date: Date) => void;
}

export function CalendarStep({ onSelectDateTime }: CalendarStepProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const router = useRouter();

    const isDateSelected = !!selectedDate;
    const username = typeof router.query.username === 'string' ? router.query.username : undefined;

    const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null;

    const describedDate = selectedDate ? dayjs(selectedDate).format('DD [de] MMMM') : null;

    const selectedDateWithoutTime = selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : null;

    function handleSelectTime(hour: number) {
        const dateWithTime = dayjs(selectedDate).set('hour', hour).startOf('hour').toDate();

        onSelectDateTime(dateWithTime);
    }

    const {
        data: availability,
        isLoading,
        isError,
    } = useQuery<Availability>({
        queryKey: ['availability', username, selectedDateWithoutTime],
        queryFn: async () => {
            const response = await api.get<Availability>(`/users/${username}/availability`, {
                params: {
                    date: selectedDateWithoutTime,
                },
            });

            return response.data;
        },
        enabled: !!selectedDateWithoutTime && !!username,
    });

    return (
        <Container isTimePickerOpen={isDateSelected}>
            <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

            {isDateSelected && (
                <TimePicker>
                    <TimePickerHeader>
                        {weekDay} <span>{describedDate}</span>
                    </TimePickerHeader>

                    {isLoading && <p>Carregando horários...</p>}
                    {isError && <p>Erro ao carregar horários.</p>}

                    <TimePickerList>
                        {availability?.possibleTimes.map((hour) => (
                            <TimePickerItem
                                key={hour}
                                onClick={() => handleSelectTime(hour)}
                                disabled={!availability.availableTimes.includes(hour)}
                            >
                                {String(hour).padStart(2, '0')}:00h
                            </TimePickerItem>
                        ))}
                    </TimePickerList>
                </TimePicker>
            )}
        </Container>
    );
}
