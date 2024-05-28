import {useEffect, useMemo, useRef, useState} from 'react'
import isEqual from 'react-fast-compare'
import {Subscription} from 'rxjs'
import {catchError, distinctUntilChanged} from 'rxjs/operators'
import {ListenQueryOptions, ListenQueryParams, useDocumentStore} from 'sanity'

type Value = unknown

interface Config<V> {
  params?: ListenQueryParams
  options?: ListenQueryOptions
  initialValue?: null | V
}

// make generic optional
interface Return<V = Value> {
  loading: boolean
  error: boolean | unknown | ProgressEvent
  data: unknown | V
  initialValue?: Value
}

const DEFAULT_PARAMS = {}
const DEFAULT_OPTIONS = {apiVersion: `v2023-05-01`}
const DEFAULT_INITIAL_VALUE = null

function useParams(
  params?: undefined | null | ListenQueryParams | ListenQueryOptions
): ListenQueryParams {
  const stringifiedParams = useMemo(
    () => JSON.stringify(params || {}),
    [params]
  )
  return useMemo(() => JSON.parse(stringifiedParams), [stringifiedParams])
}

export function useListeningQuery<V>(
  query: string | {fetch: string; listen: string},
  {
    params = DEFAULT_PARAMS,
    options = DEFAULT_OPTIONS,
    initialValue = DEFAULT_INITIAL_VALUE,
  }: Config<V>
): Return<V> {
  const [loading, setLoading] = useState<Return['loading']>(true)
  const [error, setError] = useState<Return['error']>(false)
  const [data, setData] = useState<Return['data']>(initialValue)
  const memoParams = useParams(params)
  const memoOptions = useParams(options)

  const subscription = useRef<null | Subscription>(null)
  const documentStore = useDocumentStore()

  useEffect(() => {
    if (query && !error && !subscription.current) {
      try {
        subscription.current = documentStore
          .listenQuery(query, memoParams, memoOptions)
          .pipe(
            distinctUntilChanged(isEqual),
            catchError((err) => {
              console.error(err)
              setError(err)
              setLoading(false)
              setData(null)

              return err
            })
          )
          .subscribe((documents) => {
            setData((current: Value) =>
              isEqual(current, documents) ? current : documents
            )
            setLoading(false)
            setError(false)
          })
      } catch (err) {
        console.error(err)
        setLoading(false)
        setError(err)
      }
    }

    // Unsubscribe when an error occurs
    if (error && subscription.current) {
      subscription.current.unsubscribe()
    }

    return () => {
      if (subscription.current) {
        subscription?.current?.unsubscribe()
        subscription.current = null
      }
    }
  }, [query, error, memoParams, memoOptions, documentStore])

  return {data, loading, error}
}
