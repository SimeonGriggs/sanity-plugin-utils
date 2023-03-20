import React, {useRef} from 'react'
import {Box, Text, Menu, MenuItem, TextInput, Flex, Badge} from '@sanity/ui'
import {AddCircleIcon, RemoveCircleIcon, RestoreIcon} from '@sanity/icons'
import {UserAvatar} from 'sanity'

import {UserExtended} from '../../hooks/useProjectUsers'

function searchUsers(
  users: UserExtended[],
  searchString: string
): UserExtended[] {
  return users.filter((user) => {
    const displayName = (user.displayName || '').toLowerCase()
    if (displayName.startsWith(searchString)) return true
    const givenName = (user.givenName || '').toLowerCase()
    if (givenName.startsWith(searchString)) return true
    const middleName = (user.middleName || '').toLowerCase()
    if (middleName.startsWith(searchString)) return true
    const familyName = (user.familyName || '').toLowerCase()
    if (familyName.startsWith(searchString)) return true

    return false
  })
}

type Labels = {
  addMe?: string
  removeMe?: string
  clear?: string
  searchPlaceholder?: string
  notFound?: string
}

type UserSelectMenuProps = {
  value: string[]
  userList: UserExtended[]
  onAdd: (userId: string) => void
  onRemove: (userId: string) => void
  onClear: () => void
  labels?: Labels
  style?: React.CSSProperties
}

const LABELS: Labels = {
  addMe: 'Assign myself',
  removeMe: 'Unassign myself',
  clear: 'Clear assignees',
  searchPlaceholder: 'Search users',
  notFound: 'No users found',
}

export function UserSelectMenu(props: UserSelectMenuProps) {
  const {
    value = [],
    userList = [],
    onAdd,
    onRemove,
    onClear,
    style = {},
  } = props
  const labels = props?.labels ? {...LABELS, ...props.labels} : LABELS

  const [searchString, setSearchString] = React.useState('')
  const searchResults = searchUsers(userList || [], searchString)

  const me = userList.find((u) => u.isCurrentUser)
  const meAssigned = me && value.includes(me.id)

  // Focus input on open
  // TODO: Fix focus, it gets immediately taken away
  const input = useRef<HTMLInputElement>(null)
  // useEffect(() => {
  //   if (open && input?.current) {
  //     input.current.focus()
  //   }
  // }, [open])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value)
  }

  const handleSelect = (isChecked: boolean, user: UserExtended) => {
    if (!isChecked) {
      if (onAdd) onAdd(user.id)
    } else if (onRemove) onRemove(user.id)
  }

  const handleAssignMyself = () => {
    if (me && onAdd) onAdd(me.id)
  }

  const handleUnassignMyself = () => {
    if (me && onRemove) onRemove(me.id)
  }

  const handleClearAssigneesClick = () => {
    if (onClear) onClear()
  }

  return (
    <Menu style={style}>
      {meAssigned ? (
        <MenuItem
          tone="caution"
          disabled={!me}
          onClick={handleUnassignMyself}
          icon={RemoveCircleIcon}
          text={labels.removeMe}
        />
      ) : (
        <MenuItem
          tone="positive"
          onClick={handleAssignMyself}
          icon={AddCircleIcon}
          text={labels.addMe}
        />
      )}

      <MenuItem
        tone="critical"
        disabled={value.length === 0}
        onClick={handleClearAssigneesClick}
        icon={RestoreIcon}
        text={labels.clear}
      />

      <Box padding={1}>
        <TextInput
          ref={input}
          onChange={handleSearchChange}
          placeholder={labels.searchPlaceholder}
          value={searchString}
        />
      </Box>

      {searchString && searchResults?.length === 0 && (
        <MenuItem disabled text={labels.notFound} />
      )}

      {searchResults &&
        searchResults.map((user) => (
          <MenuItem
            key={user.id}
            pressed={value.includes(user.id)}
            onClick={() => handleSelect(value.indexOf(user.id) > -1, user)}
          >
            <Flex align="center">
              <UserAvatar user={user} size={1} />
              <Box paddingX={2} flex={1}>
                <Text>{user.displayName}</Text>
              </Box>
              {user.isCurrentUser && (
                <Badge fontSize={1} tone="positive" mode="outline">
                  Me
                </Badge>
              )}
            </Flex>
          </MenuItem>
        ))}
    </Menu>
  )
}
