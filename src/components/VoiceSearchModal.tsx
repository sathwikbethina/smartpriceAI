import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Mic, MicOff, X, Sparkles } from 'lucide-react';

export const VoiceSearchModal: React.FC = () => {
  const { showVoiceModal, setShowVoiceModal, triggerSearch, showToast } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!showVoiceModal) {
      setIsListening(false);
      setTranscript('');
      setErrorMsg('');
      return;
    }

    // Check Web Speech API availability
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg('Voice recognition is not supported in this browser. Please type in the search bar.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg('');
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);

        if (event.results[current].isFinal) {
          setIsListening(false);
          setTimeout(() => {
            setShowVoiceModal(false);
            triggerSearch(text);
          }, 800);
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'no-speech') {
          setErrorMsg('No speech detected. Tap the mic to try again.');
        } else {
          setErrorMsg('Microphone access issue. Please try again.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();

      return () => {
        try {
          recognition.abort();
        } catch {}
      };
    } catch (err) {
      setErrorMsg('Could not initialize voice search. Tap mic to retry.');
    }
  }, [showVoiceModal, triggerSearch, setShowVoiceModal]);

  const handleStartAgain = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = true;
      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg('');
      };
      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        if (event.results[0].isFinal) {
          setIsListening(false);
          setTimeout(() => {
            setShowVoiceModal(false);
            triggerSearch(text);
          }, 800);
        }
      };
      recognition.start();
    } catch {}
  };

  const handleSampleVoiceQuery = (sample: string) => {
    setTranscript(sample);
    setTimeout(() => {
      setShowVoiceModal(false);
      triggerSearch(sample);
    }, 400);
  };

  if (!showVoiceModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1E2130] w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center relative flex flex-col items-center">
        <button
          onClick={() => setShowVoiceModal(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mt-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-[#1A56DB] dark:text-blue-300">
            <Sparkles className="w-3.5 h-3.5" />
            Voice Search (en-IN)
          </span>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mt-2">
            {isListening ? 'Listening...' : 'Tap to Speak'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Say any product name (e.g., &quot;Amul Butter 500g&quot; or &quot;iPhone 15&quot;)
          </p>
        </div>

        {/* Animated Mic Wave */}
        <div className="my-6 relative flex items-center justify-center">
          {isListening && (
            <>
              <div className="absolute w-28 h-28 rounded-full bg-blue-500/20 animate-ping" />
              <div className="absolute w-20 h-20 rounded-full bg-[#FF5A1F]/20 animate-pulse" />
            </>
          )}
          <button
            onClick={handleStartAgain}
            className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
              isListening
                ? 'bg-gradient-to-tr from-[#FF5A1F] to-rose-500 text-white scale-110'
                : 'bg-gradient-to-tr from-[#1A56DB] to-blue-600 text-white hover:scale-105'
            }`}
          >
            {isListening ? <Mic className="w-8 h-8 animate-bounce" /> : <MicOff className="w-8 h-8" />}
          </button>
        </div>

        {/* Transcript or Status */}
        <div className="w-full min-h-[60px] flex items-center justify-center px-4 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/60 dark:border-slate-800">
          {transcript ? (
            <p className="text-sm font-bold text-slate-900 dark:text-white italic">
              &ldquo;{transcript}&rdquo;
            </p>
          ) : errorMsg ? (
            <p className="text-xs text-rose-500 dark:text-rose-400 font-medium">{errorMsg}</p>
          ) : (
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-4 bg-blue-500 rounded-full animate-pulse" />
              <span className="w-1.5 h-6 bg-orange-500 rounded-full animate-pulse delay-75" />
              <span className="w-1.5 h-3 bg-blue-500 rounded-full animate-pulse delay-150" />
              <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">Speak now...</span>
            </div>
          )}
        </div>

        {/* Quick Voice Suggestions */}
        <div className="mt-4 w-full text-left">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Try saying:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['Amul Butter 500g', 'iPhone 15 128GB', 'Maggi Noodles', 'Niacinamide Serum'].map((item) => (
              <button
                key={item}
                onClick={() => handleSampleVoiceQuery(item)}
                className="text-xs px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-[#1A56DB] transition-colors"
              >
                &ldquo;{item}&rdquo;
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
