import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { quote } = await req.json()

    // Configuration email (utilise Resend)
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured')
    }

    // Préparer le contenu de l'email
    const emailContent = `
      <h2>🏠 Nouvelle demande de devis - ContainerHomes</h2>
      
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>📋 Détails du devis</h3>
        <p><strong>ID:</strong> #D${quote.id.slice(0, 8)}</p>
        <p><strong>Date:</strong> ${new Date(quote.created_at).toLocaleDateString('fr-FR')}</p>
        <p><strong>Client:</strong> ${quote.user_email || 'Email non disponible'}</p>
        <p><strong>Montant estimé:</strong> ${Math.round(quote.total_price / 100).toLocaleString('fr-FR')}€</p>
      </div>

      <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>🏡 Produit demandé</h3>
        <p><strong>Maison:</strong> ${quote.house_name || 'Modèle non spécifié'}</p>
        <p><strong>Couleur:</strong> ${quote.color_name || 'Standard'}</p>
        <p><strong>Taille:</strong> ${quote.size_name || 'Standard'}</p>
        ${quote.customizations && quote.customizations.length > 0 ? 
          `<p><strong>Options:</strong> ${quote.customizations.join(', ')}</p>` : 
          ''
        }
      </div>

      ${quote.message ? `
        <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>💬 Message du client</h3>
          <p style="font-style: italic;">"${quote.message}"</p>
        </div>
      ` : ''}

      <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>⚡ Actions à effectuer</h3>
        <p>1. Connectez-vous au <a href="${Deno.env.get('SITE_URL') || 'http://localhost:5173'}/admin">panel admin</a></p>
        <p>2. Consultez la section "Devis" pour plus de détails</p>
        <p>3. Contactez le client pour finaliser la demande</p>
      </div>

      <hr style="margin: 30px 0;">
      <p style="color: #666; font-size: 12px;">
        Email automatique envoyé par ContainerHomes<br>
        Pour gérer ce devis, rendez-vous sur votre panel d'administration.
      </p>
    `

    // Envoyer l'email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ContainerHomes <noreply@containerhomes.fr>',
        to: ['unicold.info@gmail.com'],
        subject: `🏠 Nouveau devis #D${quote.id.slice(0, 8)} - ${Math.round(quote.total_price / 100).toLocaleString('fr-FR')}€`,
        html: emailContent,
      }),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      throw new Error(`Resend API error: ${errorText}`)
    }

    const emailResult = await emailResponse.json()
    console.log('✅ Email envoyé:', emailResult)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email de notification envoyé',
        emailId: emailResult.id 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('❌ Erreur envoi email:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})