// On définit l'URL de secours au cas où Render ne l'injecterait pas
const FALLBACK_BACKEND_URL = "https://vulcain-backend.onrender.com"; 
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || FALLBACK_BACKEND_URL;

// Nettoyage de l'URL pour éviter les doubles slashs (ex: ...com//api/trends)
const CLEAN_BASE_URL = API_BASE_URL.replace(/\/$/, '');

console.log("🛠️ VULCAIN DEBUG: Connexion établie vers ->", CLEAN_BASE_URL);

export interface Trend {
  id: string;
  slug: string;
  title: string;
  description: string;
  searchVolume: number;
  growthRate: number;
  imageUrl: string;
  sourceUrl: string;
  isHot: boolean;
  category: string;
  createdAt: string;
}

export interface TrendsResponse {
  status: string;
  timestamp: string;
  data: Trend[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export const fetchTrends = async (page = 1, limit = 10): Promise<TrendsResponse> => {
  // Construction de l'URL absolue
  const targetUrl = `${CLEAN_BASE_URL}/api/trends?page=${page}&limit=${limit}&sortBy=searchVolume&sortOrder=desc`;

  // Création d'un contrôleur pour gérer le timeout (15 secondes max)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      next: { revalidate: 60 }, // Revalidate data every 60 seconds
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorMsg = `Erreur HTTP: ${response.status}`;
      console.error("❌ Problème Backend:", errorMsg);
      throw new Error(errorMsg);
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Échec de la requête API:", error);
    throw error;
  }
};