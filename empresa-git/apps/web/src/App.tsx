import { Outlet } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import './lib/i18n'; // Initialize i18n
import ChatbotPanel from './components/ChatbotPanel';
import { PrivacyBanner } from './components/PrivacyBanner';

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
                <NavBar />
                <main className="flex-grow">
                    <Outlet />
                </main>
                <Footer />
                <PrivacyBanner />
                <div className="fixed bottom-6 right-6 z-50">
                    {/* Floating Chatbot */}
                    <ChatbotPanel />
                </div>
            </div>
        </QueryClientProvider>
    );
}

export default App;
