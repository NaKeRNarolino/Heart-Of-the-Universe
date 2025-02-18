import * as mc from "@minecraft/server";
import { SparkManager } from "../sparks/spark_manager";

mc.system.runInterval(() => {
  for (const player of mc.world.getAllPlayers()) {
    player.onScreenDisplay.setTitle(
      `naker_sparks§r${new SparkManager(player).get()}`
    );
  }
});
