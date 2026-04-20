const Footer = () => {
  return (
    <footer>
      <div>
        <div>
          <a href="/" aria-label="Accueil">
            <span>Trouve ton artisan !</span>
            <span>Avec la région Auvergne-Rhône-Alpes</span>
          </a>
          <address>
            101 cours Charlemagne
            <br />
            CS 20033 — 69269 LYON CEDEX 02
            <br />
            France — <a href="tel:+33426734000">+33 (0)4 26 73 40 00</a>
          </address>
        </div>
        <nav aria-label="Liens légaux">
          <ul role="list">
            <li>
              <a href="/mentions-legales">Mentions légales</a>
            </li>
            <li>
              <a href="/donnees-personnelles">Données personnelles</a>
            </li>
            <li>
              <a href="/accessibilite">Accessibilité</a>
            </li>
            <li>
              <a href="/cookies">Cookies</a>
            </li>
          </ul>
        </nav>
      </div>
      <hr />
      <p>
        <small>© {new Date().getFullYear()} Région Auvergne-Rhône-Alpes</small>
      </p>
    </footer>
  );
};
export default Footer;
