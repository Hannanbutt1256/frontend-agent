import { supabase } from './supabase'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function submitJobToBackend({ jobId, datasetUrl, targetColumn }) {
  const response = await fetch(`${API_URL}/api/audit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      job_id: jobId,
      dataset_url: datasetUrl,
      target_column: targetColumn || undefined,
    }),
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(error.detail || `API error ${response.status}`)
  }
  return response.json()
}

export async function createJob({ userId, datasetUrl, targetColumn }) {
  const { data, error } = await supabase
    .from('jobs')
    .insert({
      user_id: userId,
      dataset_url: datasetUrl,
      target_column: targetColumn || null,
      status: 'running',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateJobStatus(jobId, { status, result, error_message }) {
  const { error } = await supabase
    .from('jobs')
    .update({ status, result: result || null, error_message: error_message || null, updated_at: new Date().toISOString() })
    .eq('id', jobId)
  if (error) throw error
}

export async function uploadDatasetFile(file, userId) {
  const ext = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`

  const { data, error } = await supabase.storage
    .from('datasets')
    .upload(fileName, file, { contentType: file.type, upsert: false })

  if (error) throw error

  const { data: urlData } = supabase.storage.from('datasets').getPublicUrl(data.path)
  return urlData.publicUrl
}
