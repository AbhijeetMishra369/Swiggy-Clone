import { useAppSelector } from '../store';

export default function Profile() {
  const { user } = useAppSelector(s => s.auth);
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <div className="border rounded-xl p-4 bg-white">
        <p><span className="text-gray-500">Name:</span> {user?.name}</p>
        <p><span className="text-gray-500">Email:</span> {user?.email}</p>
        <p><span className="text-gray-500">Role:</span> {user?.role}</p>
      </div>
    </div>
  );
}