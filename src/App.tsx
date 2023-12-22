import { useState } from "react";
import { FaRegCopy } from "react-icons/fa6";
import "./App.css";
import { Link } from "react-router-dom";

function App() {
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [shortLink, setShortLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [asyncError, setAsyncError] = useState("");
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  // Split the URL by "/"
  const parts = shortLink.split("/");

  // Get the last part of the URL, which should be the unique ID
  const id = parts[parts.length - 1];

  console.log(id);

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setLoading(true);
    e.preventDefault();
    if (link === "") {
      setLoading(false);
      setError("Please provide a link");
      return;
    } else {
      fetch(`${SERVER_URL}/url/shorten`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ url: link }),
      })
        .then((response) => response.json())
        .then((res) => {
          setShortLink(res.shortUrl);
          console.log(res.shortUrl);
          setLoading(false);
          setLink("");
        })
        .catch((error: unknown) => {
          // handle error here
          setLoading(false);
          if (error instanceof Error) {
            setAsyncError("An error occured. Kindly try again later.");
          } else {
            setAsyncError("An unknown error occurred. Please try again later.");
          }
        });
    }
  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLink(event.target.value);
    setError("");
  };

  async function handleCopyToClipboard() {
    try {
      await navigator.clipboard.writeText(shortLink);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="flex max-w-4xl m-auto flex-col justify-center items-center h-screen">
        <h1 className="font-bold text-white text-center pb-14">
          URL link shortener
        </h1>
        {loading && <p className="text-white">Loading...</p>}
        {asyncError !== "" && <p className="text-red-500 pb-2">{asyncError}</p>}

        {shortLink && (
          <div className="flex items-center gap-3">
            <Link to={`/url/${id}`}>
              <p>
                Short link -{" "}
                <span className="underline cursor-pointer">{shortLink}</span>
              </p>
            </Link>

            {!copied && (
              <FaRegCopy
                className={`text-purple-400 text-xl cursor-pointer ${
                  copied ? "opacity-0" : ""
                }`}
                onClick={handleCopyToClipboard}
              />
            )}
            {copied && <span className="text-green-500">Copied!</span>}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="flex items-start mx-4 w-3/4 flex-col"
        >
          <label htmlFor="Link" className="pb-2">
            Link
          </label>
          {error && <p className="text-red-500 pb-2 ">{error}</p>}
          <input
            type="url"
            value={link}
            onChange={handleInputChange}
            placeholder="https://examplelink.com"
            className="p-2 mb-5 rounded-sm w-full outline-none focus:outline-purple-500"
          />
          <button
            type="submit"
            className="text-white rounded-md bg-purple-500 outline-none border-none hover:bg-purple-600 focus:outline-none cursor-pointer px-5 py-2"
          >
            Create
          </button>
        </form>
      </div>
    </>
  );
}

export default App;
