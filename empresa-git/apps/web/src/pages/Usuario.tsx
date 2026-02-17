import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Uploader } from '../components/Uploader';
import { useDatasets } from '../lib/hooks/useDatasets';
import { ShieldCheck, FileText, CheckCircle } from 'lucide-react';

export default function Usuario() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { upload, isUploading } = useDatasets();

    const handleUpload = async (file: File) => {
        try {
            const dataset = await upload(file);
            // Navigate to the dataset detail page after upload
            // Assuming the API returns the created dataset with an ID
            if (dataset?.id) {
                navigate(`/datasets/${dataset.id}`);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            // Error handling is managed by the Uploader component or global toaster (not yet implemented)
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                    {t('user.title', 'Portal de Usuario de Negocio')}
                </h1>
                <p className="mt-4 text-xl text-gray-500">
                    {t('user.subtitle', 'Sube tus archivos y deja que la IA asegure la calidad.')}
                </p>
            </div>

            <div className="bg-white shadow rounded-lg p-6 sm:p-10 mb-10">
                <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-primary-500" />
                    {t('user.upload_section', 'Nuevo Análisis')}
                </h2>
                <Uploader onUpload={handleUpload} isUploading={isUploading} />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="bg-primary-50 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <ShieldCheck className="h-6 w-6 text-primary-600 mr-2" />
                        <h3 className="text-lg font-medium text-primary-900">
                            {t('user.security_title', 'Seguridad Garantizada')}
                        </h3>
                    </div>
                    <p className="text-primary-700">
                        {t('user.security_desc', 'Tus datos son procesados de forma segura y cumpliendo con RGPD. No compartimos información sensible con modelos externos.')}
                    </p>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                        <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                        <h3 className="text-lg font-medium text-green-900">
                            {t('user.quality_title', 'Calidad Automática')}
                        </h3>
                    </div>
                    <p className="text-green-700">
                        {t('user.quality_desc', 'Detectamos duplicados, errores de formato y valores atípicos automáticamente en segundos.')}
                    </p>
                </div>
            </div>
        </div>
    );
}
