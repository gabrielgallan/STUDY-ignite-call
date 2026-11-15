import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getWeekDays } from '@/src/utils/get-week-days';
import { CalendarActions, CalendarBody, CalendarContainer, CalendarDay, CalendarHeader, CalendarTitle } from './styles';

interface CalendarWeek {
    week: number;
    days: Array<{
        date: dayjs.Dayjs;
        disabled: boolean;
    }>;
}

interface CalendarProps {
    selectedDate: Date | null;
    onDateSelected: (date: Date) => void;
}

export function Calendar({ selectedDate, onDateSelected }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(() => {
        return dayjs().set('date', 1);
    });

    function handlePreviousMonth() {
        const previousMonthDate = currentDate.subtract(1, 'month');

        setCurrentDate(previousMonthDate);
    }

    function handleNextMonth() {
        const nextMonthDate = currentDate.add(1, 'month');

        setCurrentDate(nextMonthDate);
    }

    const shortWeekDays = getWeekDays({ short: true });

    const currentMonth = currentDate.format('MMMM');
    const currentYear = currentDate.format('YYYY');

    const calendarWeeks = useMemo(() => {
        const daysInMonthArray = Array.from({ length: currentDate.daysInMonth() }, (_, i) => {
            return currentDate.set('date', i + 1);
        });

        const firstWeekDay = currentDate.get('day');

        const previousMonthFillArray = Array.from({ length: firstWeekDay })
            .map((_, i) => {
                return currentDate.subtract(i + 1, 'day');
            })
            .reverse();

        const lastDayInCurrentMonth = currentDate.set('date', currentDate.daysInMonth());
        const lastWeekDay = lastDayInCurrentMonth.get('day');

        const nextMonthFillArray = Array.from({ length: 6 - lastWeekDay }).map((_, i) => {
            return lastDayInCurrentMonth.add(i + 1, 'day');
        });

        const calendarDays = [
            ...previousMonthFillArray.map((date) => {
                return { date, disabled: true };
            }),
            ...daysInMonthArray.map((date) => {
                return { date, disabled: date.endOf('day').isBefore(dayjs().endOf('day')) };
            }),
            ...nextMonthFillArray.map((date) => {
                return { date, disabled: true };
            }),
        ];

        const calendarWeeks = calendarDays.reduce<CalendarWeek[]>((weeks, _, i, original) => {
            const isNewWeek = i % 7 === 0;

            if (isNewWeek) {
                weeks.push({ week: i / 7 + 1, days: [original[i]] });
            } else {
                weeks[weeks.length - 1].days.push(original[i]);
            }

            return weeks;
        }, []);

        return calendarWeeks;
    }, [currentDate]);

    return (
        <CalendarContainer>
            <CalendarHeader>
                <CalendarTitle>
                    {currentMonth} <span>{currentYear}</span>
                </CalendarTitle>
                <CalendarActions>
                    <button type="button" onClick={handlePreviousMonth}>
                        <ChevronLeft />
                    </button>
                    <button type="button" onClick={handleNextMonth}>
                        <ChevronRight />
                    </button>
                </CalendarActions>
            </CalendarHeader>

            <CalendarBody>
                <thead>
                    <tr>
                        {shortWeekDays.map((weekDay) => (
                            <th key={weekDay}>{weekDay}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {calendarWeeks.map(({ week, days }) => {
                        return (
                            <tr key={week}>
                                {days.map((day) => (
                                    <td key={day.date.toISOString()}>
                                        <CalendarDay
                                            disabled={day.disabled}
                                            onClick={() => onDateSelected(day.date.toDate())}
                                        >
                                            {day.date.format('D')}
                                        </CalendarDay>
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </CalendarBody>
        </CalendarContainer>
    );
}
