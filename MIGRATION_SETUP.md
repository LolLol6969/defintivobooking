# Setup Database Tables

Le prenotazioni vengono salvate su Supabase. Segui questi step per configurare il database:

## Step 1: Esegui la migrazione SQL

1. Nel tuo progetto Vercel, accedi alla sezione "Integrations" e seleziona Supabase
2. Vai al Supabase Dashboard → "SQL Editor"
3. Copia il contenuto di `scripts/01-create-bookings-table.sql`
4. Incollalo nell'SQL Editor di Supabase
5. Esegui la query

## Step 2: Verifica che la tabella sia creata

Nel SQL Editor, esegui:
\`\`\`sql
SELECT * FROM bookings LIMIT 1;
\`\`\`

Se la query restituisce un errore con `"relation "bookings" does not exist"`, significa che la migrazione non è stata eseguita correttamente.

## Step 3: Configura Row Level Security (RLS)

Le policy RLS sono già configurate nello script SQL per permettere a chiunque di:
- Inserire nuove prenotazioni (pubblica)
- Leggere tutte le prenotazioni (pubblica)

Se desideri cambiare i permessi, modifica il file SQL e re-esegui la query.

## Troubleshooting

- **"Errore durante la prenotazione"**: Verifica che la tabella `bookings` sia stata creata
- **"permission denied"**: Assicurati che le policy RLS siano corrette
