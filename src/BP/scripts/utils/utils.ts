import { Vector3Utils } from "@minecraft/math";
import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";

export namespace utils {
  /**
   * @description Calculates points along two vectors.
   * @param locationA first vector
   * @param locationB second vector
   * @param numberOfPoints amount of points to calculate
   * @returns the points along two vectors
   */
  export function calculatePointsAlongLine(
    locationA: mc.Vector3,
    locationB: mc.Vector3,
    numberOfPoints: number
  ): mc.Vector3[] {
    const points: mc.Vector3[] = [];
    for (let i = 0; i <= numberOfPoints; i++) {
      const t = i / numberOfPoints;
      const point = {
        x: locationA.x + (locationB.x - locationA.x) * t,
        y: locationA.y + (locationB.y - locationA.y) * t,
        z: locationA.z + (locationB.z - locationA.z) * t,
      };
      points.push(point);
    }
    return points;
  }

  /**
   * @description Replicates the /clear command using native APIs.
   * @param player Player to uss the function on
   * @param typeId The typeId of item to remove
   * @param amount The amount of item to remove
   */
  export function clearFromPlayerInventory(
    player: mc.Player,
    typeId: string,
    amount: number
  ) {
    let playerInventory = (
      player.getComponent("inventory") as mc.EntityInventoryComponent
    ).container!;
    let amountToDelete = amount;
    for (let i = 0; i < 36; i++) {
      if (amountToDelete > 0) {
        let item = playerInventory.getItem(i);
        if (item != undefined) {
          if (item.typeId == typeId) {
            if (item.amount < amountToDelete) {
              amountToDelete -= item.amount;
              playerInventory.setItem(i, undefined);
            } else {
              let it =
                item.amount - amountToDelete > 0
                  ? new mc.ItemStack(typeId, item.amount - amountToDelete)
                  : undefined;
              playerInventory.setItem(i, it);
              amountToDelete -= item.amount;
            }
          }
        }
      }
    }
  }

  export function calculateLocalCoordinates(
    player: mc.Entity,
    vec3: mc.Vector3
  ) {
    let ploc = player.getHeadLocation();
    // let vector3 = Vec3(vec3.x, vec3.y, vec3.z);
    let zVec = player.getViewDirection();
    let xVec = Vector3Utils.normalize({ x: zVec.z, y: 0, z: -zVec.x });
    let yVec = Vector3Utils.normalize(Vector3Utils.cross(zVec, xVec));
    let location = Vector3Utils.add(
      Vector3Utils.scale(xVec, vec3.x),
      Vector3Utils.add(
        Vector3Utils.scale(yVec, vec3.y),
        Vector3Utils.scale(zVec, vec3.z)
      )
    );
    return Vector3Utils.add(ploc, location);
  }
}
