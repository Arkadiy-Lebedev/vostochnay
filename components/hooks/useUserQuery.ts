
export function useUserQuery() {
    return useQuery({
        queryKey: ['users'],
     queryFn: () => $fetch('/api/user')
 })
}