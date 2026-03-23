import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WeatherPage } from '@/pages/weather'

const queryClient = new QueryClient()

export function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <WeatherPage />
        </QueryClientProvider>
    )
}
