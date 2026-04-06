import './globals.css';

export const metadata = {
  title: 'Lumina | Image Search Abstraction',
  description: 'Unsplash abstraction layer and history sync.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
