import { forwardRef, InputHTMLAttributes } from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '../lib/utils';
import { AlertCircle } from 'lucide-react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    name: string;
    helperText?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
    ({ label, name, helperText, className, type = 'text', ...props }, ref) => {
        const {
            register,
            formState: { errors },
        } = useFormContext();

        const error = errors[name];
        const errorMessage = error?.message as string | undefined;

        return (
            <div className={cn('w-full', className)}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                        id={name}
                        type={type}
                        className={cn(
                            'block w-full rounded-md sm:text-sm focus:ring-primary-500 focus:border-primary-500',
                            error
                                ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                                : 'border-gray-300'
                        )}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${name}-error` : helperText ? `${name}-description` : undefined}
                        {...register(name)}
                        {...props}
                    />
                    {error && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                        </div>
                    )}
                </div>
                {error ? (
                    <p className="mt-2 text-sm text-red-600" id={`${name}-error`}>
                        {errorMessage}
                    </p>
                ) : helperText ? (
                    <p className="mt-2 text-sm text-gray-500" id={`${name}-description`}>
                        {helperText}
                    </p>
                ) : null}
            </div>
        );
    }
);

FormField.displayName = 'FormField';
