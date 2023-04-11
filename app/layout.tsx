//import './globals.css'

export const metadata = {
  title: 'Gallery',
  description: 'Gallery',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>

  )
}
