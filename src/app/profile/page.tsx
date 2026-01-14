'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserStats, updateUserProfile } from '@/app/actions/auth';

interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  profilePicture: string | null;
}

interface Stats {
  totalImages: number;
  totalOriginalSize: number;
  totalCompressedSize: number;
  totalSaved: number;
  averageCompressionRatio: number;
}

interface CompressedImageData {
  id: string;
  originalName: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  quality: number;
  createdAt: string;
  imageData: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentImages, setRecentImages] = useState<CompressedImageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        router.push('/login');
        return;
      }

      const userData: User = JSON.parse(storedUser);
      setUser(userData);
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
      });

      // Load stats
      const result = await getUserStats(userData.id);
      if (result.success && result.stats) {
        setStats(result.stats);
        setRecentImages(result.recentImages || []);
      }

      setIsLoading(false);
    };

    loadUserData();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const result = await updateUserProfile(user.id, formData);
    if (result.success && result.user) {
      localStorage.setItem('user', JSON.stringify(result.user));
      setUser(result.user);
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🐼</div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Image Compressor" className="h-10" />
            </div>
            <nav className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Compress
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h2>

        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-4xl">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  '👤'
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{user.name || 'Anonymous User'}</h3>
                <p className="text-gray-600">{user.email}</p>
                {user.phone && <p className="text-gray-500 text-sm">{user.phone}</p>}
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-[#00A0DC] hover:text-[#0080B0] font-medium"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditing && (
            <form onSubmit={handleUpdateProfile} className="space-y-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="+1 234 567 8900"
                />
              </div>
              <button
                type="submit"
                className="bg-[#00A0DC] text-white px-6 py-2 rounded-lg hover:bg-[#0080B0] transition-colors"
              >
                Save Changes
              </button>
            </form>
          )}
        </div>

        {/* Stats Cards */}
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-[#00A0DC] rounded-lg p-6">
            <p className="text-sm text-[#0080B0] mb-1">Total Images</p>
            <p className="text-3xl font-bold text-[#00A0DC]">{stats?.totalImages || 0}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Total Saved</p>
            <p className="text-3xl font-bold text-gray-900">{formatFileSize(stats?.totalSaved || 0)}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Avg. Compression</p>
            <p className="text-3xl font-bold text-gray-900">{stats?.averageCompressionRatio || 0}%</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <p className="text-sm text-gray-600 mb-1">Original Size</p>
            <p className="text-3xl font-bold text-gray-900">{formatFileSize(stats?.totalOriginalSize || 0)}</p>
          </div>
        </div>

        {/* Recent Images */}
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Recent Compressions</h3>
        {recentImages.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
            <div className="text-5xl mb-3">📁</div>
            <p className="text-gray-600 mb-4">No compressed images yet</p>
            <button
              onClick={() => router.push('/')}
              className="bg-[#00A0DC] text-white px-6 py-2 rounded-lg hover:bg-[#0080B0] transition-colors"
            >
              Compress Your First Image
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentImages.map((image) => (
              <div key={image.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="aspect-video bg-gray-100 rounded overflow-hidden mb-3">
                  <img
                    src={image.imageData}
                    alt={image.originalName}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h4 className="font-semibold text-gray-900 truncate mb-2">{image.originalName}</h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    <p className="text-gray-500">Original</p>
                    <p className="font-semibold">{formatFileSize(image.originalSize)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Compressed</p>
                    <p className="font-semibold text-[#7AC943]">{formatFileSize(image.compressedSize)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Saved</p>
                    <p className="font-semibold">{image.compressionRatio}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Quality</p>
                    <p className="font-semibold">{image.quality}%</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  {new Date(image.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
