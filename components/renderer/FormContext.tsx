'use client';

import { createContext, useContext } from 'react';

interface FormContextType {
    formData: Record<string, any>;
    setFieldValue: (name: string, value: any) => void;
    registerField: (name: string, initialValue?: any) => void;
    isSubmitting: boolean;
}

const FormContext = createContext<FormContextType | null>(null);

export const useFormContext = () => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error('useFormContext must be used within a FormProvider');
    }
    return context;
};

export default FormContext;
