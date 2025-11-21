import React, { useState } from 'react';
import { DropZone } from './components/DropZone';
import { convertWorld } from './utils/converter';
import { FileCheck, Loader2, Download, AlertCircle } from 'lucide-react';

function App() {
  const [status, setStatus] = useState('idle'); // idle, converting, success, error
  const [statusMessage, setStatusMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState(null);

  const handleFileSelected = async (file) => {
    try {
      setStatus('converting');
      setError(null);
      setFileName(file.name);

      const convertedBlob = await convertWorld(file, (msg) => {
        setStatusMessage(msg);
      });

      const url = URL.createObjectURL(convertedBlob);
      setDownloadUrl(url);
      setStatus('success');
      setStatusMessage('Conversion complete!');
    } catch (err) {
      console.error(err);
      setStatus('error');
      setError(err.message || 'An error occurred during conversion.');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setStatusMessage('');
    setDownloadUrl(null);
    setFileName('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            World Converter
          </h1>
          <p className="text-slate-400 text-lg">
            Unlock your Education Edition worlds for Bedrock
          </p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-12 shadow-2xl">
          {status === 'idle' && (
            <DropZone onFileSelected={handleFileSelected} disabled={false} />
          )}

          {status === 'converting' && (
            <div className="py-12 flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
                <Loader2 className="w-16 h-16 text-indigo-400 animate-spin relative z-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-200">Converting...</h3>
                <p className="text-slate-400">{statusMessage}</p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="py-8 flex flex-col items-center space-y-6">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                <FileCheck className="w-10 h-10 text-green-400" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-200">Ready to Download!</h3>
                <p className="text-slate-400">
                  Successfully converted <span className="text-slate-200 font-medium">{fileName}</span>
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <a
                  href={downloadUrl}
                  download={`converted-${fileName}`}
                  className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/25"
                >
                  <Download className="w-5 h-5" />
                  Download World
                </a>
                <button
                  onClick={handleReset}
                  className="px-8 py-3 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-200 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
                >
                  Convert Another
                </button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="py-8 flex flex-col items-center space-y-6">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-2">
                <AlertCircle className="w-10 h-10 text-red-400" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-200">Conversion Failed</h3>
                <p className="text-red-400 max-w-md mx-auto">{error}</p>
              </div>

              <button
                onClick={handleReset}
                className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <p className="text-slate-500 text-sm">
          This tool runs entirely in your browser. Your files are never uploaded to any server.
        </p>
      </div>
    </div>
  );
}

export default App;
