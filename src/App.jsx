import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from './requests'
import Notification from './Notification'
import { useNotificationDispatch } from './NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()

  const showNotification = (message) => {
    notificationDispatch({
      type: 'SHOW_NOTIFICATION',
      payload: message
    })

    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR_NOTIFICATION' })
    }, 5000)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  })

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (returnedAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      showNotification(`you added '${returnedAnecdote.content}'`)
    },
    onError: (error) => {
      showNotification(error.message)
    }
  })

  const voteAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (returnedAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      showNotification(`you voted '${returnedAnecdote.content}'`)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()

    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    newAnecdoteMutation.mutate({
      content,
      votes: 0
    })
  }

  const handleVote = (anecdote) => {
    voteAnecdoteMutation.mutate({
      ...anecdote,
      votes: anecdote.votes + 1
    })
  }

  if (result.isPending) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />

      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>

      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes} votes
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App