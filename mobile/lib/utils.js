export function formatDate(dateString) {
    // format date nicely
    // example: from this 👉 2025-06-01 to this 👉 June 1, 2025
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }