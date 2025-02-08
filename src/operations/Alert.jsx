import React, { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

function Alert({ alert, onConfirm, onCancel, handleDeleteStudent }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (alert) {
            setShow(true);
            if (onConfirm && onCancel) {
                document.body.style.overflow = 'hidden';
            }
            const timer = setTimeout(() => {
                setShow(false);
                document.body.style.overflow = 'unset';
            }, 3000);
            return () => {
                clearTimeout(timer);
                document.body.style.overflow = 'unset';
            };
        }
    }, [alert, handleDeleteStudent, onConfirm, onCancel]);

    if (!show || !alert) return null;

    return (
        <>
            {onConfirm && onCancel && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" />
            )}
            <div className="fixed   z-50 top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
                <div className="bg-white border-l-4 border-red-500 shadow-lg rounded-lg">
                    <div className="p-4 flex items-start">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div className="flex-grow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-red-800">Alert</p>
                                    <p className="text-sm text-gray-600 mt-1">{alert}</p>
                                </div>
                                <button 
                                    onClick={() => setShow(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            {onConfirm && onCancel && (
                                <div className="mt-4 flex space-x-2">
                                    <button 
                                        onClick={onConfirm} 
                                        className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-md hover:bg-green-600 transition-colors"
                                    >
                                        Confirm
                                    </button>
                                    <button 
                                        onClick={onCancel} 
                                        className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Alert;