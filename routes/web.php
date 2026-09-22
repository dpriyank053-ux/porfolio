<?php

use App\Http\Controllers\PortfolioController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes - Portfolio Application
|--------------------------------------------------------------------------
| All 7 portfolio destinations, detail resolvers, and contact endpoints
| are fully functional through the Laravel backend.
|
*/

// 01 — HOME
Route::get('/', [PortfolioController::class, 'index'])->name('portfolio.home');
Route::get('/home', [PortfolioController::class, 'home'])->name('portfolio.home.direct');

// 02 — SELECTED WORK
Route::get('/work', [PortfolioController::class, 'work'])->name('portfolio.work');
Route::get('/work/{slug}', [PortfolioController::class, 'projectDetail'])->name('portfolio.work.show');

// 03 — ABOUT
Route::get('/about', [PortfolioController::class, 'about'])->name('portfolio.about');

// 04 — CAPABILITIES
Route::get('/capabilities', [PortfolioController::class, 'capabilities'])->name('portfolio.capabilities');

// 05 — JOURNAL & INSIGHTS
Route::get('/journal', [PortfolioController::class, 'journal'])->name('portfolio.journal');
Route::get('/journal/{slug}', [PortfolioController::class, 'journalDetail'])->name('portfolio.journal.show');

// 06 — LOCATION
Route::get('/location', [PortfolioController::class, 'location'])->name('portfolio.location');

// 07 — CONTACT
Route::get('/contact', [PortfolioController::class, 'contactPage'])->name('portfolio.contact');
Route::post('/contact', [PortfolioController::class, 'submitContact'])->name('portfolio.contact.submit')->middleware('throttle:10,1');
Route::post('/api/contact', [PortfolioController::class, 'submitContact'])->name('portfolio.contact.api')->middleware('throttle:10,1');
