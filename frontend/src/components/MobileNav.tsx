import { Link, useLocation } from 'react-router-dom';

export default function MobileNav() {
  const { pathname } = useLocation();
  const Item = ({ to, label, icon }: { to: string; label: string; icon: React.ReactNode }) => (
    <Link to={to} className={`flex-1 grid place-items-center py-2 ${pathname === to ? 'text-brand-600' : 'text-gray-700'}`}>
      {icon}
      <span className="text-xs">{label}</span>
    </Link>
  );
  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white/80 backdrop-blur border-t border-gray-200 z-30">
      <div className="flex items-center">
        <Item to="/" label="Home" icon={<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3z"/></svg>} />
        <Item to="/restaurants" label="Search" icon={<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2z"/></svg>} />
        <Item to="/cart" label="Cart" icon={<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4"/><circle cx="7" cy="21" r="2"/><circle cx="17" cy="21" r="2"/></svg>} />
        <Item to="/orders" label="Orders" icon={<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="14" height="16" rx="2"/></svg>} />
        <Item to="/profile" label="Profile" icon={<svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 100-10 5 5 0 000 10z"/><path d="M4 22a8 8 0 1116 0H4z"/></svg>} />
      </div>
    </nav>
  );
}

