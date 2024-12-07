'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Page from '../components/Page';
import CommentsSidebar from '../components/CommentsSidebar';

export default function Home() {
  const [pages, setPages] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [selectedPageId, setSelectedPageId] = useState(null);
  const textareaRef = useRef(null);
  const [folders, setFolders] = useState([]);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

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

  useEffect(() => {
    if (selectedPageId) {
      fetchComments(selectedPageId, true);
    } else {
      setShowComments(false);
    }
  }, [selectedPageId]);

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

  const adjustTextareaHeight = (element) => {
    if (element) {
      const padding = 12;
      element.style.height = 'auto';
      element.style.height = `${padding + element.scrollHeight}px`; 
    }
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

    if (textareaRef.current) {
      adjustTextareaHeight(textareaRef.current);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    if (!showComments && selectedPageId) {
      fetchComments(selectedPageId);
    }
  };

  const fetchComments = async (pageId, autoOpen = false) => {
    try {
      const res = await fetch(`/api/comments?pageId=${pageId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
        if (autoOpen) {
          setShowComments(data.length > 0);
        }
      } else {
        console.error('Failed to fetch comments:', await res.text());
        setShowComments(false);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setShowComments(false);
    }
  };

  const addComment = async (commentContent) => {
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentContent, pageId: selectedPageId, userId: user.id }),
      });

      if (res.ok) {
        const newCommentData = await res.json();
        setComments([newCommentData, ...comments]);
        setNewComment('');
        setShowComments(true);
      } else {
        console.error('Failed to add comment:', await res.text());
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: 'DELETE' });
      if (res.ok) {
        setComments(comments.filter((comment) => comment.id !== commentId));
      } else {
        console.error('Failed to delete comment:', await res.text());
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
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
      <div className="flex-grow p-5 transition-all ml-[30vw] mr-[30vw]">
        {selectedPageId !== null && (
          <Page
            page={pages.find((page) => page.id === selectedPageId)}
            onTitleChange={(e) => handleTitleChange(e)}
            onContentChange={(e) => handleContentChange(e)}
            textareaRef={textareaRef}
          />
        )}
      </div>
      <CommentsSidebar
        selectedPageId={selectedPageId}
        toggleComments={toggleComments}
        comments={comments}
        newComment={newComment}
        setNewComment={setNewComment}
        addComment={addComment}
        deleteComment={deleteComment}
        showComments={showComments}
        adjustTextareaHeight={adjustTextareaHeight}
      />
    </div>
  );
}