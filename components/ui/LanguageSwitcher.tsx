'use client';

import React from 'react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
            <Globe className="w-4 h-4" />
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'vi')}
                className="bg-transparent border-none focus:ring-0 cursor-pointer text-sm font-medium"
            >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
            </select>
        </div>
    );
}
