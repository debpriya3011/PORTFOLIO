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
  problemStatement: string;
  whyRare: string;
  keyFeatures: string[];
  pipelineSteps: PipelineStep[];
  downloads: GuideDownload[];
  placeholderGuide: PlaceholderItem[];
  codeSnippets: CodeSnippet[];
}

export const automationGuides: AutomationGuide[] = [
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
  }
];
