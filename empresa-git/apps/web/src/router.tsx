import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Usuario from './pages/Usuario';
import Ingenieria from './pages/Ingenieria';
import DatasetLayout from './pages/DatasetDetail/DatasetLayout';
import IssuesTab from './pages/DatasetDetail/IssuesTab';
import PreviewTab from './pages/DatasetDetail/PreviewTab';
import ExportTab from './pages/DatasetDetail/ExportTab';
import Reglas from './pages/Reglas';
import Dashboard from './pages/Dashboard';
import Privacidad from './pages/Privacidad';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'usuario',
                element: <Usuario />,
            },
            {
                path: 'ingenieria',
                element: <Ingenieria />,
            },
            {
                path: 'datasets/:id',
                element: <DatasetLayout />,
                children: [
                    { index: true, element: <IssuesTab /> }, // Default to issues
                    { path: 'issues', element: <IssuesTab /> },
                    { path: 'preview', element: <PreviewTab /> },
                    { path: 'export', element: <ExportTab /> },
                ],
            },
            {
                path: 'reglas',
                element: <Reglas />,
            },
            {
                path: 'dashboard',
                element: <Dashboard />,
            },
            {
                path: 'privacidad',
                element: <Privacidad />,
            },
            {
                path: '*',
                element: <div className="p-8 text-center text-red-600">404 - Página no encontrada</div>,
            },
        ],
    },
]);
