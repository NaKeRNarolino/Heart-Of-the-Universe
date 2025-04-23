import { Vector3Utils } from "@minecraft/math";
import * as mc from "@minecraft/server";
import { namespace } from "../../utils/namespace";
import { uiManager, UIManager } from "@minecraft/server-ui";
import { PlayerUIManager } from "../../utils/player_ui_manager";

Object.defineProperty(mc.ItemStack.prototype, "vialLevel", {
  get(): number {
    if (!(this instanceof mc.ItemStack))
      throw new Error("`this` is not an ItemStack");

    if (!this.typeId.startsWith("naker_hotu:health_vial_"))
      throw new Error("The item is not a health vial!");

    return parseInt(this.typeId.replace("naker_hotu:health_vial_", ""));
  },
});

declare module "@minecraft/server" {
  interface ItemStack {
    vialLevel: number;
  }
}

export const HealthVialComponent: mc.ItemCustomComponent = {
  onUse: async (data) => {
    const { itemStack: item, source: player } = data;

    if (item == undefined) return;

    const level = item.vialLevel;
    const uiManager = new PlayerUIManager(player);

    uiManager.set(true);

    player.inputPermissions.setPermissionCategory(
      mc.InputPermissionCategory.Camera,
      false
    );
    player.inputPermissions.setPermissionCategory(
      mc.InputPermissionCategory.Movement,
      false
    );

    player.camera.setCamera("minecraft:free", {
      location: Vector3Utils.add(player.location, { x: 5, y: 5, z: 5 }),
      facingLocation: player.getHeadLocation(),
      easeOptions: {
        easeTime: 0,
        easeType: mc.EasingType.InOutSine,
      },
    });

    player.dimension.spawnParticle(
      namespace.namespaced("start_use_health_vial"),
      player.location
    );

    await mc.system.waitTicks(60);

    player.dimension.spawnParticle(
      namespace.namespaced("use_health_vial"),
      player.location
    );

    player.inputPermissions.setPermissionCategory(
      mc.InputPermissionCategory.Camera,
      true
    );
    player.inputPermissions.setPermissionCategory(
      mc.InputPermissionCategory.Movement,
      true
    );

    await mc.system.waitTicks(2);

    player.camera.clear();

    uiManager.set(false);
  },
};
