import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Workflow, 
  Layers, 
  ExternalLink, 
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
  Info
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

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-4"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Production Blueprints & Technical Guides
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4"
        >
          API Architecture & <span className="gradient-text">Automation Blueprints</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-base sm:text-lg leading-relaxed"
        >
          Exclusive, production-tested automation workflows and low-level API guides engineered for complex distributed handshakes, AWS multipart uploads, and enterprise iPaaS pipelines.
        </motion.p>
      </div>

      {/* Search & Tag Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search guides, APIs, tags..."
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
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedTag === tag
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
                  : 'bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Flagship Featured Guide Banner */}
      {filteredGuides.length > 0 && selectedGuide && (
        <motion.div
          key={selectedGuide.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
          <p className="text-muted-foreground text-sm sm:text-base mb-6 max-w-4xl">
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

          {/* Why This Is Rare Callout Box */}
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

          {/* Tabs Navigation */}
          <div className="flex flex-wrap gap-2 border-b border-border/60 pb-3 mb-6">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'architecture'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Workflow className="w-4 h-4" />
              {selectedGuide.pipelineSteps.length}-Stage Architecture Flow
            </button>
            <button
              onClick={() => setActiveTab('downloads')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'downloads'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Download className="w-4 h-4" />
              Downloads & Blueprints ({selectedGuide.downloads.length})
            </button>
            <button
              onClick={() => setActiveTab('placeholders')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'placeholders'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Key className="w-4 h-4" />
              Placeholder Configuration Guide
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'code'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Code2 className="w-4 h-4" />
              Architecture & Code Snippets
            </button>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {/* 1. Architecture Flow Tab */}
            {activeTab === 'architecture' && (
              <motion.div
                key="tab-architecture"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {selectedGuide.pipelineSteps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="rounded-2xl p-5 bg-card/60 border border-border/80 flex flex-col justify-between hover:border-violet-500/50 transition-colors group relative"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="w-7 h-7 rounded-full bg-violet-500/20 text-violet-400 font-bold text-xs flex items-center justify-center border border-violet-500/30">
                            {step.stepNumber}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              step.method === 'POST'
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

                        <h4 className="font-semibold text-sm sm:text-base mb-2 group-hover:text-violet-400 transition-colors">
                          {step.title}
                        </h4>

                        <div className="text-[11px] font-mono text-muted-foreground bg-muted/60 px-2 py-1 rounded mb-3 break-all">
                          {step.endpoint}
                        </div>

                        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                          {step.description}
                        </p>
                      </div>

                      <div className="border-t border-border/40 pt-3 space-y-1.5">
                        {step.highlights.map((h, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Key Features bullet list */}
                <div className="p-5 rounded-2xl bg-card/40 border border-border/70 mt-6">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-violet-400" />
                    Key Architectural Capabilities Built Into This Blueprint:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedGuide.keyFeatures.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                        <span>{feat}</span>
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
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedGuide.downloads.map((item) => (
                    <div
                      key={item.fileName}
                      className="rounded-2xl p-5 bg-card/60 border border-border/80 flex flex-col justify-between hover:border-violet-500/50 transition-colors"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                            {item.platform || item.type.toUpperCase()}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {item.size}
                          </span>
                        </div>

                        <h4 className="font-semibold text-sm sm:text-base mb-1">
                          {item.title}
                        </h4>
                        <div className="text-[11px] font-mono text-muted-foreground mb-3 truncate">
                          {item.fileName}
                        </div>
                        <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={item.url}
                          download={item.fileName}
                          onClick={() => handleDownload(item)}
                          className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold transition-colors shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download File
                        </a>
                        {item.type === 'pdf' && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center p-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs transition-colors border border-border"
                            title="Open in new tab"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground flex items-center gap-2.5">
                  <Info className="w-4 h-4 text-violet-400 shrink-0" />
                  <span>
                    <strong>Import Tip:</strong> To import into <strong>n8n</strong>, open your n8n canvas, press <kbd className="px-1.5 py-0.5 rounded bg-background border text-[10px]">Ctrl+V</kbd> or click <em>Workflows ➔ Import from File</em>. For <strong>Make.com</strong>, create a new scenario and choose <em>Import Blueprint</em> from the menu.
                  </span>
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
                className="space-y-4"
              >
                <div className="rounded-2xl border border-border/80 overflow-hidden bg-card/60">
                  <div className="p-4 bg-muted/40 border-b border-border/60">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-400" />
                      Placeholders Cheat Sheet & Replacement Map
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Before running the imported workflow, replace the following template variables with your live credentials:
                    </p>
                  </div>

                  <div className="divide-y divide-border/60">
                    {selectedGuide.placeholderGuide.map((item) => (
                      <div key={item.key} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/20 transition-colors">
                        <div className="space-y-1">
                          <code className="text-xs sm:text-sm font-mono font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20 inline-block">
                            {item.key}
                          </code>
                          <p className="text-xs text-foreground/90 font-medium pt-1">
                            {item.description}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            📍 <strong>Where to obtain:</strong> {item.whereToFind}
                          </p>
                        </div>
                        <div className="sm:text-right shrink-0">
                          <span className="text-[11px] font-mono text-muted-foreground bg-muted/60 px-2.5 py-1 rounded">
                            {item.format}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. Raw Payloads & Code Tab */}
            {activeTab === 'code' && (
              <motion.div
                key="tab-code"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {selectedGuide.codeSnippets.map((snippet, idx) => (
                  <div
                    key={snippet.title}
                    className="rounded-2xl border border-border/80 bg-black/40 overflow-hidden font-mono"
                  >
                    <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30 border-b border-border/60">
                      <span className="text-xs font-semibold text-foreground/80 font-sans">
                        {snippet.title}
                      </span>
                      <button
                        onClick={() => handleCopyCode(snippet.code, idx)}
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted/50 transition-colors font-sans"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 text-[11px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Copy Payload</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-4 overflow-x-auto text-xs text-violet-300 leading-relaxed">
                      <pre>
                        <code>{snippet.code}</code>
                      </pre>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Extensible Grid of All Automation Guides (Ready for Future Additions) */}
      <div className="mt-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold">All Automation Blueprints</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Browse available architecture blueprints and API specifications
            </p>
          </div>
          <span className="text-xs text-muted-foreground">
            Showing {filteredGuides.length} blueprint{filteredGuides.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <div
              key={guide.id}
              onClick={() => {
                setSelectedGuide(guide);
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              className={`rounded-2xl p-6 bg-card/50 border transition-all cursor-pointer flex flex-col justify-between group ${
                selectedGuide.id === guide.id
                  ? 'border-violet-500 shadow-lg shadow-violet-500/10'
                  : 'border-border/80 hover:border-violet-500/50 hover:bg-card/80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/15 text-violet-400 border border-violet-500/25">
                    {guide.badge}
                  </span>
                  <span className="text-xs text-muted-foreground">{guide.difficulty}</span>
                </div>

                <h4 className="font-bold text-base mb-2 group-hover:text-violet-400 transition-colors">
                  {guide.title}
                </h4>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                  {guide.subtitle}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {guide.platforms.slice(0, 3).map((p) => (
                    <span key={p} className="px-2 py-0.5 rounded text-[10px] bg-muted/60 text-muted-foreground">
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

              <div className="flex items-center justify-between pt-4 border-t border-border/40 text-xs font-semibold text-violet-400 group-hover:translate-x-1 transition-transform">
                <span>Explore Full Guide</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}

          {/* Future Guide Placeholder Card */}
          <div className="rounded-2xl p-6 bg-card/20 border border-dashed border-border/80 flex flex-col items-center justify-center text-center p-8 min-h-[220px]">
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
    </div>
  );
}
