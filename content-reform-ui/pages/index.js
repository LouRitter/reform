import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:4000/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setPreview(data.preview || 'No preview available');

      // Optional: store fullText in sessionStorage for next page
      sessionStorage.setItem('uploadedContent', data.fullText);
    } catch (err) {
      console.error('Upload failed', err);
      setPreview('Error uploading file.');
    }

    setLoading(false);
  };

  const goToFormatSelection = () => {
    router.push('/format');
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">ReForm</h1>
      <p className="text-lg text-gray-700 mb-8">Upload content to transform it into new formats.</p>

      <label className="block mb-4">
        <span className="sr-only">Choose file</span>
        <input 
          type="file" 
          onChange={handleUpload} 
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
          " 
        />
      </label>

      {loading ? (
        <p className="text-blue-600 font-medium">Uploading...</p>
      ) : preview && (
        <div className="mt-4 max-w-xl text-gray-700 bg-white p-4 border border-gray-200 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Preview of "{fileName}"</h3>
          <p className="whitespace-pre-line">{preview}</p>
        </div>
      )}

      <button 
        onClick={goToFormatSelection}
        disabled={!preview}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
      >
        Next: Choose Format
      </button>
    </main>
  );
}