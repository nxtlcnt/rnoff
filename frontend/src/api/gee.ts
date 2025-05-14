export async function postFloodAnalysis(payload: any) {
  const response = await fetch("/api/gee/flood", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Flood API Error:", response.status, errorText);
    throw new Error(`Flood analysis failed: ${response.status}`);
  }

  return await response.json();
}
