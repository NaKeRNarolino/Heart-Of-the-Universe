import { EntityCustomComponent, EntityCustomComponentRegistry } from "../mod";
import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import { utils } from "../../utils/utils";
import { PlayerUIManager } from "../../utils/player_ui_manager";

export const PlayerHoldSwordCustomComponent: EntityCustomComponent = {
  filter: {
    types: ["minecraft:player"],
  },
  onTick: (data) => {
    const item = data.entity
      .getComponent("equippable")
      ?.getEquipment(mc.EquipmentSlot.Mainhand);

    const player = data.entity as mc.Player;

    if (new PlayerUIManager(player).get()) {
      return;
    }

    if (item == undefined) {
      player.camera.clear();
      return;
    }

    if (item.typeId.includes("naker_hotu:") && item.typeId.includes("sword")) {
      player.camera.setCamera("minecraft:free", {
        location: utils.calculateLocalCoordinates(player, {
          x: 1,
          y: 0,
          z: -3,
        }),
        easeOptions: {
          easeTime: 0.25,
          easeType: mc.EasingType.Linear,
        },
        rotation: player.getRotation(),
      });
    } else {
      player.camera.clear();
    }
  },
};
