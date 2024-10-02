import { useState } from "react";
import { FiSend, FiImage } from "react-icons/fi"; // Icons for buttons
import AttachFileIcon from '@mui/icons-material/AttachFile';

export default function GroupMessageComposerView({
  onSendMessage,
  onSendMedia,
}: {
  onSendMessage: (message: string) => Promise<void>;
  onSendMedia: (file: File) => Promise<void>;
}) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    await onSendMessage(message);
    setMessage("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSendMedia = async () => {
    if (!file) return;
    await onSendMedia(file);
    setFile(null);
  };

  return (
    <div className="p-4 border-t bg-white flex items-center">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        className="flex-grow border rounded-full p-2 mr-2"
        style={{ color: "grey" }}
      />
      <label htmlFor="file-upload" className="cursor-pointer p-2">
        {/* <FiImage size={24} /> */}
        <AttachFileIcon sx={{ color: "grey" }} />
        <input id="file-upload" type="file" onChange={handleFileChange} className="hidden" />
      </label>
      <button
        className="bg-blue-500 text-white p-2 rounded-full ml-2"
        onClick={handleSendMessage}
      >
        <FiSend size={24} />
      </button>
    </div>
  );
}
