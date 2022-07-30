import { ReactNode } from 'react';

export default function Modal({ open, children }: Props) {
    return (
        <div className={`fixed top-0 left-0 z-[10] h-full w-full flex-col items-center bg-black bg-opacity-50 px-10 pt-5 ${open ? 'flex' : 'hidden'}`}>
            <div className='w-full max-w-[800px] rounded-md bg-white p-5 shadow-md'>{children}</div>
        </div>
    );
}

Modal.Header = function Header({ children }: { children: ReactNode }) {
    return (
        <header className='flex items-start text-xl font-semibold'>
            <h1>{children}</h1>
        </header>
    );
};

Modal.Body = function Body({ children }: { children: ReactNode }) {
    return <div className='py-10'>{children}</div>;
};

Modal.Footer = function Footer({ children }: { children: ReactNode }) {
    return <footer className='flex items-center justify-end space-x-3 border-t pt-3'>{children}</footer>;
};

Modal.Button = function Button({ children, onClick, className }: { children: ReactNode; onClick: () => void; className?: string }) {
    return (
        <button
            onClick={() => {
                onClick();
            }}
            className={`rounded-md border-2 border-transparent py-2 px-4 text-white duration-500 hover:shadow-md ${className && className}`}
        >
            {children}
        </button>
    );
};

interface Props {
    open: boolean;
    children: ReactNode;
}
