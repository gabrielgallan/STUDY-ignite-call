interface GetWeekDaysParams {
    short?: boolean;
}

export function getWeekDays({ short = false }: GetWeekDaysParams = {}) {
    const formatter = new Intl.DateTimeFormat('pt-BR', {
        weekday: 'long',
        timeZone: 'UTC',
    });

    return Array.from({ length: 7 }, (_, day) =>
        formatter.format(new Date(Date.UTC(2021, 5, day + 7))),
    ).map((weekDay) => {
        if (short) {
            return weekDay.substring(0, 3).toUpperCase();
        }

        return weekDay.substring(0, 1).toUpperCase() + weekDay.substring(1);
    });
}