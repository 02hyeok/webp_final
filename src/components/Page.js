'use client';

export default function Page({ 
  page, 
  onTitleChange, 
  onContentChange, 
  textareaRef,
  folders
}) {
  if (!page) {
    return <div/>;
  }

  const folder = folders.find((folder) => folder.id === page.folderId);
  const folderName = folder ? folder.name : 'Default';

  return (
    <div className="mt-24">
      <div className="flex items-center text-sm text-gray-500 mb-4">
        {folder && (
          <svg
            className="w-5 h-5 mr-2 text-gray-500"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2zm0 2h10v10H4V6h6z" />
          </svg>
        )}
        <span>
          {folderName} / {page.title}
        </span>
      </div>
      
      <input
        type="text"
        value={page.title}
        onChange={onTitleChange}
        className="text-3xl font-bold mb-4 w-full p-2 border border-transparent rounded-md focus:border-gray-300 focus:outline-none"
      />
      <textarea
        value={page.content}
        onChange={onContentChange}
        ref={textareaRef}
        className="w-full p-2 border border-transparent rounded-md focus:border-gray-300 focus:outline-none"
        placeholder="Start writing your note here..."
      />
    </div>
  );
}