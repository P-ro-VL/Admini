'use client';

import { useState, useEffect } from 'react';

import { PageConfig, ApiConfig, ComponentConfig } from '@/lib/types';
import TableComponent from './TableComponent';
import FormComponent from './FormComponent';
import DetailComponent from './DetailComponent';
import ButtonComponent from './ButtonComponent';
import FormContainerComponent from './FormContainerComponent';
import FormFieldComponent from './FormFieldComponent';
import { useStore } from '@/lib/store';
import PdfComponent from './PdfComponent';
import IframeComponent from './IframeComponent';


interface PageRendererProps {
    page: PageConfig;
    apis: ApiConfig[];
    params?: Record<string, string>;
    pages?: any[];
}

export default function PageRenderer({ page, apis, params, pages = [] }: PageRendererProps) {
    const [authToken, setAuthToken] = useState<string | null>(null);
    const hasAuthApi = apis.some((a) => a.isAuth);
    const [isAuthReady, setIsAuthReady] = useState(!hasAuthApi);

    useEffect(() => {
        if (!hasAuthApi) return;

        const authApi = apis.find((a) => a.isAuth);
        if (authApi) {
            const fetchToken = async () => {
                try {
                    const headers: Record<string, string> = {};
                    authApi.headers.forEach((h) => {
                        headers[h.key] = h.value;
                    });

                    if (authApi.body) {
                        headers['Content-Type'] = 'application/json';
                    }

                    const res = await fetch(authApi.url, {
                        method: authApi.method,
                        headers,
                        body: authApi.body,
                    });

                    if (res.ok) {
                        const data = await res.json();
                        // Extract token using tokenPath
                        if (authApi.tokenPath) {
                            const token = authApi.tokenPath.split('.').reduce((obj: any, key: string) => obj?.[key], data);
                            if (typeof token === 'string') {
                                setAuthToken(token);
                            }
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch auth token', error);
                } finally {
                    setIsAuthReady(true);
                }
            };
            fetchToken();
        }
    }, [apis, hasAuthApi]);

    if (!isAuthReady) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-500">Initializing application...</div>
            </div>
        );
    }

    const renderComponent = (component: ComponentConfig) => {
        const api = apis.find((a) => a.id === component.apiId);

        switch (component.type) {
            case 'table':
                return <TableComponent key={component.id} component={component} api={api} authToken={authToken} params={params} pages={pages} apis={apis} />;
            case 'form':
                return <FormComponent key={component.id} component={component} api={api} authToken={authToken} params={params} />;
            case 'detail':
                return <DetailComponent key={component.id} component={component} api={api} authToken={authToken} params={params} />;
            case 'text':
                return (
                    <div key={component.id} className="prose max-w-none my-4">
                        {component.props?.content || ''}
                    </div>
                );
            case 'image':
                // eslint-disable-next-line @next/next/no-img-element
                return <img key={component.id} src={component.props?.src} alt={component.label} className="max-w-full h-auto rounded-lg my-4" />;
            case 'pdf':
                return <PdfComponent key={component.id} component={component} />;
            case 'iframe':
                return <IframeComponent key={component.id} component={component} />;
            case 'layout_2col':
                return (
                    <div key={component.id} className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
                        {component.children?.map(renderComponent)}
                    </div>
                );
            case 'layout_3col':
                return (
                    <div key={component.id} className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
                        {component.children?.map(renderComponent)}
                    </div>
                );
            case 'container':
                return (
                    <div key={component.id} className="p-4 border rounded-lg my-4">
                        {component.children?.map(renderComponent)}
                    </div>
                );
            case 'form_container':
                return (
                    <FormContainerComponent key={component.id} component={component} api={api} authToken={authToken} params={params}>
                        {component.children?.map(renderComponent)}
                    </FormContainerComponent>
                );
            case 'form_text':
            case 'form_password':
            case 'form_checkbox':
            case 'form_multi_checkbox':
            case 'form_radio':
            case 'form_select':
            case 'form_file':
                // For fields, we might need a specific API for default values if configured
                // The component.apiId on a field refers to the API used for fetching default values
                return <FormFieldComponent key={component.id} component={component} api={api} authToken={authToken} params={params} />;
            case 'button':
                return (
                    <ButtonComponent
                        key={component.id}
                        component={component}
                        api={apis.find((a) => a.id === component.apiId)}
                        pages={useStore.getState().pages}
                        authToken={null}
                        params={params}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
                {page.name && <h1 className="text-3xl font-bold text-gray-900 mb-8">{page.name}</h1>}
                <div className="space-y-6">
                    {page.components.map(renderComponent)}
                </div>
            </div>
        </div>
    );
}
