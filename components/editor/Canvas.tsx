'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { ComponentConfig } from '@/lib/types';
import { clsx } from 'clsx';
import { GripVertical } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface DroppableColumnProps {
    parentId: string;
    columnIndex: number;
    children: React.ReactNode;
}

const DroppableColumn = ({ parentId, columnIndex, children }: DroppableColumnProps) => {
    const { setNodeRef, isOver } = useDroppable({
        id: `${parentId}-col-${columnIndex}`,
        data: {
            type: 'column',
            parentId,
            columnIndex,
        },
    });

    return (
        <div
            ref={setNodeRef}
            className={`min-h-[100px] rounded border-2 border-dashed p-2 transition-colors ${isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                }`}
        >
            {children && React.Children.count(children) > 0 ? (
                <div className="space-y-2">{children}</div>
            ) : (
                <div className="flex items-center justify-center h-20 text-gray-400 text-sm">
                    Drop components here
                </div>
            )}
        </div>
    );
};

interface ComponentItemProps {
    components: ComponentConfig[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

interface CanvasProps {
    components: ComponentConfig[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

const EditorComponent = ({ component, selectedId, onSelect }: { component: ComponentConfig; selectedId: string | null; onSelect: (id: string) => void }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: component.id,
        data: { type: 'container', component },
        disabled: component.type !== 'form_container' && component.type !== 'container',
    });

    return (
        <div
            ref={setNodeRef}
            onClick={(e) => {
                e.stopPropagation();
                onSelect(component.id);
            }}
            className={clsx(
                "p-3 border rounded-lg cursor-pointer relative group transition-all mb-2",
                selectedId === component.id ? "border-blue-600 ring-2 ring-blue-100" : "border-gray-200",
                isOver && (component.type === 'form_container' || component.type === 'container' || component.type === 'layout_2col' || component.type === 'layout_3col') ? "bg-blue-50 border-blue-400" : "bg-white",
                "hover:border-blue-300"
            )}
        >
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-gray-100 px-2 py-1 rounded text-xs text-gray-500 z-10 pointer-events-none">
                {component.label || component.type}
            </div>

            {/* Component Preview Render */}
            <div>
                {component.type === 'table' && (
                    <div className="h-32 bg-gray-50 rounded border border-gray-100 flex items-center justify-center text-gray-400">
                        Table Placeholder
                    </div>
                )}
                {component.type === 'form' && (
                    <div className="space-y-2">
                        <div className="h-8 bg-gray-50 rounded w-full" />
                        <div className="h-8 bg-gray-50 rounded w-2/3" />
                        <div className="h-8 bg-blue-100 rounded w-24 mt-2" />
                    </div>
                )}
                {component.type === 'text' && (
                    <p className="text-gray-800">{component.props?.content || 'Text content...'}</p>
                )}

                {(component.type === 'form_container' || component.type === 'container') && (
                    <div className="min-h-[100px] p-2 border border-dashed border-gray-200 rounded bg-gray-50/50 pointer-events-auto">
                        {component.children && component.children.length > 0 ? (
                            component.children.map((child) => (
                                <EditorComponent key={child.id} component={child} selectedId={selectedId} onSelect={onSelect} />
                            ))
                        ) : (
                            <div className="h-full flex items-center justify-center text-xs text-gray-400">
                                Drop fields here
                            </div>
                        )}
                    </div>
                )}

                {component.type.startsWith('form_') && component.type !== 'form_container' && (
                    <div className="pointer-events-none">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                            {component.label || component.props?.name || 'Field'}
                        </label>
                        {component.type === 'form_text' && <div className="h-8 border rounded bg-white" />}
                        {component.type === 'form_password' && <div className="h-8 border rounded bg-white flex items-center px-2 text-gray-400">••••••••</div>}
                        {component.type === 'form_checkbox' && <div className="h-4 w-4 border rounded bg-white" />}
                        {component.type === 'form_multi_checkbox' && (
                            <div className="space-y-1">
                                <div className="flex items-center"><div className="h-3 w-3 border rounded mr-2" /><div className="h-3 w-16 bg-gray-100 rounded" /></div>
                                <div className="flex items-center"><div className="h-3 w-3 border rounded mr-2" /><div className="h-3 w-16 bg-gray-100 rounded" /></div>
                            </div>
                        )}
                        {component.type === 'form_radio' && (
                            <div className="space-y-1">
                                <div className="flex items-center"><div className="h-3 w-3 rounded-full border mr-2" /><div className="h-3 w-16 bg-gray-100 rounded" /></div>
                                <div className="flex items-center"><div className="h-3 w-3 rounded-full border mr-2" /><div className="h-3 w-16 bg-gray-100 rounded" /></div>
                            </div>
                        )}
                        {component.type === 'form_select' && <div className="h-8 border rounded bg-white flex items-center px-2 text-gray-400">Select...</div>}
                        {component.type === 'form_file' && <div className="h-8 border rounded bg-white flex items-center px-2 text-gray-400">Choose file...</div>}
                    </div>
                )}

                {component.type === 'pdf' && (
                    <div className="h-32 bg-gray-50 rounded border border-gray-100 flex items-center justify-center text-gray-400">
                        PDF Viewer Placeholder
                    </div>
                )}

                {component.type === 'iframe' && (
                    <div className="h-32 bg-gray-50 rounded border border-gray-100 flex items-center justify-center text-gray-400">
                        Iframe Placeholder
                    </div>
                )}

                {component.type === 'layout_2col' && (
                    <div className="grid grid-cols-2 gap-4 p-4 border border-dashed border-gray-300 rounded bg-gray-50" onClick={(e) => e.stopPropagation()}>
                        <DroppableColumn parentId={component.id} columnIndex={0}>
                            {component.children?.filter((_, idx) => idx % 2 === 0).map((child) => (
                                <EditorComponent key={child.id} component={child} selectedId={selectedId} onSelect={onSelect} />
                            ))}
                        </DroppableColumn>
                        <DroppableColumn parentId={component.id} columnIndex={1}>
                            {component.children?.filter((_, idx) => idx % 2 === 1).map((child) => (
                                <EditorComponent key={child.id} component={child} selectedId={selectedId} onSelect={onSelect} />
                            ))}
                        </DroppableColumn>
                    </div>
                )}

                {component.type === 'layout_3col' && (
                    <div className="grid grid-cols-3 gap-4 p-4 border border-dashed border-gray-300 rounded bg-gray-50" onClick={(e) => e.stopPropagation()}>
                        <DroppableColumn parentId={component.id} columnIndex={0}>
                            {component.children?.filter((_, idx) => idx % 3 === 0).map((child) => (
                                <EditorComponent key={child.id} component={child} selectedId={selectedId} onSelect={onSelect} />
                            ))}
                        </DroppableColumn>
                        <DroppableColumn parentId={component.id} columnIndex={1}>
                            {component.children?.filter((_, idx) => idx % 3 === 1).map((child) => (
                                <EditorComponent key={child.id} component={child} selectedId={selectedId} onSelect={onSelect} />
                            ))}
                        </DroppableColumn>
                        <DroppableColumn parentId={component.id} columnIndex={2}>
                            {component.children?.filter((_, idx) => idx % 3 === 2).map((child) => (
                                <EditorComponent key={child.id} component={child} selectedId={selectedId} onSelect={onSelect} />
                            ))}
                        </DroppableColumn>
                    </div>
                )}

                {!['table', 'form', 'text', 'form_container', 'container', 'pdf', 'iframe', 'layout_2col', 'layout_3col'].includes(component.type) && !component.type.startsWith('form_') && (
                    <div className="text-gray-500 italic">{component.label}</div>
                )}
            </div>
        </div>
    );
};

export default function Canvas({ components, selectedId, onSelect }: CanvasProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: 'canvas',
    });
    const { t } = useLanguage();

    return (
        <div className="flex-1 bg-gray-100 p-2 overflow-auto">
            <div
                ref={setNodeRef}
                className={clsx(
                    "min-h-full bg-white rounded-xl shadow-sm border-2 transition-colors p-2",
                    isOver ? "border-blue-500 bg-blue-50/50" : "border-dashed border-gray-300"
                )}
            >
                {components.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <p className="text-lg font-medium">{t('canvas.emptyState')}</p>
                        <p className="text-sm mt-2">{t('canvas.dragComponents')}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {components.map((component) => (
                            <EditorComponent key={component.id} component={component} selectedId={selectedId} onSelect={onSelect} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
