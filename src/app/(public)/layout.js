import "./globals.css";




export const metadata = {
  title: "ERFlow",
  description: "Smart Emergency Room Priority Board",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-100 text-black">
        {children}

        <div className="flex flex-col min-h-screen">

          {/* Footer */}
          <footer
            className="
               border-t border-zinc-200
               bg-white
               px-4 md:px-6
               py-4
               text-sm text-zinc-500
             "
          >
            ERFlow Emergency Dashboard • Real-Time Hospital Monitoring System
          </footer>
        </div>
      </body>
    </html>
  );
}