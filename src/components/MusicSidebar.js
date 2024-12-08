'use client';

export default function MusicSidebar({
  showMusicSidebar,
  handleToggleSidebar,
  musicFiles,
  isPlaying,
  handleFileUpload,
  handlePlayPause,
  handleReset,
  audioRefs,
}) {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="fixed top-4 right-10 w-5 h-5 fill-current hover:bg-gray-200 cursor-pointer z-50"
        viewBox="0 0 24 24"
        onClick={() => handleToggleSidebar('music')}
      >
        <path d="M12 3v10.555A4 4 0 1 0 14 17V7h4V3h-6z"></path>
      </svg>

      {showMusicSidebar && (
        <div className="w-1/4 min-w-20 max-w-60 h-screen bg-gray-100 fixed right-0 top-0 border-l pt-12 p-4">
          <h3 className="text-lg font-bold mb-4">Music Player</h3>
          <input
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFileUpload}
            className="text-sm mb-4"
          />
          {musicFiles.length === 0 ? (
            <p className="text-sm text-gray-500">Upload music files to start playing.</p>
          ) : (
            <div className="flex flex-col space-y-4">
              {musicFiles.map((file, index) => (
                <div key={index} className="flex flex-col items-center bg-white p-4 rounded shadow">
                  <p className="text-md font-semibold text-gray-800 mb-2 truncate">
                    {file.name.split('.').slice(0, -1).join('.')}
                  </p>
                  <div className="flex items-center gap-4">
                    <audio ref={(el) => (audioRefs.current[index] = el)} src={file.path}></audio>
                    <button
                      onClick={() => handlePlayPause(index)}
                      className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full hover:bg-gray-400 transition"
                    >
                      {isPlaying[index] ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-blue-500 hover:text-blue-300 transition"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path>
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-blue-500 hover:text-blue-300 transition"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z"></path>
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => handleReset(index)}
                      className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full hover:bg-gray-400 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-black hover:text-gray-700 transition"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 6V3L8 7l4 4V8c2.76 0 5 2.24 5 5s-2.24 5-5 5a5.006 5.006 0 0 1-4.9-4h-2.02c.51 3.43 3.43 6 6.92 6 3.87 0 7-3.13 7-7s-3.13-7-7-7z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}