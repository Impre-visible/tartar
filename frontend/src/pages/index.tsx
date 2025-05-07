import AddTartar from "@/components/add-tartar"
import TartarList from "@/components/tartar-list"
import TartarMap from "@/components/tartar-map"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/animated-tabs"
import { useGet } from "@/hooks/use-get"
import { Tartar } from "@/types/tartar"
import { useState } from "react"
import { ViewTartar } from "@/components/view-tartar"

export default function Index() {
    const [selectedTartar, setSelectedTartar] = useState<Tartar | null>(null)

    const {
        data: tartars,
        isLoading: _isLoading,
        error: _error,
        refetch: refetch,
    } = useGet<Tartar[]>("/tartar")

    return (
        <>
            <section className="h-full px-1 md:px-8 w-full">
                <Tabs defaultValue="list" className="w-full h-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="list">Liste</TabsTrigger>
                        <TabsTrigger value="map">Carte</TabsTrigger>
                    </TabsList>
                    <TabsContent value="list">
                        <TartarList tartars={tartars || []} setSelectedTartar={setSelectedTartar} />
                    </TabsContent>
                    <TabsContent value="map" className="h-full">
                        <TartarMap tartars={tartars || []} setSelectedTartar={setSelectedTartar} />
                    </TabsContent>
                </Tabs>
            </section>
            <AddTartar refetch={refetch} />
            <ViewTartar tartar={selectedTartar} onOpenChange={() => setSelectedTartar(null)} />
        </>
    )
}