export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="md:flex md:items-center md:justify-between">
                    <div className="flex justify-center md:order-2">
                        <p className="text-sm text-gray-500">
                            Datos protegidos por RGPD. Retención de 30 días.
                        </p>
                    </div>
                    <div className="mt-8 md:mt-0 md:order-1">
                        <p className="text-center text-sm text-gray-400">
                            &copy; {new Date().getFullYear()} AI Data Steward. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
