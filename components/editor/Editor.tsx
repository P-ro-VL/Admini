'use client';

import { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    DragStartEvent,
    DragEndEvent,
    DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { PageConfig, ComponentConfig, ComponentType } from '@/lib/types';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import PropertiesPanel from './PropertiesPanel';
import { createPortal } from 'react-dom';

interface EditorProps {
    page: PageConfig;
    onSave: (page: PageConfig) => void;
}

export default function Editor({ page, onSave }: EditorProps) {
    const [components, setComponents] = useState<ComponentConfig[]>(page.components || []);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [activeDragItem, setActiveDragItem] = useState<ComponentType | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        if (active.data.current?.type === 'sidebar-item') {
            setActiveDragItem(active.data.current.componentType);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragItem(null);

        if (!over) return;

        // Handle dragging from sidebar
        if (active.data.current?.type === 'sidebar-item') {
            const componentType = active.data.current.componentType;
            const newComponent: ComponentConfig = {
                id: `comp-${Date.now()}`,
                type: componentType,
                label: `New ${componentType}`,
                props: {},
                children: [],
            };

            // Check if dropping into a layout column
            if (over.data.current?.type === 'column') {
                const { parentId, columnIndex } = over.data.current;

                const addToColumn = (comps: ComponentConfig[]): ComponentConfig[] => {
                    return comps.map(c => {
                        if (c.id === parentId) {
                            const children = c.children || [];
                            // Insert at the position based on column index
                            const newChildren = [...children];
                            // Find the right position to insert based on column distribution
                            let insertIndex = 0;
                            for (let i = 0; i < children.length; i++) {
                                const childColumnIndex = (c.type === 'layout_2col') ? i % 2 : i % 3;
                                if (childColumnIndex < columnIndex) {
                                    insertIndex = i + 1;
                                }
                            }
                            newChildren.splice(insertIndex, 0, newComponent);
                            return { ...c, children: newChildren };
                        }
                        if (c.children) {
                            return { ...c, children: addToColumn(c.children) };
                        }
                        return c;
                    });
                };

                const newComponents = addToColumn(components);
                setComponents(newComponents);
                setSelectedId(newComponent.id);
                onSave({ ...page, components: newComponents });
                return;
            }

            if (over.id === 'canvas') {
                // Add to root
                const newComponents = [...components, newComponent];
                setComponents(newComponents);
                setSelectedId(newComponent.id);
                onSave({ ...page, components: newComponents });
            } else {
                // Add to container
                const addRecursive = (comps: ComponentConfig[]): ComponentConfig[] => {
                    return comps.map(c => {
                        if (c.id === over.id) {
                            return { ...c, children: [...(c.children || []), newComponent] };
                        }
                        if (c.children) {
                            return { ...c, children: addRecursive(c.children) };
                        }
                        return c;
                    });
                };

                const newComponents = addRecursive(components);
                setComponents(newComponents);
                setSelectedId(newComponent.id);
                onSave({ ...page, components: newComponents });
            }
        }

        // Reordering logic would go here if we implement SortableContext
    };

    const handleSelect = (id: string) => {
        setSelectedId(id);
    };

    const handleUpdateComponent = (id: string, updates: Partial<ComponentConfig>) => {
        const updateRecursive = (comps: ComponentConfig[]): ComponentConfig[] => {
            return comps.map(c => {
                if (c.id === id) {
                    return { ...c, ...updates };
                }
                if (c.children) {
                    return { ...c, children: updateRecursive(c.children) };
                }
                return c;
            });
        };

        const newComponents = updateRecursive(components);
        setComponents(newComponents);
        onSave({ ...page, components: newComponents });
    };

    const handleDeleteComponent = (id: string) => {
        const deleteRecursive = (comps: ComponentConfig[]): ComponentConfig[] => {
            return comps
                .filter(c => c.id !== id)
                .map(c => ({
                    ...c,
                    children: c.children ? deleteRecursive(c.children) : undefined
                }));
        };

        const newComponents = deleteRecursive(components);
        setComponents(newComponents);
        setSelectedId(null);
        onSave({ ...page, components: newComponents });
    };

    const findComponent = (comps: ComponentConfig[], id: string): ComponentConfig | undefined => {
        for (const c of comps) {
            if (c.id === id) return c;
            if (c.children) {
                const found = findComponent(c.children, id);
                if (found) return found;
            }
        }
        return undefined;
    };

    const selectedComponent = selectedId ? findComponent(components, selectedId) : undefined;

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-full">
                <Sidebar />
                <Canvas
                    components={components}
                    selectedId={selectedId}
                    onSelect={handleSelect}
                />
                <PropertiesPanel
                    component={selectedComponent}
                    onUpdate={handleUpdateComponent}
                    onDelete={handleDeleteComponent}
                />
            </div>
            {createPortal(
                <DragOverlay>
                    {activeDragItem ? (
                        <div className="px-4 py-2 bg-blue-600 text-white rounded shadow-lg opacity-80">
                            {activeDragItem}
                        </div>
                    ) : null}
                </DragOverlay>,
                document.body
            )}
        </DndContext>
    );
}
