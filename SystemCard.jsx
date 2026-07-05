export default function SystemCard({ system, onOpen }) {
  return (
    <article className="systemCard" onClick={() => onOpen(system.id)}>
      <div>
        <div className="systemIcon">{system.icon}</div>
        <p className="cardMeta">{system.subtitle}</p>
        <h3>{system.title}</h3>
        <p>{system.description}</p>
      </div>

      <div className="cardFooter">
        <span>{system.equipmentCount} equipment groups</span>
        <button>Open →</button>
      </div>
    </article>
  )
}
