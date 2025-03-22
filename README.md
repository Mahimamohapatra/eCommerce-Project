# Angular eCommerce Application

A modern, high-performance eCommerce application built with Angular 17, featuring a beautiful UI, comprehensive shopping features, and an admin dashboard.

## Features

### Customer Features
- Beautiful homepage with featured products and categories
- Advanced product search with real-time filtering
- Detailed product pages with images, descriptions, and reviews
- Shopping cart with quantity management
- Secure checkout process with Stripe integration
- User authentication and profile management
- Wishlist functionality
- Mobile-responsive design

### Admin Features
- Complete product and category management
- Order processing and tracking
- Analytics dashboard with sales metrics
- User management system

## Tech Stack

- Angular 17
- TypeScript
- Angular Material & Tailwind CSS
- NgRx for state management
- Firebase Authentication
- Stripe Payment Integration

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v17.2.0)

## Installation

1. Clone the repository:
\`\`\`bash
git clone [repository-url]
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm start
\`\`\`

The application will be available at `http://localhost:4200`

## Project Structure

```
src/
├── app/
│   ├── core/           # Singleton services, guards, and interceptors
│   ├── shared/         # Shared components, directives, and pipes
│   ├── features/       # Feature modules (products, cart, checkout, etc.)
│   ├── admin/          # Admin dashboard module
│   └── store/          # NgRx store configuration
├── assets/            # Images, icons, and other static files
└── environments/      # Environment configuration files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 