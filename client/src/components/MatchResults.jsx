export default function MatchResults({ results }) {
    if (!results.length) return null;
    return (
      <div className="w-full max-w-2xl space-y-2">
        {results.map((dog) => (
          <div key={dog.id} className="bg-white p-3 rounded-xl shadow flex justify-between items-center">
            <div>
              <p className="font-semibold">{dog.name} – {dog.breed}</p>
              <p className="text-sm text-gray-600">{dog.shelter}</p>
            </div>
            <span className="text-lg font-bold">{dog.match}%</span>
          </div>
        ))}
      </div>
    );
  }