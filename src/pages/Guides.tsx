import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Workflow,
  Layers,
  Copy,
  Check,
  Key,
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  Code2,
  Clock,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { automationGuides } from '@/data/guidesData';
import type { AutomationGuide, GuideDownload } from '@/data/guidesData';

export default function Guides() {
  const [selectedGuide, setSelectedGuide] = useState<AutomationGuide>(automationGuides[0]);
  const [activeTab, setActiveTab] = useState<'architecture' | 'downloads' | 'placeholders' | 'code'>('architecture');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  // Collect all unique tags
  const allTags = ['All', ...Array.from(new Set(automationGuides.flatMap(g => g.tags)))];

  const filteredGuides = automationGuides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = selectedTag === 'All' || guide.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    toast.success('Code payload copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownload = (download: GuideDownload) => {
    toast.success(`Downloading ${download.fileName}...`);
  };

  const selectBlueprint = (guide: AutomationGuide) => {
    setSelectedGuide(guide);
    if (detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Production Blueprints & Technical Guides
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
          API Architecture & <span className="gradient-text">Automation Blueprints</span>
        </h1>

        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
          Production-tested automation workflows, desktop architectures, and low-level API guides engineered for high performance, custom pipelines, and distributed integrations.
        </p>
      </motion.div>

      {/* Search & Tag Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search blueprints, APIs, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-card/60 border border-border focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-colors"
          />
        </div>

        {/* Tag Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${selectedTag === tag
                ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
                : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 1. BLUEPRINT SELECTOR GRID (Positioned Prominently at Top) */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold">Select an Architecture Blueprint</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Click any blueprint below to inspect its architecture flow, technical steps, and downloadable assets
            </p>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:block">
            Showing {filteredGuides.length} blueprint{filteredGuides.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGuides.map((guide) => {
            const isSelected = selectedGuide.id === guide.id;
            return (
              <div
                key={guide.id}
                onClick={() => selectBlueprint(guide)}
                className={`rounded-2xl p-6 transition-all cursor-pointer flex flex-col justify-between relative group ${isSelected
                  ? 'bg-card/90 border-2 border-violet-500 shadow-xl shadow-violet-500/15 ring-1 ring-violet-500/50'
                  : 'bg-card/40 border border-border/80 hover:border-violet-500/50 hover:bg-card/70'
                  }`}
              >
                {/* Active Selection Indicator Ribbon */}
                {isSelected && (
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-violet-600 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <CheckCircle2 className="w-3 h-3" />
                    Active Blueprint
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${isSelected
                      ? 'bg-violet-500/25 text-violet-300 border border-violet-500/40'
                      : 'bg-muted text-muted-foreground'
                      }`}>
                      {guide.badge}
                    </span>
                    <span className="text-xs text-muted-foreground">{guide.difficulty}</span>
                  </div>

                  <h4 className={`font-bold text-base mb-2 transition-colors ${isSelected ? 'text-violet-300' : 'text-foreground group-hover:text-violet-400'
                    }`}>
                    {guide.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                    {guide.subtitle}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {guide.platforms.slice(0, 3).map((p) => (
                      <span key={p} className="px-2 py-0.5 rounded text-[10px] bg-muted/60 text-muted-foreground border border-border/30">
                        {p}
                      </span>
                    ))}
                    {guide.platforms.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-muted/60 text-muted-foreground">
                        +{guide.platforms.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className={`flex items-center justify-between pt-4 border-t text-xs font-semibold transition-colors ${isSelected
                  ? 'border-violet-500/30 text-violet-400'
                  : 'border-border/40 text-muted-foreground group-hover:text-violet-400'
                  }`}>
                  <span>{isSelected ? 'Currently Inspecting ↓' : 'Inspect Blueprint'}</span>
                  <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90 text-violet-400' : 'group-hover:translate-x-1'}`} />
                </div>
              </div>
            );
          })}

          {/* Future Guide Placeholder Card */}
          <div className="rounded-2xl p-6 bg-card/20 border border-dashed border-border/80 flex flex-col items-center justify-center text-center min-h-[220px]">
            <div className="w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-semibold text-sm mb-1">More Blueprints Coming Soon</h4>
            <p className="text-xs text-muted-foreground max-w-xs">
              Upcoming guides on Multi-Tenant Webhooks, Distributed Scraping Engines, and Cloud Vector Pipelines.
            </p>
          </div>
        </div>
      </div>

      {/* 2. DETAILED BLUEPRINT INSPECTOR (Appears right beneath the cards) */}
      <div ref={detailRef} className="scroll-mt-8">
        {filteredGuides.length > 0 && selectedGuide && (
          <motion.div
            key={selectedGuide.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl p-6 sm:p-8 bg-card/40 border border-border/80 backdrop-blur-xl shadow-2xl relative overflow-hidden mb-12"
          >
            {/* Subtle Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Metadata */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-400 text-xs font-semibold border border-violet-500/30">
                {selectedGuide.badge}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Sanitized Blueprint
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                <Clock className="w-3.5 h-3.5" />
                {selectedGuide.readTime}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3">
              {selectedGuide.title}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-6 max-w-4xl leading-relaxed">
              {selectedGuide.subtitle}
            </p>

            {/* Platforms Badges */}
            <div className="flex flex-wrap gap-2 mb-8">
              {selectedGuide.platforms.map((p) => (
                <span
                  key={p}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-foreground/90 border border-border/50"
                >
                  {p}
                </span>
              ))}
            </div>

            {/* Why This Is Rare Callout Box (Only shown if whyRare is specified) */}
            {Boolean(selectedGuide.whyRare) && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-8">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-300 mb-1">
                      Why this engineering blueprint is rare & hard to find
                    </h4>
                    <p className="text-xs sm:text-sm text-amber-200/80 leading-relaxed">
                      {selectedGuide.whyRare}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs Navigation */}
            <div className="flex flex-wrap gap-2 border-b border-border/60 pb-3 mb-6">
              <button
                onClick={() => setActiveTab('architecture')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${activeTab === 'architecture'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
              >
                <Workflow className="w-4 h-4" />
                {selectedGuide.pipelineSteps.length}-Stage Architecture Flow
              </button>
              <button
                onClick={() => setActiveTab('downloads')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${activeTab === 'downloads'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
              >
                <Download className="w-4 h-4" />
                Downloads & Assets ({selectedGuide.downloads.length})
              </button>
              <button
                onClick={() => setActiveTab('placeholders')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${activeTab === 'placeholders'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
              >
                <Key className="w-4 h-4" />
                Configuration Guide ({selectedGuide.placeholderGuide.length})
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${activeTab === 'code'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
              >
                <Code2 className="w-4 h-4" />
                Code Payloads ({selectedGuide.codeSnippets.length})
              </button>
            </div>

            {/* Tab Contents */}
            <AnimatePresence mode="wait">
              {/* 1. Architecture Flow Tab */}
              {activeTab === 'architecture' && (
                <motion.div
                  key="tab-architecture"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="p-4 sm:p-5 rounded-2xl bg-card/60 border border-border/80">
                    <h3 className="text-sm sm:text-base font-bold text-foreground mb-2">
                      Problem Solved by This Architecture:
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {selectedGuide.problemStatement}
                    </p>
                  </div>

                  {/* Key Capabilities List */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-card/60 border border-border/80">
                    <h3 className="text-sm sm:text-base font-bold text-foreground mb-3 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-violet-400" />
                      Key Architectural Capabilities Built Into This Blueprint:
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {selectedGuide.keyFeatures.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Sequential Steps Flow */}
                  <div className="space-y-4">
                    <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-violet-400" />
                      Sequential Execution Pipeline ({selectedGuide.pipelineSteps.length} Stages)
                    </h3>

                    <div className="space-y-4 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-border/60 before:hidden sm:before:block">
                      {selectedGuide.pipelineSteps.map((step) => (
                        <div
                          key={step.stepNumber}
                          className="relative flex flex-col sm:flex-row gap-4 p-5 rounded-2xl bg-card/40 border border-border/60 hover:border-border transition-colors"
                        >
                          <div className="flex items-center gap-3 sm:block">
                            <div className="w-8 h-8 rounded-full bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center font-bold text-xs shrink-0 z-10">
                              {step.stepNumber}
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider sm:hidden ${step.method === 'POST'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : step.method === 'GET'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : step.method === 'WAIT'
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : step.method === 'ENGINE'
                                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                                      : step.method === 'CALC'
                                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                        : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                }`}
                            >
                              {step.method}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              <h4 className="font-semibold text-sm text-foreground">
                                {step.title}
                              </h4>
                              <span
                                className={`hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${step.method === 'POST'
                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                  : step.method === 'GET'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : step.method === 'WAIT'
                                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                      : step.method === 'ENGINE'
                                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                                        : step.method === 'CALC'
                                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                          : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                  }`}
                              >
                                {step.method}
                              </span>
                              <code className="px-2 py-0.5 rounded bg-muted/60 text-[11px] font-mono text-muted-foreground break-all">
                                {step.endpoint}
                              </code>
                            </div>

                            <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
                              {step.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                              {step.highlights.map((h, i) => (
                                <span
                                  key={i}
                                  className="text-[11px] px-2.5 py-1 rounded-md bg-muted/40 border border-border/40 text-muted-foreground flex items-center gap-1"
                                >
                                  <span className="w-1 h-1 rounded-full bg-violet-400" />
                                  {h}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 2. Downloads & Blueprints Tab */}
              {activeTab === 'downloads' && (
                <motion.div
                  key="tab-downloads"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedGuide.downloads.map((item, index) => (
                      <div
                        key={index}
                        className="p-5 rounded-2xl bg-card/60 border border-border/80 flex flex-col justify-between hover:border-violet-500/40 transition-colors"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-violet-500/15 text-violet-400 border border-violet-500/25">
                              {item.platform || item.type.toUpperCase()}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {item.size}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm sm:text-base text-foreground mb-1.5">
                            {item.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 pt-3 border-t border-border/40">
                          <a
                            href={item.url}
                            download={item.fileName}
                            onClick={() => handleDownload(item)}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors shadow-md shadow-violet-600/20"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download {item.fileName}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 3. Placeholders Configuration Guide Tab */}
              {activeTab === 'placeholders' && (
                <motion.div
                  key="tab-placeholders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="p-4 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground">
                    Replace these configuration parameters and secrets before executing the workflows or standalone binary in your production environment.
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {selectedGuide.placeholderGuide.map((item, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl bg-card/60 border border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <code className="text-xs sm:text-sm font-mono text-violet-400 font-bold">
                            {item.key}
                          </code>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.description}
                          </p>
                          <p className="text-[11px] text-muted-foreground/80 mt-0.5">
                            <strong className="text-foreground/80">Where to obtain:</strong> {item.whereToFind}
                          </p>
                        </div>

                        <span className="px-2.5 py-1 rounded bg-muted text-[11px] font-mono text-muted-foreground whitespace-nowrap self-start sm:self-center">
                          {item.format}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* 4. Code Snippets Tab */}
              {activeTab === 'code' && (
                <motion.div
                  key="tab-code"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {selectedGuide.codeSnippets.map((snippet, index) => (
                    <div
                      key={index}
                      className="rounded-2xl bg-zinc-950 border border-border/80 overflow-hidden shadow-lg"
                    >
                      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-border/60">
                        <span className="text-xs font-semibold text-zinc-300">
                          {snippet.title}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                            {snippet.language}
                          </span>
                          <button
                            onClick={() => handleCopyCode(snippet.code, index)}
                            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                            title="Copy code"
                          >
                            {copiedIndex === index ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                      <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed scrollbar-thin">
                        <code>{snippet.code}</code>
                      </pre>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
