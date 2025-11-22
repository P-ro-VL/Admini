'use client';

import { ComponentConfig } from '@/lib/types';

interface IframeComponentProps {
    component: ComponentConfig;
}

export default function IframeComponent({ component }: IframeComponentProps) {
    const iframeCode = component.props?.iframeCode as string;
    const url = component.props?.url as string;
    const height = component.props?.height as string || '600px';

    // If iframe code is provided, render it directly
    if (iframeCode) {
        return (
            <div
                className="my-4 rounded-lg overflow-hidden border border-gray-200"
                dangerouslySetInnerHTML={{ __html: iframeCode }}
            />
        );
    }

    // If URL is provided, create an iframe
    if (url) {
        return (
            <div className="my-4 rounded-lg overflow-hidden border border-gray-200">
                <iframe
                    src={url}
                    style={{ width: '100%', height }}
                    className="border-0"
                    title={component.label || 'Embedded content'}
                    allowFullScreen
                />
            </div>
        );
    }

    // No configuration
    return (
        <div className="my-4 p-8 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-400">
            <p>Configure iframe URL or code in properties panel</p>
        </div>
    );
}
