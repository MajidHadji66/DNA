"use client";

import Link from "next/link";
import { Github, Mail, Info } from "lucide-react";

interface FooterProps {
    className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
    return (
        <footer className={`mt-20 border-t border-gray-200 pt-8 text-center text-gray-500 text-sm pb-8 ${className}`}>
            <p>&copy; {new Date().getFullYear()} Majid Hadji. All rights reserved.</p>
            <p className='mt-2'>
                DNA Sequence Analyzer Project For Educational Purposes
            </p>
            <div className='mt-4 flex justify-center gap-6'>
                <Link
                    href="/docs"
                    className='hover:text-blue-600 transition-colors flex items-center gap-1'
                >
                    <Info size={16} /> Documentation
                </Link>
                <a
                    href='mailto:contact@example.com'
                    className='hover:text-blue-600 transition-colors flex items-center gap-1'
                >
                    <Mail size={16} /> Contact
                </a>
                <a
                    href='https://github.com/MajidHadji66/DNA'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='hover:text-blue-600 transition-colors flex items-center gap-1'
                >
                    <Github size={16} /> GitHub
                </a>
            </div>
        </footer>
    );
}
