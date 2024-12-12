'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        const user = await res.json();
        setUser(user);
      } else {
        router.push('/login');
      }
    };

    fetchUser();
  }, []);

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
      credentials: 'include',
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
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Change
        </button>
        {message && <div className="mt-4 text-center text-sm text-red-500">{message}</div>}
      </div>
    </div>
  );
}
