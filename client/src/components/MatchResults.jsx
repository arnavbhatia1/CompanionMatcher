import { useState } from "react";

function DogCard({ dog, onViewDetails }) {
  const photoUrl = dog.primaryPhoto || dog.photos?.[0]?.medium || 'https://via.placeholder.com/300x200?text=No+Photo';

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      {/* Photo */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={photoUrl}
          alt={dog.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=No+Photo';
          }}
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full font-bold text-sm">
          {dog.match}% Match
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{dog.name}</h3>
            <p className="text-sm text-gray-600">{dog.breed}</p>
          </div>
          <div className="text-right text-xs text-gray-500">
            {dog.distance && <p>{dog.distance.toFixed(1)} mi</p>}
          </div>
        </div>

        {/* Quick Info */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{dog.size}</span>
          <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{dog.age}</span>
          <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{dog.gender}</span>
          {dog.color && <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{dog.color}</span>}
        </div>

        {/* Temperament Tags */}
        {dog.temperament && dog.temperament.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {dog.temperament.slice(0, 3).map((trait, idx) => (
              <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                {trait}
              </span>
            ))}
            {dog.temperament.length > 3 && (
              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                +{dog.temperament.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Shelter */}
        <p className="text-sm text-gray-600 mb-3">
          {dog.shelter?.name || dog.shelter}
        </p>

        {/* View Details Button */}
        <button
          onClick={() => onViewDetails(dog)}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

function DogDetailsModal({ dog, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!dog) return null;

  const photos = dog.photos || [];
  const photoUrl = dog.primaryPhoto || photos[0]?.large || 'https://via.placeholder.com/600x400?text=No+Photo';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">{dog.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Photo Gallery */}
        <div className="relative h-96 bg-gray-200">
          <img
            src={photoUrl}
            alt={dog.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/600x400?text=No+Photo';
            }}
          />
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full font-bold">
            {dog.match}% Match
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'details'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'contact'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Contact & Adopt
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Breed</p>
                  <p className="font-semibold">{dog.breed}</p>
                  {dog.breedSecondary && <p className="text-sm text-gray-500">{dog.breedSecondary}</p>}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-semibold">{dog.age}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Size</p>
                  <p className="font-semibold">{dog.size}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="font-semibold">{dog.gender}</p>
                </div>
              </div>

              {/* Description */}
              {dog.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">About {dog.name}</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{dog.description}</p>
                </div>
              )}

              {/* Temperament */}
              {dog.temperament && dog.temperament.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Personality Traits</h3>
                  <div className="flex flex-wrap gap-2">
                    {dog.temperament.map((trait, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {dog.tags && dog.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Additional Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {dog.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Physical Characteristics */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Physical Characteristics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {dog.color && (
                    <div>
                      <p className="text-sm text-gray-600">Primary Color</p>
                      <p className="font-semibold">{dog.color}</p>
                    </div>
                  )}
                  {dog.colorSecondary && (
                    <div>
                      <p className="text-sm text-gray-600">Secondary Color</p>
                      <p className="font-semibold">{dog.colorSecondary}</p>
                    </div>
                  )}
                  {dog.coat && (
                    <div>
                      <p className="text-sm text-gray-600">Coat Type</p>
                      <p className="font-semibold">{dog.coat}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Health & Care */}
              {dog.attributes && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Health & Care</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dog.attributes.spayedNeutered ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      <span>Spayed/Neutered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dog.attributes.houseTrained ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      <span>House Trained</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dog.attributes.shotsCurrent ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                      <span>Shots Current</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dog.attributes.specialNeeds ? 'bg-yellow-500' : 'bg-gray-300'}`}></span>
                      <span>Special Needs</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Environment Compatibility */}
              {dog.environment && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Good With</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 border rounded-lg">
                      <div className={`text-2xl mb-1 ${dog.environment.children === true ? '' : 'opacity-30'}`}>👶</div>
                      <p className="text-sm">Children</p>
                      <p className="text-xs text-gray-600">
                        {dog.environment.children === true ? 'Yes' : dog.environment.children === false ? 'No' : 'Unknown'}
                      </p>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className={`text-2xl mb-1 ${dog.environment.dogs === true ? '' : 'opacity-30'}`}>🐕</div>
                      <p className="text-sm">Dogs</p>
                      <p className="text-xs text-gray-600">
                        {dog.environment.dogs === true ? 'Yes' : dog.environment.dogs === false ? 'No' : 'Unknown'}
                      </p>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className={`text-2xl mb-1 ${dog.environment.cats === true ? '' : 'opacity-30'}`}>🐈</div>
                      <p className="text-sm">Cats</p>
                      <p className="text-xs text-gray-600">
                        {dog.environment.cats === true ? 'Yes' : dog.environment.cats === false ? 'No' : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Adoption Details */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Adoption Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {dog.adoptionFee && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Adoption Fee:</span>
                      <span className="font-semibold">{dog.adoptionFee}</span>
                    </div>
                  )}
                  {dog.publishedAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Listed Date:</span>
                      <span className="font-semibold">{new Date(dog.publishedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  {dog.distance && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance:</span>
                      <span className="font-semibold">{dog.distance.toFixed(1)} miles away</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              {/* Shelter Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Shelter Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Organization</p>
                    <p className="font-semibold text-lg">{dog.shelter?.name || dog.shelter || 'Contact shelter for details'}</p>
                  </div>

                  {dog.shelter?.address && (
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">
                        {dog.shelter.address.address1}
                        {dog.shelter.address.address2 && `, ${dog.shelter.address.address2}`}
                      </p>
                      <p className="font-medium">
                        {dog.shelter.address.city}, {dog.shelter.address.state} {dog.shelter.address.postcode}
                      </p>
                    </div>
                  )}

                  {dog.shelter?.phone && (
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <a href={`tel:${dog.shelter.phone}`} className="font-medium text-blue-600 hover:underline">
                        {dog.shelter.phone}
                      </a>
                    </div>
                  )}

                  {dog.shelter?.email && (
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <a href={`mailto:${dog.shelter.email}`} className="font-medium text-blue-600 hover:underline">
                        {dog.shelter.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold mb-2">Ready to Meet {dog.name}?</h3>
                <p className="text-gray-700 mb-4">
                  Contact the shelter using the information above to schedule a visit or learn more about the adoption process.
                </p>
                {dog.url && (
                  <a
                    href={dog.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    View on Petfinder
                  </a>
                )}
              </div>

              {/* Tips */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Adoption Tips:</h4>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>Call ahead to confirm {dog.name} is still available</li>
                  <li>Ask about their adoption requirements and process</li>
                  <li>Prepare questions about {dog.name}'s history and care needs</li>
                  <li>Bring your family members to meet {dog.name}</li>
                  <li>Be prepared for a home visit or reference checks</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MatchResults({ results }) {
  const [selectedDog, setSelectedDog] = useState(null);

  if (!results.length) {
    return (
      <div className="w-full max-w-4xl text-center py-8">
        <p className="text-gray-500">No results yet. Search for your perfect companion above!</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-6xl">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">
            Found {results.length} Match{results.length !== 1 ? 'es' : ''}
          </h2>
          <p className="text-gray-600 text-sm">
            Click on any dog to view detailed information and adoption details
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((dog) => (
            <DogCard
              key={dog.id}
              dog={dog}
              onViewDetails={setSelectedDog}
            />
          ))}
        </div>
      </div>

      {selectedDog && (
        <DogDetailsModal
          dog={selectedDog}
          onClose={() => setSelectedDog(null)}
        />
      )}
    </>
  );
}
