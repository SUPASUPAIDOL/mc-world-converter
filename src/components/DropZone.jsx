import React, { useCallback } from 'react';
import { Upload, FileUp } from 'lucide-react';

export function DropZone({ onFileSelected, disabled }) {
    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.name.endsWith('.mcworld')) {
                onFileSelected(file);
            } else {
                alert('Please upload a .mcworld file');
            }
        }
    }, [onFileSelected, disabled]);

    const handleFileInput = useCallback((e) => {
        if (disabled) return;
        const files = e.target.files;
        if (files && files.length > 0) {
            onFileSelected(files[0]);
        }
    }, [onFileSelected, disabled]);

    return (
        <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`
        w-full max-w-xl p-24 border-2 border-dashed rounded-3xl transition-all duration-500
        flex flex-col items-center justify-center text-center cursor-pointer group
        ${disabled
                    ? 'border-slate-700 bg-slate-900/50 opacity-50 cursor-not-allowed'
                    : 'border-indigo-500/30 bg-slate-800/30 hover:border-indigo-400 hover:bg-slate-800/60 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/10'
                }
      `}
            onClick={() => !disabled && document.getElementById('fileInput').click()}
        >
            <input
                type="file"
                id="fileInput"
                className="hidden"
                accept=".mcworld"
                onChange={handleFileInput}
                disabled={disabled}
            />

            <div className={`
        p-5 rounded-2xl mt-12 mb-10 transition-all duration-300
        ${disabled ? 'bg-slate-800' : 'bg-indigo-500/10 group-hover:bg-indigo-500/20 group-hover:scale-110'}
      `}>
                <Upload className={`w-10 h-10 transition-colors ${disabled ? 'text-slate-600' : 'text-indigo-400 group-hover:text-indigo-300'}`} />
            </div>

            <h3 className="text-2xl font-bold text-slate-200 mb-3 tracking-tight">
                Upload your world
            </h3>
            <p className="text-slate-400 text-base mb-16 leading-relaxed">
                Drag and drop your <code className="bg-slate-700/50 border border-slate-600/50 px-2 py-1 rounded-md text-indigo-300 font-mono text-sm">.mcworld</code> file here
                <br />
                or click to browse
            </p>

            <button
                className={`
          px-8 py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all duration-300
          ${disabled
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 hover:from-indigo-500 hover:to-purple-500 active:scale-95'
                    }
        `}
                disabled={disabled}
            >
                Select File
            </button>
        </div >
    );
}
