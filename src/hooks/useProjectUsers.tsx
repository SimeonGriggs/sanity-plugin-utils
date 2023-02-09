import {useState, useEffect} from 'react'
import {useClient, useWorkspace} from 'sanity'

export type UserExtended = {
  createdAt: string
  displayName: string
  email: string
  familyName: string
  givenName: string
  id: string
  imageUrl: string
  isCurrentUser: boolean
  middleName: string
  projectId: string
  provider: string
  sanityUserId: string
  updatedAt: string
}

type UserRole = {
  name: string
  title: string
}

type UserResponse = {
  isRobot: boolean
  projectUserId: string
  roles: UserRole[]
}

type HookConfig = {
  apiVersion?: string
}

// Custom hook to fetch user details
// Built-in hook doesn't fetch all user details
export function useProjectUsers({apiVersion}: HookConfig): UserExtended[] {
  const {currentUser} = useWorkspace()
  const client = useClient({apiVersion: apiVersion ?? '2023-01-01'})
  const [users, setUsers] = useState([])

  useEffect(() => {
    const {projectId} = client.config()

    async function getUser(id: string) {
      const userDetails = await client.request({
        url: `/projects/${projectId}/users/${id}`,
      })

      return userDetails
    }

    async function getUsersWithRoles() {
      const userRoles = await client
        .request({
          url: `/projects/${projectId}/acl`,
        })
        .then(async (res) =>
          Promise.all(
            res.map(async (user: UserResponse) => ({
              isCurrentUser: user.projectUserId === currentUser?.id,
              ...(await getUser(user.projectUserId)),
            }))
          )
        )
        .catch((err) => err)

      setUsers(userRoles)
    }

    if (!users.length) {
      getUsersWithRoles()
    }
  }, [client, currentUser?.id, users.length])

  return users
}
