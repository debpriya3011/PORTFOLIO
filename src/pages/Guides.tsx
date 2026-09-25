import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Workflow,
  Layers,
  Copy,
  Check,
  Key,
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  Code2,
  Clock,
  CheckCircle2,
  Loader2,
  ExternalLink
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border/80 text-foreground text-xs font-mono tracking-wide mb-3.5">
          Production Blueprints & Technical Guides
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
          API Architecture & Automation Blueprints
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
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-card/60 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
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
                    <div className="flex items-center gap-1.5">
                      {guide.liveUrl && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live App
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">{guide.difficulty}</span>
                    </div>
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
            <svg viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mb-3 text-muted-foreground shrink-0"><path fill="rgb(0,0,0)" stroke="rgb(0,0,0)" stroke-width="1" opacity="0" d="M 0 0 L 110 0.5 Q 94.5 4 87 15.5 Q 79.3 24.8 80 42.5 L 83 53.5 L 91 66 L 103.5 74 L 109.5 76 L 122 77 L 122 113.5 L 123 114.5 L 123 122.5 L 126 137.5 L 131 152.5 Q 144.4 185.1 169.5 206 Q 185.1 218.9 204.5 228 L 209 232.5 L 217 248.5 L 217 262.5 Q 214 275.5 205.5 283 L 175.5 301 L 152 323.5 Q 134.5 344.5 126 374.5 L 123 389.5 L 123 397.5 L 122 398.5 L 122 435 L 113.5 435 L 105.5 437 Q 95.4 440.9 89 448.5 Q 79.3 458.3 80 478.5 Q 83 496.5 95.5 505 Q 101.4 510.1 111 511.5 L 0 512 L 0 0 Z " /><path fill="rgb(0,0,0)" stroke="rgb(0,0,0)" stroke-width="1" opacity="0" d="M 402.5 0 L 511.5 0 L 512 0.5 L 512 512 L 400 511.5 Q 415 508.5 423 498.5 L 431 482.5 L 432 469.5 L 429 458.5 L 422 447 L 408.5 438 L 402.5 436 L 390 435 L 390 399.5 L 389 398.5 L 389 389.5 L 383 364.5 Q 369.3 327.7 341.5 305 Q 329.4 294.6 313.5 288 L 303 279.5 L 295 263.5 L 295 248.5 Q 298.1 236.1 306.5 229 L 327.5 217 L 341.5 207 L 359 189.5 Q 377.4 168.4 386 137.5 L 389 122.5 L 389 114.5 L 390 113.5 L 390 77 Q 411.7 77 422 64.5 Q 432.8 54.8 432 33.5 Q 428.8 14.7 415.5 6 L 405.5 1 L 402.5 1 L 402.5 0 Z " /><path fill="rgb(0,0,0)" stroke="rgb(0,0,0)" stroke-width="1" opacity="0" d="M 115.5 16 L 396.5 16 L 409 22 L 415 33.5 L 415 43.5 Q 412.9 50.9 407.5 55 L 397.5 60 L 114.5 60 Q 106.8 57.8 102 52.5 L 97 42.5 L 97 33.5 Q 99.8 23.8 107.5 19 L 115.5 16 Z " /><path fill="rgb(0,0,0)" stroke="rgb(0,0,0)" stroke-width="1" opacity="0" d="M 139 77 L 372.5 77 L 373 77.5 L 373 116.5 L 367.5 140 Q 353.7 126.8 332.5 121 L 315.5 118 L 298.5 118 L 297.5 119 L 283.5 120 L 256.5 128 L 221.5 144 L 212.5 146 L 200.5 146 Q 187 143 177.5 136 L 148 108.5 L 139 97.5 L 139 77 Z " /><path fill="rgb(0,0,0)" stroke="rgb(0,0,0)" stroke-width="1" opacity="0" d="M 141.5 126 Q 155.5 142.5 174.5 154 L 191.5 161 L 208.5 163 L 209.5 162 L 222.5 161 L 234.5 157 Q 254.6 145.1 279.5 138 L 294.5 135 L 318.5 135 L 336.5 140 Q 350.1 145.9 360 155.5 Q 349.6 179.1 330.5 194 Q 317.3 204.8 300.5 212 L 290 221.5 L 281 236.5 L 278 248.5 L 278 311.5 Q 276.1 320.1 270.5 325 L 261.5 330 L 250.5 330 Q 242.5 327.5 238 321.5 L 234 312.5 L 234 249.5 Q 230.6 228.4 217.5 217 L 186.5 198 L 171 185 L 155 163.5 L 145 142.5 L 141.5 126 Z M 284 158 L 282 159 L 278 164 L 279 171 L 284 174 L 292 173 L 295 167 L 293 161 Q 291 157 284 158 Z M 220 178 L 218 179 L 214 184 Q 213 192 219 194 L 228 193 Q 231 190 230 183 Q 229 177 220 178 Z M 265 202 L 261 203 L 256 210 L 257 215 L 263 219 L 270 218 L 273 214 L 272 207 Q 270 202 265 202 Z M 256 280 L 251 282 L 248 286 L 249 294 L 254 297 L 261 296 L 264 292 L 263 284 L 256 280 Z " /><path fill="rgb(0,0,0)" stroke="rgb(0,0,0)" stroke-width="1" opacity="0" d="M 216.5 295 L 217 312.5 L 219 321.5 Q 223.2 332.3 231.5 339 Q 241.6 348.4 262.5 347 Q 276.9 343.9 285 334.5 Q 291.5 327.5 294 316.5 L 294.5 295 L 330.5 318 L 347 334.5 Q 361.7 351.8 369 376.5 L 373 397.5 L 373 435 L 347.5 435 L 287.5 389 L 270.5 382 Q 265.7 383.3 264.5 381 L 246.5 381 Q 232.3 383.3 222.5 390 L 164.5 435 L 139 435 L 139 396.5 L 144 372.5 Q 154.2 343.2 174.5 324 L 190.5 311 L 209.5 301 L 216.5 295 Z M 215 351 L 209 356 L 210 365 L 216 368 L 223 366 L 225 363 L 224 355 Q 222 350 215 351 Z M 310 360 L 308 361 L 304 366 L 304 372 L 306 375 L 309 376 L 318 375 L 320 372 L 319 364 Q 317 359 310 360 Z " /><path fill="rgb(0,0,0)" stroke="rgb(0,0,0)" stroke-width="1" opacity="0" d="M 253.5 397 L 265.5 398 L 276.5 402 L 319 434.5 L 193.5 435 L 195.5 432 L 230.5 405 L 240.5 400 L 253.5 397 Z " /><path fill="rgb(0,0,0)" stroke="rgb(0,0,0)" stroke-width="1" opacity="0" d="M 114.5 452 L 398.5 452 Q 407.5 454.4 412 461.5 Q 416.7 467.4 415 479.5 L 408.5 490 L 396.5 496 L 116.5 496 Q 104.9 494.1 100 485.5 Q 95.7 480.4 97 469.5 Q 99.3 461.8 104.5 457 L 114.5 452 Z " /><path fill="rgb(179,87,220)" stroke="rgb(179,87,220)" stroke-width="1" opacity="0.9333333333333333" d="M 110.5 0 L 401.5 0 Q 417.1 3.9 425 15.5 Q 432.7 24.8 432 42.5 L 430 51.5 L 426 59.5 L 419.5 67 Q 409.3 77.1 390 77 L 390 113.5 L 389 114.5 L 389 122.5 L 387 133.5 L 383 147.5 Q 369.3 184.3 341.5 207 Q 329.4 217.4 313.5 224 L 303 232.5 L 295 248.5 L 295 263.5 Q 298.3 275.7 306.5 283 L 327.5 295 L 341.5 305 L 359 322.5 Q 377.2 343.8 386 374.5 L 389 389.5 L 389 398.5 L 390 399.5 L 390 435 L 402.5 436 L 408.5 438 L 422 447 L 429 458.5 L 432 469.5 L 432 477.5 Q 429.1 494.1 418.5 503 Q 411 509.5 399.5 512 L 111.5 512 Q 96 508.5 88 497.5 Q 79.2 488.3 80 469.5 Q 82.7 452.7 93.5 444 L 108.5 436 L 122 435 L 122 398.5 L 123 397.5 L 123 389.5 L 125 378.5 L 129 364.5 Q 142.7 327.7 170.5 305 Q 184 293.5 201.5 286 L 208 280.5 L 216 266.5 Q 218.4 259.4 217 248.5 Q 213.6 235.4 204.5 228 L 178.5 213 L 153 189.5 Q 134.8 168.2 126 137.5 L 123 122.5 L 123 114.5 L 122 113.5 L 122 77 L 109.5 76 L 103.5 74 L 91 66 L 83 53.5 L 80 42.5 L 80 33.5 Q 83.2 14.7 96.5 6 L 110.5 0 Z M 116 16 L 108 19 Q 100 24 97 34 L 97 43 L 102 53 Q 107 58 115 60 L 398 60 L 408 55 Q 413 51 415 44 L 415 34 L 409 22 L 397 16 L 116 16 Z M 139 77 L 139 98 L 148 109 L 178 136 Q 187 143 201 146 L 213 146 L 222 144 L 257 128 L 284 120 L 298 119 L 299 118 L 316 118 L 333 121 Q 354 127 368 140 L 373 117 L 373 78 L 373 77 L 139 77 Z M 142 126 L 145 143 L 155 164 L 171 185 L 187 198 L 218 217 Q 231 228 234 250 L 234 313 L 238 322 Q 243 328 251 330 L 262 330 L 271 325 Q 276 320 278 312 L 278 249 L 281 237 L 290 222 L 301 212 Q 317 205 331 194 Q 350 179 360 156 Q 350 146 337 140 L 319 135 L 295 135 L 280 138 Q 255 145 235 157 L 223 161 L 210 162 L 209 163 L 192 161 L 175 154 Q 156 142 142 126 Z M 217 295 L 210 301 L 191 311 L 175 324 Q 154 343 144 373 L 139 397 L 139 435 L 165 435 L 223 390 Q 232 383 247 381 L 265 381 Q 266 383 271 382 L 288 389 L 348 435 L 373 435 L 373 398 L 369 377 Q 362 352 347 335 L 331 318 L 295 295 L 294 317 Q 292 328 285 335 Q 277 344 263 347 Q 242 348 232 339 Q 223 332 219 322 L 217 313 L 217 295 Z M 254 397 L 241 400 L 231 405 L 196 432 L 194 435 L 319 435 L 277 402 L 266 398 L 254 397 Z M 115 452 L 105 457 Q 99 462 97 470 Q 96 480 100 486 Q 105 494 117 496 L 397 496 L 409 490 L 415 480 Q 417 467 412 462 Q 408 454 399 452 L 115 452 Z " /><path fill="rgb(179,87,220)" stroke="rgb(179,87,220)" stroke-width="1" opacity="0.9333333333333333" d="M 283.5 158 Q 290.8 156.8 293 160.5 L 295 166.5 L 291.5 173 L 283.5 174 L 279 170.5 L 278 163.5 L 281.5 159 L 283.5 158 Z " /><path fill="rgb(179,87,220)" stroke="rgb(179,87,220)" stroke-width="1" opacity="0.9333333333333333" d="M 219.5 178 Q 228.5 176.5 230 182.5 Q 231.5 190.5 227.5 193 L 218.5 194 Q 212.9 192.1 214 183.5 L 217.5 179 L 219.5 178 Z " /><path fill="rgb(179,87,220)" stroke="rgb(179,87,220)" stroke-width="1" opacity="0.9333333333333333" d="M 264.5 202 Q 270.1 202.5 272 206.5 L 273 213.5 L 269.5 218 L 262.5 219 L 257 214.5 L 256 209.5 L 260.5 203 L 264.5 202 Z " /><path fill="rgb(179,87,220)" stroke="rgb(179,87,220)" stroke-width="1" opacity="0.9333333333333333" d="M 255.5 280 L 263 283.5 L 264 291.5 L 260.5 296 L 253.5 297 L 249 293.5 L 248 285.5 L 250.5 282 L 255.5 280 Z " /><path fill="rgb(179,87,220)" stroke="rgb(179,87,220)" stroke-width="1" opacity="0.9333333333333333" d="M 214.5 351 Q 222.1 349.9 224 354.5 L 225 362.5 L 222.5 366 L 215.5 368 L 210 364.5 L 209 355.5 L 214.5 351 Z " /><path fill="rgb(179,87,220)" stroke="rgb(179,87,220)" stroke-width="1" opacity="0.9333333333333333" d="M 309.5 360 Q 317.1 358.9 319 363.5 L 320 371.5 L 317.5 375 L 308.5 376 L 306 375 L 304 371.5 L 304 365.5 L 307.5 361 L 309.5 360 Z " /></svg>
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
              <span className="px-3 py-1 rounded-full bg-violet-500/15 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-semibold border border-violet-500/30">
                {selectedGuide.badge}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-medium border border-emerald-500/20 flex items-center gap-1">
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

            {/* Live Web App Action Button */}
            {selectedGuide.liveUrl && (
              <div className="mb-6 flex flex-wrap gap-3">
                <a
                  href={selectedGuide.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-violet-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  Launch Live Web App ({selectedGuide.title.split('—')[0].trim()})
                </a>
              </div>
            )}

            {/* Why This Is Rare Callout Box (Only shown if whyRare is specified) */}
            {Boolean(selectedGuide.whyRare) && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 dark:border-amber-500/20 mb-8">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-1">
                      Why this engineering blueprint is rare & hard to find
                    </h4>
                    <p className="text-xs sm:text-sm text-amber-950/90 dark:text-amber-200/80 leading-relaxed font-medium dark:font-normal">
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

                    <div className="space-y-4 relative before:absolute before:top-8 before:bottom-8 before:left-9 before:w-0.5 before:bg-violet-500/40 dark:before:bg-violet-500/25 before:hidden sm:before:block">
                      {selectedGuide.pipelineSteps.map((step) => (
                        <div
                          key={step.stepNumber}
                          className="relative flex flex-col sm:flex-row gap-4 p-5 rounded-2xl bg-card/40 border border-border/60 hover:border-border transition-colors"
                        >
                          <div className="flex items-center gap-3 sm:block">
                            <div className="w-8 h-8 rounded-full bg-card text-violet-600 dark:text-violet-400 border border-violet-500/40 shadow-sm flex items-center justify-center font-bold text-xs shrink-0 relative z-10">
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
                          {item.url.startsWith('http') ? (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs transition-colors shadow-md shadow-violet-600/20"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Go to {item.title}
                            </a>
                          ) : (
                            <a
                              href={item.url}
                              download={item.fileName}
                              onClick={() => handleDownload(item)}
                              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-colors shadow-md shadow-violet-600/20"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Download {item.fileName}
                            </a>
                          )}
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
