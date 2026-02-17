export const a11yProps = {
    button: (label: string) => ({
        'aria-label': label,
        role: 'button',
    }),
    link: (label: string) => ({
        'aria-label': label,
        role: 'link',
    }),
};

export const focusStyles = 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2';
