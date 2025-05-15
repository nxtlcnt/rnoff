export async function postChat(payload: {
  message: string;
  conversation_id: string;
}) {
  const response = await fetch("/api/chat/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Chatbot API Error:", response.status, errorText);
    throw new Error(`Chat failed: ${response.status}`);
  }

  const data = await response.json();
  return data as {
    response: string;
    conversation_id: string;
  };
}
