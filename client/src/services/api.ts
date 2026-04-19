export async function getTopArtisans() {
  const response = await fetch("http://localhost:3000/api/artisans/top");
  const data = await response.json();
  return data;
}

export async function getArtisanById(id: string) {
  const response = await fetch(`http://localhost:3000/api/artisans/${id}`);
  const data = await response.json();
  return data;
}

export async function searchArtisans(query: string) {
  const response = await fetch(
    `http://localhost:3000/api/artisans/search?nom=${encodeURIComponent(query)}`,
  );
  const data = await response.json();
  return data;
}

export async function getAllCategories() {
  const response = await fetch("http://localhost:3000/api/categories");
  const data = await response.json();
  return data;
}

export async function getSpecialitesByCategory(categoryId: string) {
  const response = await fetch(
    `http://localhost:3000/api/categories/${categoryId}/specialites`,
  );
  const data = await response.json();
  return data;
}

export async function sendContactEmail(
  nom: string,
  email: string,
  message: string,
) {
  const response = await fetch("http://localhost:3000/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ nom, email, message }),
  });
  const data = await response.json();
  return data;
}
