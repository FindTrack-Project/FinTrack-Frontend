const TransactionHeader = ({ userName, userEmail }) => (
  <div className="flex items-center justify-between mb-8">
    <div>
      <h1 className="text-3xl text-gray-900 font-bold">Transaksi</h1>
      <p className="text-gray-500 text-sm mt-1">
        Selamat datang kembali, {userName}!
      </p>
    </div>
    <div className="flex items-center gap-4">
      {/* Notifikasi */}
      <button className="relative bg-white border border-gray-200 rounded-full p-2.5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
        <svg width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2} className="text-gray-600" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" /></svg>
        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
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