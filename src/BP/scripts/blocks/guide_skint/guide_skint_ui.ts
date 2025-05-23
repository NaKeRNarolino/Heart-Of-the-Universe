import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import { namespace } from "../../utils/namespace";
import { Vector3Utils } from "@minecraft/math";
import { MassiveJSONStorage } from "../../utils/storage";
import { GuideSkintData } from "./custom_component";
import { SparkManager } from "../../sparks/spark_manager";
import { PlayerUIManager } from "../../utils/player_ui_manager";

export class GuideSkintManager {
  openForm(player: mc.Player, skintIdx: number) {
    const uiManager = new PlayerUIManager(player);
    uiManager.set(true);
    const storage = new MassiveJSONStorage(
      namespace.namespaced("guide_skint_storage")
    );

    const skints = storage.access() as GuideSkintData[];
    const block = player.dimension.getBlock(skints[skintIdx].location);

    const cost = Math.round(
      Vector3Utils.distance(player.location, block!.center()) / 15
    );

    const form = new ui.ActionFormData();
    form.title(namespace.namespaced("guide_skint_ui") + ` ${cost}`);
    form.button("Back");
    form.button("Travel");
    form.button("Forward");

    form.body(skints[skintIdx].name);
    console.warn("idx", skintIdx, skints.length);
    player.inputPermissions.setPermissionCategory(
      mc.InputPermissionCategory.Movement,
      false
    );
    player.inputPermissions.setPermissionCategory(
      mc.InputPermissionCategory.Camera,
      false
    );
    player.onScreenDisplay.hideAllExcept();

    player.camera.setCamera("minecraft:free", {
      facingLocation: block!.center(),
      location: Vector3Utils.add(block!.center(), {
        x: 5,
        y: 5,
        z: 5,
      }),
    });

    form.show(player).then((val) => {
      if (val.canceled) {
        player.inputPermissions.setPermissionCategory(
          mc.InputPermissionCategory.Movement,
          true
        );
        player.inputPermissions.setPermissionCategory(
          mc.InputPermissionCategory.Camera,
          true
        );
        player.camera.clear();
        player.onScreenDisplay.resetHudElementsVisibility();
        uiManager.set(false);
        return;
      }
      if (val.selection == 2) {
        this.openForm(
          player,
          skints[skintIdx + 1] == undefined ? 0 : skintIdx + 1
        );
      } else if (val.selection == 0) {
        this.openForm(
          player,
          skints[skintIdx - 1] == undefined ? skints.length - 1 : skintIdx - 1
        );
      } else {
        const sparkManager = new SparkManager(player);

        if (sparkManager.get() < cost) {
          player.sendMessage(
            `[!] Недостаточно Спарков для перемещения. Требуется еще ${
              cost - sparkManager.get()
            } Спарков.`
          );
          player.inputPermissions.setPermissionCategory(
            mc.InputPermissionCategory.Movement,
            true
          );
          player.inputPermissions.setPermissionCategory(
            mc.InputPermissionCategory.Camera,
            true
          );
          player.onScreenDisplay.resetHudElementsVisibility();
          player.camera.clear();
          uiManager.set(false);
          return;
        }

        sparkManager.increase(-cost);
        player.teleport(block!.location);
        player.dimension.spawnParticle(
          namespace.namespaced("guide_skint_sparkles"),
          block!.center()
        );
        player.inputPermissions.setPermissionCategory(
          mc.InputPermissionCategory.Movement,
          true
        );
        player.inputPermissions.setPermissionCategory(
          mc.InputPermissionCategory.Camera,
          true
        );
        player.onScreenDisplay.resetHudElementsVisibility();
        player.camera.clear();
        uiManager.set(false);
      }
    });
  }
}
