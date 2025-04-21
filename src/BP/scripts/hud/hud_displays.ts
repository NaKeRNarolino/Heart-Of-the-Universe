import * as mc from "@minecraft/server";
import { SparkManager } from "../sparks/spark_manager";

mc.system.runInterval(() => {
  for (const player of mc.world.getAllPlayers()) {
    const health = player.getComponent("health")!;
    const healthPercentage = Math.floor(
      (health.currentValue / health.effectiveMax) * 100
    );
    player.onScreenDisplay.setTitle(
      `s:${new SparkManager(player).get()},${healthPercentage}`
    );
  }
});
