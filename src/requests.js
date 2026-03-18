const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('anecdote service not available due to problems in server')
  }

  return response.json()
}

export const createAnecdote = async (newAnecdote) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newAnecdote)
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error)
  }

  return data
}

export const updateAnecdote = async (updatedAnecdote) => {
  const response = await fetch(`${baseUrl}/${updatedAnecdote.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedAnecdote)
  })

  if (!response.ok) {
    throw new Error('Failed to update anecdote')
  }

  return response.json()
}