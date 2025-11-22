'use client';

import { ComponentConfig } from '@/lib/types';

interface PdfComponentProps {
    component: ComponentConfig;
}

export default function PdfComponent({ component }: PdfComponentProps) {
    const pdfUrl = component.props?.url || '';
    const height = component.props?.height || '600px';

    if (!pdfUrl) {
        return (
            <div className="p-8 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                <p className="text-yellow-700">No PDF URL configured</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {component.label && (
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">{component.label}</h3>
                </div>
            )}
            <div className="p-4">
                <iframe
                    src={pdfUrl}
                    className="w-full border border-gray-300 rounded"
                    style={{ height }}
                    title={component.label || 'PDF Viewer'}
                />
            </div>
        </div>
    );
}
