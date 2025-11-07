"use client";

import { useMemo, useState } from "react";
import PersonForm from "@/components/PersonForm";
import CardForm from "@/components/CardForm";

export default function Page() {
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);

  return (
    <div className="grid">
      <div>
        <PersonForm selectedPersonId={selectedPersonId} onSelect={setSelectedPersonId} />
      </div>
      <div>
        <CardForm selectedPersonId={selectedPersonId} />
        <div style={{ marginTop: 16 }} className="notice">
          Download an ICS for each card to add monthly reminders to your calendar.
        </div>
      </div>
    </div>
  );
}
