import { useState } from 'react';
import { useRouter } from 'next/router';

const formats = [
  { name: 'Blog Post', icon: '📝' },
  { name: 'Slide Deck', icon: '📊' },
  { name: 'LinkedIn Post', icon: '💼' },
  { name: 'X Post', icon: '🐦' },
  { name: 'Email Newsletter', icon: '📧' },
  { name: 'Infographic', icon: '📈' }
];

export default function FormatSelect() {
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [tone, setTone] = useState('Conversational');
  const [length, setLength] = useState('Medium');
  const [audience, setAudience] = useState('General Audience');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [tweetList, setTweetList] = useState([]);

  const router = useRouter();

  const handleSelect = (format) => {
    setSelectedFormat(format);
    setResult('');
    setTweetList([]);
  };

  const parseTweetThread = (text) => {
    const matches = text.match(/(^\d+[/.][\s\S]*?)(?=\n\d+[/.]\s|$)/gm);
    if (!matches) return [text.trim()];
    return matches.map(t => t.trim());
  };

  const handleGenerate = async () => {
    const content = sessionStorage.getItem('uploadedContent');
    if (!content || !selectedFormat) return;

    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          format: selectedFormat,
          options: { tone, length, audience }
        })
      });

      const data = await res.json();
      const output = data.result;
      setResult(output);

      if (selectedFormat === 'X Post') {
        const tweets = parseTweetThread(output);
        setTweetList(tweets);
      } else {
        setTweetList([]);
      }

    } catch (err) {
      console.error('Transformation failed', err);
      setResult('Error generating content.');
      setTweetList([]);
    }

    setLoading(false);
  };

  const shareToTwitter = () => {
    const tweet = tweetList.length > 0 ? tweetList[0] : result.slice(0, 280);
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
    window.open(url, '_blank');
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?summary=${encodeURIComponent(result.slice(0, 300))}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    } catch (err) {
      alert('Failed to copy');
      console.error(err);
    }
  };


  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-white px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Choose Output Format</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">Select how you'd like your uploaded content to be transformed.</p>

      {/* Format buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
        {formats.map((format) => (
          <button
            key={format.name}
            onClick={() => handleSelect(format.name)}
            className={`flex items-center justify-center p-6 border rounded-lg shadow transition
              ${selectedFormat === format.name ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:bg-blue-50'}
            `}
          >
            <span className="text-3xl mr-3">{format.icon}</span>
            <span className="text-lg font-medium">{format.name}</span>
          </button>
        ))}
      </div>

      {/* Tone, Length, Audience options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
        <div>
          <label className="block font-semibold mb-1">Tone</label>
          <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full border rounded px-3 py-2">
            <option>Conversational</option>
            <option>Professional</option>
            <option>Friendly</option>
            <option>Bold</option>
            <option>Educational</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Length</label>
          <select value={length} onChange={(e) => setLength(e.target.value)} className="w-full border rounded px-3 py-2">
            <option>Short</option>
            <option>Medium</option>
            <option>Long</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Audience</label>
          <select value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full border rounded px-3 py-2">
            <option>General Audience</option>
            <option>Startup Founders</option>
            <option>Marketers</option>
            <option>Developers</option>
            <option>Executives</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={!selectedFormat}
        className="mb-8 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate'}
      </button>

      {/* Twitter thread preview */}
      {tweetList.length > 0 && (
        <div className="w-full max-w-2xl mt-8">
          <h2 className="text-xl font-bold mb-4">X (Twitter) Thread Preview</h2>
          {tweetList.map((tweet, idx) => (
            <div
              key={idx}
              className="mb-4 rounded-lg border border-gray-300 bg-white px-5 py-4 shadow-sm relative"
            >
              {/* Header: Avatar + username */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-300" />
                <div>
                  <p className="font-semibold text-sm text-gray-900">YourBrand 🧠</p>
                  <p className="text-sm text-gray-500">@yourhandle</p>
                </div>
              </div>

              {/* Tweet content */}
              <p className="text-gray-800 text-base whitespace-pre-line">{tweet}</p>

              {/* Footer: position and share button */}
              <div className="flex justify-between items-center mt-3">
                <p className="text-sm text-gray-400">{idx + 1}/{tweetList.length}</p>
                <button
                  onClick={() => {
                    const tweetText = encodeURIComponent(tweet);
                    const url = `https://twitter.com/intent/tweet?text=${tweetText}`;
                    window.open(url, '_blank');
                  }}
                  className="text-sm px-3 py-1 bg-[#1DA1F2] text-white rounded hover:bg-blue-600"
                >
                  Share
                </button>
                <button
                  onClick={() => copyToClipboard(tweet)}
                  className="text-sm px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}


      {/* Generic output (non-Twitter) */}
      {result && tweetList.length === 0 && (
        <div className="w-full max-w-3xl bg-white p-6 border border-gray-200 rounded shadow whitespace-pre-line">
          <h2 className="text-xl font-bold mb-4">Transformed Content</h2>
          <p>{result}</p>
        </div>
      )}

      {/* Share buttons */}
      {result && (
        <div className="flex gap-4 mt-6">
          {selectedFormat === 'X Post' && (
            <button
              onClick={shareToTwitter}
              className="px-4 py-2 bg-[#1DA1F2] text-white rounded hover:bg-blue-600"
            >
              Share on Twitter
            </button>
          )}
          {selectedFormat === 'LinkedIn Post' && (
            <button
              onClick={() => copyToClipboard(result)}
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Copy to Clipboard
            </button>
          )}
        </div>
      )}
    </main>
  );
}
