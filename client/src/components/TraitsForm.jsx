import { useState } from "react";

const initialState = {
  breed: "",
  size: "",
  color: "",
  furColor: "",
  eyeColor: "",
  age: "",
  gender: "",
  temperament: "",
  coat: "",
  height: "",
  ears: "",
  hypoallergenic: false,
  nonShed: false,
  houseTrained: false,
  goodWithKids: false,
  goodWithDogs: false,
  goodWithCats: false,
  searchText: ""
};

export default function TraitsForm({ onSearch }) {
  const [form, setForm] = useState(initialState);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const update = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const submit = (e) => {
    e.preventDefault();

    // Convert age to number if provided
    const searchTraits = {
      ...form,
      age: form.age ? (isNaN(form.age) ? form.age : Number(form.age)) : undefined
    };

    // Remove empty string values
    Object.keys(searchTraits).forEach(key => {
      if (searchTraits[key] === "" || searchTraits[key] === undefined) {
        delete searchTraits[key];
      }
    });

    onSearch(searchTraits);
  };

  const reset = () => {
    setForm(initialState);
  };

  return (
    <form onSubmit={submit} className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-4xl">
      <h2 className="text-xl font-semibold mb-4">Find Your Perfect Companion</h2>

      {/* Basic Search Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <input
          name="breed"
          placeholder="Breed (e.g., Labrador)"
          value={form.breed}
          onChange={update}
          className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <select
          name="size"
          value={form.size}
          onChange={update}
          className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Size</option>
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
          <option value="Extra Large">Extra Large</option>
        </select>

        <input
          name="color"
          placeholder="Color (e.g., Brown, Black)"
          value={form.color}
          onChange={update}
          className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <select
          name="age"
          value={form.age}
          onChange={update}
          className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Age</option>
          <option value="Baby">Baby</option>
          <option value="Young">Young</option>
          <option value="Adult">Adult</option>
          <option value="Senior">Senior</option>
        </select>

        <select
          name="gender"
          value={form.gender}
          onChange={update}
          className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input
          name="temperament"
          placeholder="Temperament (e.g., Friendly)"
          value={form.temperament}
          onChange={update}
          className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Advanced Search Toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-blue-600 text-sm font-medium mb-3 hover:text-blue-700 flex items-center gap-1"
      >
        {showAdvanced ? '▼' : '▶'} Advanced Search
      </button>

      {/* Advanced Search Fields */}
      {showAdvanced && (
        <div className="border-t pt-4 mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Physical Characteristics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <input
              name="furColor"
              placeholder="Fur Color"
              value={form.furColor}
              onChange={update}
              className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <input
              name="eyeColor"
              placeholder="Eye Color"
              value={form.eyeColor}
              onChange={update}
              className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <select
              name="coat"
              value={form.coat}
              onChange={update}
              className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Coat Type</option>
              <option value="Short">Short</option>
              <option value="Medium">Medium</option>
              <option value="Long">Long</option>
              <option value="Wire">Wire</option>
              <option value="Hairless">Hairless</option>
              <option value="Curly">Curly</option>
            </select>

            <select
              name="height"
              value={form.height}
              onChange={update}
              className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Height</option>
              <option value="Short">Short</option>
              <option value="Medium">Medium</option>
              <option value="Tall">Tall</option>
            </select>

            <select
              name="ears"
              value={form.ears}
              onChange={update}
              className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Ear Type</option>
              <option value="Floppy">Floppy</option>
              <option value="Pointed">Pointed</option>
              <option value="Button">Button</option>
              <option value="Rose">Rose</option>
            </select>
          </div>

          <h3 className="text-sm font-semibold text-gray-700 mb-3">Special Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="hypoallergenic"
                checked={form.hypoallergenic}
                onChange={update}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Hypoallergenic</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="nonShed"
                checked={form.nonShed}
                onChange={update}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Non-Shedding</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="houseTrained"
                checked={form.houseTrained}
                onChange={update}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">House Trained</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="goodWithKids"
                checked={form.goodWithKids}
                onChange={update}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Good with Kids</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="goodWithDogs"
                checked={form.goodWithDogs}
                onChange={update}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Good with Dogs</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="goodWithCats"
                checked={form.goodWithCats}
                onChange={update}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm">Good with Cats</span>
            </label>
          </div>

          <h3 className="text-sm font-semibold text-gray-700 mb-3">Free Text Search</h3>
          <textarea
            name="searchText"
            placeholder="Describe what you're looking for in your ideal companion... (e.g., 'active dog for hiking', 'calm lap dog for apartment')"
            value={form.searchText}
            onChange={update}
            rows="3"
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Find Matches
        </button>
        <button
          type="button"
          onClick={reset}
          className="px-6 bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300 transition font-medium"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
