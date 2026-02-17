import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Bot, User, X, MessageSquare, Loader2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
// import { useAssist } from '../lib/hooks/useAssist'; // Todo: Implement this hook

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export function ChatbotPanel() {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: t('chat.welcome', 'Hola, soy tu asistente de calidad de datos. ¿En qué puedo ayudarte hoy?'),
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Mock send function until we have useAssist
    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: t('chat.mock_response', 'Entiendo. Estoy analizando tus datos para encontrar la mejor solución. (Esta es una respuesta simulada por ahora).'),
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
            setIsLoading(false);
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden flex flex-col max-h-[600px] animate-in slide-in-from-bottom-5 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-primary-600 p-4 flex items-center justify-between text-white">
                        <div className="flex items-center space-x-2">
                            <Sparkles className="w-5 h-5" />
                            <h3 className="font-medium">AI Data Steward</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-primary-100 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 rounded-md p-1"
                            aria-label={t('common.close', 'Cerrar')}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-[300px]">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    'flex items-start space-x-2 max-w-[85%]',
                                    msg.role === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''
                                )}
                            >
                                <div
                                    className={cn(
                                        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm',
                                        msg.role === 'assistant' ? 'bg-white text-primary-600' : 'bg-primary-600 text-white'
                                    )}
                                >
                                    {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                </div>
                                <div
                                    className={cn(
                                        'p-3 rounded-lg text-sm shadow-sm',
                                        msg.role === 'assistant'
                                            ? 'bg-white text-gray-800 border border-gray-100'
                                            : 'bg-primary-600 text-white'
                                    )}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-start space-x-2">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white text-primary-600 flex items-center justify-center shadow-sm">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-white border-t border-gray-200">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={t('chat.placeholder', 'Escribe tu pregunta...')}
                                className="block w-full rounded-full border-gray-300 pr-12 focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-3 px-4 shadow-sm bg-gray-50 focus:bg-white transition-colors"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim() || isLoading}
                                className="absolute right-2 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                aria-label={t('common.send', 'Enviar')}
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group flex items-center justify-center w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 hover:scale-105 active:scale-95"
                    aria-label={t('chat.open', 'Abrir chat de asistencia')}
                >
                    <MessageSquare className="w-7 h-7" />
                    <span className="absolute right-0 top-0 flex h-3 w-3 -mt-1 -mr-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                </button>
            )}
        </div>
    );
}
