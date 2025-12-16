/**
 * Demo/Mock data service
 * Generates realistic Atlanta shelter dog data for testing and demonstration
 */

const atlantaShelters = [
  {
    id: 'atlanta-humane',
    name: 'Atlanta Humane Society',
    phone: '(404) 974-2880',
    email: 'info@atlantahumane.org',
    address: {
      address1: '981 Howell Mill Road NW',
      address2: null,
      city: 'Atlanta',
      state: 'GA',
      postcode: '30318',
      country: 'US'
    }
  },
  {
    id: 'lifeline-dekalb',
    name: 'LifeLine Animal Project - DeKalb',
    phone: '(404) 292-8800',
    email: 'info@lifelineanimal.org',
    address: {
      address1: '3180 Presidential Drive',
      address2: null,
      city: 'Atlanta',
      state: 'GA',
      postcode: '30340',
      country: 'US'
    }
  },
  {
    id: 'fulton-county',
    name: 'Fulton County Animal Services',
    phone: '(404) 613-0357',
    email: 'animal.services@fultoncountyga.gov',
    address: {
      address1: '860 Marietta Blvd NW',
      address2: null,
      city: 'Atlanta',
      state: 'GA',
      postcode: '30318',
      country: 'US'
    }
  },
  {
    id: 'pawsatl',
    name: 'PAWS Atlanta',
    phone: '(770) 593-1155',
    email: 'info@pawsatlanta.org',
    address: {
      address1: '5287 Covington Highway',
      address2: null,
      city: 'Decatur',
      state: 'GA',
      postcode: '30035',
      country: 'US'
    }
  },
  {
    id: 'angels-among-us',
    name: 'Angels Among Us Pet Rescue',
    phone: '(770) 693-2537',
    email: 'info@angelsrescue.org',
    address: {
      address1: 'P.O. Box 821',
      address2: null,
      city: 'Alpharetta',
      state: 'GA',
      postcode: '30009',
      country: 'US'
    }
  }
];

const breeds = [
  'Labrador Retriever', 'German Shepherd', 'Golden Retriever', 'Bulldog', 'Beagle',
  'Poodle', 'Rottweiler', 'Yorkshire Terrier', 'Boxer', 'Dachshund',
  'Siberian Husky', 'Great Dane', 'Doberman Pinscher', 'Australian Shepherd',
  'Miniature Schnauzer', 'Pembroke Welsh Corgi', 'Cavalier King Charles Spaniel',
  'Shih Tzu', 'Boston Terrier', 'Pomeranian', 'Havanese', 'Shetland Sheepdog',
  'Brittany', 'Cocker Spaniel', 'Border Collie', 'Pit Bull Terrier', 'Mixed Breed'
];

const dogNames = [
  'Max', 'Bella', 'Charlie', 'Luna', 'Cooper', 'Daisy', 'Rocky', 'Sadie',
  'Buddy', 'Molly', 'Tucker', 'Lola', 'Bear', 'Sophie', 'Duke', 'Chloe',
  'Zeus', 'Maggie', 'Bentley', 'Penny', 'Oliver', 'Zoe', 'Leo', 'Lily',
  'Milo', 'Ruby', 'Jack', 'Roxy', 'Toby', 'Stella', 'Winston', 'Nala',
  'Finn', 'Pepper', 'Jasper', 'Willow', 'Gus', 'Rosie', 'Teddy', 'Coco',
  'Murphy', 'Gracie', 'Archie', 'Ellie', 'Oscar', 'Abby', 'Henry', 'Lucy'
];

const colors = [
  'Black', 'Brown', 'White', 'Golden', 'Yellow', 'Tan', 'Gray', 'Red',
  'Black/Tan', 'Black/White', 'Brown/White', 'Tri-color', 'Brindle',
  'Cream', 'Blue', 'Chocolate', 'Apricot', 'Merle'
];

const temperamentOptions = [
  'Friendly', 'Playful', 'Energetic', 'Gentle', 'Calm', 'Affectionate',
  'Loyal', 'Smart', 'Protective', 'Independent', 'Social', 'Curious',
  'Obedient', 'Active', 'Loving', 'Patient', 'Alert'
];

const descriptions = [
  "is a wonderful companion looking for their forever home. They love people and are always ready for adventure or cuddle time.",
  "is a sweet and loving dog who would do best in a home with a fenced yard. They enjoy walks and playtime.",
  "came to us as a stray and has proven to be an absolute delight. They're house-trained and get along well with other pets.",
  "is looking for an active family who can keep up with their energy. They would excel in a home with outdoor space.",
  "is a gentle soul who just wants to be loved. They're great with children and would make an excellent family pet.",
  "has overcome a difficult past and is ready for a fresh start. They're incredibly loyal and affectionate once they trust you.",
  "is a smart cookie who knows basic commands and is eager to learn more. They would thrive with positive reinforcement training.",
  "loves nothing more than being by your side. Whether it's a walk in the park or relaxing on the couch, they're happy as long as they're with you.",
  "is a playful pup with lots of energy. They would do best with an experienced owner who can provide structure and exercise.",
  "is looking for a quiet home where they can be the only pet. They prefer a calm environment and lots of love."
];

/**
 * Generate realistic demo dog data
 */
export function generateDemoDogs(count = 50) {
  const dogs = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const shelter = atlantaShelters[Math.floor(Math.random() * atlantaShelters.length)];
    const breed = breeds[Math.floor(Math.random() * breeds.length)];
    const isMixed = breed === 'Mixed Breed' || Math.random() > 0.7;
    const name = dogNames[Math.floor(Math.random() * dogNames.length)];

    const size = ['Small', 'Medium', 'Large', 'Extra Large'][Math.floor(Math.random() * 4)];
    const age = ['Baby', 'Young', 'Adult', 'Senior'][Math.floor(Math.random() * 4)];
    const gender = Math.random() > 0.5 ? 'Male' : 'Female';
    const color = colors[Math.floor(Math.random() * colors.length)];
    const coat = ['Short', 'Medium', 'Long', 'Wire', 'Curly'][Math.floor(Math.random() * 5)];

    // Generate temperament (2-4 traits)
    const temperamentCount = 2 + Math.floor(Math.random() * 3);
    const temperament = [];
    for (let j = 0; j < temperamentCount; j++) {
      const trait = temperamentOptions[Math.floor(Math.random() * temperamentOptions.length)];
      if (!temperament.includes(trait)) {
        temperament.push(trait);
      }
    }

    // Random attributes
    const spayedNeutered = Math.random() > 0.3;
    const houseTrained = Math.random() > 0.4;
    const shotsCurrent = Math.random() > 0.2;
    const specialNeeds = Math.random() > 0.9;

    // Environment
    const goodWithKids = Math.random() > 0.4;
    const goodWithDogs = Math.random() > 0.5;
    const goodWithCats = Math.random() > 0.6;

    // Generate tags
    const tags = [];
    if (houseTrained) tags.push('House-trained');
    if (shotsCurrent) tags.push('Vaccinated');
    if (spayedNeutered) tags.push('Spayed/Neutered');
    if (specialNeeds) tags.push('Special needs');
    if (goodWithKids) tags.push('Kid-friendly');

    // Adoption fee
    const baseFee = size === 'Small' ? 150 : size === 'Medium' ? 175 : size === 'Large' ? 200 : 225;
    const feeVariation = Math.floor(Math.random() * 50) - 25;
    const adoptionFee = `$${baseFee + feeVariation}`;

    // Published date (random within last 90 days)
    const daysAgo = Math.floor(Math.random() * 90);
    const publishedAt = new Date(today);
    publishedAt.setDate(today.getDate() - daysAgo);

    // Distance from Atlanta center (2-18 miles)
    const distance = 2 + Math.random() * 16;

    // Description
    const desc = descriptions[Math.floor(Math.random() * descriptions.length)];
    const fullDescription = `${name} ${desc} ${temperament.slice(0, 2).join(' and ')} personality traits make them a joy to be around.`;

    dogs.push({
      id: `demo_${i + 1}`,
      name: name,
      breed: breed,
      breedSecondary: isMixed ? breeds[Math.floor(Math.random() * breeds.length)] : null,
      isMixed: isMixed,

      size: size,
      color: color,
      colorSecondary: Math.random() > 0.7 ? colors[Math.floor(Math.random() * colors.length)] : null,
      colorTertiary: null,
      age: age,
      gender: gender,
      coat: coat,

      temperament: temperament,

      attributes: {
        spayedNeutered: spayedNeutered,
        houseTrained: houseTrained,
        declawed: false,
        specialNeeds: specialNeeds,
        shotsCurrent: shotsCurrent
      },

      tags: tags,

      environment: {
        children: goodWithKids ? true : (Math.random() > 0.7 ? false : null),
        dogs: goodWithDogs ? true : (Math.random() > 0.7 ? false : null),
        cats: goodWithCats ? true : (Math.random() > 0.7 ? false : null)
      },

      description: fullDescription,
      photos: generateDemoPhotos(breed, color),
      primaryPhoto: `https://placedog.net/500/500?random=${i}`,
      videos: [],

      adoptionFee: adoptionFee,
      publishedAt: publishedAt.toISOString(),
      statusChangedAt: publishedAt.toISOString(),
      distance: distance,

      shelter: {
        id: shelter.id,
        name: shelter.name,
        email: shelter.email,
        phone: shelter.phone,
        address: shelter.address
      },

      url: `https://example.com/adopt/${i + 1}`
    });
  }

  return dogs;
}

/**
 * Generate demo photo URLs
 */
function generateDemoPhotos(breed, color) {
  const id = Math.floor(Math.random() * 1000);
  return [
    {
      small: `https://placedog.net/300/300?random=${id}`,
      medium: `https://placedog.net/500/500?random=${id}`,
      large: `https://placedog.net/800/800?random=${id}`,
      full: `https://placedog.net/1200/1200?random=${id}`
    }
  ];
}

/**
 * Get demo mode status
 */
export function isDemoMode() {
  return process.env.DEMO_MODE === 'true';
}
