# sanity-plugin-utils

## Installation

```
npm install --save sanity-plugin-utils
```

or

```
yarn add sanity-plugin-utils
```

## Usage

Handy hooks and clever components for Sanity Studio v3

### useListeningQuery()

Sanity's real-time APIs power excellent editorial experiences. Your plugins should respond to other users collaborating on documents in real time. This hook is a convenient way to perform a GROQ query that responds to changes, along with built-in `loading` and `error` states.

The `data` variable will be constantly updated as changes are made to the data returned by your query. You can also pass in initial data so that it is set in the first render.

```jsx
import {useListeningQuery} from 'sanity-plugin-utils'

export default function DocumentList() {
  const {data, loading, error} = useListeningQuery(`*[_type == $type]`, {
    params: {type: 'product'},
    initialData: [],
  })

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return <Feedback tone="critical">{error}</Feedback>
  }

  return (
    <Stack>
      {data?.length > 0 ? (
        data.map((doc) => <Card key={doc._id}>{doc.title}</Card>)
      ) : (
        <Feedback>No documents found</Feedback>
      )}
    </Stack>
  )
}
```

### useProjectUsers()

Hook for getting extended details on all Users in the project. Such as name.

```jsx
import {useProjectUsers} from 'sanity-plugin-utils'

export default function DocumentList() {
  const users = useProjectUsers()

  return (
    <Stack>
      {users?.length > 0 ? (
        users.map((user) => <Profile key={user.id} {...user}>)
      ) : (
        <Spinner>
      )}
    </Stack>
  )
}
```

### <Feedback />

Component for consistently displaying feedback in a card with a title, text and an icon.

```jsx
import {Feedback} from 'sanity-plugin-utils'
```

### <UserSelectMenu />

A Menu component for searching and interacting with users. Requires Users to be passed into the component. Will return an array of user `id`s.

```jsx
import {UserSelectMenu} from 'sanity-plugin-utils'
```

## License

MIT © Simeon Griggs
See LICENSE
