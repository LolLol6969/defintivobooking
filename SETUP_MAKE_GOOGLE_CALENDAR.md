# Setup Automatico Google Calendar con Make.com

## Passo 1: Crea un account Make.com
1. Vai su [make.com](https://www.make.com)
2. Registrati (è gratuito)

## Passo 2: Crea uno Scenario Make.com
1. Clicca "Create a new scenario"
2. Aggiungi un trigger "Webhooks" - "Catch a hook"
3. Copia il webhook URL generato (es: `https://hook.make.com/abcdef123456`)

## Passo 3: Aggiungi il Webhook a Vercel
1. Vai su https://vercel.com/dashboard
2. Seleziona il tuo progetto
3. Settings → Environment Variables
4. Aggiungi: `NEXT_PUBLIC_MAKE_WEBHOOK_URL` = `https://hook.make.com/abcdef123456`
5. Rideploy il progetto

## Passo 4: Collega Google Calendar a Make.com
1. Nel tuo scenario Make.com, aggiungi un'azione "Google Calendar" - "Create an event"
2. Autenticati con il tuo account Google (NON serve Google Cloud!)
3. Configura i campi:
   - **Calendar**: "primary" (il tuo calendario principale)
   - **Event name**: `{suite_name} - {full_name}`
   - **Description**: Include email, phone, num_guests, message
   - **Start time**: `{check_in_date}`
   - **End time**: `{check_out_date}`
   - **Attendees**: `{email}` (email del cliente)
   - **Notifications**: Abilita reminder

## Passo 5: Testa
1. Vai a `/prenota` e crea una prenotazione di test
2. Controlla il tuo Google Calendar - l'evento dovrebbe apparire automaticamente!

## Note
- Il webhook viene chiamato automaticamente quando un cliente prenota
- Se Make.com è offline, la prenotazione viene comunque salvata
- Puoi modificare il scenario Make.com in qualsiasi momento senza cambiare il codice

---

Per saperne di più su Make.com: https://www.make.com/en/help
