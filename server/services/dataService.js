/**
 * Unified Data Service
 * Manages multiple data sources and provides a consistent interface
 */

import { fetchRescueGroupsDogs, isRescueGroupsConfigured } from './rescueGroups.js';
import { generateDemoDogs, isDemoMode } from './demoData.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const dogsData = require('../data/dogs.json');

/**
 * Determine which data source to use
 */
function getDataSource() {
  if (isDemoMode()) {
    return 'demo';
  }

  if (isRescueGroupsConfigured()) {
    return 'rescuegroups';
  }

  return 'fallback';
}

/**
 * Fetch dogs from the appropriate data source
 */
export async function fetchDogs() {
  const source = getDataSource();

  console.log(`📊 Using data source: ${source}`);

  try {
    switch (source) {
      case 'demo':
        console.log('🎭 Generating demo data...');
        return generateDemoDogs(60); // Generate 60 demo dogs

      case 'rescuegroups':
        console.log('🌐 Fetching from RescueGroups.org API...');
        try {
          const dogs = await fetchRescueGroupsDogs();
          console.log(`✅ Fetched ${dogs.length} dogs from RescueGroups`);
          return dogs;
        } catch (error) {
          console.error('❌ RescueGroups API failed:', error.message);
          console.log('⚠️  Falling back to demo data...');
          return generateDemoDogs(60);
        }

      case 'fallback':
      default:
        console.log('📁 Using fallback data from dogs.json');
        // Transform fallback data to match our schema
        return dogsData.map(dog => ({
          ...dog,
          id: dog.id.toString(),
          breedSecondary: null,
          isMixed: false,
          colorSecondary: null,
          colorTertiary: null,
          coat: null,
          attributes: {
            spayedNeutered: false,
            houseTrained: false,
            declawed: false,
            specialNeeds: false,
            shotsCurrent: false
          },
          tags: [],
          environment: {
            children: null,
            dogs: null,
            cats: null
          },
          photos: [],
          primaryPhoto: null,
          videos: [],
          adoptionFee: 'Contact shelter for details',
          publishedAt: new Date().toISOString(),
          statusChangedAt: new Date().toISOString(),
          distance: Math.random() * 15 + 2,
          shelter: typeof dog.shelter === 'string'
            ? { id: 'unknown', name: dog.shelter, email: null, phone: null, address: {} }
            : dog.shelter,
          url: null,
          description: `${dog.name} is a ${dog.age || 'young'} ${dog.breed} looking for a loving home.`
        }));
    }
  } catch (error) {
    console.error('❌ Error fetching dogs:', error);
    throw error;
  }
}

/**
 * Get information about current data source
 */
export function getDataSourceInfo() {
  const source = getDataSource();

  const info = {
    source: source,
    description: '',
    configured: true
  };

  switch (source) {
    case 'demo':
      info.description = 'Demo Mode - Generated realistic Atlanta shelter data';
      break;
    case 'rescuegroups':
      info.description = 'RescueGroups.org API - Live data from rescue organizations';
      break;
    case 'fallback':
      info.description = 'Fallback Mode - Using local JSON data';
      break;
  }

  return info;
}

/**
 * Check if real API (not demo/fallback) is available
 */
export function hasRealAPI() {
  const source = getDataSource();
  return source === 'rescuegroups';
}
