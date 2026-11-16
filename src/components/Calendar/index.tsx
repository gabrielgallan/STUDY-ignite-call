import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';

import { api } from '@/src/lib/axios';
import { getWeekDays } from '@/src/utils/get-week-days';
import { CalendarActions, CalendarBody, CalendarContainer, CalendarDay, CalendarHeader, CalendarTitle } from './styles';

interface CalendarWeek {
    week: number;
    days: Array<{
        date: dayjs.Dayjs;
        disabled: boolean;
    }>;
}

type CalendarWeeks = CalendarWeek[];

interface BlockedDates {
    blockedWeekDays: number[];
    blockedDates: number[];
}

interface CalendarProps {
    selectedDate: Date | null;
    onDateSelected: (date: Date) => void;
}

export function Calendar({ selectedDate, onDateSelected }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(() => dayjs().startOf('month'));

    const router = useRouter();

    const username = typeof router.query.username === 'string' ? router.query.username : undefined;

    const year = currentDate.year();
    const month = currentDate.month() + 1;

    const shortWeekDays = getWeekDays({ short: true });

    const currentMonth = currentDate.format('MMMM');
    const currentYear = currentDate.format('YYYY');

    const isPreviousMonthDisabled = !currentDate.isAfter(dayjs().startOf('month'), 'month');

    function handlePreviousMonth() {
        if (isPreviousMonthDisabled) return;

        setCurrentDate((date) => date.subtract(1, 'month'));
    }

    function handleNextMonth() {
        setCurrentDate((date) => date.add(1, 'month'));
    }

    const {
        data: blockedDates,
        isLoading,
        isError,
    } = useQuery<BlockedDates>({
        queryKey: ['blocked-dates', username, year, month],
        queryFn: async () => {
            const response = await api.get<BlockedDates>(`/users/${username}/blocked-dates`, {
                params: { year, month },
            });

            return response.data;
        },
        enabled: !!username,
    });

    const calendarWeeks = useMemo<CalendarWeeks>(() => {
        if (!blockedDates) return [];

        const daysInMonthArray = Array.from({ length: currentDate.daysInMonth() }, (_, index) =>
            currentDate.date(index + 1),
        );

        const firstWeekDay = currentDate.day();

        const previousMonthFillArray = Array.from({ length: firstWeekDay }, (_, index) =>
            currentDate.subtract(firstWeekDay - index, 'day'),
        );

        const lastDayInCurrentMonth = currentDate.endOf('month');
        const lastWeekDay = lastDayInCurrentMonth.day();

        const nextMonthFillArray = Array.from({ length: 6 - lastWeekDay }, (_, index) =>
            lastDayInCurrentMonth.add(index + 1, 'day'),
        );

        const calendarDays = [
            ...previousMonthFillArray.map((date) => ({
                date,
                disabled: true,
            })),

            ...daysInMonthArray.map((date) => ({
                date,
                disabled:
                    date.isBefore(dayjs(), 'day') ||
                    blockedDates.blockedWeekDays.includes(date.day()) ||
                    blockedDates.blockedDates.includes(date.date()),
            })),

            ...nextMonthFillArray.map((date) => ({
                date,
                disabled: true,
            })),
        ];

        return calendarDays.reduce<CalendarWeeks>((weeks, _, index, original) => {
            if (index % 7 === 0) {
                weeks.push({
                    week: index / 7 + 1,
                    days: original.slice(index, index + 7),
                });
            }

            return weeks;
        }, []);
    }, [currentDate, blockedDates]);

    return (
        <CalendarContainer>
            <CalendarHeader>
                <CalendarTitle>
                    {currentMonth} <span>{currentYear}</span>
                </CalendarTitle>

                <CalendarActions>
                    <button
                        type="button"
                        title="Previous month"
                        onClick={handlePreviousMonth}
                        disabled={isPreviousMonthDisabled}
                    >
                        <ChevronLeft />
                    </button>

                    <button type="button" title="Next month" onClick={handleNextMonth}>
                        <ChevronRight />
                    </button>
                </CalendarActions>
            </CalendarHeader>

            {isLoading && <p>Carregando calendário...</p>}
            {isError && <p>Erro ao carregar calendário.</p>}

            <CalendarBody>
                <thead>
                    <tr>
                        {shortWeekDays.map((weekDay) => (
                            <th key={weekDay}>{weekDay}.</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {calendarWeeks.map(({ week, days }) => (
                        <tr key={week}>
                            {days.map(({ date, disabled }) => (
                                <td key={date.format('YYYY-MM-DD')}>
                                    <CalendarDay
                                        type="button"
                                        onClick={() => onDateSelected(date.toDate())}
                                        disabled={disabled}
                                        aria-pressed={selectedDate ? dayjs(selectedDate).isSame(date, 'day') : false}
                                    >
                                        {date.date()}
                                    </CalendarDay>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </CalendarBody>
        </CalendarContainer>
    );
}
