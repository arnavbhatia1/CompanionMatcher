import 'dotenv/config';
import express from "express";
import cors from "cors";
import { scoreMatches } from "./utils/matcher.js";
import { fetchDogs, getDataSourceInfo, hasRealAPI } from "./services/dataService.js";

const PORT = process.env.PORT || 4000;
const app  = express();
app.use(cors());
app.use(express.json());

// In-memory cache for dogs
let cachedDogs = [];
let lastFetchTime = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// Health-check
app.get("/api/health", (_, res) => {
  const dataSource = getDataSourceInfo();
  res.json({
    status: "OK",
    dataSource: dataSource.description,
    hasRealAPI: hasRealAPI(),
    cachedDogs: cachedDogs.length,
    lastFetch: lastFetchTime
  });
});

// Get data source information
app.get("/api/datasource", (_, res) => {
  const info = getDataSourceInfo();
  res.json({
    ...info,
    hasRealAPI: hasRealAPI(),
    cached: cachedDogs.length,
    lastFetch: lastFetchTime
  });
});

// Fetch dogs from data source
app.get("/api/dogs/refresh", async (req, res) => {
  try {
    console.log('🔄 Refreshing dog data...');
    cachedDogs = await fetchDogs();
    lastFetchTime = Date.now();
    res.json({
      success: true,
      count: cachedDogs.length,
      source: getDataSourceInfo().description,
      message: `Fetched ${cachedDogs.length} dogs`
    });
  } catch (error) {
    console.error('❌ Error fetching dogs:', error);
    res.status(500).json({
      error: 'Failed to fetch dogs',
      details: error.message
    });
  }
});

// Get all cached dogs
app.get("/api/dogs", async (req, res) => {
  try {
    // Refresh cache if empty or expired
    if (cachedDogs.length === 0 || !lastFetchTime || (Date.now() - lastFetchTime > CACHE_DURATION)) {
      console.log('Cache empty or expired, fetching data...');
      cachedDogs = await fetchDogs();
      lastFetchTime = Date.now();
    }

    res.json({
      dogs: cachedDogs,
      count: cachedDogs.length,
      source: getDataSourceInfo().description,
      lastFetch: lastFetchTime
    });
  } catch (error) {
    console.error('Error getting dogs:', error);
    res.status(500).json({
      error: 'Failed to get dogs',
      details: error.message
    });
  }
});

// POST /api/match  { traits: { breed, size, color, age, temperament, ... } }
app.post("/api/match", async (req, res) => {
  try {
    const { traits } = req.body;
    if (!traits) return res.status(400).json({ error: "traits object required" });

    // Refresh cache if empty or expired
    if (cachedDogs.length === 0 || !lastFetchTime || (Date.now() - lastFetchTime > CACHE_DURATION)) {
      console.log('Fetching fresh data for matching...');
      try {
        cachedDogs = await fetchDogs();
        lastFetchTime = Date.now();
      } catch (error) {
        console.error('Failed to fetch data:', error.message);
        if (cachedDogs.length === 0) {
          return res.status(500).json({
            error: 'No data available',
            details: error.message
          });
        }
      }
    }

    const matches = await scoreMatches(traits, cachedDogs);
    res.json(matches.slice(0, 20)); // top 20 matches
  } catch (error) {
    console.error('Error in match endpoint:', error);
    res.status(500).json({ error: 'Failed to match dogs', details: error.message });
  }
});

app.listen(PORT, () => {
  const dataSource = getDataSourceInfo();

  console.log('');
  console.log('🐾 ================================');
  console.log('🐾  Companion Matcher API');
  console.log('🐾 ================================');
  console.log(`🌐 Server: http://localhost:${PORT}`);
  console.log(`📍 Location: Atlanta, GA (${process.env.SEARCH_RADIUS_MILES || 20} miles)`);
  console.log(`📊 Data Source: ${dataSource.description}`);

  if (process.env.DEMO_MODE === 'true') {
    console.log('🎭 DEMO MODE ACTIVE - Using generated data');
  }

  if (process.env.RESCUEGROUPS_API_KEY && process.env.RESCUEGROUPS_API_KEY !== 'your_rescuegroups_api_key_here') {
    console.log('✅ RescueGroups API: Configured');
  } else {
    console.log('⚠️  RescueGroups API: Not configured (using demo mode)');
  }

  console.log('🔍 Matching: Enhanced intelligent algorithm');
  console.log('🐾 ================================');
  console.log('');
});
