import './globals.css'
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>House Utility Bill Splitter</title>
      </head>
      <body>{children}</body>
    </html>
  )
}