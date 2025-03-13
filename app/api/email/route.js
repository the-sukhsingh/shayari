import * as emailjs from '@emailjs/nodejs';

// Helper function to add CORS headers
function corsHeaders(origin) {
    // Get allowed origins from environment variable or use a default value
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
        ? process.env.ALLOWED_ORIGINS.split(',') 
        : ['*']; // Default to all origins if not specified
    
    // Check if the origin is allowed or if we're allowing all origins
    const isAllowed = allowedOrigins.includes('*') || 
                      (origin && allowedOrigins.includes(origin));
    
    return {
        'Access-Control-Allow-Origin': isAllowed ? origin || '*' : null,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400', // 24 hours
    };
}

// Handle OPTIONS requests (preflight)
export async function OPTIONS(request) {
    const origin = request.headers.get('origin');
    
    return new Response(null, {
        status: 204, // No content
        headers: corsHeaders(origin)
    });
}

export async function POST(request) {
    const origin = request.headers.get('origin');
    
    try {
        const CONFIG = {
            SERVICE_ID: process.env.SERVICE_ID,
            TEMPLATE_ID: process.env.TEMPLATE_ID,
            PUBLIC_KEY: process.env.PUBLIC_KEY,
            PRIVATE_KEY: process.env.PRIVATE_KEY
        };

        // Initialize EmailJS with both keys
        emailjs.init({
            publicKey: CONFIG.PUBLIC_KEY,
            privateKey: CONFIG.PRIVATE_KEY
        });

        const data = await request.json();
        const forwarded = request.headers.get("x-forwarded-for");
        const ip = forwarded ? forwarded.split(/, /)[0] : request.headers.get("x-real-ip");

        const visitsString = Array.isArray(data.visits)
            ? data.visits.map(v =>
            `Date: ${new Date(v.date).toLocaleString()}\nCount: ${v.count}\nTimes: ${v.times.join(', ')}`
              ).join('\n\n')
            : 'Unknown';

        const templateParams = {
            username: data.username || 'Unknown',
            ip: ip || 'Unknown',
            userAgent: data.userAgent || 'Unknown',
            referrer: data.referrer || 'Unknown',
            visits: visitsString,
            time: data.time || new Date().toLocaleString()
        };


        // Modified send call
        const result = await emailjs.send(
            CONFIG.SERVICE_ID,
            CONFIG.TEMPLATE_ID,
            templateParams
        );

        return new Response(JSON.stringify({ 
            success: true,
            message: 'Email sent successfully'
        }), {
            status: 200,
            headers: { 
                'Content-Type': 'application/json',
                ...corsHeaders(origin)
            }
        });

    } catch (error) {
        console.error('Mail API Error:', error);
        return new Response(JSON.stringify({ 
            error: 'Failed to send email', 
            details: error.message 
        }), {
            status: 500,
            headers: { 
                'Content-Type': 'application/json',
                ...corsHeaders(origin)
            }
        });
    }
}
