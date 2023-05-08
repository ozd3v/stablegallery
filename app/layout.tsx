//import './globals.css'
'use client'
import 'bootstrap/dist/css/bootstrap.min.css'
//import 'bootstrap/dist/js/bootstrap.bundle.min.js'
//import 'font-awesome/css/font-awesome.min.css'
import { useEffect } from 'react'
/*
export const metadata = {
  title: 'Gallery',
  description: 'Gallery',
}*/

//const bootstrap = 'bootstrap/dist/js/bootstrap'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  /*
    useEffect(() => {
      //import('bootstrap/dist/js/bootstrap.bundle.min.js')
      // import('bootstrap/dist/js/bootstrap.bundle.min.js')
      typeof document !== undefined
        ? require('bootstrap/dist/js/bootstrap')
        : null
    }, []) */

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>

  )
}
