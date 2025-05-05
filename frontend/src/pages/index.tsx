import AddTartar from "@/components/add-tartar"
import ListTartar from "@/components/list-tartar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGet } from "@/hooks/use-get"
import { Tartar } from "@/types/tartar"
import { TabsContent } from "@radix-ui/react-tabs"

export default function Index() {
    const {
        data: tartars,
        isLoading: isLoading,
        error: error,
        refetch: refetch,
    } = useGet<Tartar[]>("/tartar")

    return (
        <>
            <section className="h-full px-2 md:px-8 w-full">
                <Tabs defaultValue="list" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="list">Liste</TabsTrigger>
                        <TabsTrigger value="map">Carte</TabsTrigger>
                    </TabsList>
                    <TabsContent value="list">
                        <ListTartar tartars={tartars || []} />
                    </TabsContent>
                    <TabsContent value="map"></TabsContent>
                </Tabs>
            </section>
            <AddTartar refetch={refetch} />
        </>
    )
}