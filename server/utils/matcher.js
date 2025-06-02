export function scoreMatches(query, dogs) {
    return dogs.map(dog => {
      let score = 0;
      if (query.breed && query.breed.toLowerCase() === dog.breed.toLowerCase()) score += 20;
      if (query.size  && query.size  === dog.size)   score += 20;
      if (query.color && query.color.toLowerCase() === dog.color.toLowerCase()) score += 20;
      if (query.temperament && dog.temperament.includes(query.temperament)) score += 20;
      if (query.age) {
        const diff = Math.abs(query.age - dog.age);
        score += Math.max(0, 20 - diff * 4); // linear decay
      }
      return { ...dog, match: Math.round(score) };
    }).sort((a, b) => b.match - a.match);
  }