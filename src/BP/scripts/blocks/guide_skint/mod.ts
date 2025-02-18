import { namespace } from "../../utils/namespace";
import { GuideSkintCustomComponent } from "./custom_component";
import * as mc from "@minecraft/server";

export function register(reg: mc.BlockComponentRegistry) {
  reg.registerCustomComponent(
    namespace.namespaced("guide_skint"),
    GuideSkintCustomComponent
  );
}
