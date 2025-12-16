import fetch from 'node-fetch';

/**
 * RescueGroups.org API Integration
 * Free API for animal shelters and rescue organizations
 * Documentation: https://userguide.rescuegroups.org/display/APIDG/API+Developers+Guide+Home
 */

const API_BASE_URL = 'https://api.rescuegroups.org/v5';

/**
 * Check if RescueGroups API is configured
 */
export function isRescueGroupsConfigured() {
  return !!process.env.RESCUEGROUPS_API_KEY && process.env.RESCUEGROUPS_API_KEY !== 'your_rescuegroups_api_key_here';
}

/**
 * Fetch dogs from RescueGroups API
 */
export async function fetchRescueGroupsDogs() {
  if (!isRescueGroupsConfigured()) {
    throw new Error('RescueGroups API key not configured');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/public/animals/search/available/dogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Authorization': process.env.RESCUEGROUPS_API_KEY
      },
      body: JSON.stringify({
        data: {
          filters: [
            {
              fieldName: 'statuses.name',
              operation: 'equals',
              criteria: 'Available'
            },
            {
              fieldName: 'species.singular',
              operation: 'equals',
              criteria: 'Dog'
            }
          ],
          filterRadius: {
            miles: parseInt(process.env.SEARCH_RADIUS_MILES) || 20,
            postalcode: '30303' // Atlanta, GA
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`RescueGroups API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.data) {
      return [];
    }

    return data.data.map(animal => transformRescueGroupsDog(animal));
  } catch (error) {
    console.error('Error fetching from RescueGroups:', error.message);
    throw error;
  }
}

/**
 * Transform RescueGroups API response to our data model
 */
function transformRescueGroupsDog(animal) {
  const attributes = animal.attributes || {};
  const orgId = animal.relationships?.orgs?.data?.[0]?.id;

  return {
    id: `rg_${animal.id}`,
    name: attributes.name || 'Unknown',
    breed: attributes.breedPrimary || 'Mixed Breed',
    breedSecondary: attributes.breedSecondary || null,
    isMixed: attributes.isMixedBreed || false,

    // Physical characteristics
    size: mapSize(attributes.ageGroup),
    color: attributes.colorDetails || attributes.descriptionText?.match(/color[:\s]+(\w+)/i)?.[1] || 'Unknown',
    colorSecondary: null,
    colorTertiary: null,
    age: mapAgeGroup(attributes.ageGroup),
    gender: attributes.sex === 'Male' ? 'Male' : attributes.sex === 'Female' ? 'Female' : 'Unknown',
    coat: attributes.coatLength || null,

    // Behavioral traits
    temperament: extractTemperamentFromRG(attributes),

    // Special attributes
    attributes: {
      spayedNeutered: attributes.isAltered || false,
      houseTrained: attributes.isHousetrained || false,
      declawed: false,
      specialNeeds: attributes.isSpecialNeeds || false,
      shotsCurrent: attributes.isCurrentVaccinations || false
    },

    // Health & behavior tags
    tags: extractTagsFromRG(attributes),

    // Environment compatibility
    environment: {
      children: attributes.isKidsOk || null,
      dogs: attributes.isDogsOk || null,
      cats: attributes.isCatsOk || null
    },

    // Description & media
    description: attributes.descriptionText || 'No description available',
    photos: (attributes.pictureThumbnailUrl ? [{
      small: attributes.pictureThumbnailUrl,
      medium: attributes.pictureThumbnailUrl,
      large: attributes.pictureThumbnailUrl,
      full: attributes.pictureThumbnailUrl
    }] : []),
    primaryPhoto: attributes.pictureThumbnailUrl || null,
    videos: [],

    // Adoption details
    adoptionFee: attributes.adoptionFeeString || 'Contact shelter for details',
    publishedAt: attributes.createdDate || new Date().toISOString(),
    statusChangedAt: attributes.updatedDate || new Date().toISOString(),
    distance: null,

    // Shelter information
    shelter: {
      id: orgId || 'unknown',
      name: attributes.orgName || 'Local Animal Shelter',
      email: attributes.orgEmail || null,
      phone: attributes.orgPhone || null,
      address: {
        address1: attributes.orgAddress || null,
        address2: null,
        city: attributes.orgCity || 'Atlanta',
        state: attributes.orgState || 'GA',
        postcode: attributes.orgPostalcode || null,
        country: 'US'
      }
    },

    // Links
    url: attributes.url || null
  };
}

/**
 * Map age group to size (approximate)
 */
function mapSize(ageGroup) {
  if (!ageGroup) return 'Medium';
  const age = ageGroup.toLowerCase();
  if (age.includes('baby') || age.includes('young')) return 'Small';
  if (age.includes('senior')) return 'Medium';
  return 'Large';
}

/**
 * Map age group to our format
 */
function mapAgeGroup(ageGroup) {
  if (!ageGroup) return 'Adult';
  const age = ageGroup.toLowerCase();
  if (age.includes('baby')) return 'Baby';
  if (age.includes('young')) return 'Young';
  if (age.includes('senior')) return 'Senior';
  return 'Adult';
}

/**
 * Extract temperament from RescueGroups data
 */
function extractTemperamentFromRG(attributes) {
  const traits = [];

  if (attributes.isCourteousOk) traits.push('Friendly');
  if (attributes.isPlayful) traits.push('Playful');
  if (attributes.isObedient) traits.push('Obedient');
  if (attributes.isGentle) traits.push('Gentle');
  if (attributes.isAgilityTrained) traits.push('Active');

  // Environment-based traits
  if (attributes.isKidsOk) traits.push('Good with kids');
  if (attributes.isDogsOk) traits.push('Good with dogs');
  if (attributes.isCatsOk) traits.push('Good with cats');

  return traits.length > 0 ? traits : ['Friendly'];
}

/**
 * Extract tags from RescueGroups data
 */
function extractTagsFromRG(attributes) {
  const tags = [];

  if (attributes.isHousetrained) tags.push('House-trained');
  if (attributes.isSpecialNeeds) tags.push('Special needs');
  if (attributes.isCurrentVaccinations) tags.push('Vaccinated');
  if (attributes.isAltered) tags.push('Spayed/Neutered');
  if (attributes.isDeclawed) tags.push('Declawed');

  return tags;
}
