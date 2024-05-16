import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { SettingsControl } from "./controls-setting";
import { ExplainationContent } from "./explaination";
import { useIsDesktop } from "@/components/hooks/use-is-desktop";
import { useDashboardStore } from "@/components/dashboard/store";
import { GridSwatch, GridSelector, GridDescription } from "./controls-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Drawer,
  DrawerContent,
  DrawerNestedRoot,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  ClusterSwatch,
  ClusterSelector,
  ClusterRadarChart,
} from "./controls-cluster";

/**
 * return control content based on active state
 *
 * @returns
 */
const ControlsContent = () => {
  const active = useDashboardStore((state) => state.active);
  return (
    <div className="flex flex-col gap-y-2">
      <Tabs
        defaultValue="grid"
        value={active.analysis}
        onValueChange={(value) =>
          useDashboardStore
            .getState()
            .changeActiveAnalysis(value as (typeof active)["analysis"])
        }
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grid">Grid</TabsTrigger>
          <TabsTrigger value="cluster">Cluster</TabsTrigger>
        </TabsList>
        <TabsContent value="grid">
          <div className="space-y-2 px-2">
            <GridSwatch />
            <GridDescription />
            <GridSelector />
          </div>
        </TabsContent>
        <TabsContent value="cluster">
          <div className="space-y-2 px-2">
            <ClusterSwatch />
            <ClusterSelector />
            <ClusterRadarChart />
          </div>
        </TabsContent>
      </Tabs>
      <SettingsControl />
    </div>
  );
};

/**
 * trigger for opening controls content
 */
const MobileControlsTrigger = forwardRef<HTMLDivElement>((_props, ref) => {
  const active = useDashboardStore((state) => state.active);

  return (
    <div ref={ref} className="absolute bottom-5 left-0 z-[1000] w-full p-2">
      {active.analysis === "grid" && (
        <GridSwatch className="m-auto max-w-xs flex-1 overflow-hidden rounded-sm rounded-t-sm bg-white" />
      )}
      {active.analysis === "cluster" && (
        <ClusterSwatch className="m-auto max-w-xs flex-1 overflow-hidden rounded-sm rounded-t-sm bg-white" />
      )}
    </div>
  );
});

/**
 * wrapper for control in desktop and mobile
 *
 * @returns
 */
export const Controls = () => {
  const isDesktop = useIsDesktop();

  return isDesktop ? (
    <div className="absolute left-0 z-[1000] flex h-full w-96 flex-col gap-y-2 p-10">
      <div className="max-h-full w-full overflow-auto">
        <div className="w-full rounded-sm border bg-white shadow-sm">
          <ControlsContent />
        </div>
      </div>
    </div>
  ) : (
    <Drawer shouldScaleBackground>
      <DrawerTrigger>
        <MobileControlsTrigger />
      </DrawerTrigger>
      <DrawerContent>
        <div className="m-auto flex max-w-sm flex-col gap-y-2">
          <ControlsContent />
          <DrawerNestedRoot>
            <DrawerTrigger asChild>
              <Button>Explain Me</Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="m-auto max-w-sm">
                <ExplainationContent />
              </div>
            </DrawerContent>
          </DrawerNestedRoot>
        </div>
      </DrawerContent>
    </Drawer>
  );
};