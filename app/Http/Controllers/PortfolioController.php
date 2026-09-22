<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class PortfolioController extends Controller
{
    /**
     * Centralized portfolio data repository
     */
    protected array $portfolioData = [
        'identity' => [
            'name' => 'Priyank Sharma',
            'role' => 'Creative Developer & AI Systems Architect',
            'location' => 'India / Worldwide',
            'email' => 'hello@priyanksharma.dev',
        ],
        'projects' => [
            'neural-synthetics' => [
                'id' => 'project-1',
                'number' => '01',
                'title' => 'Neural Synthetics',
                'category' => 'Generative AI Platform',
                'year' => '2025',
                'description' => 'A low-latency generative interface orchestrating multi-modal diffusion pipelines and real-time semantic canvas manipulations.',
                'tech' => 'Three.js / PyTorch / WebGPU / FastAPI',
                'url' => 'https://github.com',
            ],
            'aether-engine' => [
                'id' => 'project-2',
                'number' => '02',
                'title' => 'Aether Engine',
                'category' => 'Real-time 3D & Graphics',
                'year' => '2024',
                'description' => 'Custom WebGL/GLSL rendering pipeline with fluid dynamics, volumetric refraction, and physics-driven interactive spatial choreography.',
                'tech' => 'WebGL / GLSL / TypeScript / Web Workers',
                'url' => 'https://github.com',
            ],
            'chronos-distributed' => [
                'id' => 'project-3',
                'number' => '03',
                'title' => 'Chronos Distributed',
                'category' => 'Autonomous Cloud Architecture',
                'year' => '2024',
                'description' => 'High-throughput event streaming engine handling millions of concurrent telemetry streams with automated anomaly mitigation.',
                'tech' => 'Laravel / Go / Kafka / MySQL / Rust',
                'url' => 'https://github.com',
            ],
        ],
        'journal' => [
            'architecting-persistent-liquid-shaders' => [
                'id' => 'journal-1',
                'title' => 'Architecting Persistent Liquid Shaders for High-DPI Displays',
                'date' => 'OCTOBER 2025',
                'category' => 'Engineering',
                'description' => 'Deep dive into multi-octave 3D Simplex noise, analytical normal recalculation, and chromatic aberration under fixed GPU memory bounds.',
                'link' => 'https://github.com',
            ],
            'real-time-vector-search-latency-optimization' => [
                'id' => 'journal-2',
                'title' => 'Real-time Vector Search Latency Optimization Under High Concurrency',
                'date' => 'AUGUST 2025',
                'category' => 'Systems',
                'description' => 'Benchmarking HNSW indices, quantized embeddings, and low-latency gRPC streaming architectures across distributed nodes.',
                'link' => 'https://github.com',
            ],
            'mathematics-of-organic-damping' => [
                'id' => 'journal-3',
                'title' => 'The Mathematics of Organic Damping in Pointer-Driven WebGL',
                'date' => 'MAY 2025',
                'category' => 'Interaction',
                'description' => 'Formulating frame-rate independent exponential damping, viscous mass lag, and screen-to-world raycasting physics.',
                'link' => 'https://github.com',
            ],
        ],
    ];

    /**
     * Display the master interactive portfolio
     */
    public function index(): View
    {
        return view('welcome', [
            'activeSection' => 'home',
            'data' => $this->portfolioData,
        ]);
    }

    /**
     * Direct navigation: Home
     */
    public function home(): View
    {
        return view('welcome', [
            'activeSection' => 'home',
            'data' => $this->portfolioData,
        ]);
    }

    /**
     * Direct navigation: Selected Work
     */
    public function work(): View
    {
        return view('welcome', [
            'activeSection' => 'work',
            'data' => $this->portfolioData,
        ]);
    }

    /**
     * Project detail resolver with strict 404 handling
     */
    public function projectDetail(string $slug): View
    {
        if (!isset($this->portfolioData['projects'][$slug])) {
            abort(404, 'The requested project was not found.');
        }

        $project = $this->portfolioData['projects'][$slug];

        return view('welcome', [
            'activeSection' => 'work',
            'activeProject' => $project,
            'data' => $this->portfolioData,
        ]);
    }

    /**
     * Direct navigation: About
     */
    public function about(): View
    {
        return view('welcome', [
            'activeSection' => 'about',
            'data' => $this->portfolioData,
        ]);
    }

    /**
     * Direct navigation: Capabilities
     */
    public function capabilities(): View
    {
        return view('welcome', [
            'activeSection' => 'capabilities',
            'data' => $this->portfolioData,
        ]);
    }

    /**
     * Direct navigation: Journal & Insights
     */
    public function journal(): View
    {
        return view('welcome', [
            'activeSection' => 'journal',
            'data' => $this->portfolioData,
        ]);
    }

    /**
     * Journal note detail resolver with strict 404 handling
     */
    public function journalDetail(string $slug): View
    {
        if (!isset($this->portfolioData['journal'][$slug])) {
            abort(404, 'The requested technical note was not found.');
        }

        $note = $this->portfolioData['journal'][$slug];

        return view('welcome', [
            'activeSection' => 'journal',
            'activeJournal' => $note,
            'data' => $this->portfolioData,
        ]);
    }

    /**
     * Direct navigation: Location
     */
    public function location(): View
    {
        return view('welcome', [
            'activeSection' => 'location',
            'data' => $this->portfolioData,
        ]);
    }

    /**
     * Direct navigation: Contact
     */
    public function contactPage(): View
    {
        return view('welcome', [
            'activeSection' => 'contact',
            'data' => $this->portfolioData,
        ]);
    }

    /**
     * Process contact form submission with validation and database storage
     */
    public function submitContact(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'name' => ['nullable', 'string', 'max:100'],
            'subject' => ['nullable', 'string', 'max:150'],
            'message' => ['nullable', 'string', 'max:3000'],
        ]);

        $contact = ContactMessage::create([
            'name' => $validated['name'] ?? null,
            'email' => $validated['email'],
            'subject' => $validated['subject'] ?? 'New Portfolio Inquiry',
            'message' => $validated['message'] ?? 'Direct engagement inquiry from portfolio visitor.',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thank you. Your inquiry has been received and will be answered shortly.',
            'id' => $contact->id,
        ], 200);
    }
}
