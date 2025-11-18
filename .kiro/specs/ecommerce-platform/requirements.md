# Requirements Document

## Introduction

This document outlines the requirements for a beginner-friendly e-commerce platform built with Nuxt 3 and TypeScript. The system enables guest users to browse and purchase products using PromptPay payments, while authenticated sellers (admins) manage products and verify payments through uploaded payment slips using OCR technology.

## Glossary

- **Guest User**: An unauthenticated visitor who can browse and purchase products without registration
- **Seller**: An authenticated admin user who manages products and verifies payments
- **Payment System**: The PromptPay QR code generation and verification system
- **OCR Service**: Optical Character Recognition service using Tesseract.js to extract text from payment slip images
- **Product Catalog**: The collection of products available for purchase
- **Payment Verification**: The process where sellers confirm payment authenticity using uploaded payment slips
- **Auth System**: Authentication system using Auth.js for email/password authentication
- **Database Layer**: Drizzle ORM with SQLite for data persistence
- **Image Service**: Cloudinary integration for image uploads and management
- **API Client**: Axios for HTTP requests to external services

## Requirements

### Requirement 1

**User Story:** As a guest user, I want to browse products without creating an account, so that I can quickly view available items

#### Acceptance Criteria

1. THE Product Catalog SHALL display all available products on the home page
2. WHEN a guest user visits the product listing page, THE Product Catalog SHALL render product cards with image, name, and price
3. WHEN a guest user clicks on a product card, THE Product Catalog SHALL navigate to the product detail page
4. THE Product Catalog SHALL load product data from the Database Layer using the API Client

### Requirement 2

**User Story:** As a guest user, I want to purchase products without registration, so that I can complete transactions quickly

#### Acceptance Criteria

1. WHEN a guest user clicks the purchase button on a product detail page, THE Payment System SHALL generate a PromptPay QR code
2. THE Payment System SHALL display the QR code with payment amount and product details
3. WHEN the QR code is generated, THE Payment System SHALL create a pending order record in the Database Layer
4. THE Payment System SHALL provide an interface for uploading a payment slip image
5. WHEN a payment slip is uploaded, THE Image Service SHALL store the image and return a URL

### Requirement 3

**User Story:** As a new seller, I want to register an account with my personal information, so that I can access the admin dashboard

#### Acceptance Criteria

1. THE Auth System SHALL provide a registration page with fields for first name, last name, email, and password
2. WHEN a user submits the registration form with valid data, THE Auth System SHALL create a new user record in the Database Layer
3. THE Auth System SHALL hash the password before storing it in the Database Layer
4. WHEN registration is successful, THE Auth System SHALL redirect the user to the login page
5. IF the email already exists in the Database Layer, THEN THE Auth System SHALL display an error message

### Requirement 4

**User Story:** As a seller, I want to log in with my email and password, so that I can access the admin dashboard

#### Acceptance Criteria

1. THE Auth System SHALL provide a login page with email and password fields
2. WHEN a seller submits valid credentials, THE Auth System SHALL authenticate the user and create a session
3. WHEN authentication is successful, THE Auth System SHALL redirect the seller to the admin dashboard
4. IF the credentials are invalid, THEN THE Auth System SHALL display an error message
5. THE Auth System SHALL maintain the session across page refreshes

### Requirement 5

**User Story:** As a seller, I want to manage products from an admin dashboard, so that I can add, edit, and remove items from the catalog

#### Acceptance Criteria

1. WHEN an authenticated seller accesses the admin dashboard, THE Product Catalog SHALL display all products with edit and delete options
2. THE Product Catalog SHALL provide a form for creating new products with fields for name, description, price, and image
3. WHEN a seller uploads a product image, THE Image Service SHALL store the image on Cloudinary and return a URL
4. WHEN a seller submits a new product form, THE Product Catalog SHALL save the product to the Database Layer
5. WHEN a seller edits a product, THE Product Catalog SHALL update the existing record in the Database Layer
6. WHEN a seller deletes a product, THE Product Catalog SHALL remove the record from the Database Layer

### Requirement 6

**User Story:** As a seller, I want to verify customer payments using uploaded payment slips, so that I can confirm legitimate transactions before fulfilling orders

#### Acceptance Criteria

1. WHEN a seller accesses the payment verification page, THE Payment System SHALL display all pending orders with uploaded payment slips
2. WHEN a seller clicks to verify a payment slip, THE OCR Service SHALL extract text from the uploaded image
3. THE OCR Service SHALL identify payment amount, date, and transaction reference from the extracted text
4. THE Payment System SHALL display the extracted information alongside the order details for seller review
5. WHEN a seller approves a payment, THE Payment System SHALL update the order status to confirmed in the Database Layer
6. WHEN a seller rejects a payment, THE Payment System SHALL update the order status to rejected in the Database Layer

### Requirement 7

**User Story:** As a developer, I want the application to use a consistent tech stack, so that the codebase is maintainable and deployment-ready

#### Acceptance Criteria

1. THE Auth System SHALL use Auth.js for authentication implementation
2. THE Database Layer SHALL use Drizzle ORM with SQLite for data persistence
3. THE API Client SHALL use Axios for HTTP requests
4. THE Image Service SHALL use Cloudinary for image storage and management
5. THE Payment System SHALL use promptpay-qr library for QR code generation
6. THE Payment System SHALL use qrcode library for QR code rendering
7. THE OCR Service SHALL use Tesseract.js for text extraction from images

### Requirement 8

**User Story:** As a developer, I want the application to be deployment-ready for NuxtHub, so that I can easily deploy to production

#### Acceptance Criteria

1. THE application SHALL use Nitro server for server-side functionality
2. THE application SHALL structure API routes compatible with NuxtHub deployment
3. THE Database Layer SHALL configure SQLite with file-based storage suitable for NuxtHub
4. THE application SHALL include environment variable configuration for deployment settings

### Requirement 9

**User Story:** As a user, I want a consistent and responsive UI, so that I can have a good experience on any device

#### Acceptance Criteria

1. THE application SHALL use Tailwind CSS for styling all components
2. THE application SHALL provide reusable components including ProductCard, ProductGrid, ProductForm, Navbar, Footer, Button, Input, Modal, and LoadingSpinner
3. WHEN any page loads, THE application SHALL display the Navbar and Footer consistently
4. THE application SHALL implement responsive design that adapts to mobile, tablet, and desktop screen sizes
5. WHEN data is loading, THE application SHALL display the LoadingSpinner component

### Requirement 10

**User Story:** As a beginner developer, I want simple and well-structured code, so that I can understand and maintain the application

#### Acceptance Criteria

1. THE application SHALL organize code with clear separation between pages, components, server routes, and utilities
2. THE application SHALL use TypeScript with explicit type definitions for all functions and components
3. THE application SHALL include comments explaining complex logic
4. THE application SHALL follow consistent naming conventions throughout the codebase
5. THE application SHALL structure files in a logical directory hierarchy
