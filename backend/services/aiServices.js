const classifyRequest = (message) => {
  if (message.toLowerCase().includes("payment")) {
    return {
      category: "support",
      priority: "high",
      summary: "Customer has payment issue",
      confidence: 0.92,
    };
  }

  return {
    category: "general",
    priority: "low",
    summary: "General inquiry",
    confidence: 0.75,
  };
};

module.exports = classifyRequest;