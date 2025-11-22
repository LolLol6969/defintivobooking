# Setup Automatico Google Calendar - Google Apps Script

**Non richiede Google Cloud, niente script SQL, niente configurazioni complicate.**

## Come Funziona
1. Crei un Google Apps Script (gratuito)
2. Lo script espone un webhook pubblico
3. Quando un cliente prenota, automaticamente viene creato un evento nel TUO Google Calendar
4. Tutto pronto in 5 minuti!

## Step 1: Creare il Google Apps Script

1. Vai su [script.google.com](https://script.google.com)
2. Clicca **+ Nuovo progetto**
3. Dai un nome: "Definitivio Booking to Calendar"
4. Elimina il codice di default e incolla questo:

\`\`\`javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Ottieni il calendario primario
    const calendar = CalendarApp.getDefaultCalendar();
    
    // Converti le date
    const checkIn = new Date(data.check_in_date);
    const checkOut = new Date(data.check_out_date);
    
    // Crea l'evento
    const event = calendar.createEvent(
      `${data.full_name} - ${data.suite_name}`,
      checkIn,
      checkOut,
      {
        description: `
Suite: ${data.suite_name}
Nome: ${data.full_name}
Email: ${data.email}
Telefono: ${data.phone || 'N/A'}
Ospiti: ${data.num_guests}
Note: ${data.message || 'Nessuna'}
Booking ID: ${data.booking_id}
        `,
        guests: data.email
      }
    );
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      eventId: event.getId()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
\`\`\`

## Step 2: Deploy dello Script

1. Clicca **Deploy** (pulsante in alto)
2. Seleziona **Nuova distribuzione**
3. Tipo: **Web app**
4. Eseguire come: **Il tuo account Gmail**
5. Accesso concesso a: **Chiunque**
6. Clicca **Deploy**
7. Copia l'URL del webhook (qualcosa come `https://script.google.com/macros/d/...`)

## Step 3: Aggiungere il Webhook al Progetto

Nel tuo progetto Vercel, aggiungi la variabile d'ambiente:

**Nome:** `NEXT_PUBLIC_MAKE_WEBHOOK_URL`
**Valore:** L'URL che hai copiato dallo script

## Fatto! 🎉

Ora quando un cliente prenota:
1. La prenotazione viene salvata su Supabase
2. Un evento viene automaticamente creato nel TUO Google Calendar
3. Il cliente riceve una notifica sul suo Google Calendar (se hai usato il suo email)

## Troubleshooting

**L'evento non appare?**
- Verifica che il webhook URL sia corretto nella variabile d'ambiente
- Controlla la console del browser per eventuali errori
- Nel Google Apps Script, vai a **Execution** per vedere i log

**Errore di permessi?**
- Assicurati di aver fatto deploy come "Chiunque"
- Il tipo di distribuzione deve essere "Web app"
