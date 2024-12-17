import {Box, Card, CardTone, Flex, Stack, Text} from '@sanity/ui'
import type {ReactNode} from 'react'

type FeedbackChildren = {
  children?: ReactNode
  title?: never
  description?: never
}

type FeedbackTextProps = {
  title?: string
  description?: ReactNode
  children?: never
}

type FeedbackProps = (FeedbackChildren | FeedbackTextProps) & {
  tone?: CardTone
  icon?: ReactNode
}

const DEFAULT_PROPS: FeedbackProps = {
  tone: 'primary',
}

export function Feedback(props: FeedbackProps) {
  const {title, description, icon, tone, children} = {
    ...DEFAULT_PROPS,
    ...props,
  }

  return (
    <Card tone={tone} padding={4} radius={3} border>
      <Flex>
        {icon ? `display icon` : null}
        {children ? (
          children
        ) : (
          <Box flex={1}>
            <Stack space={4}>
              {title ? <Text weight="semibold">{title}</Text> : null}
              {description ? <Text size={2}>{description}</Text> : null}
            </Stack>
          </Box>
        )}
      </Flex>
    </Card>
  )
}
