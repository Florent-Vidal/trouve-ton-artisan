import type { Artisan } from "../types";

const ArtisanCard = ({ artisan }: { artisan: Artisan }) => {
  return (
    <div>
      <h3>{artisan.nom}</h3>
      <p>{artisan.note}</p>
      <p>{artisan.adresse}</p>
    </div>
  );
};

export default ArtisanCard;
