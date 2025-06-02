import { useState } from "react";
const initial = { breed: "", size: "", color: "", age: "", temperament: "" };

export default function TraitsForm({ onSearch }) {
  const [form, setForm] = useState(initial);
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    onSearch({ ...form, age: Number(form.age) || undefined });
  };
  return (
    <form onSubmit={submit} className="grid grid-cols-2 gap-4 bg-white p-4 rounded-2xl shadow w-full max-w-2xl">
      {Object.keys(initial).map((key) => (
        <input
          key={key}
          name={key}
          placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
          value={form[key]}
          onChange={update}
          className="border p-2 rounded"
        />
      ))}
      <button className="col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">Find Matches</button>
    </form>
  );
}