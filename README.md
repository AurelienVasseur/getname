# GetName

GetName is a modern web application that helps users find the perfect name for their projects by checking domain name and social media availability in real-time.

## Features

- **Domain Name Search**: Instantly check availability across major domain extensions (.com, .net, .org, etc.)
- **Social Media Check**: Verify username availability on popular platforms like Twitter, Instagram, and Facebook
- **Real-time Results**: Get immediate feedback on name availability
- **Modern UI**: Clean and intuitive interface built with Next.js and Tailwind CSS

## Technical Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Language**: TypeScript
- **API Integration**: Custom API endpoints for domain and social media checks

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── home/        # Home page components
│   └── ui/          # Reusable UI components
├── hooks/           # Custom React hooks
├── services/        # API and external service integrations
├── types/           # TypeScript type definitions
└── lib/             # Utility functions and configurations
```

## Development

The project uses modern development practices and tools:

- ESLint for code linting
- TypeScript for type safety
- Prettier for code formatting
- Next.js for server-side rendering and API routes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
