'use client';

export default function CommentsSidebar({
  selectedPageId,
  toggleComments,
  comments,
  newComment,
  setNewComment,
  addComment,
  deleteComment,
  showComments,
  adjustTextareaHeight,
}) {
  if (!selectedPageId) {
    return null;
  }

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="fixed top-4 right-4 w-5 h-5 fill-current hover:bg-gray-200 cursor-pointer z-50"
        viewBox="0 0 24 24"
        onClick={toggleComments}
      >
        <path d="M20 2H4C2.9 2 2 2.9 2 4v10c0 1.1.9 2 2 2h3v4l4-4h9c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM4 4h16v10H8.83L7 16.83V14H4V4z"></path>
      </svg>

      {showComments && (
        <div className="w-1/4 min-w-20 max-w-60 h-screen bg-gray-100 fixed right-0 top-0 border-l p-8">
          <h3 className="text-lg font-bold mb-4">Comments</h3>
          <div className="flex flex-col space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="flex justify-between items-center bg-white p-3 rounded shadow"
              >
                <div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                  <p className="text-xs text-gray-500">
                    {new Intl.DateTimeFormat('kr', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    }).format(new Date(comment.createdAt))}
                  </p>
                </div>
                <button
                  className="ml-1 text-xs font-bold text-red-500 hover:underline"
                  onClick={() => deleteComment(comment.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <textarea
              value={newComment}
              onChange={(e) => {
                setNewComment(e.target.value);
                adjustTextareaHeight(e.target);
              }}
              placeholder="Type your comment"
              className="w-full p-2 border rounded text-sm"
            ></textarea>
            <button
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 mt-2"
              onClick={() => {
                addComment(newComment);
                setNewComment('');
                if (textareaRef.current) {
                  textareaRef.current.style.height = 'auto';
                }
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
}
