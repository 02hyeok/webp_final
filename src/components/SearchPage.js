'use client';

export default function SearchPage({ searchQuery, onSearch, searchResults, onSelectPage }) {
  return (
    <div className="max-w-3xl p-5">
      <h2 className="text-2xl font-bold mb-4">Search Pages</h2>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Type a keyword to search..."
        className="w-full p-2 border rounded mb-4"
      />
      <div>
        {searchResults.length > 0 ? (
          searchResults.map(({ id, title, snippet }) => (
            <div
              key={id}
              className="p-3 border-b cursor-pointer hover:bg-gray-100"
              onClick={() => onSelectPage(id)}
            >
              <h3 className="font-bold">{title}</h3>
              <p
                className="text-sm text-gray-500"
                dangerouslySetInnerHTML={{ __html: snippet }}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500">No results found.</p>
        )}
      </div>
    </div>
  );
}
