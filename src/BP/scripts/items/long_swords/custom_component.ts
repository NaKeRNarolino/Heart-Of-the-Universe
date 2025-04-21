import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import { namespace } from "../../utils/namespace";
import { Vector3Builder, Vector3Utils } from "@minecraft/math";

mc.Player.prototype.applyImpulse = function (vector: mc.Vector3) {
  this.applyKnockback(
    { x: vector.x, z: vector.z },
    vector.y < 0.0 ? 0.5 * vector.y : vector.y
  );
};

export const LongSwordCustomComponent: mc.ItemCustomComponent = {
  onUse: (event) => {
    event.source.startItemCooldown("attack", 30);

    const player = event.source;

    let lastSet = 0;

    if (
      Date.now() -
        ((player.getDynamicProperty(namespace.namespaced("last_use")) as
          | number
          | undefined) ?? 0) <
      2000
    ) {
      const lastAttackState = player.getDynamicProperty(
        namespace.namespaced("attack_state")
      ) as number;

      player.setProperty(
        namespace.namespaced("attack_state"),
        lastAttackState + 1 > 4 ? 1 : lastAttackState + 1
      );
      lastSet = lastAttackState + 1 > 4 ? 1 : lastAttackState + 1;
      player.setDynamicProperty(namespace.namespaced("attack_state"), lastSet);
    } else {
      player.setProperty(namespace.namespaced("attack_state"), 1);
      player.setDynamicProperty(namespace.namespaced("attack_state"), 1);
    }

    mc.system.runTimeout(() => {
      player.setProperty(namespace.namespaced("attack_state"), 0);
    }, 2);

    player.applyImpulse(
      Vector3Utils.scale(
        {
          x: player.getViewDirection().x,
          y: 0,
          z: player.getViewDirection().z,
        },
        0.3
      )
    );
    player.setDynamicProperty(namespace.namespaced("last_use"), Date.now());
  },
};
