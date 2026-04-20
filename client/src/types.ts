export interface Categorie {
  id: number;
  nom: string;
}

export interface Specialite {
  id: number;
  nom: string;
  categorieId: number;
}

export interface Artisan {
  id: number;
  nom: string;
  adresse: string;
  email: string;
  site_web: string;
  note: number;
  ville: string;
  photo: string;
  a_propos: string;
  top_artisan: boolean;
  specialiteId: number;
}
