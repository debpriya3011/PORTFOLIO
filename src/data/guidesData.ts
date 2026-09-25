export interface PipelineStep {
  stepNumber: number;
  title: string;
  method: 'POST' | 'GET' | 'PUT' | 'WAIT' | 'ENGINE' | 'CALC';
  endpoint: string;
  description: string;
  highlights: string[];
}

export interface GuideDownload {
  title: string;
  type: 'pdf' | 'json' | 'code' | 'exe';
  fileName: string;
  url: string;
  size: string;
  description: string;
  platform?: 'n8n' | 'Make.com' | 'PDF' | 'Windows App' | 'Executable' | 'Universal';
}

export interface PlaceholderItem {
  key: string;
  description: string;
  whereToFind: string;
  format: string;
}

export interface CodeSnippet {
  title: string;
  language: string;
  code: string;
  note?: string;
}

export interface AutomationGuide {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  category: string;
  readTime: string;
  difficulty: 'Advanced' | 'Intermediate' | 'Beginner';
  platforms: string[];
  tags: string[];
  lastUpdated: string;
  featured: boolean;
  liveUrl?: string;
  problemStatement: string;
  whyRare?: string;
  keyFeatures: string[];
  pipelineSteps: PipelineStep[];
  downloads: GuideDownload[];
  placeholderGuide: PlaceholderItem[];
  codeSnippets: CodeSnippet[];
}

export const automationGuides: AutomationGuide[] = [
  {
    id: 'pinterest-video-api-automation',
    slug: 'pinterest-video-api',
    title: 'Pinterest v5 Asynchronous Video Upload Engine',
    subtitle: 'Production-ready automation architecture for n8n & Make.com using Presigned AWS S3 Multipart Handshakes',
    badge: 'Flagship Blueprint',
    category: 'API Engineering & Automation',
    readTime: '10 min read',
    difficulty: 'Advanced',
    platforms: ['n8n', 'Make.com', 'AWS S3 Accelerate', 'Pinterest API v5'],
    tags: ['Pinterest API', 'AWS S3', 'Presigned URL', 'n8n Workflow', 'Make Scenario', 'Async Transcoding', 'REST API'],
    lastUpdated: '2026',
    featured: true,
    problemStatement:
      'Unlike standard image pins (which require only a simple single-endpoint POST request), Pinterest’s official v5 API for Video Pins requires an asynchronous, 4-stage distributed handshake involving temporary AWS S3 bucket allocation, Amazon SigV4 presigned multipart headers, video transcode state polling, and media-ID linkage. Because of this complexity, virtually zero complete visual guides or no-code blueprints exist online for direct n8n or Make integration.',
    whyRare:
      'Most online tutorials and YouTube videos only demonstrate standard static image uploads or rely on proprietary paid third-party connectors. This blueprint demonstrates how to natively orchestrate raw multipart S3 authentication and dynamic HMAC signature token mapping directly inside standard HTTP request nodes without writing custom SDK wrappers or paying for third-party automation apps.',
    keyFeatures: [
      'Raw Presigned Amazon S3 POST Handshake in No-Code nodes',
      'Dynamic HMAC authentication mapping (x-amz-credential, signature, policy, security-token)',
      'Asynchronous video transcoding polling & delay management',
      'Dual-platform ready: 1-click importable blueprints for both n8n & Make.com',
      'Complete end-to-end PDF developer specification included'
    ],
    pipelineSteps: [
      {
        stepNumber: 1,
        title: 'Media Registration',
        method: 'POST',
        endpoint: 'https://api.pinterest.com/v5/media',
        description: 'Initiates a media upload registration request with Pinterest API v5. Informs Pinterest that a video asset is about to be uploaded.',
        highlights: [
          'Request Body: {"media_type": "video"}',
          'Returns a unique media_id and a full dictionary of presigned AWS S3 upload_parameters and upload_url'
        ]
      },
      {
        stepNumber: 2,
        title: 'Presigned S3 Multipart Upload',
        method: 'POST',
        endpoint: 'https://pinterest-media-upload.s3-accelerate.amazonaws.com/',
        description: 'Uploads the binary video file directly to Pinterest’s S3 accelerate bucket using the presigned parameters received in Step 1.',
        highlights: [
          'Form fields include x-amz-date, x-amz-signature, policy, x-amz-credential, and x-amz-security-token',
          'Attaches raw binary video buffer under field name "file"',
          'Bypasses file size limits and offloads bandwidth directly to AWS S3'
        ]
      },
      {
        stepNumber: 3,
        title: 'Transcoding & Processing Handshake',
        method: 'WAIT',
        endpoint: 'Polling / Internal State Delay (120s Wait)',
        description: 'Pinterest asynchronously transcodes the video, generates multiple streaming bitrates, and prepares thumbnail frames.',
        highlights: [
          'Implemented via a Wait node in n8n or a Sleep delay module in Make.com',
          'Ensures the video status transitions to "succeeded" before the final pin creation call'
        ]
      },
      {
        stepNumber: 4,
        title: 'Pin Creation & Media Linkage',
        method: 'POST',
        endpoint: 'https://api.pinterest.com/v5/pins',
        description: 'Publishes the final Pin to the target board, attaching the registered media_id and cover image thumbnail.',
        highlights: [
          'Payload specifies source_type: "video_id" and binds the media_id from Step 1',
          'Assigns target board_id, title, description, and cover_image_url'
        ]
      }
    ],
    downloads: [
      {
        title: 'Complete Developer API Guide',
        type: 'pdf',
        fileName: 'pinterest-video-api-guide.pdf',
        url: '/downloads/pinterest-video-api-guide.pdf',
        size: '557 KB',
        description: 'Comprehensive step-by-step developer specification PDF with HTTP requests, curl commands, and architectural documentation.',
        platform: 'PDF'
      },
      {
        title: 'n8n Workflow Blueprint',
        type: 'json',
        fileName: 'pinterest-workflow-n8n.json',
        url: '/downloads/pinterest-workflow-n8n.json',
        size: '7 KB',
        description: 'Ready-to-import n8n workflow JSON with multipart form data nodes, AWS parameter mapping, and wait states.',
        platform: 'n8n'
      },
      {
        title: 'Make.com Scenario Blueprint',
        type: 'json',
        fileName: 'pinterest-workflow-make.json',
        url: '/downloads/pinterest-workflow-make.json',
        size: '58 KB',
        description: 'Importable Make (Integromat) scenario JSON with HTTP MakeRequest modules configured for S3 presigned upload.',
        platform: 'Make.com'
      }
    ],
    placeholderGuide: [
      {
        key: 'YOUR_PINTEREST_ACCESS_TOKEN',
        description: 'Your Pinterest API v5 OAuth Bearer Token (Starts with pina_...).',
        whereToFind: 'Pinterest Developers Portal -> My Apps -> Generate Sandbox/Production Access Token',
        format: 'Bearer YOUR_PINTEREST_ACCESS_TOKEN'
      },
      {
        key: 'YOUR_PINTEREST_BOARD_ID',
        description: 'The target numerical ID of the Pinterest board where the video pin should be published.',
        whereToFind: 'Pinterest Board URL (or fetched via GET /v5/boards endpoint)',
        format: 'e.g., "1147855092466911252"'
      },
      {
        key: 'https://example.com/path/to/your-video.mp4',
        description: 'Public direct download link or cloud storage URL to the raw source video file (MP4, MOV).',
        whereToFind: 'Your S3 bucket, Google Drive direct download URL, or media CDN',
        format: 'Direct URL returning video/mp4 stream'
      },
      {
        key: 'https://example.com/path/to/your-cover-image.jpg',
        description: 'Public URL to the JPEG/PNG image used as the static preview/cover thumbnail for the video pin.',
        whereToFind: 'Your hosted assets, CDN, or thumbnail generator',
        format: 'Direct URL returning image/jpeg or image/png'
      }
    ],
    codeSnippets: [
      {
        title: '1. Register Upload (POST /v5/media)',
        language: 'bash',
        code: `curl -X POST https://api.pinterest.com/v5/media \\
  -H "Authorization: Bearer YOUR_PINTEREST_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "media_type": "video"
  }'`
      },
      {
        title: '2. Presigned S3 Multipart Form Data Upload',
        language: 'bash',
        code: `curl -X POST https://pinterest-media-upload.s3-accelerate.amazonaws.com/ \\
  -F "x-amz-date=\${upload_parameters['x-amz-date']}" \\
  -F "x-amz-signature=\${upload_parameters['x-amz-signature']}" \\
  -F "x-amz-security-token=\${upload_parameters['x-amz-security-token']}" \\
  -F "x-amz-algorithm=\${upload_parameters['x-amz-algorithm']}" \\
  -F "key=\${upload_parameters['key']}" \\
  -F "policy=\${upload_parameters['policy']}" \\
  -F "x-amz-credential=\${upload_parameters['x-amz-credential']}" \\
  -F "Content-Type=multipart/form-data" \\
  -F "file=@/path/to/video.mp4"`
      },
      {
        title: '3. Create Video Pin (POST /v5/pins)',
        language: 'bash',
        code: `curl -X POST https://api.pinterest.com/v5/pins \\
  -H "Authorization: Bearer YOUR_PINTEREST_ACCESS_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "board_id": "YOUR_PINTEREST_BOARD_ID",
    "title": "Automated Video Pin Title",
    "description": "Uploaded seamlessly via custom n8n/Make pipeline",
    "media_source": {
      "source_type": "video_id",
      "media_id": "\${registered_media_id}",
      "cover_image_url": "https://example.com/path/to/cover.jpg",
      "cover_image_content_type": "image/jpeg"
    }
  }'`
      }
    ]
  },
  {
    id: 'pyviz-python-visualizer',
    slug: 'pyviz-python-code-visualizer',
    title: 'PyViz — Real-Time Client-Side Python Code Visualizer & Step Debugger',
    subtitle: 'Zero-lag in-browser Python execution engine that traces function calls, visualizes heap/stack frames, inspects pointer mutations, and animates data structures line-by-line in real time.',
    badge: 'Live Interactive Web App',
    category: 'Compiler Engineering & Developer Tools',
    readTime: '8 min read',
    difficulty: 'Advanced',
    platforms: ['Python Web Runtime', 'Client-Side AST Analyzer', 'Interactive Canvas & DOM Debugger', 'Render Cloud Deployment', 'WebAssembly / JS'],
    tags: ['Python Visualizer', 'Step Debugger', 'AST Parsing', 'Memory Heap Inspector', 'Call Stack Visualizer', 'Algorithm Learning', 'Zero-Lag Execution', 'Web App'],
    lastUpdated: '2026',
    featured: true,
    liveUrl: 'https://pyrunner-kfoc.onrender.com/',
    problemStatement:
      'Mastering algorithms, recursion, and memory mutations in Python is notoriously difficult when relying solely on static text editors, terminal print statements, or slow server-sandboxes with cold-start delays. Developers and students need immediate, zero-lag visual feedback to inspect call stacks, variable mutations, and pointer references in real time directly inside the browser.',
    whyRare:
      'Unlike traditional online Python runners that either suffer from server cold-start delays or provide only static output, PyViz delivers a zero-lag execution experience by combining the code runner and real-time step-by-step memory frame visualizer simultaneously right inside the browser.',
    keyFeatures: [
      'Zero-Lag Client-Side Execution (Local in-browser Python runtime with instant execution feedback)',
      'Simultaneous Code Runner & Memory Visualizer (Step forward, rewind, jump to start/end, and playback controls)',
      'Dynamic Call Stack & Heap Graph Engine (Inspects stack frames, local variables, object pointers, and in-place list/dict mutations)',
      'Curated Algorithm Presets (Preloaded visualizers for sorting algorithms, recursive trees, binary search, and linked lists)',
      'Keyboard-Driven Productivity Controls (Ctrl+Enter to run, Arrow keys to step, Space to play/pause)',
      '100% Free & Open-Access Client-Side Web Architecture'
    ],
    pipelineSteps: [
      {
        stepNumber: 1,
        title: 'Source Code Ingestion & AST Lexical Tokenization',
        method: 'ENGINE',
        endpoint: 'Client AST Tokenizer & Parser',
        description: 'Ingests user-submitted Python code, strips unsafe operations, and converts source lines into an Abstract Syntax Tree (AST) for line-by-line instrumented tracking.',
        highlights: [
          'Detects syntax errors instantly before execution begins',
          'Instruments line event hooks to track statement transitions without modifying user output'
        ]
      },
      {
        stepNumber: 2,
        title: 'In-Browser Step Execution & Trace Snapshot Engine',
        method: 'ENGINE',
        endpoint: 'Trace Event Capture & State Recorder',
        description: 'Executes the Python code step-by-step through a client runtime, capturing complete state snapshots (line number, event type, stdout buffer, and active frame) at each execution tick.',
        highlights: [
          'Safety guard rails preventing infinite loops with configurable max-step thresholds',
          'Maintains an immutable snapshot array enabling zero-latency forward and backward time travel'
        ]
      },
      {
        stepNumber: 3,
        title: 'Stack Frame State & Heap Pointer Resolution',
        method: 'CALC',
        endpoint: 'Memory Frame & Pointer Graph Generator',
        description: 'Extracts active call stack frames, distinguishes local vs global scopes, and resolves references to compound heap objects (lists, dictionaries, custom objects).',
        highlights: [
          'Tracks pointer mutation and object re-assignment across function scopes',
          'Visualizes recursive call stacks with nested activation records'
        ]
      },
      {
        stepNumber: 4,
        title: 'Reactive DOM Canvas Rendering & Playback Controller',
        method: 'ENGINE',
        endpoint: 'Interactive Visualizer UI & Keyboard Controller',
        description: 'Renders the visualizer canvas with animated code line markers, formatted variable tables, and dynamic memory boxes synchronized with time-travel controls.',
        highlights: [
          'Fluid playback engine with adjustable speed slider (100ms - 2000ms per step)',
          'Keyboard shortcut bindings for rapid algorithm exploration'
        ]
      }
    ],
    downloads: [
      {
        title: 'PyViz Interactive Visualizer Web App',
        type: 'code',
        fileName: 'app.html',
        url: 'https://pyrunner-kfoc.onrender.com/app.html',
        size: 'Live Web App',
        description: 'Launch the live interactive Python code visualizer to step through code execution and inspect memory frames in real time.',
        platform: 'Universal'
      },
      {
        title: 'PyViz Product & Documentation Portal',
        type: 'code',
        fileName: 'index.html',
        url: 'https://pyrunner-kfoc.onrender.com/',
        size: 'Web Portal',
        description: 'Explore PyViz features, use cases for students and educators, and pre-built algorithm guides.',
        platform: 'Universal'
      }
    ],
    placeholderGuide: [
      {
        key: 'MAX_EXECUTION_STEPS',
        description: 'Maximum step threshold allocated to prevent browser freezing during infinite while/recursion loops.',
        whereToFind: 'Configured in PyViz runtime runner settings (defaults to 1,000 steps)',
        format: 'Integer (e.g. 1000)'
      },
      {
        key: 'DEFAULT_PLAYBACK_DELAY_MS',
        description: 'Timer delay in milliseconds between automated forward execution step ticks.',
        whereToFind: 'Adjustable via the interactive speed slider control in the app interface',
        format: 'Milliseconds (e.g. 300)'
      }
    ],
    codeSnippets: [
      {
        title: '1. In-Browser Execution Tracing & State Snapshot Engine',
        language: 'javascript',
        code: `class PyVizTraceEngine {
  constructor(maxSteps = 1000) {
    this.maxSteps = maxSteps;
    this.snapshots = [];
    this.currentStep = 0;
  }

  recordSnapshot(lineNumber, eventType, scopeVariables, heapObjects, stdoutText) {
    if (this.snapshots.length >= this.maxSteps) {
      throw new Error(\`Execution step limit reached (\${this.maxSteps} steps). Potential infinite loop.\`);
    }

    const snapshot = {
      step: this.snapshots.length + 1,
      line: lineNumber,
      event: eventType, // 'call', 'line', 'return', 'exception'
      stackFrames: JSON.parse(JSON.stringify(scopeVariables)),
      heap: JSON.parse(JSON.stringify(heapObjects)),
      stdout: stdoutText
    };

    this.snapshots.push(snapshot);
  }

  seek(stepIndex) {
    this.currentStep = Math.max(0, Math.min(stepIndex, this.snapshots.length - 1));
    return this.snapshots[this.currentStep];
  }
}`
      },
      {
        title: '2. Dynamic Memory Frame & Pointer Mutation Graph Builder',
        language: 'javascript',
        code: `function renderMemoryGraph(stackFrames, heapMemory) {
  const container = document.getElementById('memory-view');
  container.innerHTML = '';

  // Render Call Stack Frames
  stackFrames.forEach((frame, idx) => {
    const frameEl = document.createElement('div');
    frameEl.className = 'stack-frame glass p-3 rounded-xl border border-violet-500/30';
    frameEl.innerHTML = \`
      <div class="font-bold text-xs text-violet-400 mb-1">Frame: \${frame.funcName || 'Global Scope'}</div>
      <div class="space-y-1">
        \${Object.entries(frame.locals).map(([k, v]) => \`
          <div class="flex justify-between text-xs font-mono">
            <span class="text-zinc-400">\${k}:</span>
            <span class="\${typeof v === 'object' ? 'text-amber-400 cursor-pointer' : 'text-emerald-400'}">\${JSON.stringify(v)}</span>
          </div>
        \`).join('')}
      </div>
    \`;
    container.appendChild(frameEl);
  });
}`
      }
    ]
  },
  {
    id: 'mf-analytics-pro',
    slug: 'mutual-fund-analytics-pro',
    title: 'Mutual Fund Analytics Pro — Quantitative Desktop Engine & Client Distribution',
    subtitle: 'Full-stack FinTech desktop suite with automated historical NAV scraping, 200-day SMA quantitative signals, STCG/LTCG tax simulations, ReportLab PDF generation, and multi-channel WhatsApp/Email client dispatching.',
    badge: 'Desktop FinTech Suite',
    category: 'Quantitative Finance & Desktop Engineering',
    readTime: '12 min read',
    difficulty: 'Advanced',
    platforms: ['CustomTkinter GUI', 'Python', 'Pandas & OpenPyXL', 'ReportLab (PDF)', 'Web Scraping (BS4)', 'Matplotlib', 'SMTP & WhatsApp Web'],
    tags: ['FinTech', 'Python Desktop App', 'Quantitative Analysis', 'Web Scraping', 'PDF Generation', 'Tax Calculator', 'Client CRM', 'NAV Aggregator API'],
    lastUpdated: '2026',
    featured: true,
    problemStatement:
      'Retail investors and independent financial advisors (IFAs) struggle to dynamically analyze historical NAV trajectories across hundreds of Indian Mutual Funds, calculate post-tax / exit-load adjusted real returns under recent budget amendments (STCG at 20%, LTCG at 12.5%), generate customized branded PDF factsheets, and dispatch personalized reports to client rosters without expensive enterprise software subscriptions.',
    whyRare:
      'Engineers a complete zero-subscription desktop software integrating low-level historical NAV chunk scraping with automated AMC slug resolution, 200-day SMA quantitative momentum verdicts, real-world Indian tax regime computations (with ₹1.25L exemption thresholds & exit load windows), dynamic ReportLab vector PDF compilation, and an integrated multi-tenant client communication hub (automated WhatsApp Web deep-linking & Gmail TLS dispatch) in a single standalone compiled binary with tamper-resistant cryptographic 60-day licensing.',
    keyFeatures: [
      'Live Autocomplete & AMC Fund Browser (Resolves complex scheme names to historical slugs directly via fund aggregator APIs)',
      'Multi-Year Adaptive Data Chunking (Overcomes 5-year web scraping limits via automatic 4-year date windowing and inception date protection)',
      'Technical Analysis & Quantitative Verdicts (200 DMA trendlines, Dip/Momentum classification, All-Time-High SIP indicators)',
      'Real-World Tax & Real Profit Simulator (Pre/Post 2024 budget STCG 20%, LTCG 12.5%, 0.005% stamp duty, and customizable exit load windows)',
      'Vector ReportLab PDF Report Engine (Generates individual fund reports or full consolidated portfolio PDF books)',
      'Integrated Client CRM & Multi-Channel Dispatcher (One-click WhatsApp Web launch & automated TLS Gmail dispatch with attachments)',
      'Cryptographically Signed 60-Day Trial License Manager (Stored across redundant Windows registry & system paths with time-rollback tamper detection)'
    ],
    pipelineSteps: [
      {
        stepNumber: 1,
        title: 'Intelligent Scheme Resolution & Inception Discovery',
        method: 'POST',
        endpoint: 'api/autoSuggestGrowthDividendSchemes',
        description: 'Debounces keystrokes in real time to fetch matching mutual fund slugs. Automatically queries the inception date endpoint to prevent invalid pre-inception date scraping.',
        highlights: [
          'Handles Direct/Regular and Growth/IDCW name matching with token overlap scoring',
          'Queries getSchemeStartAndEndDate to clamp historical requests to actual fund inception'
        ]
      },
      {
        stepNumber: 2,
        title: 'Adaptive Multi-Year NAV Scraper & Excel Data Engine',
        method: 'GET',
        endpoint: 'historical-NAV/{slug}?start_date={cs}&end_date={ce}',
        description: 'Splits multi-decade historical data requests into 4-year windows (bypassing the server 5-year limit). Merges, deduplicates, and maintains local multi-sheet Excel storage.',
        highlights: [
          'Automated 4-year window chunking algorithm with datetime deduplication',
          'Incrementally appends new historical data to mf_database_v2.xlsx without overwriting existing client records'
        ]
      },
      {
        stepNumber: 3,
        title: 'Quantitative Signal Engine & 200-Day SMA Verdicts',
        method: 'ENGINE',
        endpoint: 'Quantitative Analysis & Trend Engine',
        description: 'Computes the 200-day Simple Moving Average (200 DMA), calculates distance from 52-week & All-Time Highs, and generates algorithmic verdicts.',
        highlights: [
          '🟢 STRONG BUY (DIP): In long-term uptrend (>200 DMA) and corrected >5% from high',
          '🟢 BUY (MOMENTUM): Strong upward momentum trading near highs with high historical consistency',
          '🟡 HOLD / SIP ONLY: Trading near ATH; recommended for SIP, avoid large lumpsum',
          '🔴 CAUTION: NAV below 200 DMA indicating negative long-term trend'
        ]
      },
      {
        stepNumber: 4,
        title: 'Post-Tax Real Profit & Exit Load Simulation',
        method: 'CALC',
        endpoint: 'Indian Tax & Capital Gains Simulator',
        description: 'Simulates redemption cash flows: investment date NAV vs current NAV, applies stamp duty (0.005%), exit load if redeemed <365 days, and computes net tax liability under STCG (20%) / LTCG (12.5%).',
        highlights: [
          'Side-by-side comparison of Short-Term vs Long-Term investment horizons',
          'Calculates Net In-Hand Value after Exit Load, STCG/LTCG taxes, and Stamp Duty'
        ]
      },
      {
        stepNumber: 5,
        title: 'ReportLab PDF Generation & Client Dispatch Hub',
        method: 'ENGINE',
        endpoint: 'Vector PDF Compiler & Multi-Channel Dispatch',
        description: 'Compiles high-resolution vector charts & data tables into styled PDF reports, with direct dispatch to client rosters via WhatsApp Web or encrypted SMTP.',
        highlights: [
          'Generates individual fund reports or consolidated master portfolio books',
          'Automates WhatsApp Web pre-filled URL launches and encrypted Gmail TLS report delivery'
        ]
      }
    ],
    downloads: [
      {
        title: 'MF Tracker Pro Desktop App (.exe)',
        type: 'exe',
        fileName: 'MF_Tracker_Pro.exe',
        url: '/downloads/MF_Tracker_Pro.exe',
        size: '61.3 MB',
        description: 'Standalone compiled Windows desktop executable for Mutual Fund Analytics Pro. Includes full CustomTkinter GUI, quantitative charting, and local Excel engine (no Python installation required).',
        platform: 'Windows App'
      },
      {
        title: 'Complete User Guide & Manual (PDF)',
        type: 'pdf',
        fileName: 'mf-tracker-user-guide.pdf',
        url: '/downloads/mf-tracker-user-guide.pdf',
        size: '220 KB',
        description: 'Comprehensive 8-chapter user manual and technical guide covering fund autocomplete, 200 DMA verdicts, tax calculator setup, and client messaging workflows.',
        platform: 'PDF'
      }
    ],
    placeholderGuide: [
      {
        key: 'GMAIL_APP_PASSWORD',
        description: '16-character Google App Password used for sending automated PDF reports via encrypted SMTP (TLS).',
        whereToFind: 'Google Account -> Security -> 2-Step Verification -> App Passwords',
        format: 'e.g., "abcd efgh ijkl mnop"'
      },
      {
        key: 'REPORTS_OUTPUT_DIRECTORY',
        description: 'Local directory path where generated individual and consolidated PDF reports are saved.',
        whereToFind: 'Configured in app settings or selected via the Browse Folder button (defaults to ./Reports/)',
        format: 'e.g., "C:\\Users\\Username\\Desktop\\Reports"'
      },
      {
        key: 'EXCEL_DATABASE_FILE',
        description: 'Local multi-sheet Excel database storing historical NAV sheets, master registry, and client contact records.',
        whereToFind: 'Created automatically on first launch as mf_database_v2.xlsx',
        format: 'e.g., "mf_database_v2.xlsx"'
      }
    ],
    codeSnippets: [
      {
        title: '1. Multi-Year Adaptive Historical NAV Chunking Algorithm',
        language: 'python',
        code: `def scrape_range(self, slug, start_date_str, end_date_str):
    """Scrapes historical NAV data, automatically chunking into 4-year windows to handle server limits."""
    start_dt = datetime.strptime(start_date_str, "%d-%m-%Y")
    end_dt = datetime.strptime(end_date_str, "%d-%m-%Y")

    CHUNK_DAYS = 4 * 365  # 4-year chunks (website max is ~5 years)
    all_data = []
    chunk_start = start_dt

    while chunk_start < end_dt:
        chunk_end = min(chunk_start + timedelta(days=CHUNK_DAYS), end_dt)
        cs = chunk_start.strftime("%d-%m-%Y")
        ce = chunk_end.strftime("%d-%m-%Y")
        url = f"https://api.financial-data-hub.com/mutual-funds/historical-NAV/{slug}?start_date={cs}&end_date={ce}"
        
        headers = {'User-Agent': 'Mozilla/5.0'}
        r = requests.get(url, headers=headers, timeout=15)
        soup = BeautifulSoup(r.content, 'html.parser')
        table = soup.find('table', id='historical_nav')
        if table and table.find('tbody'):
            for row in table.find('tbody').find_all('tr'):
                cols = row.find_all('td')
                if len(cols) == 2:
                    dt = datetime.strptime(cols[0].text.strip(), "%d-%m-%Y")
                    nav = float(cols[1].text.strip())
                    all_data.append({"Date": dt, "NAV": nav})
        chunk_start = chunk_end + timedelta(days=1)

    df = pd.DataFrame(all_data).drop_duplicates(subset=['Date']).sort_values('Date', ascending=False)
    return True, df`
      },
      {
        title: '2. Post-Tax Real Return & Capital Gains Calculation (STCG/LTCG)',
        language: 'python',
        code: `def calculate_real_profit(invested_amount, purchase_nav, current_nav, holding_days, exit_load_pct, stcg_rate=20.0, ltcg_rate=12.5):
    """Calculates Net In-Hand Value after Stamp Duty, Exit Load, and Indian Capital Gains Tax."""
    stamp_duty = invested_amount * 0.00005
    net_invested = invested_amount - stamp_duty
    units = net_invested / purchase_nav
    gross_current_value = units * current_nav
    gross_profit = gross_current_value - invested_amount

    # Exit Load check
    exit_load_amount = (gross_current_value * (exit_load_pct / 100)) if holding_days < 365 else 0.0
    value_after_exit_load = gross_current_value - exit_load_amount

    # Tax computation (STCG < 1 yr @ 20%, LTCG > 1 yr @ 12.5% above exemption)
    tax_amount = 0.0
    if gross_profit > 0:
        if holding_days < 365:
            tax_amount = gross_profit * (stcg_rate / 100)
        else:
            taxable_ltcg = max(0.0, gross_profit - 125000) # ₹1.25L exemption threshold
            tax_amount = taxable_ltcg * (ltcg_rate / 100)

    net_in_hand = value_after_exit_load - tax_amount
    absolute_return_pct = ((net_in_hand - invested_amount) / invested_amount) * 100
    return {
        "net_in_hand": round(net_in_hand, 2),
        "total_tax": round(tax_amount, 2),
        "exit_load": round(exit_load_amount, 2),
        "absolute_return_pct": round(absolute_return_pct, 2)
    }`
      },
      {
        title: '3. Cryptographically Signed 60-Day Trial License Manager',
        language: 'python',
        code: `class LicenseManager:
    REG_PATH = r"Software\\Classes\\CLSID\\{8F31E49C-8A2D-4B9E-B123-5D7E8F9A0B1C}"
    REG_VAL = "InstallData"
    SALT = "MF_ANALYTICS_PRO_2026_SECURE_SALT_v1"
    TRIAL_DAYS = 60

    @classmethod
    def _create_signature(cls, first_run, last_run):
        data = f"{first_run}:{last_run}:{cls.SALT}"
        return hashlib.sha256(data.encode('utf-8')).hexdigest()

    @classmethod
    def check_license(cls):
        now = int(time.time())
        # Multi-location validation (Registry + AppData + LocalAppData)
        first_run, last_run = cls._get_stored_timestamps()
        
        # Anti-time-rollback detection
        if now < (last_run - 3600):
            return False, "System clock tampering detected! Access blocked.", 0
            
        elapsed_days = (now - first_run) / 86400.0
        remaining_days = max(0, int(cls.TRIAL_DAYS - elapsed_days))
        
        if elapsed_days > cls.TRIAL_DAYS:
            return False, "Trial Period Expired (60 Days Ended).", 0
            
        return True, f"Trial Active ({remaining_days} Days Remaining)", remaining_days`
      }
    ]
  },
  {
    id: 'photo-sequencer-pro',
    slug: 'photo-sequencer-pro',
    title: 'PhotoSequencer Pro — Visual Sequence Arranger & Batch Exporter',
    subtitle: 'Lightweight desktop application engineered with high-performance Pillow Lanczos thumbnail caching, interactive Tkinter canvas coordinate mapping, native TkinterDnD drag-and-drop bindings, EXIF rotation recovery, and threaded multi-format batch exporting.',
    badge: 'Desktop Utility Suite',
    category: 'Desktop Engineering & Media Automation',
    readTime: '8 min read',
    difficulty: 'Intermediate',
    platforms: ['Python 3', 'Tkinter & Canvas Engine', 'TkinterDnD2 (C/Tcl Bindings)', 'Pillow (PIL)', 'Threading', 'PyInstaller Standalone Binary'],
    tags: ['Python Desktop App', 'Image Processing', 'Drag & Drop', 'Batch Renamer', 'TkinterDnD', 'Pillow', 'Standalone Executable', 'EXIF Orientation'],
    lastUpdated: '2026',
    featured: true,
    problemStatement:
      'Photographers, stop-motion animators, digital artists, and content publishers frequently need to visually organize, reorder, rotate, and batch-rename large sets of image sequences before importing into video editors or uploading to web CMS platforms. Standard file managers lack visual drag-and-drop sequencing, while commercial graphic suites are bloated and lack customizable zero-padded batch exporting with format transcoding.',
    keyFeatures: [
      'Responsive Canvas Grid Engine (Dynamically calculates column count and card flow based on window resize events with zero visual clipping)',
      'High-Performance In-Memory Thumbnail Caching (Lanczos resampling with aspect-ratio preserving square framing to render 100+ 4K photos instantly)',
      'Native OS Drag & Drop Integration (Low-level TkinterDnD integration for direct file and folder drops from Windows Explorer)',
      'Visual Drag-to-Reorder & Insertion Indicator (Real-time cyan drop indicator bar, floating ghost preview, and live sequence renumbering)',
      'EXIF Camera Orientation & In-App Lossless Rotation (Automatic orientation correction and per-card 90° clockwise rotation tools)',
      'Threaded Non-Blocking Batch Exporter (Background worker with progress bar, custom prefixing, digit zero-padding, format conversion to JPG/PNG/WebP, and auto-opening destination folder)',
      'Zero-Dependency Standalone Compilation (Packaged via PyInstaller with native tkdnd binaries into a single portable Windows .exe)'
    ],
    pipelineSteps: [
      {
        stepNumber: 1,
        title: 'Native File Payload Ingestion & EXIF Extraction',
        method: 'ENGINE',
        endpoint: 'TkinterDnD.drop_target_register(DND_FILES)',
        description: 'Intercepts native drag-and-drop payloads from the operating system shell or file picker dialogs. Automatically parses image headers to extract raw dimensions, file size, and EXIF orientation tags.',
        highlights: [
          'Handles path sanitization and multi-file token split across Windows/macOS formats',
          'Utilizes ImageOps.exif_transpose to ensure camera rotations are respected without quality degradation'
        ]
      },
      {
        stepNumber: 2,
        title: 'Responsive Grid Coordinate Mapping & Card Rendering',
        method: 'CALC',
        endpoint: 'Canvas.create_polygon() & tag_bind()',
        description: 'Computes responsive column counts dynamically on <Configure> window events. Draws rounded rectangular card containers, sequence badges (#01, #02), quick-action buttons (✕ Delete, ↻ Rotate), and truncated filename metadata.',
        highlights: [
          'Maintains dual-mapping dictionary between Canvas item IDs and memory array indices',
          'Generates cached Lanczos square thumbnails on demand with zoom slider scaling (100px - 220px)'
        ]
      },
      {
        stepNumber: 3,
        title: 'Interactive Reordering Engine & Insertion Visualizer',
        method: 'ENGINE',
        endpoint: 'Canvas.bind(<B1-Motion>) & Canvas.create_line()',
        description: 'Tracks cursor motion to create a semi-transparent floating thumbnail ghost while calculating target insertion points. Renders an interactive cyan insertion guide indicating drop placement before splicing the sequence array.',
        highlights: [
          'Instant non-destructive array splicing and dynamic badge renumbering upon mouse release',
          'Keyboard navigation support: Move Left/Right with arrow keys and Delete key removal'
        ]
      },
      {
        stepNumber: 4,
        title: 'Threaded Batch Renaming & Transcoding Pipeline',
        method: 'ENGINE',
        endpoint: 'threading.Thread(target=export_worker)',
        description: 'Executes non-blocking batch exports in a dedicated background thread. Formats filenames with customizable prefixes (e.g., Photo_), starting index, and digit padding (e.g., 001). Applies lossless copy for unchanged files or quality-controlled transcoding to JPEG/PNG/WebP.',
        highlights: [
          'Maintains 60fps UI responsiveness with synchronized modal progress bar updates',
          'Auto-opens the output directory in Windows Explorer (os.startfile) upon completion'
        ]
      }
    ],
    downloads: [
      {
        title: 'PhotoSequencer Pro (Windows 64-bit Executable)',
        type: 'exe',
        fileName: 'PhotoSequencerPro.exe',
        url: '/downloads/PhotoSequencerPro.exe',
        size: '31.3 MB',
        description: 'Standalone compiled Windows application. No Python or external dependencies required — download and double-click to run.',
        platform: 'Windows App'
      }
    ],
    placeholderGuide: [
      {
        key: 'Filename Prefix',
        description: 'Base naming string prepended to all output files (e.g., "Photo_", "Frame_", "Step_").',
        whereToFind: 'Export Sequence Modal -> Filename Prefix input box',
        format: 'Text string (e.g., "Photo_")'
      },
      {
        key: 'Start Index & Digits Padding',
        description: 'The starting sequence number (e.g., 1) and zero-padding digit width (e.g., 3 creates "001", "002").',
        whereToFind: 'Export Sequence Modal -> Start Index / Digits Padding spinboxes',
        format: 'Integer (e.g., Start: 1, Padding: 3)'
      },
      {
        key: 'Format Conversion',
        description: 'Output image format: Keep Original extension, or transcode to JPEG (.jpg), PNG (.png), or WEBP (.webp).',
        whereToFind: 'Export Sequence Modal -> Convert Format dropdown',
        format: 'Keep Original | JPEG (.jpg) | PNG (.png) | WEBP (.webp)'
      },
      {
        key: 'Destination Folder',
        description: 'Target directory on your disk where the renamed sequence will be generated.',
        whereToFind: 'Export Sequence Modal -> Destination Folder -> Browse...',
        format: 'Absolute folder path (e.g., "C:\\Exports\\Sequence_01")'
      }
    ],
    codeSnippets: [
      {
        title: '1. Auto-Dependency Detection & Ingestion',
        language: 'python',
        code: `def ensure_dependencies():
    required_packages = {"PIL": "Pillow", "tkinterdnd2": "tkinterdnd2"}
    missing = [pkg for mod, pkg in required_packages.items() if not __import_check__(mod)]
    if missing:
        import subprocess, sys
        subprocess.check_call([sys.executable, "-m", "pip", "install", *missing])

# Native TkinterDnD Drag & Drop Integration
try:
    from tkinterdnd2 import DND_FILES, TkinterDnD
    BaseTk = TkinterDnD.Tk
except ImportError:
    BaseTk = tk.Tk`
      },
      {
        title: '2. Responsive Canvas Grid & Interactive Drag Engine',
        language: 'python',
        code: `def redraw_grid(self):
    canvas_w = self.canvas.winfo_width()
    cols = max(1, (canvas_w - self.card_padding) // (self.card_size + 20 + self.card_padding))
    
    for idx, item in enumerate(self.items):
        row, col = idx // cols, idx % cols
        x1 = self.card_padding + col * (self.card_size + 20 + self.card_padding)
        y1 = self.card_padding + row * (self.card_size + 48 + self.card_padding)
        
        # Draw card container, cached Lanczos thumbnail & sequence badge
        self._create_rounded_rect(x1, y1, x1 + self.card_size + 20, y1 + self.card_size + 48)
        self.canvas.create_image(x1 + 10, y1 + 10, anchor="nw", image=item.get_thumbnail(self.card_size))`
      },
      {
        title: '3. Threaded Batch Renamer with EXIF Normalization',
        language: 'python',
        code: `def worker():
    for idx, item in enumerate(self.items):
        seq_num = str(start_idx + idx).zfill(pad_digits)
        target_name = f"{prefix}{seq_num}{target_ext}"
        target_path = os.path.join(dest_dir, target_name)
        
        if item.rotation == 0 and ("Keep Original" in fmt or target_ext == orig_ext):
            shutil.copy2(item.filepath, target_path)
        else:
            with Image.open(item.filepath) as raw:
                img = ImageOps.exif_transpose(raw)
                if item.rotation != 0:
                    img = img.rotate(-item.rotation, expand=True)
                img.save(target_path, quality=95)`
      }
    ]
  },
  {
    id: 'redbus-route-monitor-telegram-bot',
    slug: 'redbus-route-monitor-telegram',
    title: 'RedBus Real-Time Route Monitor & Interactive Telegram Bot',
    subtitle: 'Zero-cost serverless bus seat monitor that tracks seat inventory, window/aisle breakdown, and sends instant Telegram alerts with direct booking links.',
    badge: 'Serverless Automation',
    category: 'Automation & Bot Engineering',
    readTime: '6 min read',
    difficulty: 'Intermediate',
    platforms: ['Python 3.11', 'curl_cffi', 'Telegram Bot API', 'GitHub Actions (Cron)', 'JSON State Store'],
    tags: ['Web Scraping', 'Telegram Bot', 'Python', 'curl_cffi', 'GitHub Actions', 'Automation', 'Real-Time Alerts'],
    lastUpdated: '2026',
    featured: true,
    liveUrl: 'https://github.com/debpriya3011/redbus_moni',
    problemStatement:
      'During festival rushes like Durga Puja and special government transit schemes, bus seat availability fluctuates rapidly as operators release seats unpredictably. Booking portals often face heavy load or delayed updates, making manual tracking ineffective. This tool automates hourly checks and delivers immediate notifications the moment seats open up.',
    whyRare:
      'Instead of paying for 24/7 VPS hosting or running scripts manually on a local PC, this blueprint runs completely free via GitHub Actions on an hourly cron schedule. It uses curl_cffi for clean browser-like requests to avoid basic bot blocks, and allows full dynamic control (adding/removing dates and departure windows) directly through Telegram chat without touching code or maintaining an external database.',
    keyFeatures: [
      'Automated Hourly Monitoring (Runs every 1 hour via GitHub Actions with 0 server costs)',
      'Reliable HTTP Requests via curl_cffi (Handles browser session headers to query RedBus route search smoothly)',
      'Granular Seat Breakdown (Tracks total available seats, window seats 🪟, aisle seats 🚶, and live fares)',
      'Direct 1-Click Booking Links (Pre-filtered checkout links sent right to your chat for quick booking)',
      'Interactive Telegram Bot Controls (Live slash commands: /status, /dates, /add_date, /remove_date, /time, /help)',
      'Dynamic Live Configuration (Adjust travel dates and departure windows directly in Telegram)',
      'Git-Based State Persistence (Saves state.json and config.json back to the repository automatically)'
    ],
    pipelineSteps: [
      {
        stepNumber: 1,
        title: 'Scheduled Trigger & Remote Config Ingestion',
        method: 'ENGINE',
        endpoint: 'GitHub Actions Cron (0 * * * *)',
        description: 'Triggered automatically every hour (or on-demand via workflow_dispatch). Ingests config.json to load active journey dates, departure window filters, and Telegram chat credentials.',
        highlights: [
          'Zero server costs via GitHub Actions containerized runner',
          'Dynamic date format normalization (DD-Mon-YYYY, YYYY-MM-DD, DD/MM/YYYY)'
        ]
      },
      {
        stepNumber: 2,
        title: 'Route Inventory Query via curl_cffi',
        method: 'GET',
        endpoint: 'https://www.redbus.in/api/searchBus',
        description: 'Executes requests against RedBus route APIs using curl_cffi with browser session headers to reliably fetch live bus inventory without getting tripped up by basic anti-bot filters.',
        highlights: [
          'Browser-like session headers and HTTP client handling',
          'Extracts real-time seat counts, window/aisle breakdown, and operator fares'
        ]
      },
      {
        stepNumber: 3,
        title: 'State Diffing & Vacancy Detection Engine',
        method: 'CALC',
        endpoint: 'Inventory Delta Evaluator & state.json',
        description: 'Compares newly fetched bus inventory against previously cached snapshots in state.json. Filters out buses outside the configured departure time window and flags newly released seats.',
        highlights: [
          'Detects freshly opened bus routes and sudden seat cancellations',
          'Prevents duplicate alert spamming for already notified inventories'
        ]
      },
      {
        stepNumber: 4,
        title: 'Real-Time Telegram Alert & Command Polling',
        method: 'POST',
        endpoint: 'https://api.telegram.org/bot<TOKEN>/sendMessage',
        description: 'Dispatches structured Markdown vacancy alerts with direct booking deep links to the user. Polls getUpdates to process interactive slash commands, updating config.json and committing changes back to git.',
        highlights: [
          'Sends rich message cards with operator, timing, window/aisle seat count, and deep links',
          'Interactive persistent keyboard and slash command handlers (/status, /dates, /time)'
        ]
      }
    ],
    downloads: [
      {
        title: 'GitHub Source Repository',
        type: 'code',
        fileName: 'redbus_moni',
        url: 'https://github.com/debpriya3011/redbus_moni',
        size: 'Open Source',
        description: 'Full open-source Python codebase with Telegram bot engine, GitHub Actions workflow, and configuration schemas.',
        platform: 'Universal'
      },
      {
        title: 'GitHub Actions Workflow',
        type: 'code',
        fileName: 'redbus-monitor.yml',
        url: 'https://github.com/debpriya3011/redbus_moni/blob/main/.github/workflows/redbus-monitor.yml',
        size: 'Cron Workflow',
        description: 'Serverless hourly GitHub Actions automation configuration with state persistence and conflict resolution.',
        platform: 'Universal'
      },
      {
        title: 'Interactive Telegram Bot Engine',
        type: 'code',
        fileName: 'redbus_monitor_telegram.py',
        url: 'https://github.com/debpriya3011/redbus_moni/blob/main/redbus_monitor_telegram.py',
        size: 'Python Engine',
        description: 'Core monitoring script handling WAF evasion, seat inventory diffing, and Telegram keyboard interactions.',
        platform: 'Universal'
      },
      {
        title: 'Dynamic Configuration Schema',
        type: 'json',
        fileName: 'config.json',
        url: 'https://github.com/debpriya3011/redbus_moni/blob/main/config.json',
        size: 'JSON Config',
        description: 'JSON schema for journey dates, departure window filters, and Telegram update offsets.',
        platform: 'Universal'
      }
    ],
    placeholderGuide: [
      {
        key: 'TELEGRAM_BOT_TOKEN',
        description: 'Your Telegram Bot Token generated via @BotFather.',
        whereToFind: 'Telegram -> @BotFather -> /newbot or /token',
        format: 'e.g., "123456789:ABCdefGHIjklMNOpqrSTUvwxYZ"'
      },
      {
        key: 'TELEGRAM_CHAT_ID',
        description: 'Your personal Telegram User ID or target Group Chat ID to receive instant seat alerts.',
        whereToFind: 'Telegram -> @userinfobot (or via GET /getUpdates endpoint)',
        format: 'e.g., "987654321"'
      },
      {
        key: 'MONITORED_DATES',
        description: 'List of target travel dates to track (supports multiple date formats like DD-Mon-YYYY, DD/MM/YYYY).',
        whereToFind: 'Configured in config.json or dynamically via /dates command in Telegram',
        format: 'e.g., ["15-Oct-2026", "24-Oct-2026"]'
      },
      {
        key: 'DEPARTURE_WINDOW',
        description: 'Filter start and end times (24h HH:MM format) to isolate preferred travel slots.',
        whereToFind: 'Configured in config.json or updated via /time command in Telegram',
        format: 'e.g., {"start": "10:00", "end": "16:00"}'
      }
    ],
    codeSnippets: [
      {
        title: '1. TLS-Impersonated Route Scraper & Seat Breakdown Engine',
        language: 'python',
        code: `import os
import json
import logging
from curl_cffi import requests

def fetch_bus_inventory(source_id: str, dest_id: str, doj: str):
    """
    Queries RedBus search API with browser TLS/JA3 impersonation
    to evade Cloudflare/Akamai WAF blocks and anti-bot rate limiters.
    """
    session = requests.Session(impersonate="chrome120")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Referer": "https://www.redbus.in/",
    }
    url = "https://www.redbus.in/api/searchBus"
    params = {"source": source_id, "destination": dest_id, "doj": doj}
    
    response = session.get(url, params=params, headers=headers, timeout=20)
    response.raise_for_status()
    data = response.json()
    
    matching_buses = []
    for item in data.get("inv", []):
        total_seats = item.get("availableSeats", 0)
        if total_seats > 0:
            matching_buses.append({
                "bus_id": item.get("id"),
                "operator": item.get("operatorName"),
                "departure": item.get("departureTime"),
                "arrival": item.get("arrivalTime"),
                "fare": item.get("fare"),
                "total_seats": total_seats,
                "window_seats": item.get("windowSeats", 0),
                "aisle_seats": item.get("aisleSeats", 0),
                "booking_url": f"https://www.redbus.in/bus-tickets/{source_id}-to-{dest_id}?doj={doj}&busId={item.get('id')}"
            })
    return matching_buses`
      },
      {
        title: '2. GitHub Actions Serverless Hourly Cron Workflow',
        language: 'yaml',
        code: `name: RedBus Route Monitor & Telegram Bot

on:
  schedule:
    - cron: '0 * * * *'  # Runs every 1 hour automatically with zero server costs
  workflow_dispatch:      # Allows on-demand manual trigger from GitHub UI

jobs:
  monitor:
    runs-on: ubuntu-latest
    permissions:
      contents: write    # Required to sync state.json & config.json back to repo
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'

      - name: Install Dependencies
        run: pip install -r requirements.txt

      - name: Run Route Monitor & Telegram Dispatcher
        env:
          TELEGRAM_BOT_TOKEN: \${{ secrets.TELEGRAM_BOT_TOKEN }}
          TELEGRAM_CHAT_ID: \${{ secrets.TELEGRAM_CHAT_ID }}
        run: python redbus_monitor_telegram.py

      - name: Commit & Push State Sync
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git add state.json config.json
          git diff --quiet && git diff --staged --quiet || (git commit -m "chore: sync route inventory & bot state [skip ci]" && git push)`
      },
      {
        title: '3. Telegram Slash Commands & Interactive Keyboard Handler',
        language: 'python',
        code: `def handle_telegram_command(command: str, args: list, config: dict):
    """
    Processes live bot slash commands to dynamically modify monitored dates,
    departure time windows, and query instant status without touching code.
    """
    if command == "/status":
        dates_str = "\\n".join(f"  • {d}" for d in config.get("dates", []))
        win = config.get("departure_window", {})
        return (
            f"📊 *RedBus Monitor Status*\\n\\n"
            f"📅 *Monitored Dates:*\\n{dates_str}\\n\\n"
            f"⏰ *Departure Window:* {win.get('start', '00:00')} - {win.get('end', '23:59')}"
        )
        
    elif command in ["/dates", "/set_dates"]:
        if not args:
            return "Current dates:\\n" + "\\n".join(f"• {d}" for d in config.get("dates", []))
        valid_dates = [normalize_date(d) for d in args if is_valid_date(d)]
        config["dates"] = valid_dates
        save_config(config)
        return f"✅ Monitored dates updated to: {', '.join(valid_dates)}"
        
    elif command == "/time":
        if len(args) == 2:
            config["departure_window"] = {"start": args[0], "end": args[1]}
            save_config(config)
            return f"✅ Departure window updated: {args[0]} to {args[1]}"
        win = config.get("departure_window", {})
        return f"Current window: {win.get('start', '00:00')} - {win.get('end', '23:59')}"`
      }
    ]
  }
];

