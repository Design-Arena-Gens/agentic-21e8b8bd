"use client";

import { useEffect, useMemo, useState } from "react";
import { Person } from "@/lib/types";
import { loadPersons, savePersons } from "@/lib/storage";
import { v4 as uuidv4 } from "uuid";

export default function PersonForm(props: {
  selectedPersonId?: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [persons, setPersons] = useState<Person[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setPersons(loadPersons());
  }, []);

  useEffect(() => {
    savePersons(persons);
    if (persons.length && !props.selectedPersonId) {
      props.onSelect(persons[0].id);
    }
  }, [persons]);

  function addPerson() {
    if (!name.trim()) return;
    const p: Person = { id: uuidv4(), name: name.trim(), email: email.trim() || undefined };
    setPersons([p, ...persons]);
    setName("");
    setEmail("");
  }

  function removePerson(id: string) {
    const next = persons.filter((p) => p.id !== id);
    setPersons(next);
    if (props.selectedPersonId === id) props.onSelect(next[0]?.id ?? null);
  }

  return (
    <div className="card">
      <h2 className="section-title">People</h2>
      <div className="row">
        <div>
          <label className="label">Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Alice" />
        </div>
        <div>
          <label className="label">Email (optional)</label>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <button className="button" onClick={addPerson}>Add person</button>
      </div>

      <div style={{ marginTop: 16 }} className="list">
        {persons.length === 0 && <div className="notice">No people yet. Add someone above.</div>}
        {persons.map((p) => (
          <div key={p.id} className="item">
            <div>
              <div style={{ fontWeight: 600 }}>{p.name}</div>
              {p.email && <div style={{ color: "#64748b", fontSize: 13 }}>{p.email}</div>}
            </div>
            <div className="actions">
              <button className="button secondary" onClick={() => props.onSelect(p.id)}>{props.selectedPersonId === p.id ? "Selected" : "Select"}</button>
              <button className="button link" onClick={() => removePerson(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
