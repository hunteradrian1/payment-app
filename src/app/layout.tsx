import '../globals.css'

export const metadata = {
  title: "Poker Tournament Ledger",
  description: "Manage your poker tournaments with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-900 text-white">
        {children}
      </body>
    </html>
  );
}