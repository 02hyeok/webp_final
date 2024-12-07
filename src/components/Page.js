'use client';

export default function Page({ page, onTitleChange, onContentChange, textareaRef }) {
  if (!page) {
    return <div/>;
  }
  return (
    <div className="mt-24">
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