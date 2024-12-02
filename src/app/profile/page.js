'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function ProfilePage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const { user } = useUser();
  const router = useRouter();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/profile/upload', {
      method: 'POST',
      headers: {
        'user-id': user?.userId,
      },
      body: formData,
    });

    if (res.ok) {
      setMessage('Upload successful!');
      router.push('/');
    } else {
      setMessage('Upload failed, please try again');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-4 text-center">Upload Profile Image</h1>
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-4"
          placeholder="Upload"
        />
        <button
          onClick={handleUpload}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Change
        </button>
        {message && <div className="mt-4 text-center text-sm text-red-500">{message}</div>}
      </div>
    </div>
  );
}
