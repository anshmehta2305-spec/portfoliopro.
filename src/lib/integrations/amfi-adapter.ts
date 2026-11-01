/**
 * Portfolio Pro - AMFI NAV Live & Batch Ingestion Adapter
 * Connects to Association of Mutual Funds in India (AMFI) daily official NAV feed
 * URL: https://www.amfiindia.com/spages/NAVAll.txt
 */

export interface ParsedNavRecord {
  schemeCode: string;
  isinDivPayout?: string;
  isinDivReinvest?: string;
  schemeName: string;
  netAssetValue: number;
  date: string;
}

export async function fetchLiveAmfiNavFile(): Promise<ParsedNavRecord[]> {
  const amfiUrl = process.env.AMFI_NAV_URL || "https://www.amfiindia.com/spages/NAVAll.txt";

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const response = await fetch(amfiUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "PortfolioPro-WealthTech/1.0" },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`AMFI returned status ${response.status}`);
    }

    const text = await response.text();
    const lines = text.split("\n");
    const records: ParsedNavRecord[] = [];

    // Format: Scheme Code;ISIN Div Payout/ ISIN Growth;ISIN Div Reinvestment;Scheme Name;Net Asset Value;Date
    for (const line of lines) {
      const parts = line.trim().split(";");
      if (parts.length >= 6 && !isNaN(Number(parts[0]))) {
        const nav = parseFloat(parts[4]);
        if (!isNaN(nav)) {
          records.push({
            schemeCode: parts[0],
            isinDivPayout: parts[1],
            isinDivReinvest: parts[2],
            schemeName: parts[3],
            netAssetValue: nav,
            date: parts[5],
          });
        }
      }
    }

    return records;
  } catch (error) {
    console.warn("AMFI Live fetch failed or timed out, returning empty for fallback to local DB:", (error as Error).message);
    return [];
  }
}

