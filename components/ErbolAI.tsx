'use client';

import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, X, Info, Settings } from 'lucide-react';

declare global {
  interface Window {
    initializeAgent?: (config: {
      agentId: string;
      rootId?: string;
      formID?: string;
      queryParams?: string[];
      domain?: string;
      isInitialOpen?: boolean;
      isDraggable?: boolean;
    }) => void;
  }
}

export default function ErbolAI() {
  const [isOpenInfo, setIsOpenInfo] = useState(false);
  const agentId = process.env.NEXT_PUBLIC_ERBOL_AI_AGENT_ID?.trim();

  useEffect(() => {
    if (!agentId) return;

    // Load official Jotform AI Agent script once
    const scriptId = 'jotform-agent-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;

    const initAgent = () => {
      if (typeof window !== 'undefined' && typeof window.initializeAgent === 'function') {
        try {
          window.initializeAgent({
            agentId,
            rootId: `JotformAgent-${agentId}`,
            isInitialOpen: false,
            isDraggable: false,
          });
        } catch (e) {
          console.warn('Jotform Agent initialization:', e);
        }
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://cdn.jotfor.ms/s/umd/latest/for-embedded-agent.js';
      script.async = true;
      script.onload = initAgent;
      document.body.appendChild(script);
    } else {
      initAgent();
    }
  }, [agentId]);

  // If a real Jotform Agent ID is provided, the Jotform SDK mounts its own interactive assistant
  if (agentId) {
    return <div id={`JotformAgent-${agentId}`} />;
  }

  // Pre-configured official slot when waiting for user's own Jotform agent
  return (
    <aside aria-label="Технический помощник" className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none">
      {isOpenInfo && (
        <div className="mb-3 w-80 max-w-[90vw] bg-[#111116] border border-white/15 text-white rounded-2xl shadow-2xl p-5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#e5007d] to-purple-600 flex items-center justify-center text-white shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold flex items-center gap-1.5 leading-tight">
                  Erbol AI
                  <Sparkles className="w-3.5 h-3.5 text-[#ff4da6]" />
                </h2>
                <p className="text-[11px] text-gray-400">Тех. помощник</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpenInfo(false)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              aria-label="Закрыть уведомление"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5 text-xs text-gray-300">
            <p className="leading-relaxed">
              Компонент <span className="text-white font-semibold">Erbol AI</span> готов к подключению вашего персонального Jotform AI Agent.
            </p>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[11px] font-mono text-gray-300">
              <p className="text-gray-400 text-[10px] uppercase font-sans mb-1 flex items-center gap-1">
                <Settings className="w-3 h-3 text-[#e5007d]" /> Активация в .env:
              </p>
              <code>NEXT_PUBLIC_ERBOL_AI_AGENT_ID=&quot;ваш_id&quot;</code>
            </div>
            <p className="text-[11px] text-gray-400">
              После добавления ID в <code className="text-gray-300">.env</code> официальный виджет помощника автоматически появится здесь.
            </p>
          </div>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpenInfo(!isOpenInfo)}
        className="group flex items-center gap-3 bg-gradient-to-r from-[#17171e] to-[#20202c] hover:from-[#1f1f2a] hover:to-[#2b2b3b] border border-white/15 px-4 py-2.5 rounded-full shadow-2xl hover:shadow-pink-500/20 transition-all duration-300 cursor-pointer"
        aria-label="Erbol AI - Тех. помощник"
      >
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#e5007d] to-[#c2005d] flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
            <Bot className="w-5 h-5" />
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#17171e] rounded-full" />
        </div>
        <div className="text-left pr-1">
          <div className="text-xs font-bold text-white flex items-center gap-1">
            Erbol AI
            <Sparkles className="w-3 h-3 text-[#ff4da6]" />
          </div>
          <div className="text-[10px] text-gray-400 font-medium">Тех. помощник</div>
        </div>
      </button>
    </aside>
  );
}
