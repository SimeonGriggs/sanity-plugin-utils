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
    params: {type: 'pet'},
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
        data.map((pet) => <Card key={pet._id}>{pet.title}</Card>)
      ) : (
        <Feedback>No Pets found</Feedback>
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

### Feedback

Component for consistently displaying feedback in a card with a title, text and an icon.

```jsx
import {Feedback, useListeningQuery} from 'sanity-plugin-utils'

export default function DocumentList() {
  const {data, loading, error} = useListeningQuery(`*[_type == "task" && !complete]`)

  if (loading) {
    return <Feedback tone="primary" title="Please hold" description="Fetching tasks..." />
  }

  if (error) {
    return (
      <Feedback tone="critical" title="There was an error" description="Please try again later" />
    )
  }

  return data?.length > 0 ? (
    <Feedback tone="caution" title="There are unfinished tasks" description="Please get to work" />
  ) : (
    <Feedback tone="success" title="You're all done" description="You should feel accomplished" />
  )
}
```

### Table, Row and Cell

These components are all @sanity/ui Card's but with their HTML DOM elements and CSS updated to output and behave like tables.

```jsx
import {Table, Row, Cell} from 'sanity-plugin-utils'

export default function Report(documents) {
  return (
    <Table>
      <thead>
        <Row>
          <Cell>
            <Text>Name</Text>
          </Cell>
          <Cell>
            <Text>Price</Text>
          </Cell>
        </Row>
      </thead>
      <tbody>
        {documents.map((doc) => (
          <Row key={doc._id}>
            <Cell>
              <Text>{doc.title}</Text>
            </Cell>
            <Cell tone={doc.inStock ? `caution` : `primary`}>
              <Text>{doc.price}</Text>
            </Cell>
          </Row>
        ))}
      </tbody>
    </Table>
  )
}
```

### UserSelectMenu

A Menu component for searching and interacting with users. Requires Users to be passed into the component. Will return an array of user `id`s.

```jsx
import {UserSelectMenu} from 'sanity-plugin-utils'

// TODO: Example
```

## License

MIT © Simeon Griggs
See LICENSE
