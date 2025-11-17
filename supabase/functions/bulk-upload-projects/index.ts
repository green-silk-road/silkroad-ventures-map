import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProjectData {
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  type: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Project data from the CSV
    const projects: ProjectData[] = [
      {
        name: "Another School is Possible",
        latitude: 37.070160,
        longitude: 27.35767,
        description: "alternative education movement",
        type: "social enterprise"
      },
      {
        name: "Earthist",
        latitude: 38.423733,
        longitude: 27.142826,
        description: "Hemp value chain community",
        type: "social enterprise"
      },
      {
        name: "Bread Houses Network",
        latitude: 42.702179,
        longitude: 23.333359,
        description: "creates and unites centers for community-building, creativity, and social entrepreneurship with the mission to inspire through collective bread-making",
        type: "social enterprise"
      },
      {
        name: "Keystone Foundation",
        latitude: 11.430735,
        longitude: 76.8569853,
        description: "program areas include: livelihoods, conservation, organic market development, environmental governance, training and information",
        type: "social enterprise"
      },
      {
        name: "Just Change",
        latitude: 11.505573,
        longitude: 76.4946414,
        description: "Producer-Consumer coop with innovative stakeholder governance model",
        type: "social enterprise"
      },
      {
        name: "Sristi Village",
        latitude: 12.072053,
        longitude: 79.6298409,
        description: "working with individuals who have intellectual and developmental disabilities",
        type: "social enterprise"
      },
      {
        name: "Puvidham",
        latitude: 12.0887125,
        longitude: 78.046902,
        description: "School that champions localisation and integrates it in all aspects of their work",
        type: "school"
      },
      {
        name: "Marudam",
        latitude: 12.2094503,
        longitude: 79.0248104,
        description: "education at Marudam Farm School will help to bring about sensitive and intelligent human beings. Children will discover not only their interests and passions, but also nurture skills in both academic and non-academic areas that will help them meet any life challenges. We care for the land and use it as a rich educational resource, integral to the learning process.",
        type: "school"
      },
      {
        name: "reStore / OFM",
        latitude: 12.9674536,
        longitude: 80.2547327,
        description: "reStore works with small and marginal farmers as well as other rural producers to support their livelihoods. We operate a not-for profit shop where we sell 100% organic foods sourced directly from farmers. Organic verification is done by means of personal visits to see their farms and understand their work, and price-setting is by mutual consent.",
        type: "social enterprise"
      },
      {
        name: "Raddis cotton",
        latitude: 14.4486919,
        longitude: 78.8241272,
        description: "circular, climate neutral cotton cooperative",
        type: "social enterprise"
      },
      {
        name: "DDS - Disha",
        latitude: 17.4453544,
        longitude: 78.4600139,
        description: "Deccan Development Society partnered with a consumer group called Disha to build a healthy, local food brand and retail chain",
        type: "social enterprise"
      },
      {
        name: "Siddarth Ecovillage",
        latitude: 18.939272,
        longitude: 83.0117942,
        description: "Ecovillage in Orissa. We at Siddharth Village are committed to raising awareness on India's indigenous population as well as working towards achieving ecological balance and individual and community empowerment",
        type: "ecovillage"
      },
      {
        name: "Gender Lab",
        latitude: 19.253,
        longitude: 72.8559132,
        description: "learning about gender bias and breaking stereotypes",
        type: "social enterprise"
      },
      {
        name: "SEWA Trade Facilitation Centre",
        latitude: 23.0257292,
        longitude: 72.6116115,
        description: "artisans are the producers, owners and managers of STFC that reaches global market by coordination of design, production, and marketing of traditional embroidery.",
        type: "social enterprise"
      }
    ]

    // Insert all projects with the current user's ID
    const locationsToInsert = projects.map(project => ({
      ...project,
      user_id: user.id
    }))

    const { data, error } = await supabaseClient
      .from('locations')
      .insert(locationsToInsert)
      .select()

    if (error) throw error

    return new Response(
      JSON.stringify({ 
        success: true, 
        count: data.length,
        message: `Successfully uploaded ${data.length} projects` 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
