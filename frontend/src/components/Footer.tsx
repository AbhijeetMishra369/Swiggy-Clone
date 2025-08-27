export default function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-600">
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Foodly</h4>
          <p className="text-gray-500">Delicious food delivered fast.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Company</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-gray-800">About Us</a></li>
            <li><a href="#" className="hover:text-gray-800">Careers</a></li>
            <li><a href="#" className="hover:text-gray-800">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Legal</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-gray-800">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-gray-800">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Follow</h4>
          <div className="flex items-center gap-3">
            <a href="#" aria-label="Twitter" className="hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M22.162 5.656a8.384 8.384 0 01-2.407.66 4.205 4.205 0 001.841-2.32 8.409 8.409 0 01-2.667 1.017 4.197 4.197 0 00-7.147 3.828A11.907 11.907 0 013.07 4.845a4.194 4.194 0 001.298 5.598 4.183 4.183 0 01-1.902-.525v.053a4.198 4.198 0 003.364 4.115 4.208 4.208 0 01-1.895.072 4.2 4.2 0 003.92 2.914A8.418 8.418 0 012 19.54a11.875 11.875 0 006.424 1.883c7.71 0 11.93-6.387 11.93-11.915 0-.18-.004-.36-.012-.54a8.508 8.508 0 002.09-2.312z"/></svg>
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M7.5 2A5.5 5.5 0 002 7.5v9A5.5 5.5 0 007.5 22h9a5.5 5.5 0 005.5-5.5v-9A5.5 5.5 0 0016.5 2h-9zm0 2h9A3.5 3.5 0 0120 7.5v9A3.5 3.5 0 0116.5 20h-9A3.5 3.5 0 014 16.5v-9A3.5 3.5 0 017.5 4zm11 1a1 1 0 100 2 1 1 0 000-2zM12 7a5 5 0 100 10 5 5 0 000-10z"/></svg>
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M13 10h3V7h-3V5.5A1.5 1.5 0 0114.5 4H16V1h-1.5A4.5 4.5 0 0010 5.5V7H8v3h2v10h3V10z"/></svg>
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-gray-500 flex items-center justify-between">
        <p>© {new Date().getFullYear()} Foodly</p>
        <p>Made with ❤️ for great food</p>
      </div>
    </footer>
  );
}