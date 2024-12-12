'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Page from '../components/Page';
import CommentsSidebar from '../components/CommentsSidebar';
import SearchPage from '../components/SearchPage';
import MusicSidebar from '../components/MusicSidebar';

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
  const [searchActive, setSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMusicSidebar, setShowMusicSidebar] = useState(false);
  const [musicFiles, setMusicFiles] = useState([]);
  const [isPlaying, setIsPlaying] = useState([]);
  const audioRefs = useRef({});

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
    if (selectedPageId && textareaRef.current) {
      adjustTextareaHeight(textareaRef.current);
      fetchComments(selectedPageId, true);
      fetchMusicFiles(selectedPageId);
    } else {
      setShowComments(false);
      setMusicFiles([]);
    }
  }, [selectedPageId]);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setUser(null);
        router.push('/login');
      } else {
        console.error('Failed to log out:', await res.text());
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

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

  const handleToggleSidebar = (sidebar) => {
    if (sidebar === 'comments') {
      setShowComments((prev) => !prev);
      if (showMusicSidebar) setShowMusicSidebar(false);
    } else if (sidebar === 'music') {
      setShowMusicSidebar((prev) => !prev);
      if (showComments) setShowComments(false);
    }
  };

  const fetchComments = async (pageId, autoOpen = false) => {
    try {
      const res = await fetch(`/api/comments?pageId=${pageId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
        if (autoOpen) {
          setShowMusicSidebar(false);
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

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = pages.map((page) => {
      const lowerCaseContent = page.content.toLowerCase();
      const lowerCaseQuery = query.toLowerCase();

      const startIndex = lowerCaseContent.indexOf(lowerCaseQuery);

      if (startIndex === -1) {
        return null;
      }

      const snippetStart = Math.max(0, startIndex - 10); 
      const snippetEnd = Math.min(page.content.length, startIndex + query.length + 10); 
      const snippet = page.content.slice(snippetStart, snippetEnd);

      const highlightedSnippet = snippet.replace(
        new RegExp(`(${query})`, 'gi'), 
        '<b>$1</b>' 
      );

      return {
        id: page.id,
        title: page.title,
        snippet: `${snippetStart > 0 ? '...' : ''}${highlightedSnippet}${snippetEnd < page.content.length ? '...' : ''}`,
      };
    });

    setSearchResults(results.filter((result) => result !== null));
  };

  const handleSearchToggle = (active) => {
    if (active) {
      setSearchQuery('');
      setSearchResults([]);
      setSearchActive(true); 
    } else {
      setSearchActive(false);
    }
  };

  const handlePageSelection = (pageId) => {
    setSelectedPageId(pageId); 
    setSearchActive(false); 
  };

  const fetchMusicFiles = async (pageId) => {
    try {
      const res = await fetch(`/api/music?pageId=${pageId}`);
      if (res.ok) {
        const data = await res.json();
        setMusicFiles(data);
        setIsPlaying(data.map(() => false));
      } else {
        console.error('Failed to fetch music files:', await res.text());
      }
    } catch (error) {
      console.error('Error fetching music files:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('pageId', selectedPageId);

        const res = await fetch('/api/music', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          console.error('Failed to upload file');
          return null;
        }

        const { filePath, fileName } = await res.json();
        return { name: fileName, path: filePath };
      })
    );

    const validFiles = uploadedFiles.filter((file) => file !== null);
    setMusicFiles([...musicFiles, ...validFiles]);
    setIsPlaying([...isPlaying, ...validFiles.map(() => false)]);
  };

  const handlePlayPause = (index) => {
    if (audioRefs.current[index]) {
      if (isPlaying[index]) {
        audioRefs.current[index].pause();
      } else {
        audioRefs.current[index].play();
      }
      setIsPlaying((prev) =>
        prev.map((playing, i) => (i === index ? !playing : playing))
      );
    }
  };

  const handleReset = (index) => {
    if (audioRefs.current[index]) {
      audioRefs.current[index].currentTime = 0;
      audioRefs.current[index].play();
      setIsPlaying((prev) =>
        prev.map((playing, i) => (i === index ? true : playing))
      );
    }
  };

  return (
    <div className="flex">
      <Sidebar
        user={user}
        pages={pages}
        folders={folders}
        handleLogout={handleLogout}
        selectedPageId={selectedPageId}
        setSelectedPageId={handlePageSelection}
        toggleFavorite={toggleFavorite}
        addNewPage={addNewPage}
        deletePage={deletePage}
        addFolder={addFolder}
        addPageToFolder={addPageToFolder}
        setSearchActive={handleSearchToggle}
        setShowComments={setShowComments}
        setShowMusicSidebar={setShowMusicSidebar}
      />
      <div className="flex-grow p-5 transition-all ml-[30vw] mr-[30vw]">
        {searchActive ? (
          <SearchPage
          searchQuery={searchQuery}
          onSearch={handleSearch}
          searchResults={searchResults}
          onSelectPage={handlePageSelection}
          />
        ) : selectedPageId !== null && (
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
        handleToggleSidebar={handleToggleSidebar}
        comments={comments}
        newComment={newComment}
        setNewComment={setNewComment}
        addComment={addComment}
        deleteComment={deleteComment}
        showComments={showComments}
        adjustTextareaHeight={adjustTextareaHeight}
      />
      <MusicSidebar
        selectedPageId={selectedPageId}
        showMusicSidebar={showMusicSidebar}
        handleToggleSidebar={handleToggleSidebar}
        musicFiles={musicFiles}
        isPlaying={isPlaying}
        handleFileUpload={handleFileUpload}
        handlePlayPause={handlePlayPause}
        handleReset={handleReset}
        audioRefs={audioRefs}
      />
    </div>
  );
}