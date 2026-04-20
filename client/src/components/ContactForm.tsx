import { useState } from "react";
import { sendContactEmail } from "../services/api";

const ContactForm = () => {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      await sendContactEmail(nom, email, message);
      alert("Message envoyé !");
      setNom("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'envoi du message");
    }
  };
  return (
    <form>
      <input
        type="text"
        placeholder="Nom"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSubmit} type="button">
        Envoyer
      </button>
    </form>
  );
};

export default ContactForm;
