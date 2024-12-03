'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Page from '../components/Page';

export default function Home() {
  const [pages, setPages] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [selectedPageIndex, setSelectedPageIndex] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include', 
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
          fetchPages(data.id);
        } else {
          console.error('Failed to fetch user info:', await res.text());
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
        router.push('/login');
      }
    };

    fetchUser();
  }, []);

  const toggleFavorite = async (pageId, isFavorite) => {
    const res = await fetch('/api/pages/favorite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageId, isFavorite }),
    });

    if (!res.ok) {
      console.error('Failed to toggle favorite status');
      return;
    }

    const updatedPage = await res.json();

    // 페이지 목록 업데이트
    setPages((prevPages) => {
      const updatedPages = prevPages.map((page) =>
        page.id === pageId ? updatedPage : page
      );

      return updatedPages.sort((a, b) => b.isFavorite - a.isFavorite || a.id - b.id);
    });
  };

  const fetchPages = async (userId) => {
    try {
      const res = await fetch(`/api/pages?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      } else {
        console.error('Failed to fetch pages:', await res.text());
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  };

  const addNewPage = async () => {
    const newPage = { 
      title: `New Page ${pages.length + 1}`, 
      content: '', 
      userId: parseInt(user?.userId, 10),
    };

    const res = await fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPage),
    });

    if (!res.ok) {
      console.error('Failed to create new page');
      return;
    }

    const createdPage = await res.json();
    setPages([...pages, createdPage]);
    setSelectedPageIndex(pages.length);
  };

  const deletePage = async (pageId) => {
    const res = await fetch(`/api/pages/${pageId}`, {
      method: 'DELETE',
    });
  
    if (!res.ok) {
      console.error('Failed to delete page');
      return;
    }
  
    const remainingPages = pages.filter((page) => page.id !== pageId);
    setPages(remainingPages);
    if (selectedPageIndex >= remainingPages.length) {
      setSelectedPageIndex(null);
    }
  };

  const handleTitleChange = async (e) => {
    const updatedPages = [...pages];
    const updatedPage = { ...updatedPages[selectedPageIndex], title: e.target.value };
  
    updatedPages[selectedPageIndex] = updatedPage;
    setPages(updatedPages);
  
    await fetch('/api/pages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPage),
    });
  };

  const handleContentChange = async (e) => {
    const updatedPages = [...pages];
    const updatedPage = { ...updatedPages[selectedPageIndex], content: e.target.value };
  
    updatedPages[selectedPageIndex] = updatedPage;
    setPages(updatedPages);
  
    await fetch('/api/pages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPage),
    });
  };

  return (
    <div className="flex">
      <Sidebar
        user={user}
        pages={pages}
        selectedPageIndex={selectedPageIndex}
        setSelectedPageIndex={setSelectedPageIndex}
        toggleFavorite={toggleFavorite}
        addNewPage={addNewPage}
        deletePage={deletePage}
      />
      <div className="ml-[35vw] mr-[15vw] p-5 transition-all">
        {selectedPageIndex !== null && (
          <Page
            page={pages[selectedPageIndex]}
            onTitleChange={(e) => handleTitleChange(e)}
            onContentChange={(e) => handleContentChange(e)}
          />
        )}
      </div>
    </div>
  );
}