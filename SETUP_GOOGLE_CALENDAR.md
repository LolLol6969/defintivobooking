# Google Calendar Integration Setup

Questa guida spiega come configurare Google Calendar per sincronizzare automaticamente le prenotazioni.

## Opzione 1: Google Service Account (Consigliata)

### Step 1: Crea un Google Cloud Project
1. Vai a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuovo progetto
3. Abilita l'API "Google Calendar API":
   - Vai a "APIs & Services" → "Library"
   - Cerca "Calendar API"
   - Clicca e abilita

### Step 2: Crea un Service Account
1. Vai a "APIs & Services" → "Credentials"
2. Clicca "Create Credentials" → "Service Account"
3. Compila il modulo con i dati del tuo progetto
4. Assegna il ruolo "Editor" (o un ruolo personalizzato con accesso al Calendar API)
5. Crea una chiave JSON:
   - Nel "Service Account" creato, vai alla scheda "Keys"
   - Clicca "Add Key" → "Create new key" → "JSON"
   - Scarica il file JSON

### Step 3: Condividi il calendario con il Service Account
1. Apri il tuo Google Calendar
2. Trova l'email del service account nel file JSON scaricato (campo `client_email`)
3. Condividi il calendario con questa email, assegnando permessi di modifica

### Step 4: Aggiungi le variabili d'ambiente
Nel tuo progetto Vercel, aggiungi queste variabili nella sezione "Settings" → "Environment Variables":

\`\`\`
GOOGLE_CLOUD_PROJECT_ID=<project_id dal file JSON>
GOOGLE_PRIVATE_KEY_ID=<private_key_id dal file JSON>
GOOGLE_PRIVATE_KEY=<private_key dal file JSON - include i \n per le nuove righe>
GOOGLE_CLIENT_EMAIL=<client_email dal file JSON>
GOOGLE_CLIENT_ID=<client_id dal file JSON>
GOOGLE_CALENDAR_ID=primary
\`\`\`

**Nota:** La `private_key` contiene `\n` letterali - sostituiscili con newline reali quando la incollate.

### Step 5: Testa l'integrazione
Crea una nuova prenotazione dalla pagina "Prenota" e controlla se l'evento appare nel tuo Google Calendar.

## Opzione 2: OAuth 2.0 (Alternative)

Se preferisci un approccio OAuth:
1. Crea un OAuth 2.0 "Web Application" credential
2. Autorizza l'utente per accedere al suo calendar personale
3. Usa i token di accesso/refresh per sincronizzare

Questa opzione richiede un flusso di autenticazione più complesso.

## Disabilitare la sincronizzazione temporaneamente

Se desideri testare senza Google Calendar, commenta la funzione `syncBookingToGoogleCalendar` in `/lib/supabase/actions.ts`.

## Troubleshooting

- **"Unauthorized"**: Verifica che le credenziali siano corrette e che il service account abbia accesso al calendario
- **"Invalid private key"**: Assicurati che la `GOOGLE_PRIVATE_KEY` includa le newline corrette
- **Nessun evento su Google Calendar**: Verifica che il calendario sia condiviso con il service account email
