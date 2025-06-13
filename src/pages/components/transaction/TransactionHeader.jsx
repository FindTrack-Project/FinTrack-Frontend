import { Bell } from 'lucide-react';
const TransactionHeader = ({ userName, userEmail }) => (
  <div className="flex items-center justify-between mb-8">
    <div>
      <h1 className="text-2xl sm:text-3xl text-gray-900 font-semibold">Transaksi</h1>
    </div>
    <div className="flex items-center gap-3">
      {/* Notifikasi */}
      <button className="relative bg-white border border-gray-200 rounded-full p-2.5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
        <Bell size={20} className="text-gray-600" />
      </button>
      {/* Profil user */}
      {/* Desktop: nama & email, Mobile: hanya gambar */}
      <div className="hidden sm:flex items-center gap-3 bg-white border border-gray-200 rounded-full pr-3 pl-1 py-1 shadow-sm">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="text-right">
          <p className="font-semibold text-gray-800 text-sm">{userName}</p>
          <p className="text-gray-500 text-xs">{userEmail}</p>
        </div>
      </div>
      <div className="sm:hidden">
        <img
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
        />
      </div>
    </div>
  </div>
);

export default TransactionHeader;