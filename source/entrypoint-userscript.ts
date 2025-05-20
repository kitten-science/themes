import { redirectErrorsToConsole } from "@oliversalzburg/js-utils/errors/console.js";

declare global {
  const PAYLOAD: string;
}

(async () => {
  const nodeStyle = document.createElement("style");
  nodeStyle.textContent = PAYLOAD;
  document.body.appendChild(nodeStyle);
})().catch(redirectErrorsToConsole(console));
