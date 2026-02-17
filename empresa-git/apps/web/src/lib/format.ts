export const formatCurrency = (amount: number, currency = 'EUR') => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency,
    }).format(amount);
};

export const formatDate = (date: string | Date | undefined | null) => {
    if (!date) return '-';
    return new Intl.DateTimeFormat('es-ES', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(date));
};

export const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-ES').format(num);
};

export const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
