export default function Footer() {
  return (
    <footer className="border-t border-gray-100 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-500 flex items-center justify-between">
        <p>© {new Date().getFullYear()} Foodly</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-gray-700">Privacy</a>
          <a href="#" className="hover:text-gray-700">Terms</a>
          <a href="#" className="hover:text-gray-700">Contact</a>
        </div>
      </div>
    </footer>
  );
}