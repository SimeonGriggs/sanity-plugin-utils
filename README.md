> This is a **Sanity Studio v3** plugin.

## Installation

```sh
npm install sanity-plugin-utils
```

# sanity-plugin-utils

Handy hooks and clever components for Sanity Studio v3.

## Installation

```
npm install --save sanity-plugin-utils
```

or

```
yarn add sanity-plugin-utils
```

## Usage

### `useListeningQuery()`

Sanity's real-time APIs power excellent editorial experiences. Your plugins should respond to other users collaborating on documents in real time. This hook is a convenient way to perform a GROQ query that responds to changes, along with built-in `loading` and `error` states.

The `data` variable will be constantly updated as changes are made to the data returned by your query. You can also pass in initial data so that it is set in the first render.

```tsx
import {useListeningQuery} from 'sanity-plugin-utils'

export default function DocumentList() {
  const {data, loading, error} = useListeningQuery<SanityDocument[]>(`*[_type == $type]`, {
    params: {type: 'pet'},
    initialValue: [],
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

### `useProjectUsers()`

Hook for getting extended details on all Users in the project. Such as name.

```tsx
import {useProjectUsers} from 'sanity-plugin-utils'

export default function DocumentList() {
  const users = useProjectUsers({apiVersion: `2023-01-01`})

  return (
    <Stack>
      {users?.length > 0 ? (
        users.map((user) => (
          <Profile key={user.id} {...user}>
        ))
      ) : (
        <Spinner>
      )}
    </Stack>
  )
}
```

### useOpenInNewPane()

Returns a function that will open a document in a new view pane, alongside the current view pane

```tsx
import {useOpenInNewPane} from 'sanity-plugin-utils'

export default function SidePetOpener(pet: SanityDocument) {
  const openInNewPane = useOpenInNewPane(pet._id, pet._type)

  return (
    <Button onClick={() => openInNewPane()}>
      {pet.title}
    </Button>
  )
}
```

### useImageUrlBuilder()

Returns an [image URL builder](https://www.sanity.io/docs/image-url) configured with the current workspace's Project ID and Dataset.

Useful if you have many images in the one component.

```tsx
import {useImageUrlBuilder} from 'sanity-plugin-utils'

export default function PetPics(pet: SanityDocument) {
  const builder = useImageUrlBuilder({apiVersion: `2023-01-01`})

  return (
    <ul>
      {pet.pics.map((pic) => (
        <li key={pic._key}>
          <img src={builder.source(pic).width(200).height(200).url()} alt={pic.altText} />
        </li>
      ))}
    </ul>
  )
}
```

### useImageUrlBuilderImage()

As above, but pre-configured with an image source. 

Useful if you only have one image in your component.

```tsx
import {useImageUrlBuilderImage} from 'sanity-plugin-utils'

export default function PetPic(pet: SanityDocument) {
  const image = useImageUrlBuilderImage(pet.image, {apiVersion: `2023-01-01`})

  return <img src={image.width(200).height(200).url()} alt={pet.name} />
}
```

### Feedback

Component for consistently displaying feedback in a card with a title, text and an icon.

```tsx
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

### `Table`, `Row` and `Cell`

These components are all `@sanity/ui` `Card`'s but with their HTML DOM elements and CSS updated to output and behave like tables.

```tsx
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

### `UserSelectMenu`

A Menu component for searching and interacting with users. Requires Users to be passed into the component. 

```tsx
import {UserSelectMenu} from 'sanity-plugin-utils'

export default function Report() {
  const users = useProjectUsers({apiVersion: `2023-01-01`})
  const [selectedUsers, setSelectedUsers] = useState([])
  
  return (
    <UserSelectMenu
      userList={users}
      value={selectedUsers}
      onAdd={(id) => selectedUsers((current) => [...current, id])}
      onRemove={(id) => setSelectedUsers((current) => current.filter((id) => id !== id))}
      onClear={() => setSelectedUsers([])}
    >
  )
}
```

## License

MIT © Simeon Griggs
See LICENSE

## License

[MIT](LICENSE) © Simeon Griggs

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.

### Release new version

Run ["CI & Release" workflow](https://github.com/SimeonGriggs/sanity-plugin-utils/actions/workflows/main.yml).
Make sure to select the main branch and check "Release new version".

Semantic release will only release on configured branches, so it is safe to run release on any branch.
