import { supabase } from '$lib/supabaseClient'
import type { PageServerLoad } from './$types'

type Instrument = {
  id: number
  name: string
}

export const load: PageServerLoad = async () => {
  const { data, error } = await supabase.from('jobs').select<'*', Instrument>()

  if (error) {
    console.error('Error loading instruments:', error.message)
    return { instruments: [], error: error.message }
  }

  console.log("instruments: ", {instruments: data ?? []})
  return {
    instruments: data ?? [],
    error: null,
  }
}