export default function Footer(){
  return (
    <footer className="mt-16 border-t">
      <div className="container-rt py-10 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} RTC Bliss Drive — All rights reserved.
      </div>
    </footer>
  )
}
