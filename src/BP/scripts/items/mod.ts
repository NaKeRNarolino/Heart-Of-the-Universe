import "./long_swords/mod";
import * as long_swords from "./long_swords/mod";
import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";

export function registerItemComponents(data: mc.ItemComponentRegistry) {
  long_swords.register(data);
}
