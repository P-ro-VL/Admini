'use client';

import { ComponentConfig } from '@/lib/types';
import { useStore } from '@/lib/store';
import { Trash2, Plus } from 'lucide-react';
import { useLanguage } from '@/lib/contexts/LanguageContext';

interface PropertiesPanelProps {
    component?: ComponentConfig;
    onUpdate: (id: string, updates: Partial<ComponentConfig>) => void;
    onDelete: (id: string) => void;
}

export default function PropertiesPanel({ component, onUpdate, onDelete }: PropertiesPanelProps) {
    const { apis } = useStore();
    const { t } = useLanguage();

    if (!component) {
        return (
            <div className="w-80 bg-white border-l border-gray-200 p-6 flex items-center justify-center text-gray-400 text-sm">
                Select a component to edit properties
            </div>
        );
    }

    return (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-800">Properties</h3>
                <p className="text-xs text-gray-500 mt-1">ID: {component.id.slice(0, 8)}...</p>
            </div>

            {/* Delete Button */}
            <div className="p-4 border-b border-gray-200">
                <button
                    onClick={() => onDelete(component.id)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm font-medium"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Component
                </button>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-6">
                {/* Common Properties */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                    <input
                        type="text"
                        value={component.label || ''}
                        onChange={(e) => onUpdate(component.id, { label: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* API Connection */}
                {['table', 'form', 'detail', 'form_container'].includes(component.type) && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Connected API</label>
                        <select
                            value={component.apiId || ''}
                            onChange={(e) => onUpdate(component.id, { apiId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select an API...</option>
                            {apis.map((api) => (
                                <option key={api.id} value={api.id}>
                                    {api.name} ({api.method})
                                </option>
                            ))}
                        </select>
                        {component.type.startsWith('form_') && (component.type as string) !== 'form_container' && (
                            <p className="text-xs text-gray-500 mt-1">Connect API to fetch default value (optional)</p>
                        )}
                    </div>
                )}

                {component.type === 'table' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Hidden Columns</label>
                            <input
                                type="text"
                                value={component.props?.hiddenColumns || ''}
                                onChange={(e) => onUpdate(component.id, { props: { ...component.props, hiddenColumns: e.target.value } })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="id, created_at"
                            />
                            <p className="text-xs text-gray-500 mt-1">Comma separated keys to hide</p>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-medium text-gray-900">Row Actions</h4>
                                <button
                                    onClick={() => {
                                        const currentActions = component.props?.rowActions || [];
                                        const newAction = {
                                            id: crypto.randomUUID(),
                                            label: 'Action',
                                            action: 'navigate',
                                            variant: 'primary'
                                        };
                                        onUpdate(component.id, {
                                            props: {
                                                ...component.props,
                                                rowActions: [...currentActions, newAction]
                                            }
                                        });
                                    }}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                    title="Add Action"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            {(component.props?.rowActions || []).map((action: any, index: number) => (
                                <div key={action.id} className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200 relative group">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-gray-700">Action {index + 1}</span>
                                        <button
                                            onClick={() => {
                                                const newActions = component.props?.rowActions.filter((a: any) => a.id !== action.id);
                                                onUpdate(component.id, { props: { ...component.props, rowActions: newActions } });
                                            }}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Label</label>
                                            <input
                                                type="text"
                                                value={action.label}
                                                onChange={(e) => {
                                                    const newActions = [...(component.props?.rowActions || [])];
                                                    newActions[index] = { ...action, label: e.target.value };
                                                    onUpdate(component.id, { props: { ...component.props, rowActions: newActions } });
                                                }}
                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Type</label>
                                            <select
                                                value={action.action}
                                                onChange={(e) => {
                                                    const newActions = [...(component.props?.rowActions || [])];
                                                    newActions[index] = { ...action, action: e.target.value };
                                                    onUpdate(component.id, { props: { ...component.props, rowActions: newActions } });
                                                }}
                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                            >
                                                <option value="navigate">Navigate</option>
                                                <option value="api">Call API</option>
                                            </select>
                                        </div>

                                        {action.action === 'navigate' && (
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Target Page</label>
                                                <select
                                                    value={action.targetPageId || ''}
                                                    onChange={(e) => {
                                                        const newActions = [...(component.props?.rowActions || [])];
                                                        newActions[index] = { ...action, targetPageId: e.target.value };
                                                        onUpdate(component.id, { props: { ...component.props, rowActions: newActions } });
                                                    }}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                                >
                                                    <option value="">Select page...</option>
                                                    {useStore.getState().pages.map((p) => (
                                                        <option key={p.id} value={p.id}>{p.name} (/{p.slug})</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        {action.action === 'navigate' && action.targetPageId && (() => {
                                            const targetPage = useStore.getState().pages.find(p => p.id === action.targetPageId);
                                            if (!targetPage) return null;
                                            const params = targetPage.slug.split('/').filter(p => p.startsWith(':')).map(p => p.slice(1));
                                            if (params.length === 0) return null;

                                            return (
                                                <div className="mt-2 pl-2 border-l-2 border-gray-200">
                                                    {params.map(param => (
                                                        <div key={param} className="mb-2">
                                                            <label className="block text-[10px] text-gray-500 mb-1">:{param}</label>
                                                            <input
                                                                type="text"
                                                                value={action.navParams?.[param] || ''}
                                                                onChange={(e) => {
                                                                    const newActions = [...(component.props?.rowActions || [])];
                                                                    newActions[index] = {
                                                                        ...action,
                                                                        navParams: { ...action.navParams, [param]: e.target.value }
                                                                    };
                                                                    onUpdate(component.id, { props: { ...component.props, rowActions: newActions } });
                                                                }}
                                                                className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                                                placeholder={`Value (use %col% for row data)`}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })()}

                                        {action.action === 'api' && (
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">API</label>
                                                <select
                                                    value={action.apiId || ''}
                                                    onChange={(e) => {
                                                        const newActions = [...(component.props?.rowActions || [])];
                                                        newActions[index] = { ...action, apiId: e.target.value };
                                                        onUpdate(component.id, { props: { ...component.props, rowActions: newActions } });
                                                    }}
                                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                                >
                                                    <option value="">Select API...</option>
                                                    {apis.map((api) => (
                                                        <option key={api.id} value={api.id}>{api.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">{t('properties.variant')}</label>
                                            <select
                                                value={action.variant || 'primary'}
                                                onChange={(e) => {
                                                    const newActions = [...(component.props?.rowActions || [])];
                                                    newActions[index] = { ...action, variant: e.target.value };
                                                    onUpdate(component.id, { props: { ...component.props, rowActions: newActions } });
                                                }}
                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                            >
                                                <option value="primary">{t('properties.primary')}</option>
                                                <option value="secondary">{t('properties.secondary')}</option>
                                                <option value="outline">{t('properties.outline')}</option>
                                                <option value="danger">{t('properties.danger')}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Form Field Properties */}
                {component.type.startsWith('form_') && (component.type as string) !== 'form_container' && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('properties.fieldNameJson')}</label>
                            <input
                                type="text"
                                value={component.props?.name || ''}
                                onChange={(e) => onUpdate(component.id, { props: { ...component.props, name: e.target.value } })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., firstName"
                            />
                        </div>

                        {/* Is Required Checkbox for Form Fields (excluding Form Container) */}
                        {component.type.startsWith('form_') && (component.type as string) !== 'form_container' && (
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`required-${component.id}`}
                                    checked={(component.props?.required as boolean) || false}
                                    onChange={(e) => onUpdate(component.id, { props: { ...component.props, required: e.target.checked } })}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor={`required-${component.id}`} className="ml-2 text-sm font-medium text-gray-700">
                                    {t('properties.required')}
                                </label>
                            </div>
                        )}

                        {['form_radio', 'form_select', 'form_multi_checkbox'].includes(component.type) && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('properties.options')}</label>
                                <input
                                    type="text"
                                    value={component.props?.options || ''}
                                    onChange={(e) => onUpdate(component.id, { props: { ...component.props, options: e.target.value } })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={t('properties.optionsHelp')}
                                />
                            </div>
                        )}

                        <div className="border-t border-gray-200 pt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-3">{t('properties.defaultValue')}</h4>
                            <div className="mb-2">
                                <label className="block text-xs text-gray-500 mb-1">{t('properties.source')}</label>
                                <select
                                    value={component.props?.defaultValueSource || 'manual'}
                                    onChange={(e) => onUpdate(component.id, { props: { ...component.props, defaultValueSource: e.target.value } })}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                >
                                    <option value="manual">{t('properties.manualInput')}</option>
                                    <option value="api">{t('properties.fromApi')}</option>
                                </select>
                            </div>

                            {component.props?.defaultValueSource === 'api' ? (
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">{t('properties.jsonPath')}</label>
                                    <input
                                        type="text"
                                        value={component.props?.defaultValueJsonPath || ''}
                                        onChange={(e) => onUpdate(component.id, { props: { ...component.props, defaultValueJsonPath: e.target.value } })}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                        placeholder="e.g., data.user.name"
                                    />
                                    {!component.apiId && <p className="text-xs text-red-500 mt-1">{t('properties.connectApiAbove')}</p>}
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">{t('properties.value')}</label>
                                    <input
                                        type="text"
                                        value={component.props?.defaultValue || ''}
                                        onChange={(e) => onUpdate(component.id, { props: { ...component.props, defaultValue: e.target.value } })}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Specific Properties */}
                {component.type === 'text' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('properties.content')}</label>
                        <textarea
                            rows={4}
                            value={component.props?.content || ''}
                            onChange={(e) => onUpdate(component.id, { props: { ...component.props, content: e.target.value } })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                )}

                {component.type === 'image' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('properties.imageUrl')}</label>
                        <input
                            type="text"
                            value={component.props?.src || ''}
                            onChange={(e) => onUpdate(component.id, { ...component, props: { ...component.props, src: e.target.value } })}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                )}

                {component.type === 'pdf' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('properties.pdfUrl')}</label>
                            <input
                                type="text"
                                value={component.props?.url || ''}
                                onChange={(e) => onUpdate(component.id, { ...component, props: { ...component.props, url: e.target.value } })}
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="https://example.com/document.pdf"
                            />
                            <p className="text-xs text-gray-500 mt-1">{t('properties.pdfUrlHelp')}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('properties.height')}</label>
                            <input
                                type="text"
                                value={component.props?.height || '600px'}
                                onChange={(e) => onUpdate(component.id, { ...component, props: { ...component.props, height: e.target.value } })}
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="600px"
                            />
                            <p className="text-xs text-gray-500 mt-1">{t('properties.heightHelp')}</p>
                        </div>
                    </>
                )}

                {/* Button Properties */}
                {component.type === 'button' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('properties.buttonText')}</label>
                            <input
                                type="text"
                                value={(component.props?.text as string) || ''}
                                onChange={(e) => onUpdate(component.id, { props: { ...component.props, text: e.target.value } })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder={t('properties.clickMe')}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('properties.actionType')}</label>
                            <select
                                value={(component.props?.actionType as string) || 'api'}
                                onChange={(e) => onUpdate(component.id, { props: { ...component.props, actionType: e.target.value } })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="api">{t('properties.callApi')}</option>
                                <option value="navigate">{t('properties.navigateToPage')}</option>
                            </select>
                        </div>

                        {(component.props?.actionType === 'navigate' || !component.props?.actionType) && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('properties.targetPage')}</label>
                                <select
                                    value={(component.props?.targetPageId as string) || ''}
                                    onChange={(e) => onUpdate(component.id, { props: { ...component.props, targetPageId: e.target.value } })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">{t('properties.selectPage')}</option>
                                    {useStore.getState().pages.map((page) => (
                                        <option key={page.id} value={page.id}>
                                            {page.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </>
                )}

                {/* Iframe Properties */}
                {component.type === 'iframe' && (
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('properties.iframeUrl')}</label>
                            <input
                                type="url"
                                value={(component.props?.url as string) || ''}
                                onChange={(e) => onUpdate(component.id, { props: { ...component.props, url: e.target.value } })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://example.com"
                            />
                            <p className="text-xs text-gray-500 mt-1">{t('properties.iframeUrlHelp')}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('properties.customIframeCode')}</label>
                            <textarea
                                value={(component.props?.iframeCode as string) || ''}
                                onChange={(e) => onUpdate(component.id, { props: { ...component.props, iframeCode: e.target.value } })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                                placeholder='<iframe src="..." width="100%" height="600"></iframe>'
                                rows={4}
                            />
                            <p className="text-xs text-gray-500 mt-1">{t('properties.customIframeCodeHelp')}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('properties.heightUrlMode')}</label>
                            <input
                                type="text"
                                value={(component.props?.height as string) || '600px'}
                                onChange={(e) => onUpdate(component.id, { props: { ...component.props, height: e.target.value } })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="600px"
                            />
                        </div>
                    </div>
                )}

                {/* Detail Component Properties */}
                {component.type === 'detail' && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Route Parameters</h4>
                        {(() => {
                            const targetPage = useStore.getState().pages.find(p => p.id === component.props?.targetPageId);
                            if (!targetPage) return <p className="text-xs text-gray-500">Select a target page to configure parameters.</p>;

                            // Extract params from slug (e.g., users/:id -> ['id'])
                            const params = targetPage.slug.split('/').filter(p => p.startsWith(':')).map(p => p.slice(1));

                            if (params.length === 0) return <p className="text-xs text-gray-500">No route parameters found for the selected page.</p>;

                            return params.map(param => (
                                <div key={param} className="mb-2">
                                    <label className="block text-xs text-gray-500 mb-1">{param}</label>
                                    <input
                                        type="text"
                                        value={component.props?.navParams?.[param] || ''}
                                        onChange={(e) => {
                                            const newParams = { ...component.props?.navParams, [param]: e.target.value };
                                            onUpdate(component.id, { props: { ...component.props, navParams: newParams } });
                                        }}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                        placeholder={`Value for :${param}`}
                                    />
                                    <p className="text-[10px] text-gray-400 mt-0.5">Use %key% for dynamic values</p>
                                </div>
                            ));
                        })()}
                    </div>
                )}

                {component.props?.action === 'api' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">API to Call</label>
                        <select
                            value={component.apiId || ''}
                            onChange={(e) => onUpdate(component.id, { apiId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select an API...</option>
                            {apis.map((api) => (
                                <option key={api.id} value={api.id}>
                                    {api.name} ({api.method})
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Button Variant */}
                {component.type === 'button' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Variant</label>
                        <select
                            value={component.props?.variant || 'primary'}
                            onChange={(e) => onUpdate(component.id, { props: { ...component.props, variant: e.target.value } })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="primary">Primary (Blue)</option>
                            <option value="secondary">Secondary (Gray)</option>
                            <option value="outline">Outline</option>
                            <option value="danger">Danger (Red)</option>
                        </select>
                    </div>
                )}

                {/* Form Container Properties */}
                {component.type === 'form_container' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Submit Button Text</label>
                        <input
                            type="text"
                            value={(component.props?.submitText as string) || 'Submit'}
                            onChange={(e) => onUpdate(component.id, { props: { ...component.props, submitText: e.target.value } })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Submit"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
