import React, { useState } from "react";
import "./App.css";
import OpenAI from "openai";
import { BeatLoader } from "react-spinners";

const App = () => {
  const [formData, setFormData] = useState({ language: "French", message: "" });
  const [error, setError] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // console.log(formData);
    setError("");
  };

  const translate = async () => {
    try {
      const { language, message } = formData;
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: `Translate this into ${language}: ${message}`,
        temperature: 0.7,
        max_tokens: 64,
        top_p: 1,
      });

      const translatedText = (response.data.choices[0].text);
      setIsLoading(false);
      setTranslation(translatedText);
    } catch (error) {
      setError("An error occurred while translating. Please try again later.");
    }
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (!formData.message) {
      setError("Please enter the message.");
      return;
    }
    setIsLoading(true);
    translate();
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(translation)
      .then(() => displayNotification())
      .catch((err) => console.log.error("failed to copy: ", err));
  };

  const displayNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div className="container">
      <h1>Translation</h1>

      <form onSubmit={handleOnSubmit}>
        <div className="choices">
          {/* the name attribute allows you to select one radio button at a time */}
          <input
            type="radio"
            id="french"
            name="language"
            value="French"
            defaultChecked={formData.language}
            onChange={handleInputChange}
          />
          <label htmlFor="french">French</label>

          <input
            type="radio"
            id="spanish"
            name="language"
            value="Spanish"
            onChange={handleInputChange}
          />
          <label htmlFor="spanish">Spanish</label>

          <input
            type="radio"
            id="dutch"
            name="language"
            value="Dutch"
            onChange={handleInputChange}
          />
          <label htmlFor="dutch">Dutch</label>

          <input
            type="radio"
            id="south-korea"
            name="language"
            value="South-Korea"
            onChange={handleInputChange}
          />
          <label htmlFor="south-korea">South Korea</label>
        </div>

        <textarea
          name="message"
          placeholder="Type your message here..."
          onChange={handleInputChange}
        ></textarea>

        {error && <div className="error">{error}</div>}

        <button type="submit">Translate</button>
      </form>

      <div className="translation">
        <div className="copy-btn" onClick={handleCopy}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"
            />
          </svg>
        </div>
        {isLoading ? <BeatLoader size="12px" color="red"/> : translation}
      </div>
      <div className={`notification ${showNotification ? "active" : ""}`}>
        copied to clipboard!
      </div>
    </div>
  );
};

export default App;
