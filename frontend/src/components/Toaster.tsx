import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { removeToast } from '../store/toastSlice';

export default function Toaster() {
  const items = useAppSelector(s => s.toast.items);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timers = items.map(t => setTimeout(() => dispatch(removeToast(t.id)), 3000));
    return () => { timers.forEach(clearTimeout); };
  }, [items, dispatch]);

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2">
      {items.map(t => (
        <div key={t.id} className={`px-4 py-2 rounded-md shadow text-sm border ${t.type === 'error' ? 'bg-red-50 text-red-700 border-red-100' : t.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-700 border-gray-100'}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}

