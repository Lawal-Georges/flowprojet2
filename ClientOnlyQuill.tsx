'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';

// Chargement dynamique du composant ReactQuill avec SSR désactivé
const ReactQuill = dynamic(
    async () => {
        const { default: RQ } = await import('react-quill');
        return function Comp({ value, onChange, ...props }: { value: string; onChange: (value: string) => void;[key: string]: unknown }) {
            return <RQ value={value} onChange={onChange} {...props} />;
        };
    },
    {
        ssr: false,
        loading: () => <div>Loading...</div>,
    }
);

interface ClientOnlyQuillProps {
    value: string;
    onChange: (value: string) => void;
}

export default function ClientOnlyQuill({ value, onChange }: ClientOnlyQuillProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return <ReactQuill value={value} onChange={onChange} />;
}