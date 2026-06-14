'use client';

import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  BookOpen, 
  HelpCircle,
  Mail, 
  FolderKanban, 
  FileText, 
  CalendarDays, 
  TrendingUp,
  Brain,
  CornerDownLeft
} from 'lucide-react';
import Slack from '@/components/icons/Slack';
import { queryService, AnswerPayload } from '@/services/queryService';
import { SourceSystem } from '@/types';
import MemoryDetailPanel from '@/components/MemoryDetailPanel';

export default function AskFounderOps() {
  const [query, setQuery] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [answerPayload, setAnswerPayload] = useState<AnswerPayload | null>(null);
  const [currentQueryText, setCurrentQueryText] = useState<string>('');
  
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

  const suggestedQuestions = [
    'Why did we delay launch?',
    'What blockers are open?',
    'What commitments are overdue?',
    'Explain the Pro pricing changes and MRR trends'
  ];

  const handleAsk = async (text: string) => {
    if (!text.trim()) return;
    setIsThinking(true);
    setCurrentQueryText(text);
    setQuery('');
    setAnswerPayload(null);

    try {
      const result = await queryService.askQuestion(text);
      setAnswerPayload(result);
    } catch (err) {
      console.error('Failed to query FounderOps AI', err);
    } finally {
      setIsThinking(false);
    }
  };

  const getSourceIcon = (source: SourceSystem) => {
    switch (source) {
      case 'Gmail': return <Mail className="w-3.5 h-3.5 text-rose-400" />;
      case 'Slack': return <Slack className="w-3.5 h-3.5 text-indigo-400" />;
      case 'Linear': return <FolderKanban className="w-3.5 h-3.5 text-purple-400" />;
      case 'Notion': return <FileText className="w-3.5 h-3.5 text-amber-400" />;
      case 'Calendar': return <CalendarDays className="w-3.5 h-3.5 text-teal-400" />;
      case 'Stripe': return <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <FileText className="w-3.5 h-3.5" />;
    }
  };

  const openMemoryDetails = (id: string) => {
    setSelectedMemoryId(id);
    setIsPanelOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col justify-between max-w-4xl mx-auto w-full p-8 select-none text-foreground">
      {/* Top Banner Header */}
      <div className="border-b border-border pb-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center">
            <Brain className="w-5 h-5 text-indigo-400 animate-pulse-subtle" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-none mb-1">Ask FounderOps AI</h2>
            <p className="text-xs text-muted-foreground">Synthesize cross-platform records with full provenance citing.</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-0.5 rounded uppercase font-bold tracking-wider">
          RAG Engine: Synced
        </span>
      </div>

      {/* Answer Area (Scrollable Center) */}
      <div className="flex-1 overflow-y-auto py-8 space-y-8 scrollbar-thin">
        {!currentQueryText && !answerPayload && !isThinking ? (
          /* Empty state onboarding layout */
          <div className="max-w-xl mx-auto text-center space-y-8 py-12">
            <div className="space-y-3">
              <h3 className="text-xl font-extrabold text-white tracking-tight">What do you want to recover, Sarah?</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Search, analyze, and inspect your startup memory graph. Our reasoning layer returns precise corporate answers with complete source-evidence logs.
              </p>
            </div>

            {/* Suggested cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-left">
              {suggestedQuestions.map((qText, idx) => (
                <div
                  key={idx}
                  onClick={() => handleAsk(qText)}
                  className="p-4 bg-card border border-border/60 rounded-xl hover:border-border cursor-pointer hover:bg-border/20 transition-all duration-150 flex items-start gap-3 group"
                >
                  <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs text-zinc-200 group-hover:text-white font-medium leading-tight">
                    {qText}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Query view layout */
          <div className="space-y-7">
            {/* User prompt question card */}
            <div className="flex items-start gap-4 p-4 bg-border/20 border border-border/30 rounded-xl">
              <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0">
                SJ
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-muted-foreground uppercase">Sarah Jenkins asked</span>
                <p className="text-sm font-semibold text-white">{currentQueryText}</p>
              </div>
            </div>

            {/* AI Response section */}
            {isThinking ? (
              <div className="space-y-4 p-4">
                <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono animate-pulse">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>FounderOps AI is reading memories and verifying citations...</span>
                </div>
                <div className="space-y-2.5">
                  <div className="h-3 bg-border/40 rounded-full w-3/4 animate-pulse" />
                  <div className="h-3 bg-border/40 rounded-full w-5/6 animate-pulse" />
                  <div className="h-3 bg-border/40 rounded-full w-2/3 animate-pulse" />
                </div>
              </div>
            ) : answerPayload ? (
              <div className="space-y-7 animate-fade-in">
                {/* 1. Sources citations slider */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase flex items-center gap-1.5 font-bold">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Source Citations
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {answerPayload.sources.map((src) => (
                      <div
                        key={src.id}
                        onClick={() => openMemoryDetails(src.id)}
                        className="p-3 bg-card border border-border/60 hover:border-indigo-500/50 hover:bg-border/10 rounded-lg cursor-pointer transition-all duration-150 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[9px] bg-border px-1.5 py-0.5 rounded font-mono text-zinc-300">{src.type}</span>
                            {getSourceIcon(src.provenance.source)}
                          </div>
                          <h4 className="text-xs font-bold text-white line-clamp-1 mb-1">{src.title}</h4>
                          <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">{src.content}</p>
                        </div>
                        <div className="pt-2 border-t border-border/20 mt-2.5 flex items-center justify-between text-[9px] text-muted-foreground font-mono">
                          <span className="truncate max-w-[80px]">{src.provenance.author}</span>
                          <span>{new Date(src.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Markdown Answer content */}
                <div className="space-y-3 border-t border-border pt-6">
                  <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Synthesized Answer
                  </span>
                  <div className="text-sm text-zinc-300 leading-relaxed space-y-4 select-text selection:bg-indigo-500/30">
                    {answerPayload.answer.split('\n\n').map((para, pIdx) => {
                      if (para.startsWith('###')) {
                        return <h4 key={pIdx} className="text-sm font-bold text-white mt-4">{para.replace('###', '')}</h4>;
                      }
                      if (para.startsWith('1.') || para.startsWith('-')) {
                        return (
                          <div key={pIdx} className="pl-4 border-l-2 border-indigo-500/40 space-y-2 my-2.5">
                            {para.split('\n').map((line, lIdx) => (
                              <p key={lIdx} className="text-xs">{line}</p>
                            ))}
                          </div>
                        );
                      }
                      return <p key={pIdx} className="text-xs text-zinc-300">{para}</p>;
                    })}
                  </div>
                </div>

                {/* 3. Related memories / actions list */}
                {answerPayload.relatedMemories.length > 0 && (
                  <div className="space-y-2.5 border-t border-border pt-6">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold">Related Graph Nodes</span>
                    <div className="flex flex-wrap gap-2">
                      {answerPayload.relatedMemories.map((rel) => (
                        <button
                          key={rel.id}
                          onClick={() => openMemoryDetails(rel.id)}
                          className="px-3 py-1.5 bg-border/20 border border-border/40 hover:border-border/80 hover:bg-border/30 rounded-lg text-xs text-zinc-300 hover:text-white transition-all flex items-center gap-2"
                        >
                          {getSourceIcon(rel.provenance.source)}
                          <span>{rel.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Suggested pivot questions */}
                {answerPayload.suggestedQuestions.length > 0 && (
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold">Suggested Follow-ups</span>
                    <div className="space-y-2">
                      {answerPayload.suggestedQuestions.map((sQ, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleAsk(sQ)}
                          className="p-3 bg-border/10 hover:bg-border/25 border border-border/30 hover:border-border/60 rounded-xl cursor-pointer text-xs text-zinc-300 hover:text-white font-medium transition-all duration-150 flex items-center gap-2"
                        >
                          <HelpCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>{sQ}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Query input panel */}
      <div className="pt-4 border-t border-border bg-background shrink-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleAsk(query); }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isThinking}
            placeholder="Ask about launch delays, open blockers, active commitments, or custom pricing reviews..."
            className="w-full bg-card border border-border/75 rounded-xl py-4 pl-5 pr-28 text-xs text-white focus:outline-none focus:border-indigo-500/75 transition-colors placeholder:text-muted-foreground shadow-inner"
          />
          <div className="absolute right-3 flex items-center gap-2">
            <span className="hidden md:flex items-center gap-0.5 text-[9px] font-mono text-muted-foreground border border-border px-1.5 py-0.5 rounded">
              Enter <CornerDownLeft className="w-2.5 h-2.5 text-muted-foreground inline" />
            </span>
            <button
              type="submit"
              disabled={isThinking || !query.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg p-2 transition-all shadow-md disabled:bg-border/40 disabled:text-muted-foreground disabled:shadow-none"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* slide-out panel for memory details */}
      <MemoryDetailPanel 
        memoryId={selectedMemoryId}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onNavigateToMemory={(id) => openMemoryDetails(id)}
      />
    </div>
  );
}
