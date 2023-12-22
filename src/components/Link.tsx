import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Link() {
  const { id } = useParams();
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  async function redirectToOriginal() {
    await fetch(`${SERVER_URL}/url/${id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((res) => {
        window.open(res.originalUrl, "_blank");
      });
  }
  useEffect(() => {
    redirectToOriginal();
  });
  return (
    <div className="h-screen">
      <h1 className="text-white">Loading...</h1>
    </div>
  );
}
