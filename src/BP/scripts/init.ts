import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";

mc.world.afterEvents.worldLoad.subscribe((_) => {
  mc.world.gameRules.doDayLightCycle = false;
  mc.world.gameRules.naturalRegeneration = false;
  mc.world.setTimeOfDay(mc.TimeOfDay.Sunset);
});
