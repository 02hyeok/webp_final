'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Page from '../components/Page';

export default function Home() {
  const [pages, setPages] = useState([]);
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const userEmail = searchParams.get('userEmail');
  const [selectedPageIndex, setSelectedPageIndex] = useState(null);

  useEffect(() => {
    if (userId) {
      fetch(`/api/pages?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => setPages(data))
        .catch((error) => console.error('Error fetching pages:', error));
    }
  }, [userId]);

  const addNewPage = async () => {
    const newPage = { 
      title: `New Page ${pages.length + 1}`, 
      content: '', 
      userId: parseInt(userId, 10),
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
      body: JSON.stringify({
        id: updatedPage.id, 
        title: updatedPage.title,
        content: updatedPage.content,
      }),
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
      body: JSON.stringify({
        id: updatedPage.id,
        title: updatedPage.title,
        content: updatedPage.content,
      }),
    });
  };

  return (
    <div className="flex">
      <Sidebar
        userEmail={userEmail}
        pages={pages}
        selectedPageIndex={selectedPageIndex}
        setSelectedPageIndex={setSelectedPageIndex}
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