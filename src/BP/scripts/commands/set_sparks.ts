import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import { namespace } from "../utils/namespace";
import { SparkManager } from "../sparks/spark_manager";

mc.world.beforeEvents.chatSend.subscribe((data) => {
  if (data.message.startsWith("@setsparks")) {
    data.cancel = true;

    if (data.sender.isOp() == false) {
      data.sender.sendMessage(
        "[!] Использовать команду @setsparks могут только операторы."
      );
      return;
    }

    const args = data.message.split(" ");
    const name = args[1];
    const amount = parseInt(args[2]);

    mc.system.run(() => {
      const player = mc.world.getPlayers({
        name: name,
      });

      player[0]?.setDynamicProperty(SparkManager.dynamicPropertyId, amount);
    });
  }
});
