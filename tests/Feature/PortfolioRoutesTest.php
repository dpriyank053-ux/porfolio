<?php

namespace Tests\Feature;

use Tests\TestCase;

class PortfolioRoutesTest extends TestCase
{
    /**
     * Test all 7 main portfolio navigation destinations.
     */
    public function test_all_seven_destinations_return_200_ok(): void
    {
        $destinations = [
            '/',
            '/home',
            '/work',
            '/about',
            '/capabilities',
            '/journal',
            '/location',
            '/contact',
        ];

        foreach ($destinations as $uri) {
            $response = $this->get($uri);
            $response->assertStatus(200);
        }
    }

    /**
     * Test project detail routes for valid and invalid slugs.
     */
    public function test_project_detail_and_404_handling(): void
    {
        $validSlugs = [
            'neural-synthetics',
            'aether-engine',
            'chronos-distributed',
        ];

        foreach ($validSlugs as $slug) {
            $response = $this->get('/work/' . $slug);
            $response->assertStatus(200);
        }

        // Invalid slug returns 404
        $notFoundResponse = $this->get('/work/nonexistent-project-xyz');
        $notFoundResponse->assertStatus(404);
    }

    /**
     * Test journal detail routes for valid and invalid slugs.
     */
    public function test_journal_detail_and_404_handling(): void
    {
        $validSlugs = [
            'architecting-persistent-liquid-shaders',
            'real-time-vector-search-latency-optimization',
            'mathematics-of-organic-damping',
        ];

        foreach ($validSlugs as $slug) {
            $response = $this->get('/journal/' . $slug);
            $response->assertStatus(200);
        }

        // Invalid slug returns 404
        $notFoundResponse = $this->get('/journal/nonexistent-article-xyz');
        $notFoundResponse->assertStatus(404);
    }

    /**
     * Test contact submission and validation.
     */
    public function test_contact_form_submission_and_validation(): void
    {
        $payload = [
            'name' => 'Lead Engineer',
            'email' => 'client@enterprise.com',
            'subject' => 'WebGL Architecture Advisory',
            'message' => 'We would love to collaborate on our upcoming project.',
        ];

        $response = $this->postJson('/contact', $payload);
        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('contact_messages', [
            'email' => 'client@enterprise.com',
            'name' => 'Lead Engineer',
        ]);
    }
}
