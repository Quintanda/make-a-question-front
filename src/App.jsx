import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import './index.css';

const API_URL = "https://make-a-question.onrender.com";

function App() {
  const [pergunta, setPergunta] = useState("");
  const [respostasSalvas, setRespostasSalvas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [respostaVisivel, setRespostaVisivel] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/respostas`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRespostasSalvas(data);
        } else {
          console.warn("Resposta inesperada do backend:", data);
          setRespostasSalvas([]);
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar dados:", err);
        setRespostasSalvas([]);
      });
  }, []);

  const enviarPergunta = async () => {
    if (!pergunta.trim()) return;
    setCarregando(true);

    try {
      const res = await fetch(`${API_URL}/responder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: pergunta }),
      });

      if (res.ok) {
        setPergunta("");
      } else {
        console.error("Erro ao enviar pergunta");
      }
    } catch (err) {
      console.error("Erro ao enviar:", err);
    } finally {
      setCarregando(false);
    }
  };

  const toggleResposta = (index) => {
    setRespostaVisivel((prev) => (prev === index ? null : index));
  };

  return (
    <div
      style={{
        backgroundColor: "#121212",
        minHeight: "100vh",
        padding: "20px",
        color: "#ddd",
        fontFamily: "sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ maxWidth: "600px", width: "100%" }}>
        <h1
          style={{
            color: "#00bfff",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Make a Question
        </h1>

        <div style={{ marginBottom: "20px" }}>
          <textarea
            rows="4"
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
            placeholder="Digite sua pergunta..."
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #444",
              backgroundColor: "#1e1e1e",
              color: "#fff",
              resize: "none",
            }}
          />
          <button
            onClick={enviarPergunta}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "#00bfff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Enviar
          </button>
        </div>

        {carregando && (
          <div
            style={{
              border: "1px solid #444",
              marginBottom: "10px",
              padding: "10px",
              backgroundColor: "#1e1e1e",
              color: "#ffcc00",
              borderRadius: "6px",
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            Processando resposta...<br />
            <span style={{ color: "#bbb", fontSize: "0.9em" }}>
              Por favor, recarregue a página em cerca de 10 segundos.
            </span>
          </div>
        )}

        {respostasSalvas.map((item, i) => (
          <div
            key={i}
            onClick={() => toggleResposta(i)}
            style={{
              border: "1px solid #444",
              marginBottom: "10px",
              padding: "10px",
              cursor: "pointer",
              backgroundColor:
                respostaVisivel === i ? "#2a2a2a" : "#1e1e1e",
              color: "#ddd",
              borderRadius: "6px",
              boxShadow:
                respostaVisivel === i
                  ? "0 0 8px #00bfff"
                  : "none",
              transition: "all 0.3s",
            }}
          >
            <strong>{item.pergunta}</strong>
            {respostaVisivel === i && (
              <div
                style={{
                  marginTop: "10px",
                  backgroundColor: "#333",
                  padding: "10px",
                  borderRadius: "4px",
                  color: "#ccc",
                }}
              >
                <ReactMarkdown>{item.resposta}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
