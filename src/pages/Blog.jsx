// src/pages/Blog.jsx
export default function Blog(){
  const posts = [
    {
      id: 1,
      title: "Economía en CS2: cómo no malgastar tus skins",
      excerpt: "Guía rápida para comprar/vender sin perder valor y detectar ofertas reales.",
      img: "/img/blog/eco.jpg",
      date: "2025-05-30",
      tag: "Economía",
      link: "https://www.youtube.com/watch?v=0Tx2Cw0MJ2Y" // link
    },
    {
      id: 2,
      title: "Cuidado con las estafas: tips de seguridad",
      excerpt: "Las estafas más comunes y cómo evitarlas al tradear fuera y dentro de la plataforma.",
      img: "/img/blog/cuidado.jpg",
      date: "2025-07-02",
      tag: "Seguridad",
      link: "https://www.youtube.com/watch?v=dY5KJXYtO6c" // link
    }
  ];

  return (
    <div className="container mt-3">
      <h2 className="section-title">Blog</h2>
      <div className="row g-3">
        {posts.map(p => (
          <div key={p.id} className="col-12 col-md-6">
            <article className="card h-100 bg-dark text-light border-secondary">
              {p.img && (
                <a href={p.link} target="_blank" rel="noreferrer">
                  <img
                    src={p.img}
                    alt={p.title}
                    style={{height:220, objectFit:"cover"}}
                    className="card-img-top"
                    onError={(e)=>{e.currentTarget.style.display='none';}}
                  />
                </a>
              )}
              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge" style={{background:"rgba(34,197,94,.15)", color:"var(--brand)"}}>{p.tag}</span>
                  <small className="text-light-emphasis">{new Date(p.date).toLocaleDateString()}</small>
                </div>
                <h5 className="card-title">{p.title}</h5>
                <p className="text-light-emphasis flex-grow-1">{p.excerpt}</p>
                <a href={p.link} target="_blank" rel="noreferrer" className="btn btn-outline-success btn-sm mt-auto">
                  Ver video en YouTube
                </a>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
}
