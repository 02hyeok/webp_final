'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Sidebar({ 
  user,
  pages,  
  folders,
  handleLogout,
  selectedPageId, 
  setSelectedPageId, 
  toggleFavorite,
  addNewPage, 
  deletePage,
  addFolder,
  addPageToFolder,
  setSearchActive,
  setShowComments,
  setShowMusicSidebar,
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="w-1/4 min-w-20 max-w-60 h-screen bg-gray-100 fixed p-2">
      <div className="relative flex items-center gap-3 p-2">
        <img 
          src={user?.profileImage || '/default-profile.jpg'}
          alt="Profile" 
          className="w-6 h-6 rounded-md object-cover" 
        />
        <div className="flex-grow">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <span className="text-sm">
              {user?.email || 'Guest'}의 Notion
            </span>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 14l-4-4h8z" />
            </svg>
          </div>

          {dropdownOpen && (
            <div className="absolute top-10 left-0 bg-white shadow rounded-md w-48">
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setDropdownOpen(false);
                  router.push('/profile');
                }}
              >
                Edit Profile
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setDropdownOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <svg
          className="w-6 h-6 fill-current hover:bg-gray-200 cursor-pointer"
          viewBox="0 0 24 24"
          onClick={addNewPage}
        >
          <path d="M9.944 14.721c.104.094.216.12.336.079l1.703-.688 6.844-6.844-1.406-1.398-6.836 6.836-.711 1.68c-.052.13-.029.242.07.335zm8.102-9.484l1.414 1.406.515-.523a.917.917 0 00.282-.633.76.76 0 00-.258-.61l-.25-.25a.702.702 0 00-.578-.187.975.975 0 00-.617.297l-.508.5zm-9.453.127a3.85 3.85 0 00-3.85 3.85v6.5a3.85 3.85 0 003.85 3.85h6.5a3.85 3.85 0 003.85-3.85V12.95a.85.85 0 10-1.7 0v2.764a2.15 2.15 0 01-2.15 2.15h-6.5a2.15 2.15 0 01-2.15-2.15v-6.5a2.15 2.15 0 012.15-2.15h3.395a.85.85 0 000-1.7H8.593z"></path>
        </svg>
      </div>

      <div className="flex flex-col p-1">
        <div 
          className="flex items-center gap-2 px-1 py-2 rounded-md hover:bg-gray-200"
          onClick={() => {
            setSelectedPageId(null);
            setSearchActive(true);
          }}
        >
          <svg className="w-6 h-6 fill-gray-600" viewBox="0 0 20 20">
            <path fillRule="evenodd" clipRule="evenodd" d="M4 8.75C4 6.12665 6.12665 4 8.75 4C11.3734 4 13.5 6.12665 13.5 8.75C13.5 11.3734 11.3734 13.5 8.75 13.5C6.12665 13.5 4 11.3734 4 8.75ZM8.75 2.5C5.29822 2.5 2.5 5.29822 2.5 8.75C2.5 12.2018 5.29822 15 8.75 15C10.2056 15 11.545 14.5024 12.6073 13.668L16.7197 17.7803C17.0126 18.0732 17.4874 18.0732 17.7803 17.7803C18.0732 17.4874 18.0732 17.0126 17.7803 16.7197L13.668 12.6073C14.5024 11.545 15 10.2056 15 8.75C15 5.29822 12.2018 2.5 8.75 2.5Z"></path>
          </svg>
          <span className="text-sm font-bold text-gray-600">Search</span>
        </div>
        <div 
          className="flex items-center gap-2 px-1 py-2 rounded-md hover:bg-gray-200"
          onClick={() => {
            setSelectedPageId(null);
            setSearchActive(false);
            setShowMusicSidebar(false);
            setShowComments(false);
          }}
        >
          <svg className="w-6 h-6 fill-gray-600" viewBox="0 0 20 20">
            <path d="M10.1416 3.77299C10.0563 3.71434 9.94368 3.71434 9.85837 3.77299L3.60837 8.06989C3.54053 8.11653 3.5 8.19357 3.5 8.2759V14.2499C3.5 14.9402 4.05964 15.4999 4.75 15.4999H7.5L7.5 10.7499C7.5 10.0595 8.05964 9.49987 8.75 9.49987H11.25C11.9404 9.49987 12.5 10.0595 12.5 10.7499L12.5 15.4999H15.25C15.9404 15.4999 16.5 14.9402 16.5 14.2499V8.2759C16.5 8.19357 16.4595 8.11653 16.3916 8.06989L10.1416 3.77299ZM9.00857 2.53693C9.60576 2.12636 10.3942 2.12636 10.9914 2.53693L17.2414 6.83383C17.7163 7.1603 18 7.69963 18 8.2759V14.2499C18 15.7687 16.7688 16.9999 15.25 16.9999H12.25C11.5596 16.9999 11 16.4402 11 15.7499L11 10.9999H9L9 15.7499C9 16.4402 8.44036 16.9999 7.75 16.9999H4.75C3.23122 16.9999 2 15.7687 2 14.2499V8.2759C2 7.69963 2.2837 7.1603 2.75857 6.83383L9.00857 2.53693Z"></path>
          </svg>
          <span className="text-sm font-bold text-gray-600">Home</span>
        </div>
        <div 
          className="flex items-center gap-2 px-1 py-2 rounded-md hover:bg-gray-200"
          onClick={addFolder}>
          <svg 
            className="w-6 h-6 fill-gray-600" 
            viewBox="0 0 24 24"
          >
            <path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2zm0 2h10v10H4V6h6zm8 6h-3v3h-2v-3h-3v-2h3V7h2v3h3v2z"/>
          </svg>
          <span className="text-sm font-bold text-gray-600">Add Folder</span>
        </div>
      </div>

      <div className="flex flex-col">
        {folders.map((folder) => (
          <div 
            key={folder.id} 
            className="flex flex-col mt-4 mb-2"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-gray-400 p-2">{folder.name}</div>
              <div className="p-2 opacity-0 hover:opacity-100">
                <svg 
                  className="w-6 h-6 fill-current hover:bg-gray-200" 
                  viewBox="0 0 24 24" 
                  onClick={() => addPageToFolder(folder.id)}
                >
                  <path d="M9.944 14.721c.104.094.216.12.336.079l1.703-.688 6.844-6.844-1.406-1.398-6.836 6.836-.711 1.68c-.052.13-.029.242.07.335zm8.102-9.484l1.414 1.406.515-.523a.917.917 0 00.282-.633.76.76 0 00-.258-.61l-.25-.25a.702.702 0 00-.578-.187.975.975 0 00-.617.297l-.508.5zm-9.453.127a3.85 3.85 0 00-3.85 3.85v6.5a3.85 3.85 0 003.85 3.85h6.5a3.85 3.85 0 003.85-3.85V12.95a.85.85 0 10-1.7 0v2.764a2.15 2.15 0 01-2.15 2.15h-6.5a2.15 2.15 0 01-2.15-2.15v-6.5a2.15 2.15 0 012.15-2.15h3.395a.85.85 0 000-1.7H8.593z"></path>
                </svg>
              </div>
            </div>
            <div className="flex flex-col p-1">
              {pages
                .filter((page) => page.folderId === folder.id)
                .map((page) => (
                  <div
                    key={page.id}
                    className={`group flex items-center px-1 py-2 rounded-md ${selectedPageId === page.id ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
                    onClick={() => setSelectedPageId(page.id)}
                  >
                    <div className="w-5 flex justify-center items-center">
                      <button
                        className={`${
                          page.isFavorite ? 'opacity-100 text-yellow-500' : 'opacity-0 group-hover:opacity-100'
                        } text-gray-500 hover:text-yellow-500 focus:outline-none transition-opacity`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(page.id, !page.isFavorite);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-5 w-5 ${page.isFavorite ? 'fill-yellow-500' : 'fill-none'
                          }`}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.908c.969 0 1.371 1.24.588 1.81l-3.977 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.977-2.89a1 1 0 00-1.175 0l-3.977 2.89c-.785.57-1.84-.197-1.54-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.87 9.1c-.783-.57-.38-1.81.588-1.81h4.908a1 1 0 00.95-.69l1.518-4.674z" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex-grow ml-2">
                      <span className="text-sm font-bold text-gray-600">{page.title}</span>
                    </div>
                    <div className="w-5 flex justify-center items-center">
                      <button
                        className="opacity-0 group-hover:opacity-100  text-gray-500 hover:text-red-500 focus:outline-none transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePage(page.id);
                        } }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M3 6h18v2H3V6zm2 3v10a2 2 0 002 2h10a2 2 0 002-2V9H5zm5 2h2v8h-2v-8zm4 0h2v8h-2v-8zM9 3h6v2H9V3z" />
                        </svg>
                      </button>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="text-xs font-bold text-gray-400 p-2 mt-4">Default</div>
        <div className="flex flex-col p-1">
          {pages
            .filter((page) => !page.folderId)
            .map((page) => (
              <div
                key={page.id}
                className={`group flex items-center px-1 py-2 rounded-md ${
                  selectedPageId === page.id ? 'bg-gray-200' : 'hover:bg-gray-200'
                }`}
                onClick={() => setSelectedPageId(page.id)}
              >
                <div className="w-5 flex justify-center items-center">
                  <button
                    className={`${
                      page.isFavorite ? 'opacity-100 text-yellow-500' : 'opacity-0 group-hover:opacity-100'
                    } text-gray-500 hover:text-yellow-500 focus:outline-none transition-opacity`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(page.id, !page.isFavorite);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${
                        page.isFavorite ? 'fill-yellow-500' : 'fill-none'
                      }`}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.908c.969 0 1.371 1.24.588 1.81l-3.977 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.977-2.89a1 1 0 00-1.175 0l-3.977 2.89c-.785.57-1.84-.197-1.54-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.87 9.1c-.783-.57-.38-1.81.588-1.81h4.908a1 1 0 00.95-.69l1.518-4.674z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex-grow ml-2">
                  <span className="text-sm font-bold text-gray-600">{page.title}</span>
                </div>
                <div className="w-5 flex justify-center items-center">
                  <button
                    className="opacity-0 group-hover:opacity-100  text-gray-500 hover:text-red-500 focus:outline-none transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePage(page.id);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 6h18v2H3V6zm2 3v10a2 2 0 002 2h10a2 2 0 002-2V9H5zm5 2h2v8h-2v-8zm4 0h2v8h-2v-8zM9 3h6v2H9V3z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}