/**
 * Enhanced Matching Algorithm
 * Uses intelligent keyword matching, fuzzy matching, and weighted scoring
 * No external APIs required!
 */

/**
 * Main matching function with intelligent scoring
 */
export async function scoreMatches(query, dogs) {
  console.log('🔍 Using enhanced intelligent matching algorithm');

  return dogs.map(dog => {
    const scores = {
      breed: 0,
      size: 0,
      color: 0,
      age: 0,
      gender: 0,
      coat: 0,
      temperament: 0,
      environment: 0,
      special: 0,
      textSearch: 0
    };

    const weights = {
      breed: 25,
      size: 15,
      color: 10,
      age: 12,
      gender: 8,
      coat: 8,
      temperament: 12,
      environment: 10,
      special: 5,
      textSearch: 15
    };

    // BREED MATCHING (with fuzzy matching)
    if (query.breed && dog.breed) {
      scores.breed = matchBreed(query.breed, dog.breed, dog.breedSecondary);
    }

    // SIZE MATCHING
    if (query.size && dog.size) {
      scores.size = matchSize(query.size, dog.size);
    }

    // COLOR MATCHING
    if (query.color || query.furColor) {
      const queryColor = query.color || query.furColor;
      scores.color = matchColor(queryColor, dog.color, dog.colorSecondary, dog.colorTertiary);
    }

    // AGE MATCHING
    if (query.age) {
      scores.age = matchAge(query.age, dog.age);
    }

    // GENDER MATCHING
    if (query.gender && dog.gender) {
      scores.gender = matchExact(query.gender, dog.gender);
    }

    // COAT MATCHING
    if (query.coat && dog.coat) {
      scores.coat = matchExact(query.coat, dog.coat);
    }

    // TEMPERAMENT MATCHING (intelligent multi-trait matching)
    if (query.temperament) {
      scores.temperament = matchTemperament(query.temperament, dog.temperament, dog.tags);
    }

    // ENVIRONMENT COMPATIBILITY
    scores.environment = matchEnvironment(query, dog.environment);

    // SPECIAL ATTRIBUTES
    scores.special = matchSpecialAttributes(query, dog);

    // FREE TEXT SEARCH (search across all fields)
    if (query.searchText) {
      scores.textSearch = matchFreeText(query.searchText, dog);
    }

    // Calculate weighted total score
    let totalScore = 0;
    let totalWeight = 0;

    Object.keys(scores).forEach(key => {
      if (scores[key] > 0 || (query[key] && key !== 'textSearch')) {
        totalScore += scores[key] * weights[key];
        totalWeight += weights[key];
      }
    });

    // Normalize to 0-100
    const normalizedScore = totalWeight > 0 ? (totalScore / totalWeight) : 0;

    return {
      ...dog,
      match: Math.round(normalizedScore),
      matchType: 'intelligent',
      matchBreakdown: scores // For debugging
    };
  }).sort((a, b) => b.match - a.match);
}

/**
 * Intelligent breed matching with partial and fuzzy matching
 */
function matchBreed(queryBreed, primaryBreed, secondaryBreed) {
  const query = queryBreed.toLowerCase().trim();
  const primary = primaryBreed.toLowerCase();
  const secondary = (secondaryBreed || '').toLowerCase();

  // Exact match
  if (primary === query) return 100;
  if (secondary === query) return 90;

  // Contains match (e.g., "lab" matches "Labrador Retriever")
  if (primary.includes(query) || query.includes(primary)) {
    return 85;
  }
  if (secondary && (secondary.includes(query) || query.includes(secondary))) {
    return 75;
  }

  // Word match (e.g., "retriever" matches "Golden Retriever")
  const queryWords = query.split(/\s+/);
  const primaryWords = primary.split(/\s+/);
  const secondaryWords = secondary.split(/\s+/);

  for (const qWord of queryWords) {
    if (qWord.length < 3) continue; // Skip short words

    for (const pWord of primaryWords) {
      if (pWord.includes(qWord) || qWord.includes(pWord)) {
        return 70;
      }
    }

    for (const sWord of secondaryWords) {
      if (sWord.includes(qWord) || qWord.includes(sWord)) {
        return 60;
      }
    }
  }

  // Mixed breed special handling
  if (primary.includes('mix') && query !== 'mixed breed') {
    return 30; // Partial match for mixed breeds
  }

  return 0;
}

/**
 * Size matching with adjacent size compatibility
 */
function matchSize(querySize, dogSize) {
  const query = querySize.toLowerCase();
  const dog = dogSize.toLowerCase();

  if (query === dog) return 100;

  const sizes = ['small', 'medium', 'large', 'extra large'];
  const queryIndex = sizes.indexOf(query);
  const dogIndex = sizes.indexOf(dog);

  if (queryIndex === -1 || dogIndex === -1) return 0;

  // Adjacent sizes get partial credit
  const difference = Math.abs(queryIndex - dogIndex);
  if (difference === 1) return 60;
  if (difference === 2) return 30;

  return 0;
}

/**
 * Color matching across multiple color fields
 */
function matchColor(queryColor, primary, secondary, tertiary) {
  const query = queryColor.toLowerCase().trim();
  const colors = [primary, secondary, tertiary]
    .filter(Boolean)
    .map(c => c.toLowerCase());

  for (let i = 0; i < colors.length; i++) {
    const color = colors[i];

    // Exact match
    if (color === query) {
      return i === 0 ? 100 : 90; // Primary color worth more
    }

    // Contains match
    if (color.includes(query) || query.includes(color)) {
      return i === 0 ? 85 : 75;
    }

    // Handle compound colors (e.g., "black/tan")
    const colorParts = color.split(/[\/\s,-]+/);
    for (const part of colorParts) {
      if (part === query) return 80;
      if (part.includes(query) || query.includes(part)) return 70;
    }
  }

  return 0;
}

/**
 * Age matching with intelligent age group understanding
 */
function matchAge(queryAge, dogAge) {
  const ageMap = {
    'baby': { min: 0, max: 1, label: 'baby' },
    'young': { min: 1, max: 3, label: 'young' },
    'adult': { min: 3, max: 8, label: 'adult' },
    'senior': { min: 8, max: 20, label: 'senior' }
  };

  const query = queryAge.toString().toLowerCase();
  const dog = dogAge.toString().toLowerCase();

  // Exact match
  if (query === dog) return 100;

  // Convert to age groups
  let queryGroup, dogGroup;

  if (ageMap[query]) {
    queryGroup = ageMap[query];
  } else {
    const queryNum = parseFloat(query);
    if (!isNaN(queryNum)) {
      queryGroup = Object.values(ageMap).find(
        g => queryNum >= g.min && queryNum < g.max
      );
    }
  }

  if (ageMap[dog]) {
    dogGroup = ageMap[dog];
  } else {
    const dogNum = parseFloat(dog);
    if (!isNaN(dogNum)) {
      dogGroup = Object.values(ageMap).find(
        g => dogNum >= g.min && dogNum < g.max
      );
    }
  }

  if (queryGroup && dogGroup) {
    if (queryGroup.label === dogGroup.label) return 100;

    // Adjacent age groups
    const groupOrder = ['baby', 'young', 'adult', 'senior'];
    const qIndex = groupOrder.indexOf(queryGroup.label);
    const dIndex = groupOrder.indexOf(dogGroup.label);

    if (Math.abs(qIndex - dIndex) === 1) return 60;
  }

  return 0;
}

/**
 * Exact match helper
 */
function matchExact(query, value) {
  return query.toLowerCase() === value.toLowerCase() ? 100 : 0;
}

/**
 * Temperament matching with intelligent trait understanding
 */
function matchTemperament(queryTemp, dogTemps, dogTags) {
  if (!dogTemps || dogTemps.length === 0) return 0;

  const query = queryTemp.toLowerCase().trim();
  const temps = Array.isArray(dogTemps)
    ? dogTemps.map(t => t.toLowerCase())
    : [dogTemps.toLowerCase()];
  const tags = (dogTags || []).map(t => t.toLowerCase());

  // Exact match
  if (temps.includes(query)) return 100;
  if (tags.includes(query)) return 90;

  // Contains match
  for (const temp of temps) {
    if (temp.includes(query) || query.includes(temp)) return 85;
  }
  for (const tag of tags) {
    if (tag.includes(query) || query.includes(tag)) return 75;
  }

  // Synonym matching
  const synonyms = {
    'friendly': ['social', 'affectionate', 'loving', 'sweet', 'gentle'],
    'active': ['energetic', 'playful', 'high-energy'],
    'calm': ['gentle', 'relaxed', 'laid-back', 'mellow'],
    'smart': ['intelligent', 'clever', 'trainable'],
    'protective': ['alert', 'watchful', 'loyal'],
    'independent': ['self-sufficient', 'confident']
  };

  for (const [key, syns] of Object.entries(synonyms)) {
    if (query === key || syns.includes(query)) {
      for (const temp of temps) {
        if (temp === key || syns.some(s => temp.includes(s))) {
          return 70;
        }
      }
    }
  }

  return 0;
}

/**
 * Environment compatibility matching
 */
function matchEnvironment(query, environment) {
  if (!environment) return 0;

  let score = 0;
  let checks = 0;

  if (query.goodWithKids !== undefined) {
    checks++;
    if (environment.children === true && query.goodWithKids) score += 100;
    else if (environment.children === false && !query.goodWithKids) score += 100;
    else if (environment.children === null) score += 50; // Unknown is partial match
  }

  if (query.goodWithDogs !== undefined) {
    checks++;
    if (environment.dogs === true && query.goodWithDogs) score += 100;
    else if (environment.dogs === false && !query.goodWithDogs) score += 100;
    else if (environment.dogs === null) score += 50;
  }

  if (query.goodWithCats !== undefined) {
    checks++;
    if (environment.cats === true && query.goodWithCats) score += 100;
    else if (environment.cats === false && !query.goodWithCats) score += 100;
    else if (environment.cats === null) score += 50;
  }

  return checks > 0 ? score / checks : 0;
}

/**
 * Special attributes matching
 */
function matchSpecialAttributes(query, dog) {
  let score = 0;
  let checks = 0;

  // House trained
  if (query.houseTrained) {
    checks++;
    if (dog.attributes?.houseTrained === true) score += 100;
  }

  // Hypoallergenic
  if (query.hypoallergenic) {
    checks++;
    const isHypo = dog.tags?.some(t => t.toLowerCase().includes('hypoallergenic')) ||
                   dog.description?.toLowerCase().includes('hypoallergenic') ||
                   dog.coat?.toLowerCase().includes('hairless');
    if (isHypo) score += 100;
  }

  // Non-shedding
  if (query.nonShed) {
    checks++;
    const nonShed = dog.tags?.some(t => t.toLowerCase().includes('non-shed')) ||
                    dog.description?.toLowerCase().includes('non-shed') ||
                    dog.coat?.toLowerCase().includes('hairless');
    if (nonShed) score += 100;
  }

  return checks > 0 ? score / checks : 0;
}

/**
 * Free text search across all dog fields
 */
function matchFreeText(searchText, dog) {
  const query = searchText.toLowerCase();
  const searchWords = query.split(/\s+/).filter(w => w.length > 2);

  if (searchWords.length === 0) return 0;

  // Create searchable text from dog
  const searchableText = [
    dog.name,
    dog.breed,
    dog.breedSecondary,
    dog.description,
    dog.size,
    dog.age,
    dog.gender,
    dog.color,
    dog.coat,
    ...(dog.temperament || []),
    ...(dog.tags || [])
  ].filter(Boolean).join(' ').toLowerCase();

  let matchCount = 0;
  for (const word of searchWords) {
    if (searchableText.includes(word)) {
      matchCount++;
    }
  }

  // Score based on percentage of words found
  return (matchCount / searchWords.length) * 100;
}
