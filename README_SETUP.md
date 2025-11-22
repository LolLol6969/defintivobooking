# Guida Configurazione Sistema Prenotazioni

Questo progetto integra un sistema di prenotazioni con sincronizzazione a Google Calendar.

## Prerequisiti

1. **Database Supabase**: Deve essere già configurato (verificare che le env vars siano presenti)
2. **Google Calendar** (opzionale): Per sincronizzare automaticamente le prenotazioni

## Step di Setup

### 1. Database Supabase

Esegui il file SQL di migrazione:
- File: `scripts/01-create-bookings-table.sql`
- Vedi il file `MIGRATION_SETUP.md` per le istruzioni complete

### 2. Google Calendar (Opzionale)

Se vuoi sincronizzare le prenotazioni a Google Calendar:
- Vedi il file `SETUP_GOOGLE_CALENDAR.md` per le istruzioni complete
- Aggiungi le variabili d'ambiente necessarie

### 3. Variabili d'Ambiente Richieste

Nel tuo progetto Vercel, assicurati di avere:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_key>
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
\`\`\`

### 4. Variabili d'Ambiente Opzionali (Google Calendar)

\`\`\`
GOOGLE_CLOUD_PROJECT_ID=...
GOOGLE_PRIVATE_KEY_ID=...
GOOGLE_PRIVATE_KEY=...
GOOGLE_CLIENT_EMAIL=...
GOOGLE_CLIENT_ID=...
GOOGLE_CALENDAR_ID=primary
NEXT_PUBLIC_APP_URL=<your_app_url>
\`\`\`

## Funzionalità

### Pagina Prenota (`/prenota`)
- Form per creare nuove prenotazioni
- Validazione delle date (check-out > check-in)
- Sincronizzazione automatica a Google Calendar (se configurato)

### Calendario Admin (`/calendar`)
- Visualizza tutte le prenotazioni in formato calendario
- Protetto da password: `orla2025`
- Mostra dettagli completi di ogni prenotazione
- Lista laterale con prenotazioni prossime

### API Endpoint
- `POST /api/google-calendar/sync`: Sincronizza una prenotazione a Google Calendar

## Testing

1. Vai a `/prenota`
2. Compila il form e invia
3. Se tutto è configurato, la prenotazione apparirà in:
   - Database Supabase (tabella `bookings`)
   - Google Calendar (se configurato)
   - Pagina Calendario (`/calendar`)

## Troubleshooting

- **Prenotazione non salvata**: Controlla che Supabase sia connesso e il database sia inizializzato
- **Google Calendar non sincronizzato**: Controlla le variabili d'ambiente e i permessi del service account
- **Calendario non carica**: Inserisci la password corretta (default: orla2025)

---

Per domande o problemi, consulta i file di setup specifici.
