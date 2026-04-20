import { useEffect, useState } from "react";
import { getAllCategories } from "../services/api";
import type { Categorie } from "../types";

const Header = () => {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [recherche, setRecherche] = useState("");

  useEffect(() => {
    getAllCategories().then((data) => setCategories(data));
  }, []);
  return (
    <header>
      <h1>Trouve ton artisan</h1>
      <nav>
        <ul>
          {categories.map((categorie) => (
            <li key={categorie.id}>
              <a href={`/categories/${categorie.id}/specialites`}>
                {categorie.nom}
              </a>
            </li>
          ))}
        </ul>
        <div>
          <input
            type="text"
            placeholder="Rechercher"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
          <button onClick={() => alert(`Recherche: ${recherche}`)}>
            Rechercher
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
