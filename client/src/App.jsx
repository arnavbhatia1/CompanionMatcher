import { useState } from "react";
import TraitsForm from "./components/TraitsForm";
import MatchResults from "./components/MatchResults";

export default function App() {
  const [results, setResults] = useState([]);
  const handleSearch = async (traits) => {
    const res = await fetch("http://localhost:4000/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ traits })
    });
    const data = await res.json();
    setResults(data);
  };
  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold">🐶 Dog Companion Matcher (Atlanta)</h1>
      <TraitsForm onSearch={handleSearch} />
      <MatchResults results={results} />
    </div>
  );
}