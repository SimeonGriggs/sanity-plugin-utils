import {useEffect, useState} from 'react'
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

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

// Custom hook to fetch user details and roles in batches
export function useProjectUsers({apiVersion}: HookConfig): UserExtended[] {
  const {currentUser} = useWorkspace()
  const client = useClient({apiVersion: apiVersion ?? '2023-01-01'})
  const [users, setUsers] = useState<UserExtended[]>([])

  useEffect(() => {
    const {projectId} = client.config()

    async function getUsersWithRoles() {
      try {
        const aclData = await client.request({
          url: `/projects/${projectId}/acl`,
        })

        const userIds = aclData.map((user: UserResponse) => user.projectUserId)

        const userIdChunks = chunkArray(userIds, 200)

        let usersData: UserExtended[] = []

        // Fetch users in batches of 200
        for (const chunk of userIdChunks) {
          const chunkedUserIds = chunk.join(',')
          const response = await client.request({
            url: `/projects/${projectId}/users/${chunkedUserIds}`,
          })
          usersData = [...usersData, ...response]
        }

        // Combine user details with roles
        const usersWithRoles = usersData.map((user: UserExtended) => {
          const userRoles =
            aclData.find(
              (aclUser: UserResponse) => aclUser.projectUserId === user.id
            )?.roles || []

          return {
            ...user,
            isCurrentUser: user.id === currentUser?.id,
            roles: userRoles,
          }
        })

        setUsers(usersWithRoles)
      } catch (err) {
        console.error('Failed to fetch users:', err)
      }
    }

    if (!users.length) {
      getUsersWithRoles()
    }
  }, [client, currentUser?.id, users.length])

  return users
}
