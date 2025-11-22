'use client';

import { useStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';

export default function SettingsPage() {
    const { settings, updateSettings } = useStore();
    const [appTitle, setAppTitle] = useState(settings.appTitle || 'App');
    const [appIcon, setAppIcon] = useState(settings.appIcon || '');
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        setAppTitle(settings.appTitle || 'App');
        setAppIcon(settings.appIcon || '');
    }, [settings.appTitle, settings.appIcon]);

    const handleSave = () => {
        updateSettings({ appTitle, appIcon });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAppIcon(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeIcon = () => {
        setAppIcon('');
    };

    return (
        <div className="p-8">
            <div className="max-w-2xl">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Application Icon
                            </label>
                            <div className="flex items-start gap-4">
                                {appIcon ? (
                                    <div className="relative">
                                        <img
                                            src={appIcon}
                                            alt="App icon"
                                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                        />
                                        <button
                                            onClick={removeIcon}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                                        <Upload className="w-6 h-6 text-gray-400" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleIconUpload}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Upload an icon (PNG, JPG, SVG). Recommended size: 64x64px
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Application Title
                            </label>
                            <input
                                type="text"
                                value={appTitle}
                                onChange={(e) => setAppTitle(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your app title"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                This title will appear at the top of the sidebar on your published website
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                            >
                                Save Changes
                            </button>
                            {isSaved && (
                                <span className="text-sm text-green-600 font-medium">
                                    ✓ Saved successfully
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
