const intl = Intl.DateTimeFormat('pt-BR')

export const parseDateToString = (date: Date): string => intl.format(date)

export const parseDateToUTCString = (date: Date): string => date.toISOString().split('.')[0]
