import {useEffect, useState, useRef} from 'react'
import {catchError, distinctUntilChanged} from 'rxjs/operators'
import isEqual from 'react-fast-compare'
import {useDocumentStore} from 'sanity/_unstable'
import {Subscription} from 'rxjs'

type Params = Record<string, string | number | boolean | string[]>

interface ListenQueryOptions {
  tag?: string
  apiVersion?: string
}

type Value = any

interface Config<V> {
  params: Params
  options?: ListenQueryOptions
  initialValue?: null | V
}

interface Return<V> {
  loading: boolean
  error: boolean
  data: null | V
  initialValue?: Value
}

const DEFAULT_PARAMS = {}
const DEFAULT_OPTIONS = {apiVersion: `v2022-05-09`}
const DEFAULT_INITIAL_VALUE = null

export function useListeningQuery<V>(
  query: string | {fetch: string; listen: string},
  {
    params = DEFAULT_PARAMS,
    options = DEFAULT_OPTIONS,
    initialValue = DEFAULT_INITIAL_VALUE,
  }: Config<V>
): Return<V> {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [data, setData] = useState(initialValue)
  const subscription = useRef<null | Subscription>(null)
  const documentStore = useDocumentStore()

  useEffect(() => {
    if (query) {
      subscription.current = documentStore
        .listenQuery(query, params, options)
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
          setData((current: Value) => (isEqual(current, documents) ? current : documents))
          setLoading(false)
          setError(false)
        })
    }

    return () => subscription?.current?.unsubscribe()
  }, [query, params, options, documentStore])

  return {data, loading, error}
}
