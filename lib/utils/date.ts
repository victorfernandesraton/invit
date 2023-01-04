const intl = (lang = 'pt-BR', opt?: Intl.DateTimeFormatOptions) => Intl.DateTimeFormat(lang, opt)

export const parseDateToString = (date: Date): string => intl().format(date)

export const parseDateToUTCString = (date: Date): string => date.toISOString().split('.')[0]

export const parseDateToDefaultString = (date: Date): string => date.toISOString().split('.')[0].slice(0, -3)
