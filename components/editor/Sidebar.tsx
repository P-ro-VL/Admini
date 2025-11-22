'use client';

import { useDraggable } from '@dnd-kit/core';
import { ComponentType } from '@/lib/types';
import { Table, FileText, Type, Image, Box, FormInput, Lock, CheckSquare, Circle, ChevronDown, Upload, MousePointerClick, File, LayoutTemplate, List, Columns2, Columns3, Monitor } from 'lucide-react';

import { useLanguage } from '@/lib/contexts/LanguageContext';
import LanguageSwitcher from '../ui/LanguageSwitcher';

const DraggableItem = ({ type, label, icon: Icon }: { type: ComponentType; label: string; icon: any }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `sidebar-${type}`,
        data: {
            type: 'sidebar-item',
            componentType: type,
        },
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className="flex items-center p-3 mb-2 bg-white border border-gray-200 rounded-lg cursor-grab hover:border-blue-500 hover:shadow-sm transition-all"
        >
            <Icon className="w-5 h-5 mr-3 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
    );
};

export default function Sidebar() {
    const { t } = useLanguage();

    const layoutItems = [
        { type: 'layout_2col' as ComponentType, label: t('sidebar.twoColumns'), icon: Columns2 },
        { type: 'layout_3col' as ComponentType, label: t('sidebar.threeColumns'), icon: Columns3 },
    ];

    const items = [
        { type: 'table' as ComponentType, label: t('sidebar.dataTable'), icon: Table },
        { type: 'form' as ComponentType, label: t('sidebar.legacyForm'), icon: FormInput },
        { type: 'detail' as ComponentType, label: t('sidebar.detailView'), icon: FileText },
        { type: 'text' as ComponentType, label: t('sidebar.textBlock'), icon: Type },
        { type: 'image' as ComponentType, label: t('sidebar.image'), icon: Image },
        { type: 'button' as ComponentType, label: t('sidebar.button'), icon: MousePointerClick },
        { type: 'pdf' as ComponentType, label: t('sidebar.pdfViewer'), icon: File },
        { type: 'iframe' as ComponentType, label: t('sidebar.iframe'), icon: Monitor },
        { type: 'container' as ComponentType, label: t('sidebar.container'), icon: Box },
    ];

    const formItems = [
        { type: 'form_container' as ComponentType, label: t('sidebar.formContainer'), icon: LayoutTemplate },
        { type: 'form_text' as ComponentType, label: t('sidebar.textField'), icon: Type },
        { type: 'form_password' as ComponentType, label: t('sidebar.password'), icon: Lock },
        { type: 'form_checkbox' as ComponentType, label: t('sidebar.checkbox'), icon: CheckSquare },
        { type: 'form_multi_checkbox' as ComponentType, label: t('sidebar.multiCheckbox'), icon: List },
        { type: 'form_radio' as ComponentType, label: t('sidebar.radioGroup'), icon: Circle },
        { type: 'form_select' as ComponentType, label: t('sidebar.dropdown'), icon: ChevronDown },
        { type: 'form_file' as ComponentType, label: t('sidebar.fileUpload'), icon: Upload },
    ];

    return (
        <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto h-full flex flex-col">
            <div className="flex-1">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">{t('sidebar.layouts')}</h3>
                <div className="space-y-1">
                    {layoutItems.map((item) => (
                        <DraggableItem key={item.type} type={item.type} label={item.label} icon={item.icon} />
                    ))}
                    <div className="h-px bg-gray-200 my-4" />
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('sidebar.components')}</h4>
                    {items.map((item) => (
                        <DraggableItem key={item.type} type={item.type} label={item.label} icon={item.icon} />
                    ))}
                    <div className="h-px bg-gray-200 my-4" />
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{t('sidebar.formElements')}</h4>
                    {formItems.map((item) => (
                        <DraggableItem key={item.type} type={item.type} label={item.label} icon={item.icon} />
                    ))}
                </div>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-200">
                <LanguageSwitcher />
            </div>
        </div>
    );
}
