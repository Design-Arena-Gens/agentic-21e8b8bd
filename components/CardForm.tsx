"use client";

import { useEffect, useMemo, useState } from "react";
import { CreditCard, Person } from "@/lib/types";
import { loadCards, saveCards, loadPersons } from "@/lib/storage";
import { buildMonthlyDueICS } from "@/lib/ics";
import { v4 as uuidv4 } from "uuid";

export default function CardForm(props: { selectedPersonId?: string | null }) {
  const personId = props.selectedPersonId ?? null;
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);

  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [last4, setLast4] = useState("");
  const [dueDay, setDueDay] = useState<number>(1);
  const [reminderDaysBefore, setReminderDaysBefore] = useState<number>(3);

  useEffect(() => { setCards(loadCards()); setPersons(loadPersons()); }, []);
  useEffect(() => { saveCards(cards); }, [cards]);

  const filtered = useMemo(() => cards.filter(c => c.personId === personId), [cards, personId]);

  function addCard() {
    if (!personId) return;
    if (!name.trim()) return;
    const c: CreditCard = {
      id: uuidv4(),
      personId,
      name: name.trim(),
      issuer: issuer.trim() || undefined,
      last4: last4.trim() || undefined,
      dueDay: Math.min(31, Math.max(1, Number(dueDay) || 1)),
      reminderDaysBefore: Math.max(0, Number(reminderDaysBefore) || 0),
    };
    setCards([c, ...cards]);
    setName(""); setIssuer(""); setLast4(""); setDueDay(1); setReminderDaysBefore(3);
  }

  function removeCard(id: string) {
    setCards(cards.filter(c => c.id !== id));
  }

  function downloadIcs(card: CreditCard) {
    const person = persons.find(p => p.id === card.personId) ?? { id: "p", name: "Person" } as Person;
    const ics = buildMonthlyDueICS(person, card, 12);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `card-${card.id}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="card">
      <h2 className="section-title">Cards {personId ? "for selected person" : "(select a person)"}</h2>
      <div className="row">
        <div>
          <label className="label">Card name</label>
          <input className="input" value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g., Sapphire Preferred" />
        </div>
        <div>
          <label className="label">Issuer (optional)</label>
          <input className="input" value={issuer} onChange={(e)=>setIssuer(e.target.value)} placeholder="e.g., Chase" />
        </div>
      </div>
      <div className="row" style={{ marginTop: 12 }}>
        <div>
          <label className="label">Last 4 (optional)</label>
          <input className="input" value={last4} onChange={(e)=>setLast4(e.target.value)} placeholder="1234" />
        </div>
        <div>
          <label className="label">Due day (1-31)</label>
          <input className="input" type="number" min={1} max={31} value={dueDay} onChange={(e)=>setDueDay(Number(e.target.value))} />
        </div>
      </div>
      <div className="row" style={{ marginTop: 12 }}>
        <div>
          <label className="label">Remind N days before</label>
          <input className="input" type="number" min={0} max={14} value={reminderDaysBefore} onChange={(e)=>setReminderDaysBefore(Number(e.target.value))} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button className="button" onClick={addCard} disabled={!personId}>Add card</button>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <table className="table">
          <thead>
            <tr>
              <th>Card</th>
              <th>Due day</th>
              <th>Reminder</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{c.name} {c.last4 ? <span className="badge">????{c.last4}</span> : null}</div>
                  <div style={{ color: "#64748b" }}>{c.issuer ?? ""}</div>
                </td>
                <td>{c.dueDay}</td>
                <td>{c.reminderDaysBefore} day(s) before</td>
                <td>
                  <button className="button secondary" onClick={() => downloadIcs(c)}>Download ICS</button>
                  <button className="button link" onClick={() => removeCard(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4}><div className="notice">No cards for this person yet.</div></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
