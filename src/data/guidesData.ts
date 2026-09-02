export interface PipelineStep {
  stepNumber: number;
  title: string;
  method: 'POST' | 'GET' | 'PUT' | 'WAIT';
  endpoint: string;
  description: string;
  highlights: string[];
}

export interface GuideDownload {
  title: string;
  type: 'pdf' | 'json' | 'code';
  fileName: string;
  url: string;
  size: string;
  description: string;
  platform?: 'n8n' | 'Make.com' | 'PDF' | 'Universal';
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
