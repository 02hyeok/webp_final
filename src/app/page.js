'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Page from '../components/Page';

export default function Home() {
  const [pages, setPages] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [folders, setFolders] = useState([]);

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
          fetchFolder(data.id);
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

  const fetchFolder = async (userId) => {
    try {
      const res = await fetch('/api/folders');
      if (res.ok) {
        const data = await res.json();
        setFolders(data);
      } else {
        console.error('Failed to fetch folder:', await res.text());
      }
    } catch (error) {
      console.error('Error fetching folder:', error);
    }
  };

  const addFolder = async () => {
    const folderName = prompt('Enter folder name:');
    if (!folderName) return;

    const res = await fetch('/api/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: folderName, userId: user.id }),
    });

    if (res.ok) {
      const newFolder = await res.json();
      setFolders([...folders, newFolder]);
    }
  };

  const addPageToFolder = async (folderId) => {
    const folderName = folders.find((folder) => folder.id === folderId)?.name || 'Folder';

    const folderPagesCount = pages.filter((page) => page.folderId === folderId).length;

    const newPage = {
      title: `${folderName} New Page ${folderPagesCount + 1}`,
      content: '',
      userId: user.id,
      folderId,
    };

    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPage),
      });

      if (res.ok) {
        const newPage = await res.json();
        setPages([...pages, newPage]);
      } else {
        console.error('Failed to create page in folder:', await res.text());
      }
    } catch (error) {
      console.error('Error adding page to folder:', error);
    }
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
      userId: parseInt(user?.id, 10),
      folderId: null,
    };

    const res = await fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPage),
    });

    if (!res.ok) {
      console.error("Failed to create new page:", await res.text());
      return;
    }

    const createdPage = await res.json();
    setPages([...pages, createdPage]);
    setSelectedPageId(createdPage.id);
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
    if (selectedPageId === pageId) {
      setSelectedPageId(null);
    }
  };

  const handleTitleChange = async (e) => {
    const updatedPages = pages.map((page) =>
      page.id === selectedPageId ? { ...page, title: e.target.value } : page
    );
    setPages(updatedPages);

    const updatedPage = updatedPages.find((page) => 
      page.id === selectedPageId
    );
  
    await fetch('/api/pages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPage),
    });
  };

  const handleContentChange = async (e) => {
    const updatedPages = pages.map((page) =>
      page.id === selectedPageId ? { ...page, content: e.target.value } : page
    );
    setPages(updatedPages);

    const updatedPage = updatedPages.find((page) => page.id === selectedPageId);
  
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
        folders={folders}
        selectedPageId={selectedPageId}
        setSelectedPageId={setSelectedPageId}
        toggleFavorite={toggleFavorite}
        addNewPage={addNewPage}
        deletePage={deletePage}
        addFolder={addFolder}
        addPageToFolder={addPageToFolder}
      />
      <div className="ml-[35vw] mr-[15vw] p-5 transition-all">
        {selectedPageId !== null && (
          <Page
            page={pages.find((page) => page.id === selectedPageId)}
            onTitleChange={(e) => handleTitleChange(e)}
            onContentChange={(e) => handleContentChange(e)}
          />
        )}
      </div>
    </div>
  );
}