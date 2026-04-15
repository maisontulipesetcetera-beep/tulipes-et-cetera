// Root layout — minimal shell required by Next.js.
// The [lang] nested layout handles html/body for all locale routes.
// The middleware redirects "/" to "/fr" automatically.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
