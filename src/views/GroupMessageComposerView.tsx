import { useState } from "react";

export default function GroupMessageComposerView({ onSendMessage, onSendMedia }: { onSendMessage: (message: string) => Promise<void>, onSendMedia: (file: File) => Promise<void> }) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;
    await onSendMessage(message);
    setMessage(""); // Clear input after sending
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSendMedia = async () => {
    if (!file) return;
    await onSendMedia(file);
    setFile(null); // Clear file input after sending
  };

  return (
    <div>
      <div className="flex">
        <input
          type="text"
          className="flex-grow p-2 border rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button className="bg-blue-500 text-white p-2 rounded ml-2" onClick={handleSendMessage}>
          Send
        </button>
      </div>

      <div className="mt-2">
        <input type="file" onChange={handleFileChange} />
        <button className="bg-green-500 text-white p-2 rounded ml-2" onClick={handleSendMedia}>
          Send Media
        </button>
      </div>
    </div>
  );
}
