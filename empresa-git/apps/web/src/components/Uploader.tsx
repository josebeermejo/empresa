import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle, Loader2 } from 'lucide-react'; import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils'; // I need to create this utility or use clsx directly

interface UploaderProps {
    onUpload: (file: File) => Promise<void>;
    isUploading: boolean;
    accept?: Record<string, string[]>;
    maxSize?: number;
}

export function Uploader({ onUpload, isUploading, accept, maxSize = 10 * 1024 * 1024 }: UploaderProps) {
    const { t } = useTranslation();

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                onUpload(acceptedFiles[0]);
            }
        },
        [onUpload]
    );

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
        onDrop,
        accept: accept || {
            'text/csv': ['.csv'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/json': ['.json'],
        },
        maxFiles: 1,
        maxSize,
        disabled: isUploading,
    });

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={cn(
                    'border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    isDragActive
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-primary-400 bg-gray-50',
                    isUploading && 'opacity-50 cursor-not-allowed'
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 bg-white rounded-full shadow-sm">
                        {isUploading ? (
                            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                        ) : (
                            <Upload className="w-8 h-8 text-primary-600" />
                        )}
                    </div>
                    <div className="space-y-1">
                        <p className="text-lg font-medium text-gray-900">
                            {isDragActive
                                ? t('uploader.drop_here', 'Suelta el archivo aquí')
                                : t('uploader.drag_drop', 'Arrastra y suelta tu archivo aquí')}
                        </p>
                        <p className="text-sm text-gray-500">
                            {t('uploader.or_browse', 'o haz clic para seleccionar')}
                        </p>
                    </div>
                    <p className="text-xs text-gray-400">
                        CSV, Excel, JSON (Max {Math.round(maxSize / 1024 / 1024)}MB)
                    </p>
                </div>
            </div>

            {fileRejections.length > 0 && (
                <div className="mt-4 p-4 bg-red-50 rounded-md flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                        <h3 className="text-sm font-medium text-red-800">
                            {t('uploader.error_title', 'Error al subir archivo')}
                        </h3>
                        <div className="mt-1 text-sm text-red-700">
                            <ul className="list-disc pl-5 space-y-1">
                                {fileRejections.map(({ file, errors }) => (
                                    <li key={file.name}>
                                        {file.name}: {errors.map((e) => e.message).join(', ')}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
